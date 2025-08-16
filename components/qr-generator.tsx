"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QrCode, Download, Share2, Copy, Check, Loader2 } from "lucide-react";
import {
  generateVendorQRCode,
  downloadQRCode,
  generatePaymentURL,
  generateUSSDCode,
} from "@/lib/qr-utils";
import {
  QRGenerationError,
  logError,
  getUserFriendlyMessage,
} from "@/lib/error-utils";

interface QRGeneratorProps {
  vendorId: string;
  businessName: string;
}

export function QRGenerator({ vendorId, businessName }: QRGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState<string>("");

  const paymentUrl = generatePaymentURL(vendorId);
  const ussdCode = generateUSSDCode(vendorId);

  // Generate QR code on component mount
  useEffect(() => {
    const generateQR = async () => {
      try {
        setIsGenerating(true);
        setError("");
        const dataUrl = await generateVendorQRCode(vendorId);
        setQrCodeDataUrl(dataUrl);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        const qrError = new QRGenerationError("Failed to generate QR code", {
          vendorId,
          originalError: error.message,
        });
        logError(qrError);
        setError(getUserFriendlyMessage(qrError));
      } finally {
        setIsGenerating(false);
      }
    };

    generateQR();
  }, [vendorId]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(paymentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const handleDownloadQR = async () => {
    try {
      const filename = `${businessName.replace(
        /[^a-zA-Z0-9]/g,
        "-"
      )}-qr-code.png`;
      await downloadQRCode(paymentUrl, filename);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      const downloadError = new QRGenerationError(
        "Failed to download QR code",
        { vendorId, businessName, originalError: error.message }
      );
      logError(downloadError);
      setError(getUserFriendlyMessage(downloadError));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <QrCode className="w-5 h-5 text-primary" />
          <span>Your Payment QR Code</span>
        </CardTitle>
        <CardDescription>
          Customers can scan this code to pay you instantly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* QR Code Display */}
        <div className="flex justify-center">
          <div className="bg-white p-6 rounded-lg border-2 border-border shadow-sm">
            <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
              {isGenerating ? (
                <div className="flex flex-col items-center space-y-2">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Generating QR code...
                  </span>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center space-y-2 text-center p-4">
                  <QrCode className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm text-destructive">{error}</span>
                </div>
              ) : qrCodeDataUrl ? (
                <img
                  src={qrCodeDataUrl}
                  alt={`QR code for ${businessName}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <QrCode className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    No QR code
                  </span>
                </div>
              )}
            </div>
            <div className="text-center mt-3">
              <Badge variant="secondary" className="text-xs">
                {vendorId}
              </Badge>
            </div>
          </div>
        </div>

        {/* Payment URL */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Payment Link</label>
          <div className="flex space-x-2">
            <div className="flex-1 p-3 bg-muted rounded-md text-sm font-mono break-all">
              {paymentUrl}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyUrl}
              className="shrink-0 bg-transparent"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* USSD Code */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            USSD Code (for basic phones)
          </label>
          <div className="flex space-x-2">
            <div className="flex-1 p-3 bg-muted rounded-md text-sm font-mono">
              {ussdCode}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigator.clipboard.writeText(ussdCode)}
              className="shrink-0 bg-transparent"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={handleDownloadQR}
            disabled={!qrCodeDataUrl || isGenerating}
            className="flex items-center space-x-2 bg-transparent"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => navigator.share?.({ url: paymentUrl })}
            className="flex items-center space-x-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </Button>
        </div>

        {/* Usage Instructions */}
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">How to use:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Display this QR code at your stall</li>
            <li>• Customers scan with their phone camera</li>
            <li>• They enter the amount and pay</li>
            <li>• You get instant payment notifications</li>
            <li>• Basic phone users can dial the USSD code</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
