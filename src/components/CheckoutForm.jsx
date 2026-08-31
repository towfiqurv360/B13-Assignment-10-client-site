"use client";
import {
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    useElements,
    useStripe
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { axiosSecure } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { FiShield, FiAlertCircle, FiCheckCircle, FiCreditCard, FiCalendar, FiLock } from "react-icons/fi";

export default function CheckoutForm({ price, paymentType, recipeId = null }) {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();

    const [error, setError] = useState("");
    const [clientSecret, setClientSecret] = useState("");
    const [processing, setProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    useEffect(() => {
        axiosSecure.post("/payments/create-payment-intent", { price })
            .then((res) => {
                setClientSecret(res.data.clientSecret);
            })
            .catch((err) => {
                console.error("Failed to initialize payment", err);
            });
    }, [price]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        const cardNumber = elements.getElement(CardNumberElement);
        if (cardNumber === null) return;

        setProcessing(true);
        setError("");

        const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: cardNumber,
        });

        if (paymentMethodError) {
            setError(paymentMethodError.message);
            setProcessing(false);
            return;
        }

        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card: cardNumber }
        });

        if (confirmError) {
            setError(confirmError.message);
            setProcessing(false);
            return;
        }

        if (paymentIntent.status === "succeeded") {
            const paymentInfo = {
                amount: price,
                transactionId: paymentIntent.id,
                paymentType,
                recipeId,
                paymentStatus: "paid",
                paidAt: new Date(),
            };

            try {
                await axiosSecure.post("/payments", paymentInfo);

                if (paymentType === "premium") {
                    const user = JSON.parse(localStorage.getItem("user"));
                    if (user) {
                        user.isPremium = true;
                        localStorage.setItem("user", JSON.stringify(user));
                    }
                }

                setPaymentSuccess(true);
                setTimeout(() => {
                    router.push("/dashboard");
                }, 2000);

            } catch (err) {
                setError("Failed to save payment records.");
            }
        }
        setProcessing(false);
    };

    const elementOptions = {
        style: {
            base: {
                fontSize: "16px",
                color: "#1F2937",
                fontFamily: '"Inter", "Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: "antialiased",
                "::placeholder": {
                    color: "#9CA3AF",
                },
            },
            invalid: {
                color: "#EF4444",
                iconColor: "#EF4444",
            },
        },
    };

    if (paymentSuccess) {
        return (
            <div className="w-full max-w-md mx-auto p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 text-center animate-fade-in">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiCheckCircle className="text-4xl text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Your payment was processed successfully. Redirecting...
                </p>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-md mx-auto p-6 md:p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800"
        >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <FiShield className="text-blue-500" /> Payment Details
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Complete your purchase safely
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Amount</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">${price}</p>
                </div>
            </div>

            <div className="space-y-5">
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <FiCreditCard className="text-gray-400" /> Card Number
                    </label>
                    <div className="p-3.5 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all shadow-sm">
                        <CardNumberElement options={elementOptions} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <FiCalendar className="text-gray-400" /> Expiry Date
                        </label>
                        <div className="p-3.5 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all shadow-sm">
                            <CardExpiryElement options={elementOptions} />
                        </div>
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <FiLock className="text-gray-400" /> CVC
                        </label>
                        <div className="p-3.5 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all shadow-sm">
                            <CardCvcElement options={elementOptions} />
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mt-5 flex items-start gap-2 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg">
                    <FiAlertCircle className="text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                        {error}
                    </p>
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || !clientSecret || processing}
                className="w-full mt-8 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-md disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
            >
                {processing ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                    </>
                ) : (
                    `Pay $${price}`
                )}
            </button>

            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4 flex items-center justify-center gap-1.5 font-medium">
                <FiLock className="text-gray-400" /> Powered by Stripe
            </p>
        </form>
    );
}