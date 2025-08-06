import { Suspense } from 'react';
import PaymentCancelClient from '../../../components/paypal/PaymentCancelClient';

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Wird geladen...</p>
        </div>
      </div>
    }>
      <PaymentCancelClient />
    </Suspense>
  );
} 