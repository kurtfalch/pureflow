import { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, Sparkles, Upload, X, ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import client from '@/lib/api';
import { toast } from 'sonner';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image_url: string;
  created_at: string;
}

const ADMIN_PASSWORD = 'pureflow2026';

export default function AdminPage() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ name: '', price: '', description: '', category: '', image_url: '' });
  const [aiKeywords, setAiKeywords] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (authenticated) fetchProducts();
  }, [authenticated]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await client.entities.products.query({ sort: '-created_at', limit: 50 });
      setProducts(res.data?.items || []);
    } catch (err) {
      console.error(err);
      toast.error('Kunne ikke hente produkter');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      toast.error('Feil passord');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', price: '', description: '', category: '', image_url: '' });
    setEditingProduct(null);
    setShowForm(false);
    setAiKeywords('');
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: String(product.price),
      description: product.description || '',
      category: product.category || '',
      image_url: product.image_url || '',
    });
    setShowForm(true);
  };

  const openNewForm = () => {
    resetForm();
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error('Navn og pris er påkrevd');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        category: formData.category,
        image_url: formData.image_url,
      };
      if (editingProduct) {
        await client.entities.products.update({ id: String(editingProduct.id), data: payload });
        toast.success('Produkt oppdatert');
      } else {
        await client.entities.products.create({ data: payload });
        toast.success('Produkt opprettet');
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error('Kunne ikke lagre produkt');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Er du sikker på at du vil slette dette produktet?')) return;
    try {
      await client.entities.products.delete({ id: String(id) });
      toast.success('Produkt slettet');
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error('Kunne ikke slette produkt');
    }
  };

  const generateAiDescription = async () => {
    if (!formData.name) {
      toast.error('Skriv inn produktnavn først');
      return;
    }
    setAiLoading(true);
    try {
      let fullText = '';
      await client.ai.gentxt({
        messages: [
          {
            role: 'system',
            content: 'Du er en profesjonell norsk copywriter som skriver overbevisende produktbeskrivelser for luksus baderomsprodukter. Skriv kort, engasjerende og salgsorientert tekst på norsk. Maks 3 setninger.',
          },
          {
            role: 'user',
            content: `Skriv en salgsbeskrivelse for produktet "${formData.name}"${aiKeywords ? `. Nøkkelord: ${aiKeywords}` : ''}${formData.category ? `. Kategori: ${formData.category}` : ''}`,
          },
        ],
        model: 'deepseek-v3.2',
        stream: true,
        onChunk: (chunk: { content: string }) => {
          fullText += chunk.content;
          setFormData((prev) => ({ ...prev, description: fullText }));
        },
        onComplete: () => {
          toast.success('AI-beskrivelse generert');
        },
        onError: (error: { message: string }) => {
          toast.error(error.message || 'AI-generering feilet');
        },
      });
    } catch (err) {
      console.error(err);
      toast.error('Kunne ikke generere beskrivelse');
    } finally {
      setAiLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const objectKey = `products/${Date.now()}-${file.name}`;
      const uploadRes = await client.storage.upload({
        bucket_name: 'product-images',
        object_key: objectKey,
        file,
      });
      if (uploadRes?.data) {
        const downloadRes = await client.storage.getDownloadUrl({
          bucket_name: 'product-images',
          object_key: objectKey,
        });
        const imageUrl = downloadRes?.data?.download_url || objectKey;
        setFormData((prev) => ({ ...prev, image_url: imageUrl }));
        toast.success('Bilde lastet opp');
      }
    } catch (err) {
      console.error(err);
      toast.error('Kunne ikke laste opp bilde');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0C1B2A] flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-gray-400 text-sm mt-1">Skriv inn passord for å fortsette</p>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passord"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A96E] transition-colors"
          />
          <button
            type="submit"
            className="w-full bg-[#C9A96E] hover:bg-[#B8944D] text-[#0C1B2A] font-bold py-3 rounded-xl transition-colors"
          >
            Logg inn
          </button>
          <button type="button" onClick={() => navigate('/')} className="w-full text-gray-400 hover:text-white text-sm transition-colors">
            ← Tilbake til nettbutikken
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0C1B2A] text-white">
      {/* Header */}
      <div className="bg-[#0C1B2A] border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">
              Pure<span className="text-[#C9A96E]">Flow</span> Admin
            </h1>
          </div>
          <button
            onClick={openNewForm}
            className="bg-[#C9A96E] hover:bg-[#B8944D] text-[#0C1B2A] font-semibold px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Nytt produkt
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Product Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0F2236] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{editingProduct ? 'Rediger produkt' : 'Nytt produkt'}</h2>
                <button onClick={resetForm} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Produktnavn *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A96E] transition-colors"
                    placeholder="F.eks. Pure Flow Dusjhode"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Pris (NOK) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A96E] transition-colors"
                      placeholder="899"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Kategori</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A96E] transition-colors"
                      placeholder="Dusjhoder"
                    />
                  </div>
                </div>

                {/* AI Description Generator */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Beskrivelse</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A96E] transition-colors resize-none"
                    placeholder="Produktbeskrivelse..."
                  />
                  <div className="mt-2 flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={aiKeywords}
                      onChange={(e) => setAiKeywords(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A96E] transition-colors"
                      placeholder="Nøkkelord for AI (valgfritt)"
                    />
                    <button
                      type="button"
                      onClick={generateAiDescription}
                      disabled={aiLoading}
                      className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors whitespace-nowrap"
                    >
                      {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      {aiLoading ? 'Genererer...' : 'AI Beskrivelse'}
                    </button>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Produktbilde</label>
                  <div className="flex items-start gap-4">
                    {formData.image_url ? (
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                        <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image_url: '' })}
                          className="absolute top-1 right-1 bg-red-500 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-xl bg-white/5 border border-dashed border-white/20 flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="w-8 h-8 text-gray-600" />
                      </div>
                    )}
                    <div className="flex-1 space-y-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="bg-white/10 hover:bg-white/20 disabled:opacity-50 border border-white/20 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
                      >
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        {uploading ? 'Laster opp...' : 'Last opp bilde'}
                      </button>
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      <p className="text-xs text-gray-500">Eller lim inn en bilde-URL:</p>
                      <input
                        type="text"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A96E] transition-colors"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-[#C9A96E] hover:bg-[#B8944D] disabled:opacity-50 text-[#0C1B2A] font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingProduct ? 'Oppdater' : 'Opprett'} produkt
                  </button>
                  <button type="button" onClick={resetForm} className="px-6 py-3 border border-white/20 rounded-xl text-gray-400 hover:text-white transition-colors">
                    Avbryt
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Products List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#C9A96E] animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400">Ingen produkter ennå</h3>
            <p className="text-gray-500 mt-2">Klikk "Nytt produkt" for å legge til ditt første produkt.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#C9A96E]/30 transition-all duration-300 group">
                <div className="h-48 bg-white/5 flex items-center justify-center overflow-hidden">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-gray-600" />
                  )}
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-white">{product.name}</h3>
                      {product.category && <span className="text-xs text-[#C9A96E] font-medium">{product.category}</span>}
                    </div>
                    <span className="text-lg font-bold text-[#C9A96E] whitespace-nowrap">{product.price} kr</span>
                  </div>
                  {product.description && <p className="text-gray-400 text-sm line-clamp-2">{product.description}</p>}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => openEditForm(product)}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm font-medium py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Rediger
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}