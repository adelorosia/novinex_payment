'use client';

import { Suspense } from 'react';
import StripeVerifyClient from './StripeVerifyClient';

export default function StripeVerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Wird geladen...</h2>
          <p className="text-gray-600">Bitte warten Sie einen Moment</p>
        </div>
      </div>
    }>
      <StripeVerifyClient />
    </Suspense>
  );
}
