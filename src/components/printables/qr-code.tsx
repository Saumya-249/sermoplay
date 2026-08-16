import { useEffect, useRef } from "react";
import QRCode from "qrcode";

export function QrCode({ value, size = 96 }: { value: string; size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    QRCode.toCanvas(ref.current, value || " ", {
      width: size,
      margin: 0,
      color: { dark: "#000000", light: "#ffffff" },
    }).catch(() => undefined);
  }, [value, size]);

  return <canvas ref={ref} width={size} height={size} aria-label="Worksheet QR code" />;
}
