// src/app/admin/products/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { supabase } from "@/lib/supabase";
import { Product } from "../types";
import { getCurrentUser } from "@/lib/auth"; // Untuk cek user login dan role
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
  TagIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

// Admin Header Component
const AdminHeader = () => {
  const router = useRouter();

  const handleLogout = () => {
    Swal.fire({
      title: "Confirm Logout",
      text: "Are you sure you want to logout from admin panel?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");
        Swal.fire(
          "Logged Out",
          "You have been logged out successfully",
          "success"
        ).then(() => {
          router.push("/");
        });
      }
    });
  };

  return (
    <header className="bg-black text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Admin Brand */}
          <div className="flex items-center">
            <h1
              className="text-2xl font-bold tracking-wider text-red-500"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              KNOCKNATION
            </h1>
            <span className="ml-3 px-2 py-1 bg-red-600 text-white text-xs font-medium rounded-full uppercase tracking-wider">
              Admin
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            LOGOUT
          </button>
        </div>
      </div>
    </header>
  );
};

// Admin Navbar Component
const AdminNavbar = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  return (
    <nav className="bg-gray-900 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === "products"
                ? "border-red-500 text-red-500"
                : "border-transparent text-gray-300 hover:text-white hover:border-gray-300"
            }`}
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            <ShoppingBagIcon className="h-5 w-5" />
            MANAGE PRODUCTS
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === "orders"
                ? "border-red-500 text-red-500"
                : "border-transparent text-gray-300 hover:text-white hover:border-gray-300"
            }`}
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            <ClipboardDocumentListIcon className="h-5 w-5" />
            VIEW ORDERS
          </button>
        </div>
      </div>
    </nav>
  );
};

