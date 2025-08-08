'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyStripePaymentQuery } from "@/feature/reducers/stripSlice";

export default function StripeVerifyClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") || searchParams.get("session_id"); // ← Stripe default
  const [isClient, setIsClient] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // استفاده از RTK Query برای تایید پرداخت Stripe
  const { data: verificationData, isLoading, error, isError } = useVerifyStripePaymentQuery(
    { sessionId: sessionId || '' },
    { 
      skip: !sessionId || !isClient,
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: false
    }
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!sessionId) {
      setErrorMessage("Session-ID nicht gefunden");
      // Redirect after a short delay to show the error message
      setTimeout(() => {
        router.replace("/payment/failed?error=missing_sessionId&reason=Session-ID nicht gefunden");
      }, 2000);
      return;
    }

    if (!isClient) return; // منتظر client-side rendering

    console.log("🔍 Starting Stripe verification with sessionId:", sessionId);
    console.log("🔍 Current URL:", window.location.href);

    // اگر در حال loading هستیم، منتظر بمانیم
    if (isLoading) {
      console.log("⏳ Loading verification data...");
      return;
    }

    // اگر error داریم
    if (isError) {
      console.error("❌ Verification error:", error);
      setErrorMessage("Verifikation fehlgeschlagen");
      setTimeout(() => {
        router.replace(`/payment/failed?error=verify_failed&reason=Verifikation fehlgeschlagen`);
      }, 2000);
      return;
    }

    // اگر data داریم
    if (verificationData) {
      console.log("📦 Verification response:", verificationData);
      
      // بررسی اینکه orderId موجود باشه
      if (!verificationData.orderId) {
        console.error("❌ orderId is missing in verification response:", verificationData);
        setErrorMessage("Bestellnummer fehlt");
        setTimeout(() => {
          router.replace("/payment/failed?error=missing_orderId&reason=Bestellnummer fehlt");
        }, 2000);
        return;
      }

      // ریدایرکت به صفحه موفقیت با تمام اطلاعات
      const { orderId, transactionId, paymentMethod, restaurantId } = verificationData;
      const amount = (verificationData as any)?.amount || 'N/A';
      const successUrl = `/payment/success?orderId=${orderId}&transactionId=${transactionId || 'N/A'}&amount=${amount}&paymentMethod=${paymentMethod || 'Credit Card'}&restaurantId=${restaurantId || 'N/A'}`;
      console.log("✅ Redirecting to success:", successUrl);
      router.replace(successUrl);
    }
  }, [sessionId, router, isClient, verificationData, isLoading, isError, error]);

  // Show error message if there's an error
  if (errorMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Fehler bei der Verifikation</h2>
          <p className="text-gray-600 mb-4">{errorMessage}</p>
          <p className="text-sm text-gray-500">Sie werden automatisch weitergeleitet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Kreditkartenzahlung wird verifiziert...</h2>
        <p className="text-gray-600">Bitte warten Sie einen Moment</p>
        {sessionId && (
          <p className="text-xs text-gray-500 mt-2">Session-ID: {sessionId}</p>
        )}
        {isLoading && (
          <p className="text-xs text-blue-500 mt-2">Verifikation läuft...</p>
        )}
        {isError && (
          <p className="text-xs text-red-500 mt-2">Fehler bei der Verifikation</p>
        )}
      </div>
    </div>
  );
}
