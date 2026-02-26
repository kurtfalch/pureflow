import { ShoppingCart, Droplets, Menu, X, User, LogOut, ClipboardList, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '@/lib/api';

export default function Header() {
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await client.auth.me();
        if (res?.data) {
          setUser(res.data);
        }
      } catch {
        setUser(null);
      }
    }
    checkAuth();
  }, []);

  const handleLogin = async () => {
    await client.auth.toLogin();
  };

  const handleLogout = async () => {
    await client.auth.logout();
    setUser(null);
    setShowUserMenu(false);
  };

  const scrollTo = (id: string) => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0C1B2A]/95 backdrop-blur-md border-b border-[#C9A96E]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { navigate('/'); setTimeout(() => scrollTo('hero'), 100); }}>
            <Droplets className="w-7 h-7 text-[#C9A96E]" />
            <span className="text-xl font-bold text-white tracking-wide">
              Pure<span className="text-[#C9A96E]">Flow</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('features')} className="text-gray-300 hover:text-[#C9A96E] transition-colors text-sm font-medium">
              Fordeler
            </button>
            <button onClick={() => scrollTo('product')} className="text-gray-300 hover:text-[#C9A96E] transition-colors text-sm font-medium">
              Produkt
            </button>
            <button onClick={() => scrollTo('filter-info')} className="text-gray-300 hover:text-[#C9A96E] transition-colors text-sm font-medium">
              Filter
            </button>
            <button onClick={() => scrollTo('pricing')} className="text-gray-300 hover:text-[#C9A96E] transition-colors text-sm font-medium">
              Priser
            </button>
            <button onClick={() => scrollTo('reviews')} className="text-gray-300 hover:text-[#C9A96E] transition-colors text-sm font-medium">
              Anmeldelser
            </button>
            <button onClick={() => navigate('/ai-writer')} className="text-gray-300 hover:text-[#C9A96E] transition-colors text-sm font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> AI Annonser
            </button>
          </nav>

          {/* Cart + Auth + Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative text-white hover:text-[#C9A96E] transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#C9A96E] text-[#0C1B2A] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-9 h-9 rounded-full bg-[#C9A96E]/20 border border-[#C9A96E]/40 flex items-center justify-center hover:bg-[#C9A96E]/30 transition-colors"
                >
                  <User className="w-5 h-5 text-[#C9A96E]" />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <button
                      onClick={() => { navigate('/orders'); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#F8F6F2] transition-colors"
                    >
                      <ClipboardList className="w-4 h-4 text-[#C9A96E]" /> Mine bestillinger
                    </button>
                    <button
                      onClick={() => { navigate('/ai-writer'); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#F8F6F2] transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-[#C9A96E]" /> AI Annonsegenerator
                    </button>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Logg ut
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="text-sm font-medium text-[#C9A96E] border border-[#C9A96E]/40 hover:bg-[#C9A96E]/10 px-4 py-2 rounded-lg transition-colors"
              >
                Logg inn
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-[#C9A96E]/20 mt-2 pt-4 space-y-3">
            <button onClick={() => scrollTo('features')} className="block w-full text-left text-gray-300 hover:text-[#C9A96E] transition-colors text-sm font-medium py-2">
              Fordeler
            </button>
            <button onClick={() => scrollTo('product')} className="block w-full text-left text-gray-300 hover:text-[#C9A96E] transition-colors text-sm font-medium py-2">
              Produkt
            </button>
            <button onClick={() => scrollTo('filter-info')} className="block w-full text-left text-gray-300 hover:text-[#C9A96E] transition-colors text-sm font-medium py-2">
              Filter
            </button>
            <button onClick={() => scrollTo('pricing')} className="block w-full text-left text-gray-300 hover:text-[#C9A96E] transition-colors text-sm font-medium py-2">
              Priser
            </button>
            <button onClick={() => scrollTo('reviews')} className="block w-full text-left text-gray-300 hover:text-[#C9A96E] transition-colors text-sm font-medium py-2">
              Anmeldelser
            </button>
            <button onClick={() => { navigate('/ai-writer'); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-300 hover:text-[#C9A96E] transition-colors text-sm font-medium py-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> AI Annonser
            </button>
            {user && (
              <button onClick={() => { navigate('/orders'); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-300 hover:text-[#C9A96E] transition-colors text-sm font-medium py-2 flex items-center gap-1">
                <ClipboardList className="w-3.5 h-3.5" /> Mine bestillinger
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}