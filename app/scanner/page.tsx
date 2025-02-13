"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  findForklift,
  markForkliftAsPresent,
  getForklifts,
  resetForklifts, // Import resetForklifts action
} from "@/actions/forklift";
import { Camera, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Html5QrcodeScanner } from "html5-qrcode";
import { ContentLayout } from "@/components/shared/content-layout";

export default function ForkliftScanner() {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [scannedForklifts, setScannedForklifts] = useState<string[]>([]);
  const [totalForklifts, setTotalForklifts] = useState<number>(0); // Start with 0
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch the total number of forklifts dynamically from the server
    const fetchTotalForklifts = async () => {
      try {
        const forklifts = await getForklifts({ searchString: "" }); // Fetch the forklifts from the server
        setTotalForklifts(forklifts.length); // Set the total forklifts
      } catch (err) {
        console.error("Error fetching forklifts:", err);
        setError("Error fetching forklift data.");
      }
    };

    // Fetch the total forklifts
    fetchTotalForklifts();

    if (!cameraOpen) return;

    // Request camera permission automatically when opening the camera
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => {
        // Initialize the QR scanner
        scannerRef.current = new Html5QrcodeScanner(
          "qr-scanner",
          { fps: 10, qrbox: 250 },
          false
        );

        scannerRef.current.render(
          async (decodedText: string) => {
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

    // Return cleanup function that doesn't return a promise
    return () => {
      scannerRef.current?.clear(); // Clean up the scanner
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

  // Start scanning process and reset forklifts
  const handleStartScan = async () => {
    try {
      // Reset the forklifts before starting the scan
      await resetForklifts(); // Call the resetForklifts server action

      // Open the camera for scanning
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
            onClick={handleStartScan} // Use the updated handleStartScan
            className="flex items-center space-x-2"
          >
            <Camera className="w-5 h-5" />
            <span>Start Scanning</span>
          </Button>
        ) : (
          <div className="relative w-full max-w-md">
            <div
              id="qr-scanner"
              className="w-full h-64 border rounded-lg overflow-auto"
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

        {/* Real-time Progress Bar */}
        <div className="w-full max-w-md">
          <h2 className="text-lg font-semibold mb-2">Scanning Progress</h2>
          <Progress value={(scannedForklifts.length / totalForklifts) * 100} />
          <p className="text-sm text-gray-500 mt-1">
            {scannedForklifts.length} of {totalForklifts} forklifts scanned
          </p>
        </div>

        {/* Beep Sound for Feedback */}
        <audio ref={audioRef} src="/beep.wav" />
      </div>
    </ContentLayout>
  );
}
