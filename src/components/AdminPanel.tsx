import { useState, useEffect } from 'react';
import { supabase, PoolProduct } from '../lib/supabase';
import { Pencil, Save, X, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

const CATEGORIES = [
  'Full-Service Pool Packages',
  'Pool Openings',
  'Pool Closings',
  'Spa Packages',
];

export default function AdminPanel() {
  const [products, setProducts] = useState<PoolProduct[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<PoolProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Full-Service Pool Packages');

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from('pool_products')
      .select('*')
      .eq('category', selectedCategory)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  }

  function startEdit(product: PoolProduct) {
    setEditingId(product.id);
    setEditingProduct(JSON.parse(JSON.stringify(product)));
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingProduct(null);
    setError(null);
  }

  async function saveEdit() {
    if (!editingProduct) return;

    setError(null);

    const updateData = {
      name: editingProduct.name,
      description: editingProduct.description,
      base_price: editingProduct.base_price,
      size_options: editingProduct.size_options,
      features: editingProduct.features,
      image_url: editingProduct.image_url,
      category: editingProduct.category,
      is_featured: editingProduct.is_featured,
      display_order: editingProduct.display_order,
      hide_base_price: editingProduct.hide_base_price,
      updated_at: new Date().toISOString(),
    };

    const { error: updateError } = await supabase
      .from('pool_products')
      .update(updateData)
      .eq('id', editingProduct.id);

    if (updateError) {
      console.error('Error updating product:', updateError);
      setError(`Failed to save: ${updateError.message}`);
    } else {
      await fetchProducts();
      setEditingId(null);
      setEditingProduct(null);
    }
  }

  function updateProductName(value: string) {
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, name: value });
    }
  }

  function updateProductDescription(value: string) {
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, description: value });
    }
  }

  function updateBasePrice(value: number) {
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, base_price: value });
    }
  }

  function updateSizeOption(index: number, field: 'size' | 'price', value: string | number) {
    if (editingProduct) {
      const newOptions = [...editingProduct.size_options];
      if (field === 'price') {
        newOptions[index] = { ...newOptions[index], price: Number(value) };
      } else {
        newOptions[index] = { ...newOptions[index], size: value as string };
      }
      setEditingProduct({ ...editingProduct, size_options: newOptions });
    }
  }

  function updateFeature(index: number, value: string) {
    if (editingProduct) {
      const newFeatures = [...editingProduct.features];
      newFeatures[index] = value;
      setEditingProduct({ ...editingProduct, features: newFeatures });
    }
  }

  function addFeature() {
    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        features: [...editingProduct.features, ''],
      });
    }
  }

  function removeFeature(index: number) {
    if (editingProduct) {
      const newFeatures = editingProduct.features.filter((_, i) => i !== index);
      setEditingProduct({ ...editingProduct, features: newFeatures });
    }
  }

  function updateCategory(value: string) {
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, category: value });
    }
  }

  function startCreateNew() {
    const newProduct: PoolProduct = {
      id: 'new',
      name: '',
      description: '',
      base_price: 0,
      size_options: [],
      features: [],
      image_url: null,
      category: 'Pool Openings',
      is_featured: false,
      display_order: 0,
      hide_base_price: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setEditingProduct(newProduct);
    setIsCreatingNew(true);
    setEditingId('new');
  }

  async function createProduct() {
    if (!editingProduct) return;

    setError(null);

    const { error: insertError } = await supabase
      .from('pool_products')
      .insert({
        name: editingProduct.name,
        description: editingProduct.description,
        base_price: editingProduct.base_price,
        size_options: editingProduct.size_options,
        features: editingProduct.features,
        image_url: editingProduct.image_url,
        category: editingProduct.category,
        is_featured: editingProduct.is_featured,
        display_order: editingProduct.display_order,
        hide_base_price: editingProduct.hide_base_price,
      });

    if (insertError) {
      console.error('Error creating product:', insertError);
      setError(`Failed to create: ${insertError.message}`);
    } else {
      await fetchProducts();
      setEditingId(null);
      setEditingProduct(null);
      setIsCreatingNew(false);
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setError(null);

    const { error: deleteError } = await supabase
      .from('pool_products')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting product:', deleteError);
      setError(`Failed to delete: ${deleteError.message}`);
    } else {
      await fetchProducts();
    }
  }

  function cancelCreate() {
    setIsCreatingNew(false);
    setEditingId(null);
    setEditingProduct(null);
    setError(null);
  }

  function addSizeOption() {
    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        size_options: [...editingProduct.size_options, { size: '', price: 0 }],
      });
    }
  }

  function removeSizeOption(index: number) {
    if (editingProduct) {
      const newOptions = editingProduct.size_options.filter((_, i) => i !== index);
      setEditingProduct({ ...editingProduct, size_options: newOptions });
    }
  }

  async function moveProduct(productId: string, direction: 'up' | 'down') {
    const currentIndex = products.findIndex(p => p.id === productId);
    if (currentIndex === -1) return;

    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === products.length - 1) return;

    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const currentProduct = products[currentIndex];
    const swapProduct = products[swapIndex];

    const tempOrder = currentProduct.display_order;

    const { error: error1 } = await supabase
      .from('pool_products')
      .update({ display_order: swapProduct.display_order })
      .eq('id', currentProduct.id);

    const { error: error2 } = await supabase
      .from('pool_products')
      .update({ display_order: tempOrder })
      .eq('id', swapProduct.id);

    if (error1 || error2) {
      console.error('Error reordering products:', error1 || error2);
      setError('Failed to reorder products');
    } else {
      await fetchProducts();
    }
  }

  if (loading) {
    return <div className="flex justify-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        {!isCreatingNew && (
          <button
            onClick={startCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} />
            Add New Service
          </button>
        )}
      </div>

      <nav className="mb-8">
        <div className="flex flex-wrap gap-4">
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

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {isCreatingNew && editingProduct && (
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-blue-900">New Service</h2>
              <div className="flex gap-2">
                <button
                  onClick={createProduct}
                  className="p-2 text-green-600 hover:bg-green-50 rounded"
                >
                  <Save size={20} />
                </button>
                <button
                  onClick={cancelCreate}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Service Name</h3>
              <input
                type="text"
                value={editingProduct.name}
                onChange={(e) => updateProductName(e.target.value)}
                placeholder="e.g., Premium Opening"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Category</h3>
              <select
                value={editingProduct.category}
                onChange={(e) => updateCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <textarea
                value={editingProduct.description}
                onChange={(e) => updateProductDescription(e.target.value)}
                placeholder="Describe the service..."
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                rows={2}
              />
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Base Price</h3>
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <input
                  type="number"
                  value={editingProduct.base_price}
                  onChange={(e) => updateBasePrice(Number(e.target.value))}
                  className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mb-6 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingProduct.is_featured}
                  onChange={(e) => setEditingProduct({ ...editingProduct, is_featured: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="font-semibold text-gray-900">Mark as Popular</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingProduct.hide_base_price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, hide_base_price: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="font-semibold text-gray-900">Hide Base Price</span>
              </label>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-900">Size Options</h3>
                <button
                  onClick={addSizeOption}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Plus size={16} />
                  Add Size
                </button>
              </div>
              <div className="space-y-2">
                {editingProduct.size_options.map((option, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={option.size}
                      onChange={(e) => updateSizeOption(index, 'size', e.target.value)}
                      placeholder="Size name"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                    <div className="flex items-center">
                      <span className="mr-2">$</span>
                      <input
                        type="number"
                        value={option.price}
                        onChange={(e) => updateSizeOption(index, 'price', e.target.value)}
                        className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <button
                      onClick={() => removeSizeOption(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-900">Package Includes</h3>
                <button
                  onClick={addFeature}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Plus size={16} />
                  Add Feature
                </button>
              </div>
              <div className="space-y-2">
                {editingProduct.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder="Feature description"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={() => removeFeature(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {products.map((product) => {
          const isEditing = editingId === product.id;
          const displayProduct = isEditing && editingProduct ? editingProduct : product;

          return (
            <div key={product.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={displayProduct.name}
                      onChange={(e) => updateProductName(e.target.value)}
                      className="text-2xl font-bold border-b-2 border-blue-500 focus:outline-none w-full"
                    />
                  ) : (
                    <h2 className="text-2xl font-bold">{displayProduct.name}</h2>
                  )}
                  {!isEditing && (
                    <p className="text-sm text-gray-500 mt-1">Category: {displayProduct.category}</p>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  {isEditing ? (
                    <>
                      <button
                        onClick={saveEdit}
                        className="p-2 text-green-600 hover:bg-green-50 rounded"
                      >
                        <Save size={20} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X size={20} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => moveProduct(product.id, 'up')}
                        disabled={products.findIndex(p => p.id === product.id) === 0}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        <ChevronUp size={20} />
                      </button>
                      <button
                        onClick={() => moveProduct(product.id, 'down')}
                        disabled={products.findIndex(p => p.id === product.id) === products.length - 1}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        <ChevronDown size={20} />
                      </button>
                      <button
                        onClick={() => startEdit(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={20} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Category</h3>
                  <select
                    value={displayProduct.category}
                    onChange={(e) => updateCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                {isEditing ? (
                  <textarea
                    value={displayProduct.description}
                    onChange={(e) => updateProductDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    rows={2}
                  />
                ) : (
                  <p className="text-gray-700">{displayProduct.description}</p>
                )}
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Base Price</h3>
                {isEditing ? (
                  <div className="flex items-center">
                    <span className="mr-2">$</span>
                    <input
                      type="number"
                      value={displayProduct.base_price}
                      onChange={(e) => updateBasePrice(Number(e.target.value))}
                      className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900 font-semibold">${displayProduct.base_price.toLocaleString()}</p>
                )}
              </div>

              {isEditing && (
                <div className="mb-6 space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={displayProduct.is_featured}
                      onChange={(e) => setEditingProduct({ ...editingProduct!, is_featured: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="font-semibold text-gray-900">Mark as Popular</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={displayProduct.hide_base_price}
                      onChange={(e) => setEditingProduct({ ...editingProduct!, hide_base_price: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="font-semibold text-gray-900">Hide Base Price</span>
                  </label>
                </div>
              )}

              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-900">Size Options</h3>
                  {isEditing && (
                    <button
                      onClick={addSizeOption}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Plus size={16} />
                      Add Size
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {displayProduct.size_options.map((option, index) => (
                    <div key={index} className="flex gap-4 items-center">
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            value={option.size}
                            onChange={(e) => updateSizeOption(index, 'size', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                          />
                          <div className="flex items-center">
                            <span className="mr-2">$</span>
                            <input
                              type="number"
                              value={option.price}
                              onChange={(e) => updateSizeOption(index, 'price', e.target.value)}
                              className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <button
                            onClick={() => removeSizeOption(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 text-gray-700">{option.size}</span>
                          <span className="font-semibold text-gray-900">
                            ${option.price.toLocaleString()}
                          </span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Package Includes</h3>
                <div className="space-y-2">
                  {displayProduct.features.map((feature, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => updateFeature(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                          />
                          <button
                            onClick={() => removeFeature(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-700">• {feature}</span>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <button
                      onClick={addFeature}
                      className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Plus size={16} />
                      Add Feature
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
