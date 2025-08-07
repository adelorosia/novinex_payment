'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { displayRestaurants } from '@/feature/reducers/restaurantSlice';

export default function PaymentCancelClient() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [restaurantId, setRestaurantId] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const [isValidAccess, setIsValidAccess] = useState(false);

  // دریافت اطلاعات رستوران‌ها
  const restaurants = useSelector((state: any) => displayRestaurants(state));

  useEffect(() => {
    setIsClient(true);
    
    const orderIdParam = searchParams?.get('orderId');
    const paymentMethodParam = searchParams?.get('paymentMethod');
    const tokenParam = searchParams?.get('token');
    const restaurantIdParam = searchParams?.get('restaurantId');

    // بررسی اینکه آیا دسترسی معتبر است
    const checkValidAccess = () => {
      const referrer = document.referrer;
      const currentDomain = window.location.origin;
      
      // اگر referrer از همین domain باشه یا از external payment gateway
      const isValidReferrer = referrer.includes(currentDomain) || 
                             referrer.includes('paypal.com') || 
                             referrer.includes('stripe.com') ||
                             referrer.includes('checkout.stripe.com');
      
      // یا اینکه parameters لازم موجود باشن
      const hasRequiredParams = orderIdParam || tokenParam;
      
      return isValidReferrer || hasRequiredParams;
    };
    
    if (!checkValidAccess()) {
      // ریدایرکت به صفحه اصلی
      window.location.href = '/';
      return;
    }
    
    setIsValidAccess(true);

    if (orderIdParam) setOrderId(orderIdParam);
    if (paymentMethodParam) setPaymentMethod(paymentMethodParam);
    if (tokenParam) setToken(tokenParam);
    if (restaurantIdParam) setRestaurantId(restaurantIdParam);
  }, [searchParams]);

  // پیدا کردن دامنه رستوران - دقیقاً مثل success page
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Wird geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Cancel Icon */}
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Zahlung abgebrochen</h1>
        <p className="text-gray-600 mb-8">Ihre Zahlung wurde leider abgebrochen</p>

        {/* Payment Details */}
        {(orderId || paymentMethod || token) && (
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bestelldetails</h3>
            <div className="space-y-3 text-sm">
              {orderId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Bestellnummer:</span>
                  <span className="font-mono font-semibold text-gray-900">{orderId}</span>
                </div>
              )}
              {paymentMethod && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Zahlungsmethode:</span>
                  <span className="font-semibold text-blue-600 capitalize">{paymentMethod}</span>
                </div>
              )}
              {token && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Token:</span>
                  <span className="font-mono font-semibold text-gray-900 text-xs">{token}</span>
                </div>
              )}
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
              
              // فقط به دامنه رستوران برو - دقیقاً مثل success page
              if (restaurantDomain) {
                console.log("🏪 Redirecting to restaurant domain:", restaurantDomain);
                window.location.href = restaurantDomain;
              } else {
                console.log("❌ No restaurant domain found, staying on current page");
                // اگر دامنه رستوران نباشد، کاری نکن
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
          <p className="text-xs text-gray-500">
            Sie können Ihre Bestellung jederzeit erneut versuchen
          </p>
        </div>
      </div>
    </div>
  );
} 