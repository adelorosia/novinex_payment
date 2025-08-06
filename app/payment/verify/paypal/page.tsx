'use client';

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PayPalVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      console.error("❌ No token found in URL");
      router.replace("/payment/failed?error=missing_token&reason=Token nicht gefunden");
      return;
    }

    console.log("🔍 Starting PayPal verification with token:", token);
    console.log("🔍 Current URL:", window.location.href);

    const verify = async () => {
      try {
        console.log("🔍 Step 1: Trying proxy API...");
        
        // اول سعی می‌کنیم JSON response بگیریم
        const res = await fetch(`/api/verify-paypal?token=${token}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        console.log("📡 Proxy response status:", res.status);
        console.log("📡 Proxy response url:", res.url);
        console.log("📡 Proxy response redirected:", res.redirected);
        
        // اگر response redirect باشه (302, 301)
        if (res.redirected) {
          console.log("🔄 Proxy response was redirected to:", res.url);
          // بک‌اند مستقیماً به success redirect کرده
          window.location.href = res.url;
          return;
        }

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("📦 Proxy verification response:", data);

        if (data.success && data.data) {
          // تصحیح: orderId از data.data میاد، نه data.data.data
          const { orderId, transactionId, amount, paymentMethod } = data.data;
          
          // بررسی اینکه orderId موجود باشه
          if (!orderId) {
            console.error("❌ orderId is missing in proxy response:", data);
            router.replace("/payment/failed?error=missing_orderId&reason=Bestellnummer fehlt");
            return;
          }

          // ریدایرکت به صفحه موفقیت با تمام اطلاعات
          const successUrl = `/payment/success?orderId=${orderId}&transactionId=${transactionId || 'N/A'}&amount=${amount || 'N/A'}&paymentMethod=${paymentMethod || 'PayPal'}`;
          console.log("✅ Redirecting to success from proxy:", successUrl);
          router.replace(successUrl);
        } else if (data.success && data.redirectUrl) {
          console.log("✅ Proxy returned redirect URL:", data.redirectUrl);
          window.location.href = data.redirectUrl;
        } else {
          console.error("❌ Proxy verification failed:", data);
          router.replace(`/payment/failed?error=verify_failed&reason=${data.error || 'Verifikation fehlgeschlagen'}`);
        }
      } catch (err) {
        console.error("❌ Proxy network error:", err);
        
        // اگر proxy fail شد، مستقیماً به بک‌اند درخواست بزنیم
        try {
          console.log("🔄 Step 2: Trying direct backend request...");
          const directRes = await fetch(`https://novinex-db.novinex.de/api/order/payment/verify/paypal?token=${token}`, {
            headers: {
              'Accept': 'application/json',
            },
          });

          console.log("📡 Direct backend response status:", directRes.status);
          console.log("📡 Direct backend response url:", directRes.url);
          console.log("📡 Direct backend response redirected:", directRes.redirected);

          if (directRes.redirected) {
            console.log("✅ Direct backend redirect successful to:", directRes.url);
            window.location.href = directRes.url;
            return;
          }

          if (directRes.ok) {
            const directData = await directRes.json();
            console.log("📦 Direct backend response:", directData);
            
            // تصحیح: orderId از directData میاد، نه directData.data
            if (directData.orderId) {
              const successUrl = `/payment/success?orderId=${directData.orderId}&transactionId=${directData.transactionId || 'N/A'}&amount=${directData.amount || 'N/A'}&paymentMethod=PayPal`;
              console.log("✅ Redirecting to success from direct backend:", successUrl);
              router.replace(successUrl);
              return;
            } else {
              console.error("❌ Direct backend response missing orderId:", directData);
            }
          } else {
            console.error("❌ Direct backend request failed with status:", directRes.status);
          }
        } catch (directErr) {
          console.error("❌ Direct backend request also failed:", directErr);
        }

        // اگر همه چیز fail شد
        console.error("❌ All verification methods failed");
        router.replace(`/payment/failed?error=network_error&reason=Netzwerkfehler`);
      }
    };

    verify();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">PayPal-Zahlung wird verifiziert...</h2>
        <p className="text-gray-600">Bitte warten Sie einen Moment</p>
        <p className="text-xs text-gray-500 mt-2">Token: {token}</p>
      </div>
    </div>
  );
}