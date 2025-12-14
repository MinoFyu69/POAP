// D:\Projek Coding\projek_pkl\src\app\Admin\approval\page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Eye, X, AlertCircle } from 'lucide-react';

// Toast Component
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-green-500 border-green-600',
    error: 'bg-red-500 border-red-600',
    warning: 'bg-yellow-500 border-yellow-600',
    info: 'bg-blue-500 border-blue-600'
  };

  const icons = {
    success: <CheckCircle size={24} />,
    error: <XCircle size={24} />,
    warning: <AlertCircle size={24} />,
    info: <AlertCircle size={24} />
  };

  return (
    <div className="fixed top-4 right-4 z-[100] animate-slide-in">
      <div className={`${styles[type]} text-white px-6 py-4 rounded-lg shadow-2xl border-2 flex items-center gap-3 min-w-[300px] max-w-md`}>
        {icons[type]}
        <span className="flex-1 font-medium">{message}</span>
        <button
          onClick={onClose}
          className="hover:bg-white/20 rounded-full p-1 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

// Modal Component with Blur Background
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred Background Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Content */}
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

const BookDetailView = ({ book, onApprove, onReject, onClose }) => {
  const [catatan, setCatatan] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleApprove = async () => {
    setProcessing(true);
    await onApprove(book.id, catatan);
    setProcessing(false);
  };

  const handleReject = async () => {
    if (!catatan.trim()) {
      alert('Mohon berikan catatan alasan penolakan');
      return;
    }
    setProcessing(true);
    await onReject(book.id, catatan);
    setProcessing(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {book.sampul_buku ? (
            <img
              src={book.sampul_buku}
              alt={book.judul}
              className="w-full h-80 object-cover rounded-xl shadow-lg"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300"%3E%3Crect fill="%23ddd" width="200" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="18"%3ENo Image%3C/text%3E%3C/svg%3E';
              }}
            />
          ) : (
            <div className="w-full h-80 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-gray-500 text-lg">Tidak ada sampul</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl">
            <h3 className="text-2xl font-bold text-gray-800">{book.judul}</h3>
            <p className="text-indigo-600 font-medium mt-1">{book.penulis}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-xs text-gray-500 block mb-1">Penerbit</span>
              <p className="font-semibold text-gray-800 text-sm">{book.penerbit || '-'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-xs text-gray-500 block mb-1">Tahun Terbit</span>
              <p className="font-semibold text-gray-800 text-sm">{book.tahun_terbit || '-'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-xs text-gray-500 block mb-1">ISBN</span>
              <p className="font-semibold text-gray-800 text-sm">{book.isbn || '-'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-xs text-gray-500 block mb-1">Halaman</span>
              <p className="font-semibold text-gray-800 text-sm">{book.jumlah_halaman || '-'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-xs text-gray-500 block mb-1">Genre</span>
              <p className="font-semibold text-gray-800 text-sm">{book.nama_genre || '-'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-xs text-gray-500 block mb-1">Stok</span>
              <p className="font-semibold text-gray-800 text-sm">{book.stok_total || 0}</p>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <span className="text-xs text-blue-600 block mb-1">Diajukan oleh</span>
            <p className="font-semibold text-blue-800 text-sm">{book.created_by_name || book.created_by_username || '-'}</p>
          </div>
        </div>
      </div>

      {book.deskripsi && (
        <div className="bg-gray-50 p-4 rounded-xl">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <span className="text-indigo-600">📖</span>
            Deskripsi
          </h4>
          <p className="text-gray-700 text-sm leading-relaxed">{book.deskripsi}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          💬 Catatan Admin <span className="text-red-500">(wajib untuk reject)</span>
        </label>
        <textarea
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
          rows={3}
          placeholder="Tambahkan catatan atau alasan penolakan..."
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={handleApprove}
          disabled={processing}
          className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <CheckCircle size={22} />
          {processing ? 'Processing...' : 'Approve & Tambahkan ke Katalog'}
        </button>
        <button
          onClick={handleReject}
          disabled={processing}
          className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <XCircle size={22} />
          {processing ? 'Processing...' : 'Reject'}
        </button>
      </div>
    </div>
  );
};

export default function ApprovalBukuPage() {
  const [pendingBooks, setPendingBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    fetchPendingBooks();
  }, []);

  const fetchPendingBooks = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/admin/approve');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📚 Pending books data:', data);
      
      setPendingBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('❌ Error fetching pending books:', error);
      setPendingBooks([]);
      showToast('Gagal memuat data buku pending: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookId, catatan) => {
    try {
      console.log('📤 Approving book:', { bookId, catatan });
      
      const response = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: bookId,
          action: 'approve',
          rejection_reason: catatan || null
        })
      });

      const result = await response.json();
      console.log('📥 Approve response:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Gagal approve buku');
      }

      showToast('✅ Buku berhasil disetujui dan ditambahkan ke katalog!', 'success');
      setIsModalOpen(false);
      setSelectedBook(null);
      fetchPendingBooks();
    } catch (error) {
      console.error('❌ Error approving book:', error);
      showToast('Gagal approve buku: ' + error.message, 'error');
    }
  };

  const handleReject = async (bookId, catatan) => {
    try {
      console.log('📤 Rejecting book:', { bookId, catatan });
      
      const response = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: bookId,
          action: 'reject',
          rejection_reason: catatan
        })
      });

      const result = await response.json();
      console.log('📥 Reject response:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Gagal reject buku');
      }

      showToast('❌ Buku berhasil ditolak dengan alasan: ' + catatan, 'warning');
      setIsModalOpen(false);
      setSelectedBook(null);
      fetchPendingBooks();
    } catch (error) {
      console.error('❌ Error rejecting book:', error);
      showToast('Gagal reject buku: ' + error.message, 'error');
    }
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
    <div>
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          📋 Approval Buku
        </h1>
        <p className="text-gray-600">Review dan setujui penambahan buku dari staf perpustakaan</p>
      </div>

      {pendingBooks.length === 0 ? (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-16 text-center border border-gray-200">
          <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock size={48} className="text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Tidak Ada Buku Menunggu Approval</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Semua pengajuan buku telah diproses. Cek kembali nanti untuk review buku baru dari staf.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingBooks.map((book) => (
            <div 
              key={book.id} 
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-200 transform hover:scale-[1.02]"
            >
              {book.sampul_buku ? (
                <img
                  src={book.sampul_buku}
                  alt={book.judul}
                  className="w-full h-56 object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
              ) : (
                <div className="w-full h-56 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-gray-500 font-medium">Tidak ada sampul</span>
                </div>
              )}
              
              <div className="p-5">
                <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 text-lg">{book.judul}</h3>
                <p className="text-sm text-indigo-600 font-medium mb-2">{book.penulis}</p>
                <p className="text-xs text-gray-500 mb-4">
                  {book.penerbit} • {book.tahun_terbit || 'N/A'}
                </p>

                <div className="flex items-center justify-between text-xs mb-4">
                  <span className="flex items-center gap-1 text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                    <Clock size={14} />
                    {new Date(book.created_at).toLocaleDateString('id-ID')}
                  </span>
                  <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-3 py-1.5 rounded-full font-semibold shadow-md">
                    ⏳ Pending
                  </span>
                </div>

                <button
                  onClick={() => {
                    setSelectedBook(book);
                    setIsModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Eye size={18} />
                  Review Buku
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBook(null);
        }}
        title="🔍 Review Buku"
      >
        {selectedBook && (
          <BookDetailView
            book={selectedBook}
            onApprove={handleApprove}
            onReject={handleReject}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedBook(null);
            }}
          />
        )}
      </Modal>

      <style jsx global>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}