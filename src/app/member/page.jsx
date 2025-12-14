// src/app/member/page.jsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import { getUser, clearAuth } from "@/lib/client-auth";
import { BookOpen, Search, LogOut, AlertCircle, Filter, X, TrendingUp, Package, History } from "lucide-react";

export default function MemberPage() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function loadUserData() {
      try {
        const currentUser = await getUser();
        
        if (!currentUser) {
          window.location.href = '/login';
          return;
        }
        
        setUser(currentUser);
        setAuthReady(true);
      } catch (error) {
        console.error('❌ Failed to load user data:', error);
        window.location.href = '/login';
      }
    }

    loadUserData();
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        setLoadingBooks(true);
        setError("");
        
        // Load books first
        const booksData = await apiFetch("/api/member/buku");
        setBooks(Array.isArray(booksData) ? booksData : []);
        
        // Try to load genres, but don't fail if it errors
        try {
          const genresData = await apiFetch("/api/member/genre");
          setGenres(Array.isArray(genresData) ? genresData : []);
          console.log('✅ Genres loaded:', genresData);
        } catch (genreError) {
          console.warn('⚠️ Failed to load genres, using fallback:', genreError.message);
          // Fallback: extract unique genres from books
          const uniqueGenres = [...new Set(booksData
            .filter(book => book.genre_id)
            .map(book => book.genre_id))]
            .map(id => ({ id, nama_genre: `Genre #${id}` }));
          setGenres(uniqueGenres);
        }
      } catch (e) {
        setError(e.message || "Gagal memuat data buku");
      } finally {
        setLoadingBooks(false);
      }
    }

    if (authReady && user) {
      const roleId = user.role_id;
      if (roleId === 2 || roleId === 3 || roleId === 4) {
        loadData();
      } else {
        setLoadingBooks(false);
      }
    }
  }, [user, authReady]);

  const filteredBooks = useMemo(() => {
    let result = books;
    
    // Filter by genre
    if (selectedGenre !== "all") {
      result = result.filter(book => book.genre_id === parseInt(selectedGenre));
    }
    
    // Filter by search query
    if (searchQuery) {
      const keyword = searchQuery.toLowerCase();
      result = result.filter((book) => {
        return (
          (book.judul || book.title || "").toLowerCase().includes(keyword) ||
          (book.penulis || book.author || "").toLowerCase().includes(keyword)
        );
      });
    }
    
    return result;
  }, [books, searchQuery, selectedGenre]);

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full mx-auto animate-pulse"></div>
          <h1 className="text-lg font-semibold text-slate-800">
            Menyiapkan halaman member...
          </h1>
          <p className="text-sm text-slate-500">
            Mohon tunggu sebentar.
          </p>
        </div>
      </div>
    );
  }

  if (authReady && user && user.role_id === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6">
        <div className="max-w-lg w-full bg-white shadow-2xl rounded-3xl p-8 space-y-6 text-center animate-fadeIn">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Panel ini khusus Member
          </h1>
          <p className="text-sm text-slate-600">
            Silakan login sebagai <span className="font-semibold text-indigo-600">Member</span>{" "}
            untuk mengakses fitur peminjaman. Role Visitor hanya dapat melihat katalog.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Ke Halaman Login
          </button>
        </div>
      </div>
    );
  }

  const totalStock = books.reduce(
    (sum, book) => sum + (book.stok_tersedia ?? book.stock ?? 0),
    0
  );
  const approvedBooks = books.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-cyan-50/30">
      {/* Header with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-12 text-white">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3 animate-fadeInUp">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <p className="text-xs uppercase tracking-wider text-white/90 font-medium">
                  Portal Member
                </p>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">
                Halo, {user?.username || "Member"}! 👋
              </h1>
              <p className="text-white/90 text-base md:text-lg max-w-2xl">
                Jelajahi koleksi buku kami dan ajukan peminjaman dengan mudah.
              </p>
            </div>
            <button
              onClick={async () => {
                await clearAuth();
                window.location.href = "/login";
              }}
              className="self-start md:self-auto group inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm px-5 py-3 text-sm font-medium hover:bg-white/20 hover:scale-105 transition-all duration-300"
            >
              <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Stats Cards with Animation */}
        <section className="grid gap-6 md:grid-cols-3 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <BookOpen className="w-8 h-8 text-white/90" />
                <div className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold">
                  Total
                </div>
              </div>
              <p className="text-4xl font-bold text-white mb-1">{approvedBooks}</p>
              <p className="text-sm text-indigo-100">Buku tersedia</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <Package className="w-8 h-8 text-white/90" />
                <div className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold">
                  Stok
                </div>
              </div>
              <p className="text-4xl font-bold text-white mb-1">{totalStock}</p>
              <p className="text-sm text-emerald-100">Eksemplar aktif</p>
            </div>
          </div>

          {/* History Button Card */}
          <button
            onClick={() => window.location.href = "/member/history"}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-left"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <History className="w-8 h-8 text-white/90 group-hover:rotate-12 transition-transform" />
                <div className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold">
                  Klik
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-2">📦 History</p>
              <p className="text-sm text-purple-100">Lihat riwayat peminjaman</p>
            </div>
          </button>
        </section>

        {/* Books Catalog Section */}
        <section className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <div className="p-6 md:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  📚 Katalog Buku
                </h2>
                <p className="text-sm text-slate-500">
                  Temukan buku favoritmu dari {filteredBooks.length} hasil
                </p>
              </div>
              
              {/* Filter Toggle Button (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filter & Cari
                {showFilters ? <X className="w-4 h-4" /> : null}
              </button>
            </div>

            {/* Search and Filter Section */}
            <div className={`${showFilters ? 'block' : 'hidden lg:block'} space-y-4`}>
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari judul atau penulis buku..."
                    className="w-full border-2 border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  )}
                </div>

                {/* Genre Filter */}
                <div className="lg:w-64">
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all appearance-none bg-white cursor-pointer"
                  >
                    <option value="all">📖 Semua Genre</option>
                    {genres.map((genre) => (
                      <option key={genre.id} value={genre.id}>
                        {genre.nama_genre || `Genre #${genre.id}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active Filters */}
              {(searchQuery || selectedGenre !== "all") && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-slate-500 font-medium">Filter aktif:</span>
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium">
                      🔍 "{searchQuery}"
                      <button onClick={() => setSearchQuery("")} className="hover:bg-indigo-200 rounded-full p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedGenre !== "all" && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                      📚 {genres.find(g => g.id === parseInt(selectedGenre))?.nama_genre || `Genre #${selectedGenre}`}
                      <button onClick={() => setSelectedGenre("all")} className="hover:bg-purple-200 rounded-full p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Books Grid */}
            {loadingBooks ? (
              <div className="py-20 text-center">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-500 text-sm">Memuat koleksi buku...</p>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                  <BookOpen className="w-10 h-10 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">
                    {searchQuery || selectedGenre !== "all" ? "Tidak ada hasil" : "Belum ada buku"}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {searchQuery || selectedGenre !== "all" 
                      ? "Coba ubah filter atau kata kunci pencarian"
                      : "Belum ada buku yang tersedia saat ini"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredBooks.map((book, index) => {
                  const available = (book.stok_tersedia ?? book.stock ?? 0) > 0;
                  return (
                    <div
                      key={book.id}
                      className="group relative bg-white border-2 border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 hover:-translate-y-1 animate-fadeInUp"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      {/* Stock Badge */}
                      <div className="absolute top-3 right-3 z-10">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          available 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${available ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                          {available ? 'Tersedia' : 'Habis'}
                        </span>
                      </div>

                      {/* Book Cover */}
                      <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl mb-4 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                        {book.sampul_buku ? (
                          <img 
                            src={book.sampul_buku} 
                            alt={book.judul} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <BookOpen className="w-12 h-12 text-slate-300" />
                          </div>
                        )}
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>

                      {/* Book Info */}
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-base font-bold text-slate-900 line-clamp-2 group-hover:text-indigo-600 transition-colors mb-1">
                            {book.judul || book.title}
                          </h3>
                          <p className="text-xs text-slate-500 line-clamp-1">
                            {book.penulis || book.author || "Penulis tidak diketahui"}
                          </p>
                        </div>

                        {/* Genre & Stock */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="px-2 py-1 rounded-lg bg-indigo-50 text-indigo-600 font-medium">
                            {genres.find(g => g.id === book.genre_id)?.nama_genre || "Umum"}
                          </span>
                          <span className="text-slate-400 font-medium">
                            Stok: {book.stok_tersedia ?? book.stock ?? 0}
                          </span>
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={() => window.location.href = `/member/buku/${book.id}`}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 text-white text-sm font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105"
                        >
                          Lihat Detail →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}