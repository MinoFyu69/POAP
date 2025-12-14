// D:\Projek Coding\projek_pkl\src\app\Admin\katalog\page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, X, BookOpen, Calendar, Tag, CheckCircle, Clock, XCircle } from 'lucide-react';

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

  return (
    <div className="fixed top-4 right-4 z-[100] animate-slide-in">
      <div className={`${styles[type]} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px]`}>
        <span className="flex-1 font-medium">{message}</span>
        <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1 text-xl">×</button>
      </div>
    </div>
  );
};

const BookCard = ({ book, onViewDetail }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer group">
    <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
      {book.sampul_buku ? (
        <img
          src={book.sampul_buku}
          alt={book.judul}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="280" viewBox="0 0 200 280"%3E%3Crect fill="%23e5e7eb" width="200" height="280"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="sans-serif" font-size="16"%3ENo Cover%3C/text%3E%3C/svg%3E';
          }}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
          <BookOpen size={48} className="text-indigo-400" />
        </div>
      )}
      
      {/* Status Badge */}
      <div className="absolute top-3 right-3">
        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 ${
          book.status === 'approved' ? 'bg-green-500 text-white' :
          book.status === 'pending' ? 'bg-yellow-500 text-white' :
          'bg-red-500 text-white'
        }`}>
          {book.status === 'approved' ? <CheckCircle size={12} /> : 
           book.status === 'pending' ? <Clock size={12} /> : 
           <XCircle size={12} />}
          {book.status === 'approved' ? 'Approved' : 
           book.status === 'pending' ? 'Pending' : 
           'Rejected'}
        </span>
      </div>

      {/* Stock Badge */}
      <div className="absolute bottom-3 left-3">
        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
          book.stok_tersedia > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {book.stok_tersedia > 0 ? `${book.stok_tersedia} tersedia` : 'Habis'}
        </span>
      </div>
    </div>
    
    <div className="p-4" onClick={() => onViewDetail(book)}>
      <h3 className="font-bold text-gray-800 mb-1 line-clamp-2 h-12 group-hover:text-indigo-600 transition-colors">
        {book.judul}
      </h3>
      <p className="text-sm text-indigo-600 font-medium mb-3">{book.penulis}</p>
      
      <div className="flex items-center justify-between text-xs mb-3">
        <span className="flex items-center gap-1 text-gray-500">
          <Calendar size={14} />
          {book.tahun_terbit || 'N/A'}
        </span>
        {book.nama_genre && (
          <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
            {book.nama_genre}
          </span>
        )}
      </div>

      <button
        className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium text-sm shadow-md hover:shadow-lg"
      >
        Lihat Detail
      </button>
    </div>
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-2xl">
          <h2 className="text-2xl font-bold">📖 {title}</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/20 rounded-full transition-colors text-2xl"
          >
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const BookDetail = ({ book }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        {book.sampul_buku ? (
          <img
            src={book.sampul_buku}
            alt={book.judul}
            className="w-full h-96 object-cover rounded-xl shadow-lg"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="320" viewBox="0 0 200 320"%3E%3Crect fill="%23e5e7eb" width="200" height="320"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="sans-serif" font-size="18"%3ENo Cover%3C/text%3E%3C/svg%3E';
            }}
          />
        ) : (
          <div className="w-full h-96 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
            <BookOpen size={64} className="text-indigo-400" />
          </div>
        )}
      </div>

      <div className="md:col-span-2 space-y-4">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{book.judul}</h3>
          <p className="text-indigo-600 font-semibold text-lg">{book.penulis}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 p-3 rounded-lg">
            <span className="text-xs text-gray-500 block mb-1">Penerbit</span>
            <p className="font-semibold text-gray-800">{book.penerbit || '-'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <span className="text-xs text-gray-500 block mb-1">Tahun Terbit</span>
            <p className="font-semibold text-gray-800">{book.tahun_terbit || '-'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 p-3 rounded-lg">
            <span className="text-xs text-gray-500 block mb-1">ISBN</span>
            <p className="font-semibold text-gray-800 text-sm break-all">{book.isbn || '-'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <span className="text-xs text-gray-500 block mb-1">Jumlah Halaman</span>
            <p className="font-semibold text-gray-800">{book.jumlah_halaman || '-'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 p-3 rounded-lg">
            <span className="text-xs text-gray-500 block mb-1">Genre</span>
            <p className="font-semibold text-gray-800">{book.nama_genre || '-'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <span className="text-xs text-gray-500 block mb-1">Ketersediaan</span>
            <p className="font-semibold">
              <span className="text-green-600">{book.stok_tersedia}</span>
              <span className="text-gray-400"> / </span>
              <span className="text-gray-800">{book.stok_total}</span>
            </p>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <span className="text-xs text-blue-600 block mb-2">Status Buku</span>
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
            book.status === 'approved' ? 'bg-green-100 text-green-700' :
            book.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {book.status === 'approved' ? <CheckCircle size={16} /> : 
             book.status === 'pending' ? <Clock size={16} /> : 
             <XCircle size={16} />}
            {book.status === 'approved' ? 'Approved - Tersedia di Katalog' : 
             book.status === 'pending' ? 'Pending - Menunggu Approval' : 
             'Rejected - Tidak Disetujui'}
          </span>
        </div>
      </div>
    </div>

    {book.deskripsi && (
      <div className="bg-gray-50 p-4 rounded-xl">
        <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <Tag size={18} className="text-indigo-600" />
          Deskripsi
        </h4>
        <p className="text-gray-700 text-sm leading-relaxed">{book.deskripsi}</p>
      </div>
    )}

    {book.rejection_reason && book.status === 'rejected' && (
      <div className="bg-red-50 p-4 rounded-xl border border-red-200">
        <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
          <XCircle size={18} />
          Alasan Penolakan
        </h4>
        <p className="text-red-700 text-sm">{book.rejection_reason}</p>
      </div>
    )}
  </div>
);

export default function KatalogBukuPage() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [statusFilter, setStatusFilter] = useState('approved'); // Default: approved
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      
      // ✅ FIX: Gunakan endpoint dengan filter status
      const url = statusFilter === 'all' 
        ? '/api/admin/buku'
        : `/api/admin/buku?status=${statusFilter}`;

      const [booksRes, genresRes] = await Promise.all([
        fetch(url),
        fetch('/api/admin/genre')
      ]);

      const booksData = await booksRes.json();
      const genresData = await genresRes.json();

      console.log('📚 Katalog books data:', booksData);
      console.log('📊 Total books:', booksData?.length);

      const booksArray = Array.isArray(booksData) ? booksData : [];
      const genresArray = Array.isArray(genresData) ? genresData : [];

      // ✅ FIX: Jangan filter lagi, API sudah handle
      setBooks(booksArray);
      setGenres(genresArray);
      
      console.log('✅ Books state updated:', booksArray.length, 'books');
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      showToast('Gagal memuat data: ' + error.message, 'error');
      setBooks([]);
      setGenres([]);
    } finally {
      setLoading(false);
    }
  };

  const years = Array.isArray(books) 
    ? [...new Set(books.map(book => book.tahun_terbit).filter(Boolean))].sort((a, b) => b - a)
    : [];

  const filteredBooks = Array.isArray(books) ? books.filter(book => {
    const matchesSearch = 
      book.judul?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.penulis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.penerbit?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGenre = selectedGenre === 'all' || book.genre_id === Number(selectedGenre);
    const matchesYear = selectedYear === 'all' || book.tahun_terbit === Number(selectedYear);
    
    return matchesSearch && matchesGenre && matchesYear;
  }) : [];

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGenre('all');
    setSelectedYear('all');
    setStatusFilter('approved');
  };

  const activeFilterCount = [
    selectedGenre !== 'all',
    selectedYear !== 'all',
    searchTerm !== '',
    statusFilter !== 'approved'
  ].filter(Boolean).length;

  const stats = {
    total: books.length,
    approved: books.filter(b => b.status === 'approved').length,
    pending: books.filter(b => b.status === 'pending').length,
    rejected: books.filter(b => b.status === 'rejected').length,
    available: books.filter(b => b.stok_tersedia > 0).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat katalog...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          📚 Katalog Buku
        </h1>
        <p className="text-gray-600">Telusuri koleksi lengkap perpustakaan</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-xl shadow-lg p-5">
          <p className="text-xs opacity-90 mb-1">Total Buku</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>

        <div 
          className={`bg-white rounded-xl shadow-md p-5 cursor-pointer transition-all hover:shadow-lg ${statusFilter === 'approved' ? 'ring-2 ring-green-500' : ''}`}
          onClick={() => setStatusFilter('approved')}
        >
          <p className="text-xs text-gray-600 mb-1">Approved</p>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </div>

        <div 
          className={`bg-white rounded-xl shadow-md p-5 cursor-pointer transition-all hover:shadow-lg ${statusFilter === 'pending' ? 'ring-2 ring-yellow-500' : ''}`}
          onClick={() => setStatusFilter('pending')}
        >
          <p className="text-xs text-gray-600 mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>

        <div 
          className={`bg-white rounded-xl shadow-md p-5 cursor-pointer transition-all hover:shadow-lg ${statusFilter === 'rejected' ? 'ring-2 ring-red-500' : ''}`}
          onClick={() => setStatusFilter('rejected')}
        >
          <p className="text-xs text-gray-600 mb-1">Rejected</p>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-xl shadow-lg p-5">
          <p className="text-xs opacity-90 mb-1">Tersedia</p>
          <p className="text-2xl font-bold">{stats.available}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari judul, penulis, atau penerbit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 transition-all font-semibold ${
                showFilters 
                  ? 'bg-indigo-600 text-white border-indigo-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter size={20} />
              Filter
              {activeFilterCount > 0 && (
                <span className="bg-white text-indigo-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="flex flex-col md:flex-row gap-3 pt-3 border-t">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="all">Semua Genre</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>{genre.nama_genre}</option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="all">Semua Tahun</option>
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>

              <button
                onClick={clearFilters}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors font-medium"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-600 font-medium">
          Menampilkan <span className="text-indigo-600 font-bold">{filteredBooks.length}</span> dari <span className="font-bold">{books.length}</span> buku
        </p>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-16 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Tidak Ada Buku Ditemukan</h3>
          <p className="text-gray-600">
            {books.length === 0 
              ? 'Belum ada buku di katalog' 
              : 'Coba ubah kata kunci pencarian atau filter Anda'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onViewDetail={(book) => {
                setSelectedBook(book);
                setIsModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBook(null);
        }}
        title="Detail Buku"
      >
        {selectedBook && <BookDetail book={selectedBook} />}
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