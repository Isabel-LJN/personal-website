import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45)",
        }}
      >
        <div
          style={{
            width: 4,
            height: 14,
            background: "#0a0a0a",
            borderRadius: 1,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
