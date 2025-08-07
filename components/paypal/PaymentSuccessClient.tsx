'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useVerifyPayPalPaymentQuery } from '@/feature/reducers/paypalSlice';
import { useVerifyStripePaymentQuery } from '@/feature/reducers/stripSlice';
import { displayRestaurants } from '@/feature/reducers/restaurantSlice';
import { useSelector } from 'react-redux';

// TODO: برای آینده - اضافه کردن useGetOrderDetailsQuery برای جزئیات سفارش
// import { useGetOrderDetailsQuery } from '@/feature/reducers/orderSlice';

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [isValidAccess, setIsValidAccess] = useState(false);

  // گرفتن اطلاعات از URL
  const orderId = searchParams?.get('orderId');
  const transactionId = searchParams?.get('transactionId');
  const paymentMethod = searchParams?.get('paymentMethod');
  const token = searchParams?.get('token');
  const amount = searchParams?.get('amount');
  const restaurantId = searchParams?.get('restaurantId');

  // استفاده از RTK Query برای تأیید پرداخت PayPal (اختیاری)
  const { data: paypalVerificationData, isLoading: isPayPalVerifying, error: paypalError } = useVerifyPayPalPaymentQuery(
    { token: token || '' },
    { 
      skip: !token || !isClient || paymentMethod !== 'PayPal',
      // اضافه کردن error handling بهتر
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: false
    }
  );

  // استفاده از RTK Query برای تأیید پرداخت Stripe (Credit Card)
  const { data: stripeVerificationData, isLoading: isStripeVerifying, error: stripeError } = useVerifyStripePaymentQuery(
    { sessionId: token || '' },
    { 
      skip: !token || !isClient || paymentMethod !== 'Credit Card',
      // اضافه کردن error handling بهتر
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: false
    }
  );

  // دریافت اطلاعات رستوران‌ها
  const restaurants = useSelector((state: any) => displayRestaurants(state));

  // TODO: برای آینده - گرفتن جزئیات سفارش
  // const { data: orderDetails } = useGetOrderDetailsQuery(orderId!, { skip: !orderId });

  useEffect(() => {
    setIsClient(true);
    
    // بررسی اینکه آیا دسترسی معتبر است
    const checkValidAccess = () => {
      // بررسی اینکه آیا از verify page یا payment gateway آمده
      const referrer = document.referrer;
      const currentDomain = window.location.origin;
      
      // اگر referrer از همین domain باشه یا از external payment gateway
      const isValidReferrer = referrer.includes(currentDomain) || 
                             referrer.includes('paypal.com') || 
                             referrer.includes('stripe.com') ||
                             referrer.includes('checkout.stripe.com');
      
      // یا اینکه parameters لازم موجود باشن (از verify page آمده)
      const hasRequiredParams = orderId && paymentMethod;
      
      return isValidReferrer || hasRequiredParams;
    };
    
    if (!checkValidAccess()) {
      // ریدایرکت به صفحه اصلی
      window.location.href = '/';
      return;
    }
    
    setIsValidAccess(true);
    
    if (orderId && transactionId && paymentMethod) {
      setPaymentData({
        orderId,
        transactionId,
        paymentMethod,
        date: new Date().toLocaleDateString('de-DE'),
        time: new Date().toLocaleTimeString('de-DE'),
        // استفاده مستقیم از verificationData یا amount از URL یا fallback
        amount: (paypalVerificationData as any)?.amount ?? (stripeVerificationData as any)?.amount ?? amount ?? '100.00'
      });
    }
    setIsLoading(false);
  }, [orderId, transactionId, paymentMethod, paypalVerificationData, stripeVerificationData, amount]);

  // پیدا کردن دامنه رستوران
  const getRestaurantDomain = () => {
    if (!restaurantId || restaurantId === 'N/A') return null;
    
    console.log("🔍 All restaurants:", restaurants);
    console.log("🔍 Looking for restaurant with no:", restaurantId);
    
    const restaurant = restaurants.find(r => r.no === restaurantId);
    console.log("🔍 Debug restaurant lookup:", {
      restaurantId,
      restaurants: restaurants.length,
      foundRestaurant: restaurant,
      domain: restaurant?.domain,
      allRestaurantNos: restaurants.map(r => r.no)
    });
    return restaurant?.domain || null;
  };

  const restaurantDomain = getRestaurantDomain();
  console.log("🏪 Restaurant domain:", restaurantDomain);

  // اگر هنوز client-side نیست یا دسترسی معتبر نیست، loading نمایش بده
  if (!isClient || !isValidAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Wird geladen...</p>
        </div>
      </div>
    );
  }

  // اگر در حال تأیید PayPal هست (فقط اگر token موجود باشه)
  if (isPayPalVerifying && token && paymentMethod === 'PayPal') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">PayPal-Zahlung wird verifiziert...</p>
        </div>
      </div>
    );
  }

  // اگر در حال تأیید Stripe هست (فقط اگر token موجود باشه)
  if (isStripeVerifying && token && paymentMethod === 'Credit Card') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Kreditkartenzahlung wird verifiziert...</p>
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

  // تعیین پیام مناسب بر اساس paymentMethod
  const getPaymentMethodMessage = () => {
    switch (paymentMethod) {
      case 'PayPal':
        return 'Ihre PayPal-Zahlung wurde erfolgreich verarbeitet';
      case 'Credit Card':
        return 'Ihre Kreditkartenzahlung wurde erfolgreich verarbeitet';
      case 'CreditCard':
        return 'Ihre Kreditkartenzahlung wurde erfolgreich verarbeitet';
      case 'BankTransfer':
        return 'Ihre Banküberweisung wurde erfolgreich verarbeitet';
      default:
        return 'Ihre Bestellung wurde erfolgreich registriert und bezahlt';
    }
  };

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
        <p className="text-gray-600 mb-8">{getPaymentMethodMessage()}</p>

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
                <span className="text-gray-600">Transaktions-ID:</span>
                <span className="font-mono font-semibold text-gray-900">{paymentData.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Zahlungsmethode:</span>
                <span className="font-semibold text-blue-600">{paymentData.paymentMethod}</span>
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
            onClick={() => {
              console.log("🔍 Button clicked - Debug info:", {
                restaurantDomain,
                restaurantId,
                referrer: document.referrer,
                currentDomain: window.location.origin
              });
              
              // فقط به دامنه رستوران برو
              if (restaurantDomain) {
                console.log("🏪 Redirecting to restaurant domain:", restaurantDomain);
                window.location.href = restaurantDomain;
              } else {
                console.log("❌ No restaurant domain found, staying on current page");
                // اگر دامنه رستوران نباشد، کاری نکن
              }
            }}
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
          {/* اگر verificationData اطلاعات اضافی داره */}
          {((paypalVerificationData as any)?.additionalInfo || (stripeVerificationData as any)?.additionalInfo) && (
            <p className="text-xs text-blue-600 mt-2">
              {(paypalVerificationData as any)?.additionalInfo || (stripeVerificationData as any)?.additionalInfo}
            </p>
          )}
          {/* اگر خطا در تأیید بود ولی اطلاعات کافی داشتیم */}
          {(paypalError && token && paymentMethod === 'PayPal') || (stripeError && token && paymentMethod === 'Credit Card') && (
            <p className="text-xs text-yellow-600 mt-2">
              ⚠️ Zahlung erfolgreich, aber Verifikation konnte nicht abgeschlossen werden
            </p>
          )}
          {/* اگر verification انجام نشده (بدون token) */}
          {!token && (
            <p className="text-xs text-blue-600 mt-2">
              ℹ️ Zahlung über URL-Parameter bestätigt
            </p>
          )}
        </div>
      </div>
    </div>
  );
}