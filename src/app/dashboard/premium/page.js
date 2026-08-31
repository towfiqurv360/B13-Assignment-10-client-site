"use client";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/CheckoutForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function PremiumUpgradePage() {
  const premiumPrice = 20; 

  return (
    <div className="py-12 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Upgrade to Premium</h2>
        <p className="text-gray-600">
          Unlock unlimited recipe adding and get a premium profile badge[cite: 1].
        </p>
      </div>

      <Elements stripe={stripePromise}>
        <CheckoutForm price={premiumPrice} paymentType="premium" />
      </Elements>
    </div>
  );
}