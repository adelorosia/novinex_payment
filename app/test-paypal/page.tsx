'use client';

import { useState } from 'react';

export default function TestPayPalPage() {
  const [token, setToken] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testVerification = async () => {
    if (!token) {
      alert('Please enter a token');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`/api/test-paypal?token=${token}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">PayPal Verification Test</h1>
        
        <div className="bg-white rounded-lg p-6 mb-6">
          <label className="block text-sm font-medium mb-2">PayPal Token:</label>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter PayPal token (e.g., 2H299246J19941906)"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <button
            onClick={testVerification}
            disabled={loading}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Verification'}
          </button>
        </div>

        {result && (
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Test Result:</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 