'use client';

import { useSearchParams } from 'next/navigation';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get('orderId');
  const transactionId = searchParams.get('transactionId');
  const amount = searchParams.get('amount');

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#16a34a", fontSize: "28px", marginBottom: "20px" }}>
        ✅ Zahlung erfolgreich!
      </h1>

      <p style={{ fontSize: "18px", marginBottom: "10px" }}>
        Vielen Dank für Ihre Bestellung.
      </p>

      <p style={{ fontSize: "16px", marginBottom: "8px" }}>
        <strong>Bestellnummer:</strong> {orderId}
      </p>

      <p style={{ fontSize: "16px", marginBottom: "8px" }}>
        <strong>Transaktions-ID:</strong> {transactionId || "–"}
      </p>

      <p style={{ fontSize: "16px", marginBottom: "20px" }}>
        <strong>Bezahlter Betrag:</strong> {amount || "–"} €
      </p>

      <p style={{ fontSize: "14px", color: "#555" }}>
        Eine Bestellbestätigung wurde an Ihre E-Mail-Adresse gesendet. Bei Fragen stehen wir Ihnen gerne zur Verfügung.
      </p>
    </div>
  );
}