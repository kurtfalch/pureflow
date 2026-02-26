import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK', minimumFractionDigits: 0 }).format(price);

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsCartOpen(false)} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#C9A96E]" />
            <h2 className="text-lg font-semibold text-[#1A1A1A]">Handlekurv ({totalItems})</h2>
          </div>
          <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingBag className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg">Handlekurven er tom</p>
              <p className="text-sm mt-1">Legg til produkter for å komme i gang</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.packageType}`} className="flex gap-4 p-4 bg-[#F8F6F2] rounded-xl">
                  <img src={item.imageUrl} alt={item.productName} className="w-20 h-20 object-contain rounded-lg bg-white p-1" />
                  <div className="flex-1">
                    <h3 className="font-medium text-[#1A1A1A] text-sm">{item.productName}</h3>
                    <p className="text-xs text-[#C9A96E] font-medium mt-0.5">{item.packageLabel}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 bg-white rounded-lg border">
                        <button
                          onClick={() => updateQuantity(item.productId, item.packageType, item.quantity - 1)}
                          className="p-1.5 hover:bg-gray-50 rounded-l-lg"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.packageType, item.quantity + 1)}
                          className="p-1.5 hover:bg-gray-50 rounded-r-lg"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#1A1A1A] text-sm">{formatPrice(item.unitPrice * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.productId, item.packageType)} className="text-gray-300 hover:text-red-400 self-start">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Totalt</span>
              <span className="text-xl font-bold text-[#1A1A1A]">{formatPrice(totalPrice)}</span>
            </div>
            <button
              onClick={() => {
                setIsCartOpen(false);
                navigate('/checkout');
              }}
              className="w-full bg-[#C9A96E] hover:bg-[#B8944D] text-[#0C1B2A] font-semibold py-4 rounded-xl transition-all duration-300 text-lg"
            >
              Gå til kassen
            </button>
          </div>
        )}
      </div>
    </>
  );
}