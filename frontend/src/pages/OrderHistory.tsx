import { useEffect, useState } from 'react';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import client from '@/lib/api';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';

interface Order {
  id: number;
  items: string;
  total_amount: number;
  status: string;
  created_at: string;
  stripe_session_id: string;
}

interface ParsedItem {
  product_name: string;
  package_label: string;
  quantity: number;
  unit_price: number;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  paid: { label: 'Betalt', color: 'text-emerald-600 bg-emerald-50', icon: CheckCircle },
  pending: { label: 'Venter', color: 'text-amber-600 bg-amber-50', icon: Clock },
  cancelled: { label: 'Kansellert', color: 'text-red-500 bg-red-50', icon: XCircle },
};

function formatDate(dateStr: string) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('nb-NO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

function parseItems(itemsStr: string): ParsedItem[] {
  try {
    return JSON.parse(itemsStr);
  } catch {
    return [];
  }
}

export default function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function init() {
      try {
        const res = await client.auth.me();
        if (res?.data) {
          setUser(res.data);
          const orderRes = await client.entities.orders.query({
            sort: '-created_at',
            limit: 50,
          });
          if (orderRes.data?.items) {
            setOrders(orderRes.data.items);
          }
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F6F2]">
        <Header />
        <CartDrawer />
        <div className="flex items-center justify-center pt-32">
          <Loader2 className="w-8 h-8 text-[#C9A96E] animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8F6F2]">
        <Header />
        <CartDrawer />
        <div className="max-w-2xl mx-auto px-4 pt-32 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">Logg inn for å se bestillinger</h2>
          <p className="text-gray-500 mb-6">Du må være innlogget for å se ordrehistorikken din.</p>
          <button
            onClick={() => client.auth.toLogin()}
            className="bg-[#C9A96E] hover:bg-[#B8944D] text-[#0C1B2A] font-semibold py-3 px-8 rounded-xl transition-all"
          >
            Logg inn
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      <Header />
      <CartDrawer />
      <div className="max-w-4xl mx-auto px-4 pt-28 pb-16">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-500 hover:text-[#C9A96E] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Tilbake til butikken
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-[#C9A96E]/10 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-[#C9A96E]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Mine bestillinger</h1>
            <p className="text-gray-500 text-sm">{orders.length} bestilling{orders.length !== 1 ? 'er' : ''}</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">Ingen bestillinger ennå</h3>
            <p className="text-gray-500 mb-6">Du har ikke gjort noen bestillinger ennå. Utforsk Pure Flow-produktene våre!</p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#C9A96E] hover:bg-[#B8944D] text-[#0C1B2A] font-semibold py-3 px-8 rounded-xl transition-all"
            >
              Se produkter
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              const items = parseItems(order.items);

              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">Ordre #{order.id}</span>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${status.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status.label}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">
                      {order.created_at ? formatDate(order.created_at) : 'Ukjent dato'}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div className="px-6 py-4">
                    {items.length > 0 ? (
                      <div className="space-y-3">
                        {items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-[#1A1A1A]">{item.product_name}</p>
                              <p className="text-xs text-gray-400">{item.package_label} × {item.quantity}</p>
                            </div>
                            <span className="text-sm font-medium text-[#1A1A1A]">
                              {new Intl.NumberFormat('nb-NO', { minimumFractionDigits: 0 }).format(item.unit_price * item.quantity)} kr
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">Ingen detaljer tilgjengelig</p>
                    )}
                  </div>

                  {/* Order Total */}
                  <div className="flex items-center justify-between px-6 py-4 bg-[#F8F6F2]">
                    <span className="text-sm font-medium text-gray-600">Totalt</span>
                    <span className="text-lg font-bold text-[#1A1A1A]">
                      {new Intl.NumberFormat('nb-NO', { minimumFractionDigits: 0 }).format(order.total_amount)} kr
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}