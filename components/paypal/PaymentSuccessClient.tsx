'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  const orderId = searchParams?.get('orderId');
  const token = searchParams?.get('token');
  const PayerID = searchParams?.get('PayerID');

  useEffect(() => {
    setIsClient(true);
    
    if (orderId && token && PayerID) {
      // اینجا می‌تونی یه fetch بزنی به بک‌اند برای تأیید پرداخت
      // fetch(`/api/verify-payment?orderId=${orderId}&token=${token}&PayerID=${PayerID}`);
      
      setPaymentData({
        orderId,
        token,
        PayerID,
        amount: '100.00', // این مقدار باید از بک‌اند بیاد
        date: new Date().toLocaleDateString('de-DE'),
        time: new Date().toLocaleTimeString('de-DE')
      });
    }
    setIsLoading(false);
  }, [orderId, token, PayerID]);

  // اگر هنوز client-side نیست، loading نمایش بده
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Wird geladen...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Zahlung wird überprüft...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Zahlung erfolgreich!</h1>
        <p className="text-gray-600 mb-8">Ihre Bestellung wurde erfolgreich registriert und bezahlt</p>

        {/* Payment Details */}
        {paymentData && (
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Zahlungsdetails</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Bestellnummer:</span>
                <span className="font-mono font-semibold text-gray-900">{paymentData.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Betrag:</span>
                <span className="font-semibold text-green-600">{paymentData.amount} €</span>
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
            className="w-full bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors duration-200"
          >
            Zurück zur Startseite
          </button>
          <button
            onClick={() => window.print()}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200"
          >
            Beleg drucken
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Die Zahlungsbestätigung wird an Ihre E-Mail gesendet
          </p>
        </div>
      </div>
    </div>
  );
}