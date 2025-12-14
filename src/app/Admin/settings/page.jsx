// src/app/Admin/settings/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, DollarSign, Save, RefreshCw, AlertCircle, CheckCircle, X } from 'lucide-react';

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

  return (
    <div className="fixed top-4 right-4 z-[100] animate-slide-in">
      <div className={`${styles[type]} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px]`}>
        <CheckCircle size={24} />
        <span className="flex-1 font-medium">{message}</span>
        <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default function SettingsPage() {
  const [dendaPerHari, setDendaPerHari] = useState(2000);
  const [originalValue, setOriginalValue] = useState(2000);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings?key=denda_per_hari');
      
      if (response.ok) {
        const data = await response.json();
        const value = parseInt(data.value) || 2000;
        setDendaPerHari(value);
        setOriginalValue(value);
      } else {
        console.log('Using default denda value: 2000');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      showToast('Gagal memuat pengaturan, menggunakan nilai default', 'warning');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (dendaPerHari < 0) {
      showToast('Denda tidak boleh negatif!', 'error');
      return;
    }

    if (dendaPerHari === originalValue) {
      showToast('Tidak ada perubahan untuk disimpan', 'info');
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
        showToast('✅ Pengaturan berhasil disimpan!', 'success');
      } else {
        const error = await response.json();
        showToast(error.message || 'Gagal menyimpan pengaturan', 'error');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      showToast('Gagal menyimpan pengaturan: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setDendaPerHari(originalValue);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
          <SettingsIcon size={40} />
          Pengaturan Sistem
        </h1>
        <p className="text-gray-600">Kelola konfigurasi sistem perpustakaan</p>
      </div>

      {/* Main Settings Card */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-200">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
            <DollarSign size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Denda Keterlambatan</h2>
            <p className="text-sm text-gray-600">Atur besaran denda per hari untuk keterlambatan pengembalian</p>
          </div>
        </div>

        {/* Input Section */}
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

            <div className="mt-3 flex gap-2">
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

          {/* Preview Section */}
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

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Save size={20} />
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
            
            <button
              onClick={handleReset}
              disabled={!hasChanges}
              className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <AlertCircle size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-blue-900 mb-2">ℹ️ Informasi Penting</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Perubahan akan berlaku <strong>segera</strong> untuk semua peminjaman yang terlambat</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Denda dihitung <strong>per hari penuh</strong> keterlambatan</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Sistem akan otomatis menghitung total denda berdasarkan setting ini</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Denda dapat di-<strong>override manual</strong> oleh admin saat pengembalian</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        
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