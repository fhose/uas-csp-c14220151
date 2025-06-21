import { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
}

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
  onAddToCart?: (productId: string) => void;
}

export default function ProductCard({ 
  product, 
  showAddToCart = false, 
  onAddToCart 
}: ProductCardProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const router = useRouter();

  const handleCardClick = () => {
    const user = localStorage.getItem("user");
    if (!user) {
      Swal.fire({
        title: "Authentication Required",
        text: "Please login to view product details",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Login Now",
        cancelButtonText: "Cancel"
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/login");
        }
      });
    } else {
      router.push(`/product/${product.id}`);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const user = localStorage.getItem("user");
    if (!user) {
      Swal.fire({
        title: "Authentication Required",
        text: "Please login to add items to cart",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Login Now",
        cancelButtonText: "Cancel"
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/login");
        }
      });
    } else if (onAddToCart) {
      onAddToCart(product.id);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div 
      className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-400">Loading...</div>
          </div>
        )}
        
        {imageError ? (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <div className="text-2xl mb-2">📦</div>
              <div className="text-sm">Image not available</div>
            </div>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-48 object-cover transition-all duration-300 group-hover:scale-110 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
          />
        )}

        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wider"
               style={{ fontFamily: 'Oswald, sans-serif' }}>
            {product.category}
          </div>
        )}

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-3">
            <button 
              className="bg-white text-black p-2 rounded-full hover:bg-red-600 hover:text-white transition-all duration-200 transform hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
            >
              <EyeIcon className="h-5 w-5" />
            </button>
            
            {showAddToCart && (
              <button 
                className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-all duration-200 transform hover:scale-110"
                onClick={handleAddToCart}
              >
                <ShoppingCartIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1 group-hover:text-red-600 transition-colors duration-300"
            style={{ fontFamily: 'Oswald, sans-serif' }}>
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-red-600"
               style={{ fontFamily: 'Oswald, sans-serif' }}>
            {formatPrice(product.price)}
          </div>
          
          <div className="text-sm text-gray-500 group-hover:text-red-500 transition-colors duration-300 font-medium">
            View Details →
          </div>
        </div>

        {/* Action Buttons for Store Page */}
        {showAddToCart && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={handleAddToCart}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              ADD TO CART
            </button>
          </div>
        )}
      </div>
    </div>
  );
}