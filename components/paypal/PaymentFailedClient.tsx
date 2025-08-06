'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentFailedClient() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  // گرفتن اطلاعات از URL
  const orderId = searchParams?.get('orderId');
  const token = searchParams?.get('token');
  const error = searchParams?.get('error');
  const reason = searchParams?.get('reason');

  useEffect(() => {
    setIsClient(true);
    
    if (orderId) {
      setPaymentData({
        orderId,
        token,
        error,
        reason,
        date: new Date().toLocaleDateString('de-DE'),
        time: new Date().toLocaleTimeString('de-DE')
      });
    }
    setIsLoading(false);
  }, [orderId, token, error, reason]);

  // اگر هنوز client-side نیست، loading نمایش بده
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Wird geladen...</p>
        </div>
      </div>
    );
  }

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

  // تعیین نوع خطا و پیام مناسب
  const getErrorMessage = () => {
    if (error === 'invalid_token') {
      return {
        title: 'Ungültiger Token',
        message: 'Der Zahlungstoken ist ungültig oder abgelaufen'
      };
    }
    if (error === 'already_paid') {
      return {
        title: 'Bereits bezahlt',
        message: 'Diese Bestellung wurde bereits bezahlt'
      };
    }
    if (error === 'payment_cancelled') {
      return {
        title: 'Zahlung abgebrochen',
        message: 'Sie haben die Zahlung abgebrochen'
      };
    }
    if (error === 'verification_failed') {
      return {
        title: 'Verifikationsfehler',
        message: 'Die Zahlung konnte nicht verifiziert werden'
      };
    }
    return {
      title: 'Zahlung fehlgeschlagen',
      message: 'Die Zahlung konnte nicht abgeschlossen werden'
    };
  };

  const errorInfo = getErrorMessage();

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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{errorInfo.title}</h1>
        <p className="text-gray-600 mb-8">{errorInfo.message}</p>

        {/* Failed Details */}
        {paymentData && (
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fehler-Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Bestellnummer:</span>
                <span className="font-mono font-semibold text-gray-900">{paymentData.orderId}</span>
              </div>
              {paymentData.error && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Fehlertyp:</span>
                  <span className="font-semibold text-red-600">{paymentData.error}</span>
                </div>
              )}
              {paymentData.reason && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Grund:</span>
                  <span className="text-gray-900">{paymentData.reason}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-semibold text-red-600">Fehlgeschlagen</span>
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
            onClick={() => {
              // بررسی اینکه آیا کاربر از وب‌سایت دیگری آمده یا نه
              const referrer = document.referrer;
              const currentDomain = window.location.origin;
              
              // اگر referrer موجود باشه و از دامنه دیگری باشه
              if (referrer && !referrer.startsWith(currentDomain)) {
                console.log("🔗 Redirecting to original website:", referrer);
                window.location.href = referrer;
              } else {
                // اگر referrer نباشه یا از همین دامنه باشه، به صفحه اصلی برو
                console.log("🏠 Redirecting to homepage");
                window.location.href = '/';
              }
            }}
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
              {error === 'already_paid' && (
                <li>• Ihre Bestellung ist bereits bezahlt und wird bearbeitet</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 