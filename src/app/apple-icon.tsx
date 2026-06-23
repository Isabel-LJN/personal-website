import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #f7ef4d 0%, #f1e500 55%, #e6da00 100%)",
          borderRadius: "9999px",
          boxShadow: "inset 0 2px 0 rgba(255,255,255,0.45)",
        }}
      >
        <div
          style={{
            width: 22,
            height: 78,
            background: "#0a0a0a",
            borderRadius: 4,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
