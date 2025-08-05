'use client';

import { useSearchParams } from 'next/navigation';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get('orderId');
  const transactionId = searchParams.get('transactionId');
  const amount = searchParams.get('amount');

  return (
    <div style={{ padding: 40 }}>
      <h1>✅ پرداخت با موفقیت انجام شد!</h1>
      <p>شماره سفارش: {orderId}</p>
      <p>تراکنش: {transactionId}</p>
      <p>مبلغ پرداختی: {amount} یورو</p>
    </div>
  );
}