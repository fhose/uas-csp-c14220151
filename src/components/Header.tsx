"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingCartIcon,
  UserIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    router.push("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Import Google Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      
      <header className="bg-black text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold tracking-wider text-red-500 hover:text-red-400 transition-colors duration-300" 
                  style={{ fontFamily: 'Oswald, sans-serif' }}>
                KNOCKNATION
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-gray-300 hover:text-white hover:text-red-400 transition-colors duration-300 font-medium"
                style={{ fontFamily: 'Oswald, sans-serif' }}
              >
                HOME
              </Link>
              <Link
                href="/store"
                className="text-gray-300 hover:text-white hover:text-red-400 transition-colors duration-300 font-medium"
                style={{ fontFamily: 'Oswald, sans-serif' }}
              >
                STORE
              </Link>
              
              
            </nav>

            {/* User Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/cart"
                    className="text-gray-300 hover:text-red-400 transition-colors duration-300 p-2"
                  >
                    <ShoppingCartIcon className="h-6 w-6" />
                  </Link>
                  <Link
                    href="/orders"
                    className="text-gray-300 hover:text-red-400 transition-colors duration-300 p-2"
                  >
                    <ClipboardDocumentListIcon className="h-6 w-6" />
                  </Link>
                  <div className="relative group">
                    <button className="text-gray-300 hover:text-red-400 transition-colors duration-300 p-2">
                      <UserIcon className="h-6 w-6" />
                    </button>
                    <div className="absolute top-full right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="py-2">
                        <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-700">
                          {user?.email || 'User'}
                        </div>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-red-400 hover:bg-gray-800 transition-colors duration-200"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                    style={{ fontFamily: 'Oswald, sans-serif' }}
                  >
                    LOGIN
                  </Link>
                  <Link
                    href="/register"
                    className="border border-red-600 text-red-500 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                    style={{ fontFamily: 'Oswald, sans-serif' }}
                  >
                    REGISTER
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-300 hover:text-red-400 transition-colors duration-300"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-gray-800 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/store"
                className="block px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-gray-800 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Store
              </Link>
              <Link
                href="/store?category=weightlifting"
                className="block px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-gray-800 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Weightlifting
              </Link>
              <Link
                href="/store?category=muaythai"
                className="block px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-gray-800 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Muay Thai
              </Link>
              <Link
                href="/store?category=boxing"
                className="block px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-gray-800 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Boxing
              </Link>
              
              {isLoggedIn ? (
                <>
                  <Link
                    href="/cart"
                    className="block px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-gray-800 rounded-md transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cart
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-gray-800 rounded-md transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-gray-800 rounded-md transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-gray-800 rounded-md transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-gray-800 rounded-md transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}