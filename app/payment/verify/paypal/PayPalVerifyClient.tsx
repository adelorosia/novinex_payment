'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyPayPalPaymentQuery } from "@/feature/reducers/paypalSlice";

export default function PayPalVerifyClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isClient, setIsClient] = useState(false);

  // استفاده از RTK Query برای تایید پرداخت PayPal
  const { data: verificationData, isLoading, error, isError } = useVerifyPayPalPaymentQuery(
    { token: token || '' },
    { 
      skip: !token || !isClient,
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: false
    }
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!token) {
      console.error("❌ No token found in URL");
      router.replace("/payment/failed?error=missing_token&reason=Token nicht gefunden");
      return;
    }

    if (!isClient) return; // منتظر client-side rendering

    console.log("🔍 Starting PayPal verification with token:", token);
    console.log("🔍 Current URL:", window.location.href);

    // اگر در حال loading هستیم، منتظر بمانیم
    if (isLoading) {
      console.log("⏳ Loading verification data...");
      return;
    }

    // اگر error داریم
    if (isError) {
      console.error("❌ Verification error:", error);
      router.replace(`/payment/failed?error=verify_failed&reason=Verifikation fehlgeschlagen`);
      return;
    }

    // اگر data داریم
    if (verificationData) {
      console.log("📦 Verification response:", verificationData);
      
      // بررسی اینکه orderId موجود باشه
      if (!verificationData.orderId) {
        console.error("❌ orderId is missing in verification response:", verificationData);
        router.replace("/payment/failed?error=missing_orderId&reason=Bestellnummer fehlt");
        return;
      }

      // ریدایرکت به صفحه موفقیت با تمام اطلاعات
      const { orderId, transactionId, amount, paymentMethod, restaurantId } = verificationData;
      const successUrl = `/payment/success?orderId=${orderId}&transactionId=${transactionId || 'N/A'}&amount=${amount || 'N/A'}&paymentMethod=${paymentMethod || 'PayPal'}&restaurantId=${restaurantId || 'N/A'}`;
      console.log("✅ Redirecting to success:", successUrl);
      router.replace(successUrl);
    }
  }, [token, router, isClient, verificationData, isLoading, isError, error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">PayPal-Zahlung wird verifiziert...</h2>
        <p className="text-gray-600">Bitte warten Sie einen Moment</p>
        <p className="text-xs text-gray-500 mt-2">Token: {token}</p>
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