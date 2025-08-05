import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const token = searchParams.get('token');

    if (!orderId || !token) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'پارامترهای ضروری موجود نیست' 
        },
        { status: 400 }
      );
    }

    // اینجا باید به بک‌اند درخواست بزنی برای لغو پرداخت
    const response = await fetch(`${process.env.BACKEND_URL}/api/payments/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
        token,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to cancel payment');
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      cancelDetails: data,
    });

  } catch (error) {
    console.error('Error canceling payment:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'خطا در لغو پرداخت' 
      },
      { status: 500 }
    );
  }
} 