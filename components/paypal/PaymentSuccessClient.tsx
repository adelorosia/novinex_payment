'use client';

import { useSearchParams } from 'next/navigation';

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const transactionId = searchParams.get('transactionId');
  const amount = searchParams.get('amount');

  return (
    <div style={{ padding: 40 }}>
      <h1>✅ Zahlung erfolgreich!</h1>
      <p><strong>Bestellnummer:</strong> {orderId}</p>
      <p><strong>Transaktions-ID:</strong> {transactionId}</p>
      <p><strong>Bezahlter Betrag:</strong> {amount} €</p>
    </div>
  );
}