import PaymentSuccessClient from "@/components/paypal/PaymentSuccessClient";
import { Suspense } from "react";


export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>🔄 Wird geladen...</div>}>
      <PaymentSuccessClient />
    </Suspense>
  );
}