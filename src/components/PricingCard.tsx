import { Check } from 'lucide-react';
import { PoolProduct } from '../lib/supabase';

interface PricingCardProps {
  product: PoolProduct;
}

export function PricingCard({ product }: PricingCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {product.image_url && (
        <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
          <div className="text-white text-6xl">🏊</div>
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        <div className="h-7 mb-3">
          {product.is_featured && (
            <span className="inline-block bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
              POPULAR
            </span>
          )}
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-2 min-h-[4rem]">
          {product.name}
        </h3>

        <p className="text-gray-600 mb-4 min-h-[3rem]">
          {product.description}
        </p>

        {!product.hide_base_price && (
          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-1">Starting at</div>
            <div className="text-4xl font-bold text-blue-600">
              {formatPrice(product.base_price)}
            </div>
          </div>
        )}

        {product.size_options && product.size_options.length > 0 ? (
          <div className="mb-6">
            {!product.hide_base_price && (
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                {product.category === 'Pool Openings' || product.category === 'Pool Closings'
                  ? 'Savings:'
                  : 'Maintenance Visits:'}
              </h4>
            )}
            <div className="space-y-2">
              {product.size_options.map((option, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{option.size}</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(option.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-6 invisible">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Placeholder</h4>
            <div className="h-6"></div>
          </div>
        )}

        {product.features && product.features.length > 0 && (
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Includes:</h4>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
