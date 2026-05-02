import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Lingo - Learn, practice, and master new languages";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to bottom, #ffffff, #f4f4f5)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "80px",
            fontWeight: "bold",
            color: "#10b981",
            marginBottom: "24px",
          }}
        >
          Lingo
        </div>
        <div
          style={{
            fontSize: "40px",
            color: "#52525b",
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          Learn, practice, and master new languages with interactive lessons and challenges.
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
