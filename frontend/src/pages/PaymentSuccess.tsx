import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowLeft, Package } from 'lucide-react';
import client from '@/lib/api';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [orderId, setOrderId] = useState<number | null>(null);

  useEffect(() => {
    async function verifyPayment() {
      const sessionId = searchParams.get('session_id');
      if (!sessionId) {
        setStatus('error');
        return;
      }

      try {
        const response = await client.apiCall.invoke({
          url: '/api/v1/payment/verify_payment',
          method: 'POST',
          data: { session_id: sessionId },
        });

        if (response.data?.status === 'paid') {
          setStatus('success');
          setOrderId(response.data.order_id);
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    }
    verifyPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {status === 'loading' && (
          <>
            <Loader2 className="w-20 h-20 text-[#C9A96E] mx-auto animate-spin" />
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Verifiserer betaling...</h1>
            <p className="text-gray-500">Vennligst vent mens vi bekrefter betalingen din.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-14 h-14 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-[#1A1A1A]">Takk for din bestilling!</h1>
            <p className="text-gray-500 text-lg">
              Din betaling er bekreftet. Vi sender Pure Flow til deg så snart som mulig.
            </p>
            {orderId && (
              <div className="bg-white rounded-xl p-4 inline-flex items-center gap-3">
                <Package className="w-5 h-5 text-[#C9A96E]" />
                <span className="text-gray-600">Ordrenummer: <strong className="text-[#1A1A1A]">#{orderId}</strong></span>
              </div>
            )}
            <button
              onClick={() => navigate('/')}
              className="bg-[#C9A96E] hover:bg-[#B8944D] text-[#0C1B2A] font-semibold py-3 px-8 rounded-xl transition-all inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Tilbake til butikken
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-14 h-14 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Noe gikk galt</h1>
            <p className="text-gray-500">Vi kunne ikke verifisere betalingen din. Vennligst kontakt oss.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#0C1B2A] hover:bg-[#1A3A5C] text-white font-semibold py-3 px-8 rounded-xl transition-all inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Tilbake til butikken
            </button>
          </>
        )}
      </div>
    </div>
  );
}