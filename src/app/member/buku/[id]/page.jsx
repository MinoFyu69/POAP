// src/app/member/buku/[id]/page.jsx

"use client";

import { useEffect, useState, use } from "react";
import { apiFetch } from "@/lib/api-client";
import { getUser } from "@/lib/client-auth";
import { 
  ArrowLeft, Calendar, BookOpen, User, Clock, AlertCircle, 
  CheckCircle2, ShoppingCart, Package, FileText, Star 
} from "lucide-react";

function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function BookDetailPage({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Form states
  const [startDate, setStartDate] = useState(() => formatDateInput(new Date()));
  const [returnDate, setReturnDate] = useState(() => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    return formatDateInput(defaultDate);
  });
  const [catatan, setCatatan] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const currentUser = await getUser();
        setUser(currentUser);

        setLoading(true);
        const data = await apiFetch("/api/member/buku");
        const foundBook = data.find((b) => b.id === parseInt(id));

        if (!foundBook) {
          setError("Buku tidak ditemukan.");
        } else {
          setBook(foundBook);
        }
      } catch (e) {
        setError(e.message || "Gagal memuat detail buku.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  async function handleBorrow(e) {
    e.preventDefault();
    if (!user) {
      setError("Anda harus login untuk meminjam buku.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccessMessage("");

      await apiFetch("/api/member/peminjaman", {
        method: "POST",
        body: JSON.stringify({
          user_id: user.id,
          buku_id: parseInt(id),
          tanggal_kembali_target: returnDate,
          catatan: catatan,
        }),
      });

      setSuccessMessage("Permintaan peminjaman berhasil dikirim! Menunggu persetujuan Admin/Staf.");
      setCatatan("");
    } catch (e) {
      setError(e.message || "Gagal mengirim permintaan peminjaman.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleBuyBook() {
    // Placeholder - nanti akan redirect ke halaman pembelian
    alert("Fitur pembelian buku akan segera hadir! 🛒");
    // TODO: window.location.href = `/member/beli-buku/${id}`;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-cyan-50/30">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-medium">Memuat detail buku...</p>
        </div>
      </div>
    );
  }

  if (!book && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-cyan-50/30">
        <div className="text-center space-y-6 animate-fadeIn">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="w-12 h-12 text-slate-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Buku Tidak Ditemukan</h1>
            <p className="text-slate-500 mb-6">Buku yang Anda cari tidak tersedia</p>
            <button
              onClick={() => window.location.href = "/member"}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Katalog
            </button>
          </div>
        </div>
      </div>
    );
  }

  const available = (book.stok_tersedia ?? book.stock ?? 0) > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-cyan-50/30 py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={() => window.location.href = "/member"}
          className="group inline-flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Katalog
        </button>

        {/* Book Detail Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-fadeInUp">
          <div className="lg:flex">
            {/* Book Cover Section */}
            <div className="lg:w-2/5 bg-gradient-to-br from-slate-100 to-slate-200 p-10 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
              
              <div className="relative w-64 h-96 bg-white shadow-2xl rounded-2xl overflow-hidden group hover:scale-105 transition-transform duration-300">
                {book.sampul_buku ? (
                  <img 
                    src={book.sampul_buku} 
                    alt={book.judul} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                    <BookOpen className="w-20 h-20 text-slate-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Book Info Section */}
            <div className="lg:w-3/5 p-8 lg:p-12 space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold">
                  {book.genre_id ? `Genre #${book.genre_id}` : "Umum"}
                </span>
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 ${
                  available 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${available ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                  {available ? 'Tersedia' : 'Stok Habis'}
                </span>
              </div>

              {/* Title & Author */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight mb-3">
                  {book.judul || book.title}
                </h1>
                <div className="flex items-center text-slate-600">
                  <User className="w-5 h-5 mr-2" />
                  <span className="text-lg">{book.penulis || book.author || "Penulis tidak diketahui"}</span>
                </div>
              </div>

              {/* Book Details Grid */}
              <div className="grid grid-cols-2 gap-4 py-6 border-y-2 border-slate-100">
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Penerbit</p>
                  <p className="font-semibold text-slate-800">{book.penerbit || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Tahun Terbit</p>
                  <p className="font-semibold text-slate-800">{book.tahun_terbit || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">ISBN</p>
                  <p className="font-semibold text-slate-800 text-sm">{book.isbn || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Halaman</p>
                  <p className="font-semibold text-slate-800">{book.jumlah_halaman || "-"}</p>
                </div>
              </div>

              {/* Synopsis */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-lg text-slate-900">Sinopsis</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {book.deskripsi || "Tidak ada deskripsi tersedia untuk buku ini."}
                </p>
              </div>

              {/* Stock Info */}
              <div className="flex items-center gap-2 p-4 bg-slate-50 rounded-xl">
                <Package className="w-5 h-5 text-slate-600" />
                <span className="text-sm text-slate-700">
                  <span className="font-semibold">{book.stok_tersedia ?? book.stock ?? 0}</span> eksemplar tersedia
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Beli & Pinjam */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Buy Book Card */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl shadow-xl p-8 text-white relative overflow-hidden group hover:scale-105 transition-transform duration-300 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <div className="relative space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-xl">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Beli Buku Ini</h3>
                  <p className="text-emerald-100 text-sm">Miliki secara permanen</p>
                </div>
              </div>
              <p className="text-emerald-50 leading-relaxed">
                Ingin memiliki buku ini selamanya? Beli sekarang dan buku akan langsung menjadi milikmu!
              </p>
              <button
                onClick={handleBuyBook}
                className="w-full py-4 bg-white text-emerald-600 rounded-xl font-bold text-lg hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl"
              >
                🛒 Beli Sekarang
              </button>
              <p className="text-xs text-emerald-100 text-center">
                * Fitur akan segera tersedia
              </p>
            </div>
          </div>

          {/* Borrow Book Form */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
                <Calendar className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Pinjam Buku</h2>
                <p className="text-sm text-slate-500">Gratis untuk member</p>
              </div>
            </div>

            {successMessage ? (
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-8 text-center space-y-4 animate-fadeIn">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-emerald-800">Permintaan Terkirim! 🎉</h3>
                <p className="text-emerald-700">{successMessage}</p>
                <button
                  onClick={() => window.location.href = "/member"}
                  className="mt-4 px-8 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-lg"
                >
                  Kembali ke Katalog
                </button>
              </div>
            ) : (
              <form onSubmit={handleBorrow} className="space-y-5">
                {error && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm animate-shake">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}

                {/* Start Date */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    Tanggal Mulai Pinjam
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={formatDateInput(new Date())}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
                  />
                </div>

                {/* Return Date */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    Tanggal Pengembalian
                  </label>
                  <input
                    type="date"
                    required
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={startDate}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
                  />
                  <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Durasi peminjaman standar adalah 7 hari
                  </p>
                </div>

                {/* Notes */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    Catatan (Opsional)
                  </label>
                  <textarea
                    rows={3}
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="Contoh: Untuk keperluan tugas akhir, penelitian, dll..."
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting || !available}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Mengirim Permintaan...
                    </span>
                  ) : available ? (
                    "📚 Ajukan Peminjaman"
                  ) : (
                    "❌ Stok Habis"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
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