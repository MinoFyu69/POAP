// D:\Projek Coding\projek_pkl\src\app\Admin\manajemen-buku\page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X, Filter, CheckCircle, Clock, XCircle } from 'lucide-react';

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
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
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

const BookForm = ({ book, genres, tags, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    judul: '',
    penulis: '',
    penerbit: '',
    tahun_terbit: '',
    isbn: '',
    jumlah_halaman: '',
    deskripsi: '',
    stok_tersedia: 0,
    stok_total: 0,
    sampul_buku: '',
    genre_id: '',
    tag_ids: []
  });

  useEffect(() => {
    if (book) {
      setFormData({
        judul: book.judul || '',
        penulis: book.penulis || '',
        penerbit: book.penerbit || '',
        tahun_terbit: book.tahun_terbit || '',
        isbn: book.isbn || '',
        jumlah_halaman: book.jumlah_halaman || '',
        deskripsi: book.deskripsi || '',
        stok_tersedia: book.stok_tersedia || 0,
        stok_total: book.stok_total || 0,
        sampul_buku: book.sampul_buku || '',
        genre_id: book.genre_id || '',
        tag_ids: book.tag_ids || []
      });
    }
  }, [book]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Buku *</label>
          <input
            type="text"
            value={formData.judul}
            onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Masukkan judul buku"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Penulis *</label>
          <input
            type="text"
            value={formData.penulis}
            onChange={(e) => setFormData({ ...formData, penulis: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Masukkan nama penulis"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Penerbit</label>
          <input
            type="text"
            value={formData.penerbit || ''}
            onChange={(e) => setFormData({ ...formData, penerbit: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Nama penerbit"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tahun Terbit</label>
          <input
            type="text"
            value={formData.tahun_terbit || ''}
            onChange={(e) => setFormData({ ...formData, tahun_terbit: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="2024"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">ISBN</label>
          <input
            type="text"
            value={formData.isbn || ''}
            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="978-xxx-xxx"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Jumlah Halaman</label>
          <input
            type="number"
            value={formData.jumlah_halaman || ''}
            onChange={(e) => setFormData({ ...formData, jumlah_halaman: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="300"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Genre</label>
        <select
          value={formData.genre_id || ''}
          onChange={(e) => setFormData({ ...formData, genre_id: e.target.value })}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
        >
          <option value="">Pilih Genre</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>{genre.nama_genre}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Stok Tersedia</label>
          <input
            type="number"
            value={formData.stok_tersedia}
            onChange={(e) => setFormData({ ...formData, stok_tersedia: Number(e.target.value) })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Stok Total</label>
          <input
            type="number"
            value={formData.stok_total}
            onChange={(e) => setFormData({ ...formData, stok_total: Number(e.target.value) })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            min="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi</label>
        <textarea
          value={formData.deskripsi || ''}
          onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Deskripsi singkat tentang buku..."
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">URL Sampul Buku</label>
        <input
          type="url"
          value={formData.sampul_buku || ''}
          onChange={(e) => setFormData({ ...formData, sampul_buku: e.target.value })}
          placeholder="https://example.com/cover.jpg"
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        {formData.sampul_buku && (
          <div className="mt-3">
            <img 
              src={formData.sampul_buku} 
              alt="Preview" 
              className="w-32 h-48 object-cover rounded-lg shadow-md"
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          {book ? '💾 Update Buku' : '➕ Tambah Buku'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
        >
          Batal
        </button>
      </div>
    </form>
  );
};

export default function ManajemenBukuPage() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const url = statusFilter === 'all' 
        ? '/api/admin/buku'
        : `/api/admin/buku?status=${statusFilter}`;
      
      const [booksRes, genresRes, tagsRes] = await Promise.all([
        fetch(url),
        fetch('/api/admin/genre'),
        fetch('/api/admin/tags')
      ]);

      const booksData = await booksRes.json();
      const genresData = await genresRes.json();
      const tagsData = await tagsRes.json();

      console.log(`📚 Books fetched (filter: ${statusFilter}):`, booksData.length);

      setBooks(Array.isArray(booksData) ? booksData : []);
      setGenres(Array.isArray(genresData) ? genresData : []);
      setTags(Array.isArray(tagsData) ? tagsData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('Gagal memuat data: ' + error.message, 'error');
      setBooks([]);
      setGenres([]);
      setTags([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const url = '/api/admin/buku';
      const method = editingBook ? 'PUT' : 'POST';
      const body = editingBook ? { ...formData, id: editingBook.id } : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const result = await response.json();

      if (response.ok) {
        showToast(
          editingBook ? '✅ Buku berhasil diupdate!' : '✅ Buku berhasil ditambahkan!',
          'success'
        );
        setIsModalOpen(false);
        setEditingBook(null);
        fetchData();
      } else {
        showToast(result.message || 'Terjadi kesalahan', 'error');
      }
    } catch (error) {
      console.error('Error saving book:', error);
      showToast('Gagal menyimpan buku: ' + error.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('⚠️ Yakin ingin menghapus buku ini?\n\nBuku yang dihapus tidak dapat dikembalikan.')) return;

    try {
      const response = await fetch(`/api/admin/buku?id=${id}`, { method: 'DELETE' });
      const result = await response.json();
      
      if (response.ok) {
        showToast('🗑️ Buku berhasil dihapus!', 'success');
        fetchData();
      } else {
        showToast(result.message || 'Gagal menghapus buku', 'error');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      showToast('Gagal menghapus buku: ' + error.message, 'error');
    }
  };

  const filteredBooks = Array.isArray(books) ? books.filter(book =>
    book.judul?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.penulis?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const stats = {
    all: books.length,
    approved: books.filter(b => b.status === 'approved').length,
    pending: books.filter(b => b.status === 'pending').length,
    rejected: books.filter(b => b.status === 'rejected').length
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
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          📚 Manajemen Buku
        </h1>
        <p className="text-gray-600">Kelola koleksi buku perpustakaan</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className={`bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all hover:shadow-lg ${statusFilter === 'all' ? 'ring-2 ring-indigo-500' : ''}`} onClick={() => setStatusFilter('all')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Buku</p>
              <p className="text-3xl font-bold text-gray-800">{stats.all}</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Filter className="text-indigo-600" size={24} />
            </div>
          </div>
        </div>

        <div className={`bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all hover:shadow-lg ${statusFilter === 'approved' ? 'ring-2 ring-green-500' : ''}`} onClick={() => setStatusFilter('approved')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Approved</p>
              <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className={`bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all hover:shadow-lg ${statusFilter === 'pending' ? 'ring-2 ring-yellow-500' : ''}`} onClick={() => setStatusFilter('pending')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className={`bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all hover:shadow-lg ${statusFilter === 'rejected' ? 'ring-2 ring-red-500' : ''}`} onClick={() => setStatusFilter('rejected')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Rejected</p>
              <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <XCircle className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Add */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari buku atau penulis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            onClick={() => {
              setEditingBook(null);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            <Plus size={20} />
            Tambah Buku
          </button>
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Judul</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Penulis</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Genre</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Tahun</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Stok</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <div className="text-5xl mb-4">📭</div>
                    <p className="text-xl font-medium">Tidak ada buku ditemukan</p>
                    <p className="text-sm mt-2">Coba ubah filter atau kata kunci pencarian</p>
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book, idx) => (
                  <tr key={book.id} className={`hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {book.sampul_buku ? (
                          <img src={book.sampul_buku} alt={book.judul} className="w-12 h-16 object-cover rounded shadow-md" />
                        ) : (
                          <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">No Img</div>
                        )}
                        <div className="font-semibold text-gray-800">{book.judul}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{book.penulis}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                        {book.nama_genre || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{book.tahun_terbit || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-indigo-600">{book.stok_tersedia}</span>
                      <span className="text-gray-400"> / {book.stok_total}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        book.status === 'approved' ? 'bg-green-100 text-green-700' :
                        book.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {book.status === 'approved' ? '✅ Approved' : book.status === 'pending' ? '⏳ Pending' : '❌ Rejected'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => {
                            setEditingBook(book);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBook(null);
        }}
        title={editingBook ? '✏️ Edit Buku' : '➕ Tambah Buku Baru'}
      >
        <BookForm
          book={editingBook}
          genres={genres}
          tags={tags}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingBook(null);
          }}
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
      `}</style>
    </div>
  );
}