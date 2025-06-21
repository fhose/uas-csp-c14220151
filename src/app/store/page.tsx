// app/store/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import {
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";

// ✅ Import supabase client
import { supabase } from "@/lib/supabase"; // Pastikan path ini benar ke file supabase.ts Anda

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Fetch product list pakai supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("name", { ascending: true });

        if (error) {
          console.error("Error fetching products from Supabase:", error.message);
          Swal.fire("Error", "Gagal memuat produk: " + error.message, "error"); // Menampilkan pesan error dari supabase
        } else if (Array.isArray(data)) {
          setProducts(data as Product[]); // Memastikan data sesuai dengan interface Product[]
        }
      } catch (err) {
        console.error("Unexpected error during product fetch:", err);
        Swal.fire("Error", "Terjadi kesalahan tak terduga saat memuat produk", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle URL category parameter 
  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  // Filter products based on category and search 
  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product =>
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery]);

  // Click handler 
  const handleProductClick = (id: string) => {
    const user = localStorage.getItem("user");
    if (!user) {
      Swal.fire({
        icon: "info",
        title: "Login Required",
        text: "Silakan login untuk melihat detail produk.",
        confirmButtonText: "Login Sekarang"
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/login");
        }
      });
    } else {
      router.push(`/product/${id}`);
    }
  };

  const categories = [
    { id: "all", name: "All Products", count: products.length },
    { id: "weightlifting", name: "Weightlifting", count: products.filter(p => p.category.toLowerCase() === "weightlifting").length },
    { id: "muaythai", name: "Muay Thai", count: products.filter(p => p.category.toLowerCase() === "muaythai").length },
    { id: "boxing", name: "Boxing", count: products.filter(p => p.category.toLowerCase() === "boxing").length },
  ];

  return (
    <>
      
      <link
        href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div className="min-h-screen bg-white">
        <Header />

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-black via-gray-900 to-red-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold mb-4"
                style={{ fontFamily: 'Oswald, sans-serif' }}>
              KNOCKNATION <span className="text-red-500">STORE</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Premium fight gear and training equipment for champions
            </p>
          </div>
        </section>

        {/* Filters & Controls */}
        <section className="bg-gray-50 py-8 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      selectedCategory === category.id
                        ? "bg-red-600 text-white shadow-lg transform scale-105"
                        : "bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-200"
                    }`}
                    style={{ fontFamily: 'Oswald, sans-serif' }}
                  >
                    {category.name}
                    <span className="ml-2 text-xs opacity-75">
                      ({products.filter(p => p.category.toLowerCase() === category.id.toLowerCase()).length})
                    </span>
                  </button>
                ))}
              </div>

              {/* Search & View Controls */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Bar */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full sm:w-64"
                  />
                </div>

                {/* View Toggle */}
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${
                      viewMode === "grid"
                        ? "bg-red-600 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Squares2X2Icon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${
                      viewMode === "list"
                        ? "bg-red-600 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <ListBulletIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900"
                  style={{ fontFamily: 'Oswald, sans-serif' }}>
                {selectedCategory === "all" ? "ALL PRODUCTS" : selectedCategory.toUpperCase()}
                <span className="text-gray-500 font-normal ml-2">
                  ({filteredProducts.length} items)
                </span>
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
                <p className="text-gray-500 text-lg">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🥊</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2"
                    style={{ fontFamily: 'Oswald, sans-serif' }}>
                  NO PRODUCTS FOUND
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your search or category filter
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
                  style={{ fontFamily: 'Oswald, sans-serif' }}
                >
                  CLEAR FILTERS
                </button>
              </div>
            ) : (
              <div className={`${
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }`}>
                {filteredProducts.map((product) => (
                  viewMode === "grid" ? (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                    >
                      <ProductCard
                        product={{
                          ...product,
                          category: product.category
                        }}
                        showAddToCart={false}
                      />
                    </div>
                  ) : (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer p-6 flex items-center gap-6"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wider"
                                style={{ fontFamily: 'Oswald, sans-serif' }}>
                            {product.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2"
                            style={{ fontFamily: 'Oswald, sans-serif' }}>
                          {product.name}
                        </h3>
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-red-600"
                                style={{ fontFamily: 'Oswald, sans-serif' }}>
                            Rp {product.price.toLocaleString("id-ID")}
                          </span>
                          <span className="text-red-500 font-medium">
                            View Details →
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}