import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    console.log("🧪 Test PayPal verification with token:", token);

    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'Token is required for testing'
      });
    }

    // تست درخواست به بک‌اند
    const response = await fetch(`https://novinex-db.novinex.de/api/order/payment/verify/paypal?token=${token}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log("📡 Test response status:", response.status);
    console.log("📡 Test response url:", response.url);
    console.log("📡 Test response redirected:", response.redirected);

    if (response.redirected) {
      return NextResponse.json({
        success: true,
        message: 'Backend redirected',
        redirectUrl: response.url,
        status: response.status
      });
    }

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `Backend returned status ${response.status}`,
        status: response.status
      });
    }

    const data = await response.json();
    console.log("📦 Test response data:", data);

    return NextResponse.json({
      success: true,
      message: 'Backend returned JSON response',
      data: data,
      status: response.status
    });

  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 