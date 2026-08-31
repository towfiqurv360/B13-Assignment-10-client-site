"use client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "@/components/CheckoutForm";
import { useParams } from "next/navigation";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function RecipePurchasePage() {
  const { id } = useParams();
  const recipePrice = 5; // রেসিপি কেনার জন্য একটি ডিফল্ট দাম (৫ ডলার) ধরলাম

  return (
    <div className="py-12 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Unlock Premium Recipe</h2>
        <p className="text-gray-600">Pay securely with Stripe to get full access to this recipe.</p>
      </div>

      <Elements stripe={stripePromise}>
        {/* paymentType="recipe" এবং recipeId পাঠানো হচ্ছে */}
        <CheckoutForm price={recipePrice} paymentType="recipe" recipeId={id} />
      </Elements>
    </div>
  );
}