
"use client";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";

export default function StripePaymentForm({ onPaymentSuccess, loading }) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    await onPaymentSuccess(stripe, elements);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button
        disabled={loading || !stripe}
        className="w-full mt-4 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-800 transition-all disabled:bg-gray-300 flex items-center justify-center gap-2"
      >
        {loading ? "Processing..." : "Pay & Confirm Order"}
      </button>
    </form>
  );
}