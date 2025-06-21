"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Swal from "sweetalert2";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  ShoppingCartIcon,
  ArrowLeftIcon,
  PhotoIcon,
  TagIcon,
  TruckIcon,
  ShieldCheckIcon,
  StarIcon
} from "@heroicons/react/24/outline";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState("");
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const router = useRouter();
  const params = useParams();

  const productId = params?.id as string;

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      Swal.fire("Oops!", "Kamu harus login untuk melihat detail produk", "warning").then(() => {
        router.push("/login");
      });
      return;
    }

    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) {
        console.error("Error fetching product:", error.message);
        Swal.fire("Error", "Produk tidak ditemukan", "error").then(() => {
          router.push("/store");
        });
      } else {
        setProduct(data);
        setImgSrc(data.image);
      }

      setLoading(false);
    };

    if (productId) fetchProduct();
  }, [productId, router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <>
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-black text-lg">Loading product details...</p>
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  if (!product) return null;

  return (
    <>
      {/* Import Google Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      
      <div className="min-h-screen bg-gray-50">
        <Header />

        {/* Breadcrumb */}
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-black hover:text-red-600 transition-colors duration-200 font-medium"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Store
            </button>
          </div>
        </section>

        {/* Product Details */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Product Image */}
              <div className="space-y-4">
                <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="aspect-square bg-gray-100">
                    {!imgError ? (
                      <>
                        {!imgLoaded && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
                            <PhotoIcon className="h-24 w-24 text-gray-400" />
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
                          <PhotoIcon className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">Image not available</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Features */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow text-center">
                    <TruckIcon className="h-6 w-6 text-red-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-black">Fast Shipping</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow text-center">
                    <ShieldCheckIcon className="h-6 w-6 text-red-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-black">Authentic</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow text-center">
                    <StarIcon className="h-6 w-6 text-red-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-black">Premium</p>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  {product.category && (
                    <div className="flex items-center gap-2 mb-4">
                      <TagIcon className="h-4 w-4 text-gray-400" />
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium uppercase tracking-wider">
                        {product.category}
                      </span>
                    </div>
                  )}
                  
                  <h1 className="text-4xl font-bold text-gray-900 mb-4"
                      style={{ fontFamily: 'Oswald, sans-serif' }}>
                    {product.name}
                  </h1>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-4xl font-bold text-red-600"
                         style={{ fontFamily: 'Oswald, sans-serif' }}>
                      {formatPrice(product.price)}
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                      <span className="text-sm text-black ml-2">(4.8/5)</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-3"
                      style={{ fontFamily: 'Oswald, sans-serif' }}>
                    PRODUCT DESCRIPTION
                  </h3>
                  <p className="text-black leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Add to Cart Section */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4"
                      style={{ fontFamily: 'Oswald, sans-serif' }}>
                    ADD TO CART
                  </h3>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => {
                      // Tambahkan ke keranjang (nanti kita buat logikanya di /cart)
                      let cart = JSON.parse(localStorage.getItem("cart") || "[]");
                      cart.push({ ...product, quantity: 1 });
                      localStorage.setItem("cart", JSON.stringify(cart));
                      Swal.fire("Berhasil!", "Produk ditambahkan ke keranjang", "success");
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-lg text-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 mb-3"
                    style={{ fontFamily: 'Oswald, sans-serif' }}
                  >
                    <ShoppingCartIcon className="h-6 w-6" />
                    TAMBAH KE KERANJANG
                  </button>

                  {/* Buy Now Button */}
                  <button
                    onClick={() => {
                      let cart = JSON.parse(localStorage.getItem("cart") || "[]");
                      cart.push({ ...product, quantity: 1 });
                      localStorage.setItem("cart", JSON.stringify(cart));
                      Swal.fire("Berhasil!", "Produk ditambahkan ke keranjang", "success").then(() => {
                        router.push("/cart");
                      });
                    }}
                    className="w-full border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white py-4 px-6 rounded-lg text-lg font-bold transition-all duration-300"
                    style={{ fontFamily: 'Oswald, sans-serif' }}
                  >
                    BUY NOW
                  </button>
                </div>

                {/* Product Specifications */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4"
                      style={{ fontFamily: 'Oswald, sans-serif' }}>
                    SPECIFICATIONS
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-black">Category</span>
                      <span className="text-black capitalize">{product.category}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-black">Brand</span>
                      <span className="text-black">KnockNation</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-black">Warranty</span>
                      <span className="text-black">1 Year</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-medium text-black">Shipping</span>
                      <span className="text-green-600 font-medium">FREE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}