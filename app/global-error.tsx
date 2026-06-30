"use client";

// Global error boundary — catches errors in the root layout itself.
// Must render its own <html>/<body>. Keep it dependency-free and self-styled.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          background: "#0b1120",
          color: "#e2e8f0",
          padding: "24px",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              margin: "0 auto 16px",
              background: "linear-gradient(135deg,#3B82F6,#1D4ED8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              color: "#fff",
            }}
          >
            !
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px" }}>Something went wrong</h1>
          <p style={{ fontSize: 14, color: "#94a3b8", margin: "0 0 20px", lineHeight: 1.5 }}>
            An unexpected error occurred. You can try again, or head back home.
            {error?.digest ? ` (ref: ${error.digest})` : ""}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button
              onClick={() => reset()}
              style={{
                padding: "10px 18px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
                color: "#fff",
                background: "linear-gradient(135deg,#3B82F6,#1D4ED8)",
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                padding: "10px 18px",
                borderRadius: 10,
                border: "1px solid #334155",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: 14,
                color: "#e2e8f0",
              }}
            >
              Go home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
