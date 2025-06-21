"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { 
  TrophyIcon, 
  ShieldCheckIcon, 
  TruckIcon,
  ArrowRightIcon,
  PhotoIcon,
  ShoppingCartIcon
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
}

// Enhanced ProductCard Component with proper image handling
const ProductCard = ({ product }: { product: Product }) => {
  const [imgSrc, setImgSrc] = useState(product.image);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const router = useRouter();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const user = localStorage.getItem("user");
    if (!user) {
      Swal.fire("Login Required", "Please login to add items to cart", "warning");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: any) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    Swal.fire({
      title: "Added to Cart!",
      text: `${product.name} has been added to your cart`,
      icon: "success",
      timer: 1500,
      showConfirmButton: false
    });
  };

  const viewDetails = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden cursor-pointer"
         onClick={viewDetails}>
      {/* Product Image */}
      <div className="relative h-64 bg-gray-100 overflow-hidden">
        {!imgError ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
                <PhotoIcon className="h-16 w-16 text-gray-400" />
              </div>
            )}
            <img
              src={imgSrc}
              alt={product.name}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImgLoaded(true)}
              onError={() => {
                setImgError(true);
                setImgLoaded(true);
              }}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="text-center">
              <PhotoIcon className="h-16 w-16 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Image not available</p>
            </div>
          </div>
        )}
        
        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-4 left-4">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {product.category}
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2"
            style={{ fontFamily: 'Oswald, sans-serif' }}>
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-red-600"
               style={{ fontFamily: 'Oswald, sans-serif' }}>
            {formatPrice(product.price)}
          </div>
          
          <button
            onClick={addToCart}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            style={{ fontFamily: 'Oswald, sans-serif' }}
          >
            <ShoppingCartIcon className="h-4 w-4" />
            ADD
          </button>
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .limit(6); // Limit to 6 products for homepage

      if (error) {
        console.error("Gagal mengambil data produk:", error.message);
        Swal.fire({
          title: "Error!",
          text: "Failed to load products",
          icon: "error",
          confirmButtonColor: "#dc2626"
        });
      } else if (Array.isArray(data)) {
        setProducts(data);
      }

      setLoading(false);
    };

    fetchProducts();
  }, []);

  return (
    <>
      {/* pakai google font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      
      <div className="min-h-screen bg-white">
        <Header />

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-black via-gray-900 to-red-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="text-center">
              <h1 className="text-5xl lg:text-7xl font-bold tracking-wider mb-6 text-white"
                  style={{ fontFamily: 'Oswald, sans-serif' }}>
                KNOCK<span className="text-red-500">NATION</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Your Ultimate Destination for <span className="text-red-400 font-semibold">Combat Sports</span> & 
                <span className="text-red-400 font-semibold"> Strength Training</span> Equipment
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/store"
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                  style={{ fontFamily: 'Oswald, sans-serif' }}
                >
                  SHOP NOW
                  <ArrowRightIcon className="h-5 w-5" />
                </Link>
                <Link
                  href="/login"
                  className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-lg text-lg font-bold transition-all duration-300 transform hover:scale-105"
                  style={{ fontFamily: 'Oswald, sans-serif' }}
                >
                  JOIN US
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4"
                  style={{ fontFamily: 'Oswald, sans-serif' }}>
                FEATURED <span className="text-red-600">PRODUCTS</span>
              </h2>
              <p className="text-xl text-black">
                Hand-picked gear for champions
              </p>
            </div>

            {loading ? (
              <div className="text-center text-black py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                <p className="mt-4">Loading products...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {products.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product}
                    />
                  ))}
                </div>
                
                <div className="text-center">
                  <Link
                    href="/store"
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-bold transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
                    style={{ fontFamily: 'Oswald, sans-serif' }}
                  >
                    VIEW ALL PRODUCTS
                    <ArrowRightIcon className="h-5 w-5" />
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4"
                  style={{ fontFamily: 'Oswald, sans-serif' }}>
                WHY <span className="text-red-500">KNOCKNATION?</span>
              </h2>
              <p className="text-xl text-gray-300">
                Built by fighters, for fighters
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrophyIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>
                  PREMIUM QUALITY
                </h3>
                <p className="text-gray-300">
                  Professional-grade equipment trusted by champions worldwide
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheckIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>
                  GUARANTEED AUTHENTIC
                </h3>
                <p className="text-gray-300">
                  100% authentic products with full warranty coverage
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TruckIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>
                  FAST DELIVERY
                </h3>
                <p className="text-gray-300">
                  Quick and secure shipping to get you training faster
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}