// Edit Product Modal Component
const EditProductModal = ({
  isOpen,
  onClose,
  product,
  onSaveSuccess, 
}: {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSaveSuccess: () => void; // Ketika sukses, beri tahu parent untuk refresh
  loadingProp: boolean;
}) => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    if (product) {
      setProductName(product.name);
      setProductDescription(product.description || "");
      setProductPrice(product.price.toString());
      setProductImage(product.image || "");
      setProductCategory(product.category || "");
    }
  }, [product]);

  const handleModalSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productName || !productPrice || !productImage) {
      Swal.fire(
        "Peringatan",
        "Nama, Harga, dan Gambar produk wajib diisi.",
        "warning"
      );
      return;
    }
    if (!product) return; // Harus ada produk yang diedit

    setLoading(true);
    const { error } = await supabase
      .from("products")
      .update({
        name: productName,
        description: productDescription,
        price: parseFloat(productPrice),
        image: productImage,
        category: productCategory,
      })
      .eq("id", product.id); 
    if (error) {
      Swal.fire("Error", `Gagal memperbarui produk: ${error.message}`, "error");
    } else {
      Swal.fire("Sukses", "Produk berhasil diperbarui.", "success");
      onSaveSuccess(); // Panggil ini untuk trigger refresh di parent
      onClose(); // Tutup modal
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="bg-red-600 px-6 py-4 flex items-center justify-between">
          <h3
            className="text-xl font-bold text-white flex items-center gap-2"
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            <PencilIcon className="h-6 w-6" />
            EDIT PRODUCT
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:text-red-200 transition-colors duration-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <form onSubmit={onSaveSuccess} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div>
                <label
                  className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider"
                  style={{ fontFamily: "Oswald, sans-serif" }}
                >
                  Product Name
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                  placeholder="Enter product name"
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label
                  className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider"
                  style={{ fontFamily: "Oswald, sans-serif" }}
                >
                  Price (IDR)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                    placeholder="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                Description
              </label>
              <div className="relative">
                <DocumentTextIcon className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <textarea
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                  placeholder="Enter product description"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image URL */}
              <div>
                <label
                  className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider"
                  style={{ fontFamily: "Oswald, sans-serif" }}
                >
                  Image URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PhotoIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    value={productImage}
                    onChange={(e) => setProductImage(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label
                  className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider"
                  style={{ fontFamily: "Oswald, sans-serif" }}
                >
                  Category
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <TagIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                  >
                    <option value="">Select category</option>
                    <option value="boxing">Boxing</option>
                    <option value="muaythai">Muay Thai</option>
                    <option value="weightlifting">Weightlifting</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                style={{ fontFamily: "Oswald, sans-serif" }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    UPDATING...
                  </>
                ) : (
                  "UPDATE PRODUCT"
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300"
                style={{ fontFamily: "Oswald, sans-serif" }}
                disabled={loading}
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


const AdminProductItem = ({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
}) => (
  <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
    <div className="p-6">
      <div className="flex items-start gap-6">
        {/* Product Image */}
        <div className="flex-shrink-0">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-lg border border-gray-200"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
              <PhotoIcon className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3
                className="text-xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                {product.name}
              </h3>

              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1 text-red-600">
                  <CurrencyDollarIcon className="h-4 w-4" />
                  <span className="font-semibold">
                    Rp {product.price.toLocaleString("id-ID")}
                  </span>
                </div>

                {product.category && (
                  <div className="flex items-center gap-1">
                    <TagIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 capitalize">
                      {product.category}
                    </span>
                  </div>
                )}
              </div>

              {product.description && (
                <p className="text-gray-600 text-sm line-clamp-2">
                  {product.description}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => onEdit(product)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
                title="Edit Product"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
                title="Delete Product"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  // State untuk Form Produk Baru
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState("");
  const [productCategory, setProductCategory] = useState("");

  // Fungsi untuk memuat produk
  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching products:", error);
      Swal.fire("Error", "Gagal memuat produk: " + error.message, "error");
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  // Cek apakah user adalah admin saat halaman dimuat
  useEffect(() => {
    const checkAdmin = async () => {
      const user = await getCurrentUser(); // Mendapatkan user dari auth.ts
      if (!user) {
        Swal.fire(
          "Akses Ditolak",
          "Anda harus login untuk mengakses halaman admin.",
          "warning"
        ).then(() => {
          router.push("/login"); // Redirect ke halaman login jika belum login
        });
        return;
      }

      // Cek role dari tabel public.users
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (userError || !userData || userData.role !== "admin") {
        Swal.fire(
          "Akses Ditolak",
          "Anda tidak memiliki izin untuk mengakses halaman admin.",
          "error"
        ).then(() => {
          router.push("/"); // Redirect ke homepage jika bukan admin
        });
        return;
      }
      fetchProducts(); // Hanya fetch produk jika admin
    };

    checkAdmin();
  }, [router]);

  // Handler untuk menyimpan produk baru
  const handleSaveNewProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productName || !productPrice || !productImage) {
      Swal.fire(
        "Peringatan",
        "Nama, Harga, dan Gambar produk wajib diisi.",
        "warning"
      );
      return;
    }

    setLoading(true);

    // Tambah Produk Baru
    const { error } = await supabase.from("products").insert({
      name: productName,
      description: productDescription,
      price: parseFloat(productPrice), 
      image: productImage,
      category: productCategory,
    });

    if (error) {
      Swal.fire("Error", `Gagal menambah produk: ${error.message}`, "error");
    } else {
      Swal.fire("Sukses", "Produk berhasil ditambah.", "success");
      resetNewProductForm();
      fetchProducts(); // Refresh daftar produk
    }
    setLoading(false);
  };

  // Handler untuk menyimpan edit produk (dalam modal)
  const handleSaveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentProduct) return;

    setLoading(true);

    // Update Produk
    const { error } = await supabase
      .from("products")
      .update({
        name: currentProduct.name,
        description: currentProduct.description,
        price: currentProduct.price,
        image: currentProduct.image,
        category: currentProduct.category,
      })
      .eq("id", currentProduct.id);

    if (error) {
      Swal.fire("Error", `Gagal memperbarui produk: ${error.message}`, "error");
    } else {
      Swal.fire("Sukses", "Produk berhasil diperbarui.", "success");
      setIsEditModalOpen(false);
      setCurrentProduct(null);
      fetchProducts(); // Refresh daftar produk
    }
    setLoading(false);
  };

  // Handler untuk memulai edit (buka modal)
  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsEditModalOpen(true);
  };

  // Handler untuk menghapus produk
  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Produk akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const { error } = await supabase.from("products").delete().eq("id", id);

        if (error) {
          Swal.fire(
            "Error",
            "Gagal menghapus produk: " + error.message,
            "error"
          );
        } else {
          Swal.fire("Terhapus!", "Produk berhasil dihapus.", "success");
          fetchProducts(); // Refresh daftar produk
        }
        setLoading(false);
      }
    });
  };

  // Fungsi untuk mereset form produk baru
  const resetNewProductForm = () => {
    setProductName("");
    setProductDescription("");
    setProductPrice("");
    setProductImage("");
    setProductCategory("");
  };

  if (loading && products.length === 0) {
    return (
      <>
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <div className="min-h-screen bg-gray-50">
          <AdminHeader />
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-700 text-lg">Checking admin access...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Import Google Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <AdminNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === "products" ? (
            <>
              {/* Form Tambah Produk Baru */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                <div className="bg-red-600 px-6 py-4">
                  <h2
                    className="text-xl font-bold text-white flex items-center gap-2"
                    style={{ fontFamily: "Oswald, sans-serif" }}
                  >
                    <PlusIcon className="h-6 w-6" />
                    ADD NEW PRODUCT
                  </h2>
                </div>

                <div className="p-6">
                  <form onSubmit={handleSaveNewProduct} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Product Name */}
                      <div>
                        <label
                          className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider"
                          style={{ fontFamily: "Oswald, sans-serif" }}
                        >
                          Product Name
                        </label>
                        <input
                          type="text"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                          placeholder="Enter product name"
                          required
                        />
                      </div>

                      {/* Price */}
                      <div>
                        <label
                          className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider"
                          style={{ fontFamily: "Oswald, sans-serif" }}
                        >
                          Price (IDR)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="number"
                            value={productPrice}
                            onChange={(e) => setProductPrice(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                            placeholder="0"
                            step="0.01"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label
                        className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider"
                        style={{ fontFamily: "Oswald, sans-serif" }}
                      >
                        Description
                      </label>
                      <div className="relative">
                        <DocumentTextIcon className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                        <textarea
                          value={productDescription}
                          onChange={(e) =>
                            setProductDescription(e.target.value)
                          }
                          rows={4}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                          placeholder="Enter product description"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Image URL */}
                      <div>
                        <label
                          className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider"
                          style={{ fontFamily: "Oswald, sans-serif" }}
                        >
                          Image URL
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <PhotoIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="url"
                            value={productImage}
                            onChange={(e) => setProductImage(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                            placeholder="https://example.com/image.jpg"
                            required
                          />
                        </div>
                      </div>

                      {/* Category */}
                      <div>
                        <label
                          className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider"
                          style={{ fontFamily: "Oswald, sans-serif" }}
                        >
                          Category
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <TagIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <select
                            value={productCategory}
                            onChange={(e) => setProductCategory(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                          >
                            <option value="">Select category</option>
                            <option value="boxing">Boxing</option>
                            <option value="muaythai">Muay Thai</option>
                            <option value="weightlifting">Weightlifting</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                        style={{ fontFamily: "Oswald, sans-serif" }}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ADDING...
                          </>
                        ) : (
                          <>
                            <PlusIcon className="h-5 w-5" />
                            ADD PRODUCT
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={resetNewProductForm}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300"
                        style={{ fontFamily: "Oswald, sans-serif" }}
                      >
                        CLEAR FORM
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Products List */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gray-900 px-6 py-4">
                  <h2
                    className="text-xl font-bold text-white flex items-center gap-2"
                    style={{ fontFamily: "Oswald, sans-serif" }}
                  >
                    PRODUCT INVENTORY
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                      {products.length}
                    </span>
                  </h2>
                </div>

                <div className="p-6">
                  {loading ? (
                    <div className="text-center py-16">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
                      <p className="text-gray-500 text-lg">
                        Loading products...
                      </p>
                    </div>
                  ) : products.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="text-6xl mb-4">📦</div>
                      <h3
                        className="text-xl font-bold text-gray-900 mb-2"
                        style={{ fontFamily: "Oswald, sans-serif" }}
                      >
                        NO PRODUCTS FOUND
                      </h3>
                      <p className="text-gray-500">
                        Start by adding your first product above
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {products.map((product) => (
                        <AdminProductItem
                          key={product.id}
                          product={product}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Orders Tab Content */
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gray-900 px-6 py-4">
                <h2
                  className="text-xl font-bold text-white flex items-center gap-2"
                  style={{ fontFamily: "Oswald, sans-serif" }}
                >
                  <ClipboardDocumentListIcon className="h-6 w-6" />
                  CUSTOMER ORDERS
                </h2>
              </div>
              <div className="p-6">
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📋</div>
                  <h3
                    className="text-xl font-bold text-gray-900 mb-2"
                    style={{ fontFamily: "Oswald, sans-serif" }}
                  >
                    ORDERS MANAGEMENT
                  </h3>
                  <p className="text-gray-500">
                    Orders functionality will be implemented here
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Edit Product Modal */}
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          product={currentProduct}
          onSaveSuccess={fetchProducts} 
          loadingProp={loading}
        />
      </div>
    </>
  );
}
