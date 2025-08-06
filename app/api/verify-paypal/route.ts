import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Token ist erforderlich' 
        },
        { status: 400 }
      );
    }

    console.log("🔍 Proxying PayPal verification request for token:", token);

    // درخواست به بک‌اند
    const response = await fetch(`https://novinex-db.novinex.de/api/order/payment/verify/paypal?token=${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // اضافه کردن CORS headers
        'Access-Control-Allow-Origin': 'https://pay.novinex.de',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      // اضافه کردن credentials
      credentials: 'include',
      // اضافه کردن redirect: 'follow' برای handle کردن redirect ها
      redirect: 'follow',
    });

    console.log("📡 Backend response status:", response.status);
    console.log("📡 Backend response url:", response.url);

    // اگر بک‌اند redirect کرده باشه
    if (response.redirected) {
      console.log("🔄 Backend redirected to:", response.url);
      
      // اگر redirect به success page باشه، URL رو return کنیم
      if (response.url.includes('/payment/success')) {
        return NextResponse.json({
          success: true,
          redirectUrl: response.url,
          message: 'Payment verified, redirecting to success page'
        });
      }
    }

    if (!response.ok) {
      console.error('Backend response error:', response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("📦 Backend response data:", data);
    
    // بررسی اینکه data درست باشه
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format from backend');
    }

    // بررسی اینکه orderId موجود باشه (از data.data.orderId)
    const orderData = data.data || data;
    if (!orderData || !orderData.orderId) {
      console.error("❌ Backend response missing orderId:", data);
      return NextResponse.json({
        success: false,
        error: 'Backend response missing orderId',
        data: data
      });
    }

    console.log("✅ Found orderId:", orderData.orderId);

    return NextResponse.json({
      success: true,
      data: {
        orderId: orderData.orderId,
        transactionId: orderData.transactionId,
        amount: orderData.amount,
        paymentMethod: orderData.paymentMethod || 'PayPal',
        status: orderData.status || 'completed'
      }
    }, {
      headers: {
        'Access-Control-Allow-Origin': 'https://pay.novinex.de',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });

  } catch (error) {
    console.error('Error verifying PayPal payment:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Fehler bei der PayPal-Verifikation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': 'https://pay.novinex.de',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    );
  }
}

// اضافه کردن OPTIONS handler برای CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://pay.novinex.de',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 