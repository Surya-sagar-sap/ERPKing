// ─── FILE: components/RazorpayButton.tsx ───
"use client";

import { useState } from "react";
import Script from "next/script";

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

export default function RazorpayButton({ planSlug, billing, label, className }: RazorpayButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      // 1. Create subscription on server
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

      // 2. Open Razorpay popup
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
          // 3. Verify payment on server
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
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <button onClick={handleClick} disabled={loading} className={className}>
        {loading ? "Loading…" : label}
      </button>
    </>
  );
}
// ─── END FILE ───
