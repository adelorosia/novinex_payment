'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentFailedClient() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);

  const orderId = searchParams.get('orderId');
  const token = searchParams.get('token');

  useEffect(() => {
    if (orderId && token) {
      // اینجا می‌تونی یه fetch بزنی به بک‌اند برای لغو پرداخت
      // fetch(`/api/cancel-payment?orderId=${orderId}&token=${token}`);
      
      setPaymentData({
        orderId,
        token,
        date: new Date().toLocaleDateString('de-DE'),
        time: new Date().toLocaleTimeString('de-DE')
      });
    }
    setIsLoading(false);
  }, [orderId, token]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Wird überprüft...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Failed Icon */}
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Zahlung abgebrochen</h1>
        <p className="text-gray-600 mb-8">Ihre Zahlung wurde abgebrochen und kein Betrag wurde von Ihrem Konto abgebucht</p>

        {/* Failed Details */}
        {paymentData && (
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Abbruch-Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Bestellnummer:</span>
                <span className="font-mono font-semibold text-gray-900">{paymentData.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-semibold text-red-600">Abgebrochen</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Datum:</span>
                <span className="text-gray-900">{paymentData.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Uhrzeit:</span>
                <span className="text-gray-900">{paymentData.time}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Zurück zur Startseite
          </button>
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200"
          >
            Erneut versuchen
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Hilfe</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Es wurde kein Betrag von Ihrem Konto abgebucht</li>
              <li>• Sie können es erneut versuchen</li>
              <li>• Bei Problemen kontaktieren Sie den Support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 