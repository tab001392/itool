"use client";

import { useRef } from "react";
import { Download } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

import { Button } from "@/components/ui/button";

export const ForkliftQRCode = ({ link }: { link: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDownload = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL("image/jpeg");
      const a = document.createElement("a");
      a.href = url;
      a.download = `forklift-qrcode-${link}.jpeg`;
      a.click();
    }
  };

  return (
    <div className="h-max">
      {/* Hidden QR Code */}
      <div className="hidden">
        <QRCodeCanvas
          ref={canvasRef}
          value={link}
          size={500}
          bgColor="#000000"
          fgColor="#FFFFFF"
          level="M"
        />
      </div>

      {/* Download Button */}
      <Button onClick={handleDownload} className="rounded-md">
        <Download className="w-7 h-7" />
      </Button>
    </div>
  );
};
