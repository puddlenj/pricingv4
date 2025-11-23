import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { PricingCard } from './components/PricingCard';
import AdminPanel from './components/AdminPanel';
import { LoginForm } from './components/LoginForm';
import { supabase, PoolProduct } from './lib/supabase';
import { Loader2, LogOut } from 'lucide-react';

const CATEGORIES = [
  'Full-Service Pool Packages',
  'Pool Openings',
  'Pool Closings',
  'Spa Packages'
] as const;

function App() {
  const [products, setProducts] = useState<PoolProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Full-Service Pool Packages');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkUrlForAdmin = () => {
      if (window.location.pathname === '/admin') {
        setShowAdmin(true);
      }
    };
    checkUrlForAdmin();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  useEffect(() => {
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (!session) {
        setShowAdmin(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
    setAuthLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setShowAdmin(false);
  }

  function handleLoginSuccess() {
    setIsAuthenticated(true);
    setShowAdmin(true);
  }

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pool_products')
        .select('*')
        .eq('category', selectedCategory)
        .order('display_order', { ascending: true });

      if (error) throw error;

      setProducts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  if (showAdmin && isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setShowAdmin(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Back to Store
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
          <AdminPanel />
        </div>
      </div>
    );
  }

  if (showAdmin && !isAuthenticated && !authLoading) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isAuthenticated && (
          <div className="flex justify-end mb-4 gap-2">
            <button
              onClick={() => setShowAdmin(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Admin Panel
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}

        <nav className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </nav>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {selectedCategory}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {selectedCategory === 'Full-Service Pool Packages' && 'Set it and forget it! We include everything you need.'}
            {selectedCategory === 'Pool Openings' && 'Professional pool opening services to start your season right.'}
            {selectedCategory === 'Pool Closings' && 'Expert pool closing services to protect your investment.'}
            {selectedCategory === 'Spa Packages' && 'Comprehensive spa maintenance packages tailored to your needs.'}
          </p>
          {selectedCategory === 'Full-Service Pool Packages' && (
            <div className="text-sm text-gray-600 max-w-2xl mx-auto mt-2 space-y-1">
              <p>For attached spas, please add $28/visit.</p>
              <p>Secure your open & close dates with a $698 deposit.</p>
              <p>Pay in full and select a $128 discount or extension—a week on us!</p>
            </div>
          )}
          {selectedCategory === 'Pool Openings' && (
            <div className="text-sm text-gray-600 max-w-2xl mx-auto mt-2 space-y-1">
              <p>For Memorial Day Weekend swimming, please have Puddle Pool Services visit 3x beforehand.</p>
              <p>In 2025, warm weather began the week of Mon 21 Apr.</p>
            </div>
          )}
          {selectedCategory === 'Pool Closings' && (
            <div className="text-sm text-gray-600 max-w-2xl mx-auto mt-2 space-y-1">
              <p>To enjoy "local summer" and prevent algae growth, consider closing after temps drop below 65°F.</p>
              <p>In 2025, warm weather remained through the week of Mon 6 Oct.</p>
            </div>
          )}
          {selectedCategory === 'Spa Packages' && (
            <p className="text-sm text-gray-600 max-w-2xl mx-auto mt-2">
              For Swim Spas, please add $28/visit.
            </p>
          )}
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
            {error}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-center">
            No products available at this time. Please check back soon!
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <PricingCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-16">
          <p className="text-center text-gray-600 italic">
            Please add NJ sales tax to all offers.
          </p>
          <p className="text-center text-gray-600 italic mb-6">
            Earn a $50 Neighbor Referral Credit (1 mile radius) after their first paid service.
          </p>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Ready to Get Started?
            </h3>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-gray-900">
                Call/Text: <a href="tel:+18483839223" className="text-blue-600 hover:text-blue-700">(848) 383-9223</a>
              </p>
              <p className="text-lg font-semibold text-gray-900">
                Email: <a href="mailto:Jeff@PuddleNJ.com" className="text-blue-600 hover:text-blue-700">Jeff@PuddleNJ.com</a>
              </p>
              <p className="text-lg font-semibold text-gray-900 mt-4">
                <a
                  href="https://puddlepools.com/monmouth-county-pool-cleaning/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Puddle Pool Services Official Website
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <div className="flex justify-center py-12">
        <img
          src="/Puddle Logo 1.png"
          alt="Puddle Pool Services"
          className="max-w-2xl w-full px-4"
        />
      </div>

      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Puddle Pool Services. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
