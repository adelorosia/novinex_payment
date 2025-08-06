'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { displayRestaurants } from '@/feature/reducers/restaurantSlice';

export default function PaymentCancelPage() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [restaurantId, setRestaurantId] = useState<string>('');

  // دریافت اطلاعات رستوران‌ها
  const restaurants = useSelector((state: any) => displayRestaurants(state));

  useEffect(() => {
    const orderIdParam = searchParams.get('orderId');
    const paymentMethodParam = searchParams.get('paymentMethod');
    const tokenParam = searchParams.get('token');
    const restaurantIdParam = searchParams.get('restaurantId');

    if (orderIdParam) setOrderId(orderIdParam);
    if (paymentMethodParam) setPaymentMethod(paymentMethodParam);
    if (tokenParam) setToken(tokenParam);
    if (restaurantIdParam) setRestaurantId(restaurantIdParam);
  }, [searchParams]);

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {/* Cancel Icon */}
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
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
            
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Zahlung abgebrochen
            </h2>
            
            <p className="mt-2 text-sm text-gray-600">
              Ihre Zahlung wurde leider abgebrochen
            </p>
          </div>

          <div className="mt-8">
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Bestelldetails
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                {orderId && (
                  <div className="flex justify-between">
                    <span>Bestellnummer:</span>
                    <span className="font-medium">{orderId}</span>
                  </div>
                )}
                {paymentMethod && (
                  <div className="flex justify-between">
                    <span>Zahlungsmethode:</span>
                    <span className="font-medium capitalize">{paymentMethod}</span>
                  </div>
                )}
                {token && (
                  <div className="flex justify-between">
                    <span>Token:</span>
                    <span className="font-medium font-mono text-xs">{token}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
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
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Zurück zur Startseite
              </button>
              
              <button
                onClick={() => window.history.back()}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Erneut versuchen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 