"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import { loginWithUsername } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  UserIcon,
  LockClosedIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // page.tsx (di dalam handleLogin)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      return Swal.fire("Oops!", "Username dan password wajib diisi", "warning");
    }

    setLoading(true);
    try {
      const trimmedUsername = username.trim();
      const result = await loginWithUsername(trimmedUsername, password); // Kirim username yang sudah di-trim

      if (result.error) {
        Swal.fire("Gagal", result.error, "error");
        return;
      }

      const user = result.data;

      localStorage.setItem("user", JSON.stringify(user));

      Swal.fire(
        "Login Berhasil!",
        `Selamat datang, ${user.username}`,
        "success"
      ).then(() => {
        if (user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      });
    } catch (error) {
      Swal.fire("Error", "Terjadi kesalahan saat login", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Import Google Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900">
        <Header />

        {/* Main Content */}
        <div className="flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            {/* Hero Section */}
            <div className="text-center">
              <h1
                className="text-4xl font-bold text-white mb-2"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                WELCOME BACK
              </h1>
              <p className="text-gray-300 text-lg">
                Ready to dominate your training?
              </p>
            </div>

            {/* Login Form */}
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
              {/* Form Header */}
              <div className="bg-red-600 px-8 py-6 text-center">
                <h2
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "Oswald, sans-serif" }}
                >
                  LOGIN TO KNOCKNATION
                </h2>
              </div>

              {/* Form Content */}
              <div className="px-8 py-8">
                <form onSubmit={handleLogin} className="space-y-6">
                  {/* Username Field */}
                  <div className="space-y-2">
                    <label
                      className="block text-sm font-semibold text-gray-700 uppercase tracking-wider"
                      style={{ fontFamily: "Oswald, sans-serif" }}
                    >
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 bg-gray-50 focus:bg-white text-black"
                        placeholder="Enter your username"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label
                      className="block text-sm font-semibold text-gray-700 uppercase tracking-wider"
                      style={{ fontFamily: "Oswald, sans-serif" }}
                    >
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 bg-gray-50 focus:bg-white text-black"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-bold rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    style={{ fontFamily: "Oswald, sans-serif" }}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        LOGGING IN...
                      </>
                    ) : (
                      <>
                        LOGIN
                        <ArrowRightIcon className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <div className="text-center">
                    <p className="text-gray-600">
                      Don't have an account?{" "}
                      <Link
                        href="/register"
                        className="font-semibold text-red-600 hover:text-red-500 transition-colors duration-200"
                        style={{ fontFamily: "Oswald, sans-serif" }}
                      >
                        CREATE ACCOUNT
                      </Link>
                    </p>
                  </div>
                </div>

                {/* Back to Store */}
                <div className="mt-4 text-center">
                  <Link
                    href="/"
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    ← Back to Homepage
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Quote */}
            <div className="text-center">
              <p
                className="text-red-400 font-medium italic"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                "ENTER THE RING. CONQUER YOUR LIMITS."
              </p>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="fixed top-20 left-10 w-32 h-32 bg-red-600 rounded-full opacity-10 animate-pulse"></div>
        <div className="fixed bottom-20 right-10 w-24 h-24 bg-red-600 rounded-full opacity-5 animate-bounce"></div>

        <Footer />
      </div>
    </>
  );
}
