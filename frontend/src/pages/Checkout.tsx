import { useState } from 'react';
import { ArrowLeft, ShoppingBag, Lock, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import client from '@/lib/api';
import { toast } from 'sonner';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK', minimumFractionDigits: 0 }).format(price);

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error('Handlekurven er tom');
      return;
    }

    setLoading(true);
    try {
      // Check if user is logged in
      const user = await client.auth.me();
      if (!user?.data) {
        toast.error('Du må logge inn for å fullføre kjøpet');
        await client.auth.toLogin();
        return;
      }

      const response = await client.apiCall.invoke({
        url: '/api/v1/payment/create_payment_session',
        method: 'POST',
        data: {
          items: items.map(item => ({
            product_id: item.productId,
            product_name: item.productName,
            package_type: item.packageType,
            package_label: item.packageLabel,
            quantity: item.quantity,
            unit_price: item.unitPrice,
          })),
          total_amount: totalPrice,
        },
      });

      if (response.data?.url) {
        clearCart();
        client.utils.openUrl(response.data.url);
      }
    } catch (err: any) {
      const detail = err?.data?.detail || err?.response?.data?.detail || err?.message || 'Noe gikk galt';
      toast.error(detail);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto" />
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Handlekurven er tom</h1>
          <p className="text-gray-500">Legg til produkter for å gå til kassen</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#C9A96E] hover:bg-[#B8944D] text-[#0C1B2A] font-semibold py-3 px-8 rounded-xl transition-all"
          >
            Tilbake til butikken
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-16">
        {/* Header */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-500 hover:text-[#C9A96E] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Tilbake til butikken
        </button>

        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-8">Kassen</h1>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-6">
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-6 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#C9A96E]" /> Ordresammendrag
          </h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={`${item.productId}-${item.packageType}`} className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
                <img src={item.imageUrl} alt={item.productName} className="w-16 h-16 object-contain bg-[#F8F6F2] rounded-lg p-1" />
                <div className="flex-1">
                  <p className="font-medium text-[#1A1A1A]">{item.productName}</p>
                  <p className="text-sm text-[#C9A96E]">{item.packageLabel}</p>
                  <p className="text-sm text-gray-400">Antall: {item.quantity}</p>
                </div>
                <p className="font-semibold text-[#1A1A1A]">{formatPrice(item.unitPrice * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Frakt</span>
              <span className="text-emerald-600 font-medium">Gratis</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-[#1A1A1A] pt-3 border-t">
              <span>Totalt</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
            <Lock className="w-4 h-4" />
            <span>Sikker betaling via Stripe</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-[#C9A96E] hover:bg-[#B8944D] disabled:opacity-60 disabled:cursor-not-allowed text-[#0C1B2A] font-bold py-4 rounded-xl text-lg transition-all duration-300 shadow-lg shadow-[#C9A96E]/30 flex items-center justify-center gap-3"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-[#0C1B2A]/30 border-t-[#0C1B2A] rounded-full animate-spin" />
            ) : (
              <>
                <CreditCard className="w-5 h-5" /> Betal {formatPrice(totalPrice)}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}