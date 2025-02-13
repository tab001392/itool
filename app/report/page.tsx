"use client";

import { jsPDF } from "jspdf";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ContentLayout } from "@/components/shared/content-layout";
import { getForklifts, getPresentForklifts, getAbsentForklifts } from "@/actions/forklift";

export default function ReportPage() {
  const [forklifts, setForklifts] = useState([]);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [timestamp, setTimestamp] = useState("");

  useEffect(() => {
    // Fetch forklifts with their "present" status
    const fetchData = async () => {
      try {
        const forklifts = await getForklifts({ searchString: "" });
        const presentForklifts = await getPresentForklifts();
        const absentForklifts = await getAbsentForklifts();

        setForklifts(forklifts);
        setPresentCount(presentForklifts.length);
        setAbsentCount(absentForklifts.length);
        setTimestamp(new Date().toLocaleString()); // Capture report generation time
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Forklift Report", 20, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${timestamp}`, 20, 30);
    doc.text(`Total Forklifts: ${forklifts.length}`, 20, 40);
    doc.text(`Present: ${presentCount}`, 20, 50);
    doc.text(`Absent: ${absentCount}`, 20, 60);

    // Table Headers
    doc.setFontSize(12);
    doc.text("SKU", 20, 80);
    doc.text("Present", 70, 80);
    doc.text("Absent", 120, 80);

    // Table Rows
    forklifts.forEach((forklift, index) => {
      const y = 90 + index * 10; // Adjust row position
      doc.text(forklift.sku, 20, y);
      doc.text(forklift.present ? "✔" : "", 70, y);
      doc.text(!forklift.present ? "❌" : "", 120, y);
    });

    doc.save("forklift_report.pdf");
  };

  return (
    <ContentLayout title="Forklift Report">
      {/* Report Summary */}
      <div className="mb-4">
        <p><strong>Generated on:</strong> {timestamp}</p>
        <p><strong>Total Forklifts:</strong> {forklifts.length}</p>
        <p><strong>Present:</strong> {presentCount}</p>
        <p><strong>Absent:</strong> {absentCount}</p>
      </div>

      {/* Table for displaying forklifts */}
      <table className="table-auto w-full max-w-4xl border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">SKU</th>
            <th className="border px-4 py-2">Present</th>
            <th className="border px-4 py-2">Absent</th>
          </tr>
        </thead>
        <tbody>
          {forklifts.map((forklift) => (
            <tr key={forklift.sku}>
              <td className="border px-4 py-2 text-center">{forklift.sku}</td>
              <td className="border px-4 py-2 text-center">
                <div className="flex justify-center">
                  {forklift.present ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </div>
              </td>
              <td className="border px-4 py-2 text-center">
                <div className="flex justify-center">
                  {!forklift.present ? (
                    <XCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Button to trigger PDF download */}
      <Button onClick={handleDownloadPDF} className="mt-4">
        Download PDF
      </Button>
    </ContentLayout>
  );
}
