"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Swal from "sweetalert2";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  ShoppingCartIcon,
  TrashIcon,
  PhotoIcon,
  CreditCardIcon,
  ArrowLeftIcon,
  PlusIcon,
  MinusIcon
} from "@heroicons/react/24/outline";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      Swal.fire("Oops!", "Kamu harus login untuk melihat keranjang", "warning").then(() => {
        router.push("/login");
      });
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);
  }, [router]);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const removeItem = (id: string) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const handleCheckout = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.id) {
      return Swal.fire("Oops!", "User tidak valid", "error");
    }

    const orderPayload = cartItems.map((item) => ({
      user_id: user.id,
      product_id: item.id,
      quantity: item.quantity,
    }));

    const { error } = await supabase.from("orders").insert(orderPayload);

    if (error) {
      console.error("Checkout error:", error.message);
      return Swal.fire("Gagal", "Checkout gagal dilakukan", "error");
    }

    localStorage.removeItem("cart");
    setCartItems([]);
    Swal.fire("Berhasil", "Pesananmu sedang diproses!", "success").then(() => {
      router.push("/orders");
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getItemTotal = (price: number, quantity: number) => {
    return price * quantity;
  };

  return (
    <>
      {/* Import Google Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      
      <div className="min-h-screen bg-gray-50">
        <Header />

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-black via-gray-900 to-red-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-bold mb-4"
                    style={{ fontFamily: 'Oswald, sans-serif' }}>
                  SHOPPING <span className="text-red-500">CART</span>
                </h1>
                <p className="text-xl text-gray-300">
                  Review your combat gear before checkout
                </p>
              </div>
              <div className="hidden md:block">
                <ShoppingCartIcon className="h-20 w-20 text-red-500" />
              </div>
            </div>
          </div>
        </section>

        {/* Cart Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Back to Store */}
            <div className="mb-8">
              <button
                onClick={() => router.push("/store")}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors duration-200 font-medium"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                Continue Shopping
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-6">🛒</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4"
                    style={{ fontFamily: 'Oswald, sans-serif' }}>
                  YOUR CART IS EMPTY
                </h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  Time to gear up! Browse our premium combat equipment and training gear.
                </p>
                <button
                  onClick={() => router.push("/store")}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105"
                  style={{ fontFamily: 'Oswald, sans-serif' }}
                >
                  START SHOPPING
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-red-600 px-6 py-4">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2"
                          style={{ fontFamily: 'Oswald, sans-serif' }}>
                        <ShoppingCartIcon className="h-6 w-6" />
                        CART ITEMS
                        <span className="bg-red-800 text-white px-3 py-1 rounded-full text-sm">
                          {cartItems.length}
                        </span>
                      </h2>
                    </div>

                    <div className="p-6 space-y-6">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-6 p-4 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300"
                        >
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                              />
                            ) : (
                              <div className="w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                                <PhotoIcon className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 mb-2"
                                style={{ fontFamily: 'Oswald, sans-serif' }}>
                              {item.name}
                            </h3>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <div>
                                <span className="font-medium">Unit Price: </span>
                                <span className="text-red-600 font-bold">
                                  {formatPrice(item.price)}
                                </span>
                              </div>
                              <div>
                                <span className="font-medium">Quantity: </span>
                                <span className="font-bold">{item.quantity}</span>
                              </div>
                            </div>

                            <div className="text-lg font-bold text-gray-900"
                                 style={{ fontFamily: 'Oswald, sans-serif' }}>
                              Subtotal: <span className="text-red-600">
                                {formatPrice(getItemTotal(item.price, item.quantity))}
                              </span>
                            </div>
                          </div>

                          {/* Remove Button */}
                          <div className="flex-shrink-0">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                              title="Remove Item"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-6">
                    <div className="bg-gray-900 px-6 py-4">
                      <h3 className="text-xl font-bold text-white"
                          style={{ fontFamily: 'Oswald, sans-serif' }}>
                        ORDER SUMMARY
                      </h3>
                    </div>

                    <div className="p-6">
                      {/* Order Details */}
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Items ({cartItems.length})</span>
                          <span className="font-medium text-black">{formatPrice(total)}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping</span>
                          <span className="font-medium text-green-600">FREE</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax</span>
                          <span className="font-medium text-black">Included</span>
                        </div>
                        
                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex justify-between">
                            <span className="text-lg font-bold text-gray-900"
                                  style={{ fontFamily: 'Oswald, sans-serif' }}>
                              TOTAL
                            </span>
                            <span className="text-2xl font-bold text-red-600"
                                  style={{ fontFamily: 'Oswald, sans-serif' }}>
                              {formatPrice(total)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Checkout Button */}
                      <button
                        onClick={handleCheckout}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-lg"
                        style={{ fontFamily: 'Oswald, sans-serif' }}
                      >
                        <CreditCardIcon className="h-6 w-6" />
                        CHECKOUT NOW
                      </button>

                      {/* Continue Shopping */}
                      <button
                        onClick={() => router.push("/store")}
                        className="w-full mt-4 border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-lg font-medium transition-all duration-300"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}