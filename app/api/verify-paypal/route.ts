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

    // درخواست به بک‌اند
    const response = await fetch(`https://novinex-db.novinex.de/api/order/payment/verify/paypal?token=${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // اضافه کردن CORS headers
        'Access-Control-Allow-Origin': 'https://pay.novinex.de',
        'Access-Control-Allow-Credentials': 'true',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Error verifying PayPal payment:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Fehler bei der PayPal-Verifikation' 
      },
      { status: 500 }
    );
  }
} 