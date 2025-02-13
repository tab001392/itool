"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  findForklift,
  markForkliftAsPresent,
  getForklifts,
  resetForklifts,
} from "@/actions/forklift";
import { Camera, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { ContentLayout } from "@/components/shared/content-layout";

export default function ForkliftScanner() {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [scannedForklifts, setScannedForklifts] = useState<string[]>([]);
  const [totalForklifts, setTotalForklifts] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTotalForklifts = async () => {
      try {
        const forklifts = await getForklifts({ searchString: "" });
        setTotalForklifts(forklifts.length);
      } catch (err) {
        console.error("Error fetching forklifts:", err);
        setError("Error fetching forklift data.");
      }
    };

    fetchTotalForklifts();

    if (!cameraOpen) return;

    // Ensure the scanner is cleared before initializing
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }

    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: "environment" }, // ✅ Force back camera
      })
      .then(() => {
        scannerRef.current = new Html5QrcodeScanner(
          "qr-scanner",
          {
            fps: 10,
            qrbox: (width, height) => {
              const minSize = Math.min(width, height) * 0.75; // ✅ Dynamic box
              return { width: minSize, height: minSize };
            },
            disableFlip: false,
            aspectRatio: 1.5,
            formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          },
          false
        );

        scannerRef.current.render(
          async (decodedText) => {
            if (!scannedForklifts.includes(decodedText)) {
              await handleScan(decodedText);
            }
          },
          (err) => console.warn("QR Scan Error:", err)
        );
      })
      .catch((err) => {
        setError("Camera permission denied. Please allow camera access.");
        console.error("Error accessing camera:", err);
      });

    return () => {
      scannerRef.current?.clear();
      scannerRef.current = null;
    };
  }, [cameraOpen]);

  const handleScan = async (sku: string) => {
    if (scannedForklifts.includes(sku)) return;

    try {
      const forklift = await findForklift(sku);

      if (forklift) {
        await markForkliftAsPresent(sku);
        setScannedForklifts((prev) => [...prev, sku]);

        // Play beep sound for feedback
        if (audioRef.current) {
          audioRef.current.play();
        }
      } else {
        setError(`Forklift ${sku} not found.`);
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      console.error("Scan error:", err);
      setError("Error processing scan.");
    }
  };

  const handleStartScan = async () => {
    try {
      await resetForklifts();
      setCameraOpen(true);
    } catch (err) {
      console.error("Error resetting forklifts:", err);
      setError("Error resetting forklifts.");
    }
  };

  return (
    <ContentLayout title="Forklifts Scanner">
      <div className="h-full w-full flex flex-col items-center justify-center space-y-6 flex-1">
        <h1 className="text-2xl font-bold">Forklift Scanner</h1>

        {!cameraOpen ? (
          <Button
            onClick={handleStartScan}
            className="flex items-center space-x-2"
          >
            <Camera className="w-5 h-5" />
            <span>Start Scanning</span>
          </Button>
        ) : (
          <div className="relative w-full max-w-md">
            <div
              id="qr-scanner"
              className="w-full max-w-md h-[350px] border rounded-lg overflow-hidden"
            ></div>
            <Button
              onClick={() => setCameraOpen(false)}
              className="mt-4"
              variant="destructive"
            >
              Close Camera
            </Button>
          </div>
        )}

        {error && (
          <div className="text-red-500 flex items-center space-x-2">
            <XCircle className="w-6 h-6" />
            <p>{error}</p>
          </div>
        )}

        {scannedForklifts.length > 0 && (
          <div className="w-full max-w-md bg-gray-100 p-4 rounded-lg shadow overflow-auto">
            <h2 className="text-lg font-semibold mb-2">Scanned Forklifts</h2>
            <ul className="space-y-2">
              {scannedForklifts.map((sku) => (
                <li
                  key={sku}
                  className="flex items-center space-x-2 text-green-600"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Forklift {sku} marked as present</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="w-full max-w-md">
          <h2 className="text-lg font-semibold mb-2">Scanning Progress</h2>
          <Progress value={(scannedForklifts.length / totalForklifts) * 100} />
          <p className="text-sm text-gray-500 mt-1">
            {scannedForklifts.length} of {totalForklifts} forklifts scanned
          </p>
        </div>

        <audio ref={audioRef} src="/beep.wav" />
      </div>
    </ContentLayout>
  );
}
