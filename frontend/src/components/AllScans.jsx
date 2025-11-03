import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AllScans = () => {
  const navigate = useNavigate();

  // mock data for now
  const [scanHistory] = useState([
    {
      id: 1,
      url: "https://example-login.com",
      prediction: "Phishing",
      confidenceScore: 0.92,
      scannedAt: "2025-11-01T10:30:00",
    },
    {
      id: 2,
      url: "https://vtop.vit.ac.in",
      prediction: "Safe",
      confidenceScore: 0.87,
      scannedAt: "2025-11-01T09:45:00",
    },
    {
      id: 3,
      url: "https://secure-update-account.net",
      prediction: "Phishing",
      confidenceScore: 0.95,
      scannedAt: "2025-10-31T18:15:00",
    },
  ]);

  const formatDate = (dateString) => {
    const options = { dateStyle: "medium", timeStyle: "short" };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  const getColor = (prediction) =>
    prediction === "Safe"
      ? "text-green-600 bg-green-50"
      : "text-red-600 bg-red-50";

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <h1 className="text-2xl font-semibold text-gray-800 mx-auto">
            All Scan History
          </h1>
        </div>

        {/* list */}
        <div className="space-y-4">
          {scanHistory.map((scan) => (
            <Card key={scan.id} className="shadow-sm border rounded-2xl">
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{scan.url}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(scan.scannedAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getColor(
                      scan.prediction
                    )}`}
                  >
                    {scan.prediction}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Confidence: {(scan.confidenceScore * 100).toFixed(1)}%
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllScans;
