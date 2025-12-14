// src/app/Admin/peminjaman/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Clock, CheckCircle, XCircle, AlertCircle, 
  User, BookOpen, Calendar, DollarSign, 
  Filter, Search, X, Settings as SettingsIcon, Save, RefreshCw
} from 'lucide-react';

// Toast Component
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };

  const icons = {
    success: <CheckCircle size={24} />,
    error: <XCircle size={24} />,
    warning: <Clock size={24} />,
    info: <Clock size={24} />
  };

  return (
    <div className="fixed top-4 right-4 z-[100] animate-slide-in">
      <div className={`${styles[type]} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px]`}>
        {icons[type]}
        <span className="flex-1 font-medium">{message}</span>
        <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-2xl">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Settings Modal Content
const SettingsContent = ({ onClose, currentDenda, onSaveSuccess }) => {
  const [dendaPerHari, setDendaPerHari] = useState(currentDenda);
  const [originalValue, setOriginalValue] = useState(currentDenda);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (dendaPerHari < 0) {
      alert('Denda tidak boleh negatif!');
      return;
    }

    if (dendaPerHari === originalValue) {
      alert('Tidak ada perubahan untuk disimpan');
      return;
    }

    try {
      setSaving(true);
      
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'denda_per_hari',
          value: dendaPerHari.toString(),
          description: 'Besaran denda keterlambatan per hari dalam Rupiah'
        })
      });

      if (response.ok) {
        setOriginalValue(dendaPerHari);
        onSaveSuccess(dendaPerHari);
        onClose();
      } else {
        const error = await response.json();
        alert(error.message || 'Gagal menyimpan pengaturan');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Gagal menyimpan pengaturan: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const calculateExample = (days) => {
    return formatRupiah(days * dendaPerHari);
  };

  const hasChanges = dendaPerHari !== originalValue;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3">
          Besaran Denda per Hari (Rupiah)
        </label>
        
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold text-lg">
            Rp
          </span>
          <input
            type="number"
            value={dendaPerHari}
            onChange={(e) => setDendaPerHari(parseInt(e.target.value) || 0)}
            className="w-full pl-12 pr-4 py-4 text-2xl font-bold border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            min="0"
            step="500"
          />
        </div>

        <div className="mt-3 flex gap-2 flex-wrap">
          <button
            onClick={() => setDendaPerHari(1000)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            Rp 1.000
          </button>
          <button
            onClick={() => setDendaPerHari(2000)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            Rp 2.000
          </button>
          <button
            onClick={() => setDendaPerHari(5000)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            Rp 5.000
          </button>
          <button
            onClick={() => setDendaPerHari(10000)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            Rp 10.000
          </button>
        </div>

        {hasChanges && (
          <div className="mt-3 flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
            <AlertCircle size={18} />
            <span className="text-sm font-medium">
              Ada perubahan yang belum disimpan
            </span>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border-2 border-indigo-200">
        <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
          <RefreshCw size={20} />
          Simulasi Denda
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
            <p className="text-xs text-gray-600 mb-1">1 Hari</p>
            <p className="text-lg font-bold text-indigo-600">{calculateExample(1)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
            <p className="text-xs text-gray-600 mb-1">3 Hari</p>
            <p className="text-lg font-bold text-indigo-600">{calculateExample(3)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
            <p className="text-xs text-gray-600 mb-1">7 Hari</p>
            <p className="text-lg font-bold text-purple-600">{calculateExample(7)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-red-200">
            <p className="text-xs text-gray-600 mb-1">14 Hari</p>
            <p className="text-lg font-bold text-red-600">{calculateExample(14)}</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border-2 border-blue-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
          <div>
            <h3 className="font-bold text-blue-900 mb-2">ℹ️ Informasi</h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Perubahan berlaku segera untuk semua peminjaman</li>
              <li>• Denda dihitung per hari penuh keterlambatan</li>
              <li>• Admin dapat override denda saat pengembalian</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={20} />
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
        
        <button
          onClick={() => setDendaPerHari(originalValue)}
          disabled={!hasChanges}
          className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-700', icon: Clock, text: 'Menunggu Approval' },
    dipinjam: { color: 'bg-blue-100 text-blue-700', icon: BookOpen, text: 'Sedang Dipinjam' },
    dikembalikan: { color: 'bg-green-100 text-green-700', icon: CheckCircle, text: 'Dikembalikan' },
    rejected: { color: 'bg-red-100 text-red-700', icon: XCircle, text: 'Ditolak' },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
      <Icon size={14} />
      {config.text}
    </span>
  );
};

const PeminjamanDetail = ({ peminjaman, onAction, onClose, dendaPerHari }) => {
  const [action, setAction] = useState('');
  const [catatan, setCatatan] = useState('');
  const [denda, setDenda] = useState(peminjaman.total_denda || 0);
  const [processing, setProcessing] = useState(false);

  const calculateDurasi = () => {
    if (!peminjaman.tanggal_pinjam) return 'Belum dipinjam';
    
    const start = new Date(peminjaman.tanggal_pinjam);
    const end = peminjaman.tanggal_kembali_aktual 
      ? new Date(peminjaman.tanggal_kembali_aktual)
      : new Date();
    
    const diffDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));
    return `${diffDays} hari`;
  };

  const calculateSisaWaktu = () => {
    if (peminjaman.status !== 'dipinjam') return null;
    
    const target = new Date(peminjaman.tanggal_kembali_target);
    const now = new Date();
    const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return {
        text: `Terlambat ${Math.abs(diffDays)} hari`,
        color: 'text-red-600',
        bg: 'bg-red-50'
      };
    } else if (diffDays === 0) {
      return {
        text: 'Jatuh tempo hari ini',
        color: 'text-orange-600',
        bg: 'bg-orange-50'
      };
    } else {
      return {
        text: `${diffDays} hari lagi`,
        color: 'text-green-600',
        bg: 'bg-green-50'
      };
    }
  };

  const handleSubmit = async () => {
    if (!action) return;

    if ((action === 'reject' || action === 'return') && !catatan.trim()) {
      alert('Catatan diperlukan untuk ' + action);
      return;
    }

    setProcessing(true);
    await onAction(peminjaman.id, action, denda, catatan);
    setProcessing(false);
    onClose();
  };

  const sisaWaktu = calculateSisaWaktu();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Informasi Peminjam</h3>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl space-y-2 border border-indigo-100">
              <div className="flex items-center gap-2">
                <User size={16} className="text-indigo-400" />
                <div>
                  <p className="font-bold text-gray-800">{peminjaman.nama_lengkap}</p>
                  <p className="text-sm text-gray-600">@{peminjaman.username}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">{peminjaman.email}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Status Peminjaman</h3>
            <StatusBadge status={peminjaman.status} />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Informasi Buku</h3>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
            {peminjaman.sampul_buku && (
              <img 
                src={peminjaman.sampul_buku} 
                alt={peminjaman.buku_judul}
                className="w-full h-32 object-cover rounded-lg mb-3 shadow-md"
                onError={(e) => e.target.style.display = 'none'}
              />
            )}
            <h4 className="font-bold text-gray-800 mb-1">{peminjaman.buku_judul}</h4>
            <p className="text-sm text-gray-600">{peminjaman.buku_penulis}</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 space-y-3">
        <h3 className="text-sm font-semibold text-blue-900 mb-3">📅 Timeline Peminjaman</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-blue-600 font-medium mb-1">Tanggal Request</p>
            <p className="text-sm font-bold text-gray-800">
              {new Date(peminjaman.created_at).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </p>
          </div>

          {peminjaman.tanggal_pinjam && (
            <div>
              <p className="text-xs text-blue-600 font-medium mb-1">Tanggal Pinjam</p>
              <p className="text-sm font-bold text-gray-800">
                {new Date(peminjaman.tanggal_pinjam).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>
          )}

          <div>
            <p className="text-xs text-blue-600 font-medium mb-1">Target Kembali</p>
            <p className="text-sm font-bold text-gray-800">
              {new Date(peminjaman.tanggal_kembali_target).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>

        {peminjaman.status === 'dipinjam' && (
          <div>
            <p className="text-xs text-blue-600 font-medium mb-1">Durasi Peminjaman</p>
            <p className="text-sm font-bold text-gray-800">{calculateDurasi()}</p>
          </div>
        )}

        {sisaWaktu && (
          <div className={`${sisaWaktu.bg} p-3 rounded-lg border ${sisaWaktu.color === 'text-red-600' ? 'border-red-200' : sisaWaktu.color === 'text-orange-600' ? 'border-orange-200' : 'border-green-200'}`}>
            <p className={`text-sm font-bold ${sisaWaktu.color}`}>
              ⏰ {sisaWaktu.text}
            </p>
          </div>
        )}

        {peminjaman.hari_terlambat > 0 && (
          <div className="bg-red-50 p-3 rounded-lg border border-red-200">
            <p className="text-sm font-bold text-red-600">
              ⚠️ Terlambat {peminjaman.hari_terlambat} hari
            </p>
            <p className="text-xs text-red-500 mt-1">
              Denda otomatis (Rp {dendaPerHari?.toLocaleString('id-ID')}/hari): Rp {(peminjaman.hari_terlambat * dendaPerHari)?.toLocaleString('id-ID')}
            </p>
          </div>
        )}
      </div>

      {(peminjaman.status === 'dipinjam' || peminjaman.status === 'dikembalikan') && peminjaman.total_denda > 0 && (
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-orange-800">💰 Total Denda</h3>
            <p className="text-2xl font-bold text-orange-600">
              Rp {peminjaman.total_denda.toLocaleString('id-ID')}
            </p>
          </div>
          {peminjaman.hari_terlambat > 0 && (
            <p className="text-xs text-orange-600 font-medium">
              Denda keterlambatan: Rp {dendaPerHari?.toLocaleString('id-ID')}/hari × {peminjaman.hari_terlambat} hari
            </p>
          )}
        </div>
      )}

      {peminjaman.status === 'pending' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-700">⚡ Approval Action</h3>
          
          <div className="flex gap-3">
            <button
              onClick={() => setAction('approve')}
              className={`flex-1 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg ${
                action === 'approve'
                  ? 'bg-green-600 text-white'
                  : 'bg-green-50 text-green-700 hover:bg-green-100 border-2 border-green-200'
              }`}
            >
              <CheckCircle className="inline mr-2" size={18} />
              Approve
            </button>
            <button
              onClick={() => setAction('reject')}
              className={`flex-1 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg ${
                action === 'reject'
                  ? 'bg-red-600 text-white'
                  : 'bg-red-50 text-red-700 hover:bg-red-100 border-2 border-red-200'
              }`}
            >
              <XCircle className="inline mr-2" size={18} />
              Reject
            </button>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Catatan {action === 'reject' && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              rows={3}
              placeholder="Tambahkan catatan..."
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!action || processing}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? '⏳ Processing...' : '✅ Submit'}
          </button>
        </div>
      )}

      {peminjaman.status === 'dipinjam' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-700">📦 Pengembalian Buku</h3>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Denda (Rp)
            </label>
            <input
              type="number"
              value={denda}
              onChange={(e) => setDenda(Number(e.target.value))}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1 font-medium">
              Denda otomatis: Rp {(peminjaman.hari_terlambat * dendaPerHari)?.toLocaleString('id-ID')}
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Catatan
            </label>
            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              rows={3}
              placeholder="Kondisi buku, catatan tambahan..."
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            onClick={() => {
              setAction('return');
              handleSubmit();
            }}
            disabled={processing}
            className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-bold shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {processing ? '⏳ Processing...' : '✅ Kembalikan Buku'}
          </button>
        </div>
      )}

      {peminjaman.catatan && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
          <h3 className="text-sm font-bold text-gray-700 mb-2">📝 Catatan</h3>
          <p className="text-sm text-gray-600">{peminjaman.catatan}</p>
        </div>
      )}
    </div>
  );
};

export default function ApprovalPeminjamanPage() {
  const [peminjaman, setPeminjaman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeminjaman, setSelectedPeminjaman] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);
  const [dendaPerHari, setDendaPerHari] = useState(2000);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    fetchPeminjaman();
    fetchDendaSetting();
  }, []);

  const fetchDendaSetting = async () => {
    try {
      const response = await fetch('/api/admin/settings?key=denda_per_hari');
      if (response.ok) {
        const data = await response.json();
        setDendaPerHari(parseInt(data.value) || 2000);
      }
    } catch (error) {
      console.error('Error fetching denda setting:', error);
    }
  };

  const fetchPeminjaman = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/peminjaman');
      const data = await response.json();
      
      setPeminjaman(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching peminjaman:', error);
      showToast('Gagal memuat data: ' + error.message, 'error');
      setPeminjaman([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action, denda, catatan) => {
    try {
      const response = await fetch('/api/peminjaman', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action, denda, catatan })
      });

      if (response.ok) {
        showToast(
          action === 'approve' ? '✅ Peminjaman berhasil diapprove!' :
          action === 'reject' ? '❌ Peminjaman ditolak!' :
          '✅ Buku berhasil dikembalikan!',
          'success'
        );
        fetchPeminjaman();
      } else {
        const error = await response.json();
        showToast(error.message || 'Gagal memproses action', 'error');
      }
    } catch (error) {
      console.error('Error processing action:', error);
      showToast('Gagal memproses action: ' + error.message, 'error');
    }
  };

  const handleSettingsSave = (newDenda) => {
    setDendaPerHari(newDenda);
    showToast('✅ Pengaturan denda berhasil disimpan!', 'success');
  };

  const filteredPeminjaman = peminjaman.filter(p => {
    const matchesSearch = 
      p.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nama_lengkap?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.buku_judul?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    all: peminjaman.length,
    pending: peminjaman.filter(p => p.status === 'pending').length,
    dipinjam: peminjaman.filter(p => p.status === 'dipinjam').length,
    dikembalikan: peminjaman.filter(p => p.status === 'dikembalikan').length,
    rejected: peminjaman.filter(p => p.status === 'rejected').length,
    terlambat: peminjaman.filter(p => p.hari_terlambat > 0).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Floating Settings Button */}
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="fixed bottom-8 right-8 z-40 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 group"
        title="Pengaturan Denda"
      >
        <SettingsIcon size={28} className="group-hover:rotate-90 transition-transform duration-500" />
      </button>

      <div className="mb-8">
        <h1 className="text-4xl font-bold  mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          📚 Approval Peminjaman
        </h1>
        <p className="text-gray-600">Kelola request peminjaman dan pengembalian buku</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div 
          className={`bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all hover:shadow-lg ${filterStatus === 'all' ? 'ring-2 ring-indigo-500' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          <div className="text-center">
            <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <Filter className="text-indigo-600" size={24} />
            </div>
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-800">{stats.all}</p>
          </div>
        </div>

        <div 
          className={`bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all hover:shadow-lg ${filterStatus === 'pending' ? 'ring-2 ring-yellow-500' : ''}`}
          onClick={() => setFilterStatus('pending')}
        >
          <div className="text-center">
            <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <Clock className="text-yellow-600" size={24} />
            </div>
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
        </div>

        <div 
          className={`bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all hover:shadow-lg ${filterStatus === 'dipinjam' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setFilterStatus('dipinjam')}
        >
          <div className="text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <BookOpen className="text-blue-600" size={24} />
            </div>
            <p className="text-sm text-gray-600 mb-1">Dipinjam</p>
            <p className="text-2xl font-bold text-blue-600">{stats.dipinjam}</p>
          </div>
        </div>

        <div 
          className={`bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all hover:shadow-lg ${filterStatus === 'dikembalikan' ? 'ring-2 ring-green-500' : ''}`}
          onClick={() => setFilterStatus('dikembalikan')}
        >
          <div className="text-center">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <p className="text-sm text-gray-600 mb-1">Kembali</p>
            <p className="text-2xl font-bold text-green-600">{stats.dikembalikan}</p>
          </div>
        </div>

        <div 
          className={`bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all hover:shadow-lg ${filterStatus === 'rejected' ? 'ring-2 ring-red-500' : ''}`}
          onClick={() => setFilterStatus('rejected')}
        >
          <div className="text-center">
            <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <XCircle className="text-red-600" size={24} />
            </div>
            <p className="text-sm text-gray-600 mb-1">Ditolak</p>
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-center">
            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertCircle className="text-orange-600" size={24} />
            </div>
            <p className="text-sm text-gray-600 mb-1">Terlambat</p>
            <p className="text-2xl font-bold text-orange-600">{stats.terlambat}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari peminjam atau buku..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Peminjam</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Buku</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Tanggal</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Denda</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPeminjaman.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <div className="text-5xl mb-4">🔍</div>
                    <p className="text-xl font-medium">Tidak ada peminjaman ditemukan</p>
                    <p className="text-sm mt-2">Coba ubah filter atau kata kunci pencarian</p>
                  </td>
                </tr>
              ) : (
                filteredPeminjaman.map((p, idx) => (
                  <tr key={p.id} className={`hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-gray-800">{p.nama_lengkap}</p>
                        <p className="text-sm text-gray-500">@{p.username}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {p.sampul_buku ? (
                          <img src={p.sampul_buku} alt={p.buku_judul} className="w-12 h-16 object-cover rounded shadow-md" />
                        ) : (
                          <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">No Img</div>
                        )}
                        <div>
                          <p className="font-bold text-gray-800">{p.buku_judul}</p>
                          <p className="text-sm text-gray-500">{p.buku_penulis}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(p.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={p.status} />
                      {p.hari_terlambat > 0 && (
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
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedPeminjaman(p);
                          setIsModalOpen(true);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all text-sm font-bold shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPeminjaman(null);
        }}
        title="📖 Detail Peminjaman"
      >
        {selectedPeminjaman && (
          <PeminjamanDetail
            peminjaman={selectedPeminjaman}
            onAction={handleAction}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedPeminjaman(null);
            }}
            dendaPerHari={dendaPerHari}
          />
        )}
      </Modal>

      {/* Settings Modal */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="⚙️ Pengaturan Denda"
      >
        <SettingsContent
          onClose={() => setIsSettingsOpen(false)}
          currentDenda={dendaPerHari}
          onSaveSuccess={handleSettingsSave}
        />
      </Modal>

      <style jsx global>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        .animate-scale-in { animation: scale-in 0.2s ease-out; }
        
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}