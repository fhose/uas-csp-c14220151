// page.tsx
"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth"; // Pastikan path ini benar
import { supabase } from "@/lib/supabase";
import { Order } from "../types";
import Swal from "sweetalert2";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  PhotoIcon,
  ShoppingBagIcon
} from "@heroicons/react/24/outline";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk ambil pesanan user berdasarkan user_id
  const loadOrders = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          quantity,
          order_date,
          user_id,
          product_id,
          product:products (
            name,
            price,
            image
          )
        `)
        .eq("user_id", userId)
        .order("order_date", { ascending: false });

      if (error) throw error;

      setOrders(
        (data ?? []).map((item: any) => ({
          id: item.id,
          user_id: item.user_id,
          product_id: item.product_id,
          quantity: item.quantity,
          order_date: item.order_date,
          product: {
            name: item.product?.name || "Produk tidak ditemukan",
            price: item.product?.price || 0,
            image: item.product?.image || "",
          },
        }))
      );
    } catch (error) {
      console.error("Error fetching orders", error);
      Swal.fire("Gagal", "Gagal memuat data pesanan.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Ambil user saat pertama kali halaman di-load
  useEffect(() => {
    const fetchOrders = async () => {
      // ✅ Perubahan di sini: langsung menerima user atau null
      const user = await getCurrentUser();
      if (!user) {
        Swal.fire("Oops!", "Kamu harus login untuk melihat pesanan", "warning");
        return;
      }
      loadOrders(user.id);
    };

    fetchOrders();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotal = (price: number, quantity: number) => {
    return price * quantity;
  };

  const getOverallTotal = () => {
    return orders.reduce((total, order) => {
      return total + calculateTotal(order.product?.price || 0, order.quantity);
    }, 0);
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold mb-4"
                style={{ fontFamily: 'Oswald, sans-serif' }}>
              YOUR <span className="text-red-500">ORDERS</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Track your combat gear purchases and training equipment orders
            </p>
          </div>
        </section>

        {/* Orders Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
                <p className="text-gray-500 text-lg">Loading your orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-6">🥊</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4"
                    style={{ fontFamily: 'Oswald, sans-serif' }}>
                  NO ORDERS YET
                </h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  You haven't placed any orders yet. Start shopping for premium combat gear!
                </p>
                <a
                  href="/store"
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105"
                  style={{ fontFamily: 'Oswald, sans-serif' }}
                >
                  START SHOPPING
                </a>
              </div>
            ) : (
              <>
                {/* Orders Header */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                  <div className="bg-red-600 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2"
                          style={{ fontFamily: 'Oswald, sans-serif' }}>
                        <ClipboardDocumentListIcon className="h-6 w-6" />
                        ORDER HISTORY
                        <span className="bg-red-800 text-white px-3 py-1 rounded-full text-sm">
                          {orders.length}
                        </span>
                      </h2>
                      <div className="text-white">
                        <span className="text-sm opacity-75">Total Spent: </span>
                        <span className="text-lg font-bold">
                          {formatPrice(getOverallTotal())}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Orders List */}
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-start gap-6">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            {order.product?.image ? (
                              <img
                                src={order.product.image}
                                alt={order.product.name}
                                className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                              />
                            ) : (
                              <div className="w-24 h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                                <PhotoIcon className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* Order Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-2"
                                    style={{ fontFamily: 'Oswald, sans-serif' }}>
                                  {order.product?.name || "Produk tidak ditemukan"}
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                  {/* Quantity */}
                                  <div className="flex items-center gap-2">
                                    <ShoppingBagIcon className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">Quantity:</span>
                                    <span className="font-semibold text-gray-900">
                                      {order.quantity}
                                    </span>
                                  </div>

                                  {/* Unit Price */}
                                  <div className="flex items-center gap-2">
                                    <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">Unit Price:</span>
                                    <span className="font-semibold text-gray-900">
                                      {formatPrice(order.product?.price || 0)}
                                    </span>
                                  </div>

                                  {/* Order Date */}
                                  <div className="flex items-center gap-2">
                                    <CalendarDaysIcon className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">Ordered:</span>
                                    <span className="font-semibold text-gray-900 text-sm">
                                      {new Date(order.order_date).toLocaleDateString('id-ID')}
                                    </span>
                                  </div>
                                </div>

                                {/* Full Date */}
                                <p className="text-sm text-gray-500 mb-3">
                                  {formatDate(order.order_date)}
                                </p>
                              </div>

                              {/* Total Price */}
                              <div className="text-right ml-4">
                                <div className="text-sm text-gray-500 mb-1">Total</div>
                                <div className="text-2xl font-bold text-red-600"
                                     style={{ fontFamily: 'Oswald, sans-serif' }}>
                                  {formatPrice(calculateTotal(order.product?.price || 0, order.quantity))}
                                </div>
                              </div>
                            </div>

                            {/* Order Status Badge */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                              <div className="flex items-center gap-2">
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                  ✓ Order Placed
                                </span>
                                <span className="text-sm text-gray-500">
                                  Order ID: #{order.id.slice(0, 8)}
                                </span>
                              </div>
                              
                              <button className="text-red-600 hover:text-red-700 font-medium text-sm transition-colors duration-200">
                                View Details →
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="bg-gray-900 text-white rounded-xl shadow-lg p-6 mt-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold mb-1"
                          style={{ fontFamily: 'Oswald, sans-serif' }}>
                        ORDER SUMMARY
                      </h3>
                      <p className="text-gray-400">
                        {orders.length} order{orders.length !== 1 ? 's' : ''} placed
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400 mb-1">Grand Total</div>
                      <div className="text-3xl font-bold text-red-500"
                           style={{ fontFamily: 'Oswald, sans-serif' }}>
                        {formatPrice(getOverallTotal())}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}