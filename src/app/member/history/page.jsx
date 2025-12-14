// src/app/member/history/page.jsx
'use client';

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import { getUser } from "@/lib/client-auth";
import { 
  ArrowLeft, BookOpen, Calendar, Clock, CheckCircle, 
  XCircle, AlertCircle, Package, ShoppingBag, Filter,
  FileText, DollarSign, TrendingUp, Archive, Eye
} from "lucide-react";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { 
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200', 
      icon: Clock, 
      text: 'Menunggu Approval' 
    },
    dipinjam: { 
      color: 'bg-blue-100 text-blue-700 border-blue-200', 
      icon: BookOpen, 
      text: 'Sedang Dipinjam' 
    },
    dikembalikan: { 
      color: 'bg-green-100 text-green-700 border-green-200', 
      icon: CheckCircle, 
      text: 'Dikembalikan' 
    },
    rejected: { 
      color: 'bg-red-100 text-red-700 border-red-200', 
      icon: XCircle, 
      text: 'Ditolak' 
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 ${config.color}`}>
      <Icon size={14} />
      {config.text}
    </span>
  );
};

const DetailModal = ({ isOpen, onClose, peminjaman }) => {
  if (!isOpen || !peminjaman) return null;

  const calculateDurasi = () => {
    if (!peminjaman.tanggal_pinjam) return 'Belum dipinjam';
    
    const start = new Date(peminjaman.tanggal_pinjam);
    const end = peminjaman.tanggal_kembali_aktual 
      ? new Date(peminjaman.tanggal_kembali_aktual)
      : new Date();
    
    const diffDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));
    return `${diffDays} hari`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">📖 Detail Peminjaman</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <XCircle size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Book Info */}
          <div className="flex gap-4 p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-2 border-slate-200">
            {peminjaman.sampul_buku && (
              <img 
                src={peminjaman.sampul_buku} 
                alt={peminjaman.buku_judul}
                className="w-20 h-28 object-cover rounded-lg shadow-md"
                onError={(e) => e.target.style.display = 'none'}
              />
            )}
            <div className="flex-1">
              <h3 className="font-bold text-lg text-slate-900 mb-1">{peminjaman.buku_judul}</h3>
              <p className="text-sm text-slate-600 mb-2">{peminjaman.buku_penulis}</p>
              <StatusBadge status={peminjaman.status} />
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border-2 border-blue-100 space-y-4">
            <h3 className="font-bold text-blue-900 flex items-center gap-2">
              <Calendar size={20} />
              Timeline Peminjaman
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-blue-600 font-semibold mb-1">Tanggal Request</p>
                <p className="text-sm font-bold text-slate-800">
                  {new Date(peminjaman.created_at).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>

              {peminjaman.tanggal_pinjam && (
                <div>
                  <p className="text-xs text-blue-600 font-semibold mb-1">Tanggal Pinjam</p>
                  <p className="text-sm font-bold text-slate-800">
                    {new Date(peminjaman.tanggal_pinjam).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs text-blue-600 font-semibold mb-1">Target Kembali</p>
                <p className="text-sm font-bold text-slate-800">
                  {new Date(peminjaman.tanggal_kembali_target).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>

              {peminjaman.tanggal_kembali_aktual && (
                <div>
                  <p className="text-xs text-blue-600 font-semibold mb-1">Tanggal Kembali Aktual</p>
                  <p className="text-sm font-bold text-slate-800">
                    {new Date(peminjaman.tanggal_kembali_aktual).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>

            {peminjaman.status === 'dipinjam' && (
              <div className="bg-white p-3 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-600 font-semibold mb-1">Durasi Peminjaman</p>
                <p className="text-sm font-bold text-slate-800">{calculateDurasi()}</p>
              </div>
            )}
          </div>

          {/* Denda Section */}
          {peminjaman.total_denda > 0 && (
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-5 rounded-2xl border-2 border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-orange-900 flex items-center gap-2">
                  <DollarSign size={20} />
                  Informasi Denda
                </h3>
                <p className="text-2xl font-bold text-orange-600">
                  Rp {peminjaman.total_denda.toLocaleString('id-ID')}
                </p>
              </div>
              {peminjaman.hari_terlambat > 0 && (
                <p className="text-sm text-orange-700">
                  Terlambat {peminjaman.hari_terlambat} hari • Rp 2.000/hari
                </p>
              )}
            </div>
          )}

          {/* Late Warning */}
          {peminjaman.hari_terlambat > 0 && peminjaman.status === 'dipinjam' && (
            <div className="bg-red-50 p-4 rounded-2xl border-2 border-red-200 flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-bold text-red-800 mb-1">⚠️ Peminjaman Terlambat!</p>
                <p className="text-sm text-red-700">
                  Buku sudah terlambat {peminjaman.hari_terlambat} hari. 
                  Segera kembalikan untuk menghindari denda tambahan.
                </p>
              </div>
            </div>
          )}

          {/* Catatan */}
          {peminjaman.catatan && (
            <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-200">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-2">
                <FileText size={18} />
                Catatan
              </h3>
              <p className="text-sm text-slate-700">{peminjaman.catatan}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function MemberHistoryPage() {
  const [user, setUser] = useState(null);
  const [peminjaman, setPeminjaman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedPeminjaman, setSelectedPeminjaman] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const currentUser = await getUser();
        
        if (!currentUser) {
          window.location.href = '/login';
          return;
        }
        
        setUser(currentUser);
        
        // Fetch peminjaman history
        const response = await apiFetch('/api/member/peminjaman');
        setPeminjaman(Array.isArray(response) ? response : []);
        
      } catch (e) {
        console.error('Error loading history:', e);
        setError(e.message || 'Gagal memuat history');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredPeminjaman = peminjaman.filter(p => {
    if (filterStatus === 'all') return true;
    return p.status === filterStatus;
  });

  const stats = {
    total: peminjaman.length,
    pending: peminjaman.filter(p => p.status === 'pending').length,
    dipinjam: peminjaman.filter(p => p.status === 'dipinjam').length,
    dikembalikan: peminjaman.filter(p => p.status === 'dikembalikan').length,
    rejected: peminjaman.filter(p => p.status === 'rejected').length,
    totalDenda: peminjaman.reduce((sum, p) => sum + (p.total_denda || 0), 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-cyan-50/30">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-medium">Memuat history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-cyan-50/30 py-10 px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={() => window.location.href = "/member"}
          className="group inline-flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Katalog
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
          
          <div className="relative">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Package size={40} />
              History Peminjaman
            </h1>
            <p className="text-white/90">
              Lihat semua riwayat peminjaman buku Anda, {user?.username || 'Member'}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div 
            className={`bg-white rounded-2xl shadow-md p-5 cursor-pointer transition-all hover:shadow-lg border-2 ${filterStatus === 'all' ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-transparent'}`}
            onClick={() => setFilterStatus('all')}
          >
            <div className="text-center">
              <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <Archive className="text-indigo-600" size={24} />
              </div>
              <p className="text-sm text-slate-600 mb-1">Total</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </div>

          <div 
            className={`bg-white rounded-2xl shadow-md p-5 cursor-pointer transition-all hover:shadow-lg border-2 ${filterStatus === 'pending' ? 'border-yellow-500 ring-2 ring-yellow-200' : 'border-transparent'}`}
            onClick={() => setFilterStatus('pending')}
          >
            <div className="text-center">
              <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="text-yellow-600" size={24} />
              </div>
              <p className="text-sm text-slate-600 mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </div>

          <div 
            className={`bg-white rounded-2xl shadow-md p-5 cursor-pointer transition-all hover:shadow-lg border-2 ${filterStatus === 'dipinjam' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent'}`}
            onClick={() => setFilterStatus('dipinjam')}
          >
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <BookOpen className="text-blue-600" size={24} />
              </div>
              <p className="text-sm text-slate-600 mb-1">Dipinjam</p>
              <p className="text-2xl font-bold text-blue-600">{stats.dipinjam}</p>
            </div>
          </div>

          <div 
            className={`bg-white rounded-2xl shadow-md p-5 cursor-pointer transition-all hover:shadow-lg border-2 ${filterStatus === 'dikembalikan' ? 'border-green-500 ring-2 ring-green-200' : 'border-transparent'}`}
            onClick={() => setFilterStatus('dikembalikan')}
          >
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <p className="text-sm text-slate-600 mb-1">Kembali</p>
              <p className="text-2xl font-bold text-green-600">{stats.dikembalikan}</p>
            </div>
          </div>

          <div 
            className={`bg-white rounded-2xl shadow-md p-5 cursor-pointer transition-all hover:shadow-lg border-2 ${filterStatus === 'rejected' ? 'border-red-500 ring-2 ring-red-200' : 'border-transparent'}`}
            onClick={() => setFilterStatus('rejected')}
          >
            <div className="text-center">
              <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <XCircle className="text-red-600" size={24} />
              </div>
              <p className="text-sm text-slate-600 mb-1">Ditolak</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-md p-5">
            <div className="text-center text-white">
              <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <DollarSign size={24} />
              </div>
              <p className="text-sm text-white/90 mb-1">Total Denda</p>
              <p className="text-xl font-bold">
                Rp {stats.totalDenda.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Filter size={20} />
              Daftar History
              <span className="text-sm font-normal text-slate-500">
                ({filteredPeminjaman.length} hasil)
              </span>
            </h2>
          </div>

          {error && (
            <div className="p-6 bg-red-50 border-b border-red-100 flex items-center gap-3 text-red-700">
              <AlertCircle size={20} />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="overflow-x-auto">
            {filteredPeminjaman.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Archive className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  Tidak ada history
                </h3>
                <p className="text-sm text-slate-500">
                  {filterStatus === 'all' 
                    ? 'Belum ada peminjaman yang tercatat'
                    : `Tidak ada peminjaman dengan status ${filterStatus}`}
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Buku</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Tanggal</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase">Denda</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPeminjaman.map((p, idx) => (
                    <tr key={p.id} className={`hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {p.sampul_buku ? (
                            <img src={p.sampul_buku} alt={p.buku_judul} className="w-12 h-16 object-cover rounded shadow-md" />
                          ) : (
                            <div className="w-12 h-16 bg-slate-200 rounded flex items-center justify-center">
                              <BookOpen size={20} className="text-slate-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{p.buku_judul}</p>
                            <p className="text-xs text-slate-500">{p.buku_penulis}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div>
                          <p className="font-medium">
                            {new Date(p.created_at).toLocaleDateString('id-ID')}
                          </p>
                          <p className="text-xs text-slate-400">
                            {new Date(p.created_at).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={p.status} />
                        {p.hari_terlambat > 0 && p.status === 'dipinjam' && (
                          <p className="text-xs text-red-600 mt-1 font-semibold">
                            ⚠️ Terlambat {p.hari_terlambat} hari
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {p.total_denda > 0 ? (
                          <span className="text-orange-600 font-bold">
                            Rp {p.total_denda.toLocaleString('id-ID')}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedPeminjaman(p);
                            setShowModal(true);
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all text-sm font-bold shadow-md hover:shadow-lg"
                        >
                          <Eye size={16} />
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <DetailModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedPeminjaman(null);
        }}
        peminjaman={selectedPeminjaman}
      />

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.9);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}