// ─── FILE: components/RazorpayButton.tsx ───
"use client";

import { useState } from "react";

interface RazorpayButtonProps {
  planSlug: "pro" | "business";
  billing: "monthly" | "yearly";
  price: number; // INR amount for display
  label: string; // e.g. "Start Pro — ₹399/mo"
  className?: string;
}

declare global {
  interface Window {
    Razorpay: new (options: object) => { open(): void };
  }
}

/**
 * Load the Razorpay checkout SDK on demand and resolve only once it's ready.
 * This avoids the race where a user clicks before a lazily-loaded <Script> tag
 * has finished — which would make `window.Razorpay` undefined and the click fail.
 */
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);

    const existing = document.getElementById("razorpay-checkout-sdk") as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-checkout-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function RazorpayButton({ planSlug, billing, label, className }: RazorpayButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      // 1. Make sure the Razorpay SDK is actually loaded before we use it.
      const sdkReady = await loadRazorpayScript();
      if (!sdkReady || !window.Razorpay) {
        alert("Couldn't load the payment gateway. Check your connection and try again.");
        return;
      }

      // 2. Create subscription on the server
      const res = await fetch("/api/razorpay/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planSlug, billing }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (err.redirect) {
          window.location.href = err.redirect;
          return;
        }
        alert(err.error || "Something went wrong");
        return;
      }
      const { subscriptionId, keyId, name, email } = await res.json();

      // 3. Open the Razorpay popup
      const rzp = new window.Razorpay({
        key: keyId,
        subscription_id: subscriptionId,
        name: "Learn ERP",
        description: `${planSlug === "pro" ? "Pro" : "Business"} Plan — ${billing}`,
        image: "/logo.png",
        prefill: { name, email },
        theme: { color: "#7C3AED" },
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_subscription_id: string;
          razorpay_signature: string;
        }) {
          // 4. Verify payment on the server
          const verifyRes = await fetch("/api/razorpay/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          if (verifyRes.ok) {
            window.location.href = "/dashboard?payment=success";
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleClick} disabled={loading} className={className}>
      {loading ? "Loading…" : label}
    </button>
  );
}
// ─── END FILE ───
