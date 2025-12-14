'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import { getUser } from '@/lib/client-auth';
import Image from 'next/image';

export default function ManajemenBukuPage() {
  const [activeTab, setActiveTab] = useState('approved');
  const [books, setBooks] = useState([]);
  const [pendingBooks, setPendingBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentBook, setCurrentBook] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('url');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  
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
    genre_id: null,
  });
  
  const [genres, setGenres] = useState([]);
  const [genresLoading, setGenresLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const userData = await getUser();
      setUser(userData);
      console.log('👤 Current user:', userData);
      if (userData) {
        fetchBooks(userData.id);
      }
    }
    loadUser();
    fetchGenres();
  }, []);

  async function fetchGenres() {
    try {
      setGenresLoading(true);
      const data = await apiFetch('/api/staf/genre');
      setGenres(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ Error fetching genres:', err);
      setGenres([]);
    } finally {
      setGenresLoading(false);
    }
  }

  async function fetchBooks(userId) {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ FIX: Send user_id as query parameter
      const allBooksData = await apiFetch(`/api/staf/buku?user_id=${userId}`);
      console.log('📚 All books from API:', allBooksData);
      
      // 🔍 DEBUG: Check data structure
      if (allBooksData.length > 0) {
        console.log('🔍 Sample book structure:', allBooksData[0]);
        console.log('🔍 created_by field:', allBooksData[0].created_by, typeof allBooksData[0].created_by);
        console.log('🔍 userId parameter:', userId, typeof userId);
      }
      
      if (Array.isArray(allBooksData)) {
        // ✅ FIX: Don't filter again! API already returns correct books
        // API query: WHERE b.created_by = userId OR b.status = 'approved'
        console.log(`📖 Books from API (already filtered):`, allBooksData);
        console.log(`📊 Total books: ${allBooksData.length}`);
        
        // Separate by status
        const approved = allBooksData.filter(b => b.status === 'approved');
        const pending = allBooksData.filter(b => b.status === 'pending');
        const rejected = allBooksData.filter(b => b.status === 'rejected');
        
        setBooks(approved);
        setPendingBooks([...pending, ...rejected]);
        
        console.log('✅ Status distribution:');
        console.log('   - Approved:', approved.length);
        console.log('   - Pending:', pending.length);
        console.log('   - Rejected:', rejected.length);
      } else {
        console.warn('⚠️ Unexpected response format:', allBooksData);
        setBooks([]);
        setPendingBooks([]);
      }
    } catch (err) {
      console.error('❌ Error fetching books:', err);
      setError(err.message || 'Failed to fetch books');
      setBooks([]);
      setPendingBooks([]);
    } finally {
      setLoading(false);
    }
  }

  function openAddModal() {
    setModalMode('add');
    setCurrentBook(null);
    setImagePreview(null);
    setFormData({
      judul: '', penulis: '', penerbit: '', tahun_terbit: '', isbn: '',
      jumlah_halaman: '', deskripsi: '', stok_tersedia: 0, stok_total: 0,
      sampul_buku: '', genre_id: null
    });
    setShowModal(true);
  }

  function openEditModal(book) {
    setModalMode('edit');
    setCurrentBook(book);
    setImagePreview(book.sampul_buku || null);
    setFormData({
      judul: book.judul || '', penulis: book.penulis || '', penerbit: book.penerbit || '',
      tahun_terbit: book.tahun_terbit || '', isbn: book.isbn || '', jumlah_halaman: book.jumlah_halaman || '',
      deskripsi: book.deskripsi || '', stok_tersedia: book.stok_tersedia || 0, stok_total: book.stok_total || 0,
      sampul_buku: book.sampul_buku || '', genre_id: book.genre_id || null
    });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setCurrentBook(null);
    setImagePreview(null);
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function openUploadModal() {
    setShowUploadModal(true);
    setImageUrl('');
    setUploadMethod('url');
  }

  function closeUploadModal() {
    setShowUploadModal(false);
    setImageUrl('');
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('❌ File harus berupa gambar!'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('❌ Ukuran file maksimal 5MB!'); return; }
    try {
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setImagePreview(base64);
        setFormData(prev => ({ ...prev, sampul_buku: base64 }));
        closeUploadModal();
      };
      reader.readAsDataURL(file);
    } catch (error) {
      alert('❌ Gagal upload gambar: ' + error.message);
    } finally {
      setUploading(false);
    }
  }

  function handleUrlSubmit() {
    if (!imageUrl.trim()) { 
      alert('❌ URL gambar tidak boleh kosong!'); 
      return; 
    }
    
    try { 
      new URL(imageUrl); 
    } catch { 
      alert('❌ Format URL tidak valid!'); 
      return; 
    }

    if (imageUrl.includes('twitter.com') || imageUrl.includes('x.com')) {
      const confirmTwitter = confirm(
        '⚠️ PERHATIAN!\n\n' +
        'Link Twitter/X tidak bisa digunakan langsung sebagai gambar.\n\n' +
        '📌 Cara yang benar:\n' +
        '1. Buka gambar di Twitter\n' +
        '2. Klik kanan pada gambar\n' +
        '3. Pilih "Copy Image Address" atau "Salin Alamat Gambar"\n' +
        '4. Paste URL yang berakhiran .jpg atau .png\n\n' +
        'Contoh URL yang benar:\n' +
        'https://pbs.twimg.com/media/xxx.jpg\n\n' +
        'Lanjutkan dengan URL ini? (Mungkin tidak akan tampil)'
      );
      if (!confirmTwitter) return;
    }

    if (imageUrl.length > 2000) {
      alert('⚠️ URL terlalu panjang! Maksimal 2000 karakter.\n\nGunakan URL yang lebih pendek atau upload file gambar.');
      return;
    }
    
    setImagePreview(imageUrl);
    setFormData(prev => ({ ...prev, sampul_buku: imageUrl }));
    closeUploadModal();
  }

  function removeImage() {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, sampul_buku: '' }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user || !user.id) { 
      alert('❌ User tidak terdeteksi. Silakan login kembali.'); 
      return; 
    }
    
    if (!formData.judul || !formData.penulis) {
      alert('❌ Judul dan Penulis wajib diisi!');
      return;
    }

    try {
      const payload = { ...formData, user_id: user.id };
      
      console.log('📤 Sending payload:', {
        ...payload,
        sampul_buku: payload.sampul_buku ? `${payload.sampul_buku.substring(0, 50)}... (${payload.sampul_buku.length} chars)` : 'empty'
      });

      if (modalMode === 'add') {
        await apiFetch('/api/staf/buku', { 
          method: 'POST', 
          body: JSON.stringify(payload) 
        });
        alert('✅ Pengajuan buku berhasil dikirim!\n\nBuku Anda akan direview oleh Admin.');
      } else {
        if (!confirm('⚠️ PERHATIAN!\n\nStatus akan kembali menjadi PENDING.\n\nLanjutkan?')) return;
        await apiFetch('/api/staf/buku', { 
          method: 'PUT', 
          body: JSON.stringify({ id: currentBook.id, ...payload }) 
        });
        alert('✅ Buku berhasil diupdate!\n\n⏳ Status: PENDING APPROVAL');
      }
      
      closeModal();
      if (user) fetchBooks(user.id);
    } catch (err) {
      console.error('❌ Submit error:', err);
      alert('❌ Gagal menyimpan buku: ' + err.message);
    }
  }

  async function handleDelete(bookId) {
    if (!confirm('Yakin ingin menghapus buku ini?')) return;
    try {
      await apiFetch(`/api/staf/buku?id=${bookId}&user_id=${user?.id}`, { method: 'DELETE' });
      alert('✅ Buku berhasil dihapus!');
      if (user) fetchBooks(user.id);
    } catch (err) {
      alert('❌ Gagal menghapus buku: ' + err.message);
    }
  }

  async function handleCancelPending(book) {
    if (!confirm('Yakin ingin membatalkan/hapus buku ini?')) return;
    try {
      await apiFetch(`/api/staf/buku?id=${book.id}&user_id=${user?.id}`, { method: 'DELETE' });
      alert('✅ Buku berhasil dihapus');
      if (user) fetchBooks(user.id);
    } catch (err) {
      alert('❌ Gagal menghapus buku: ' + err.message);
    }
  }

  function getStatusBadge(status) {
    const cfg = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⏳', label: 'Menunggu' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', icon: '✅', label: 'Disetujui' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: '❌', label: 'Ditolak' }
    };
    const c = cfg[status] || cfg.pending;
    return <span className={`px-3 py-1 text-xs font-semibold rounded-full ${c.bg} ${c.text}`}>{c.icon} {c.label}</span>;
  }

  if (loading && books.length === 0 && pendingBooks.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">📚 Manajemen Buku</h1>
              <p className="text-gray-600 mt-2">Kelola koleksi buku perpustakaan</p>
              {user && <p className="text-sm text-gray-500 mt-1">👤 {user.nama_lengkap || user.username} (ID: {user.id})</p>}
            </div>
            <button onClick={openAddModal} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2">
              ➕ Ajukan Buku Baru
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            <button onClick={() => setActiveTab('approved')} className={`px-6 py-4 font-semibold ${activeTab === 'approved' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
              ✅ Buku Approved ({books.length})
            </button>
            <button onClick={() => setActiveTab('pending')} className={`px-6 py-4 font-semibold ${activeTab === 'pending' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
              ⏳ Ajuan Saya ({pendingBooks.length})
            </button>
          </div>
        </div>

        {activeTab === 'approved' ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-xl font-bold text-gray-800">Daftar Buku Approved</h2>
            </div>
            {books.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p className="text-xl mb-2">🔭 Tidak ada buku approved</p>
                <p className="text-sm">Ajukan buku baru dan tunggu persetujuan admin</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Sampul</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Judul</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Penulis</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tahun</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Stok</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {books.map((book, idx) => (
                      <tr key={book.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4">
                          {book.sampul_buku ? (
                            <Image src={book.sampul_buku} alt={book.judul} width={60} height={80} className="rounded object-cover" />
                          ) : (
                            <div className="w-[60px] h-[80px] bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">No Image</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="font-semibold">{book.judul}</div>
                          {book.isbn && <div className="text-xs text-gray-500">ISBN: {book.isbn}</div>}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{book.penulis}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{book.tahun_terbit || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="font-semibold text-blue-600">{book.stok_tersedia}</span>
                          <span className="text-gray-500"> / {book.stok_total}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button onClick={() => openEditModal(book)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm mr-2">✏️ Edit</button>
                          <button onClick={() => handleDelete(book.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">🗑️ Hapus</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-xl font-bold text-gray-800">Buku Pending Approval</h2>
              <p className="text-sm text-gray-600 mt-1">Buku yang menunggu persetujuan admin</p>
            </div>
            {pendingBooks.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p className="text-xl mb-2">🔭 Tidak ada buku pending</p>
                <p className="text-sm">Semua buku Anda sudah disetujui atau belum ada pengajuan</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Sampul</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Judul</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Penulis</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Diajukan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingBooks.map((book, idx) => (
                      <tr key={book.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4">
                          {book.sampul_buku ? (
                            <Image src={book.sampul_buku} alt={book.judul} width={60} height={80} className="rounded object-cover" />
                          ) : (
                            <div className="w-[60px] h-[80px] bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">No Image</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="font-semibold">{book.judul}</div>
                          {book.isbn && <div className="text-xs text-gray-500">ISBN: {book.isbn}</div>}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{book.penulis}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(book.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(book.status)}
                          {book.rejection_reason && <div className="text-xs text-red-600 mt-1">Alasan: {book.rejection_reason}</div>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button onClick={() => handleCancelPending(book)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">🗑️ Hapus</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex justify-between items-center rounded-t-2xl">
              <h3 className="text-xl font-bold">{modalMode === 'add' ? '📖 Ajukan Buku Baru' : '✏️ Edit Buku'}</h3>
              <button onClick={closeModal} className="text-white hover:bg-white/20 rounded-full p-2"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sampul Buku</label>
                  {imagePreview ? (
                    <div className="relative group">
                      <Image src={imagePreview} alt="Preview" width={250} height={350} className="w-full h-auto rounded-lg shadow-md object-cover" />
                      <button type="button" onClick={removeImage} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity">🗑️</button>
                    </div>
                  ) : (
                    <button type="button" onClick={openUploadModal} className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-all"><div className="text-5xl mb-2">📷</div><p className="text-sm text-gray-600 font-medium">Klik untuk upload</p></button>
                  )}
                </div>
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Judul *</label>
                      <input type="text" name="judul" value={formData.judul} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Penulis *</label><input type="text" name="penulis" value={formData.penulis} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Penerbit</label><input type="text" name="penerbit" value={formData.penerbit} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Genre</label><select name="genre_id" value={formData.genre_id ?? ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"><option value="" disabled>{genresLoading ? 'Memuat...' : 'Pilih genre'}</option>{genres.map(g => <option key={g.id} value={g.id}>{g.nama_genre}</option>)}</select></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label><input type="number" name="tahun_terbit" value={formData.tahun_terbit} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" min="1900" max="2100" placeholder="2024" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label><input type="text" name="isbn" value={formData.isbn} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Halaman</label><input type="number" name="jumlah_halaman" value={formData.jumlah_halaman} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" min="0" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Stok Tersedia</label><input type="number" name="stok_tersedia" value={formData.stok_tersedia} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Stok Total</label><input type="number" name="stok_total" value={formData.stok_total} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label><textarea name="deskripsi" value={formData.deskripsi} onChange={handleInputChange} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={closeModal} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Batal</button>
                <button onClick={handleSubmit} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">{modalMode === 'add' ? '📖 Ajukan' : '💾 Simpan'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white flex justify-between items-center rounded-t-2xl">
              <h3 className="text-lg font-bold">📷 Upload Sampul</h3>
              <button onClick={closeUploadModal} className="text-white hover:bg-white/20 rounded-full p-1"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="p-6">
              <div className="flex gap-2 mb-4">
                <button onClick={() => setUploadMethod('url')} className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${uploadMethod === 'url' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>🔗 URL</button>
                <button onClick={() => setUploadMethod('file')} className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${uploadMethod === 'file' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>📁 File</button>
              </div>
              {uploadMethod === 'url' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">URL Gambar</label>
                    <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <p className="text-xs text-gray-500 mt-1">Contoh: Google Images, Imgur</p>
                    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs text-yellow-800 font-medium mb-1">⚠️ Link Twitter/X tidak bisa langsung digunakan!</p>
                      <p className="text-xs text-yellow-700">Cara benar: Klik kanan gambar → "Copy Image Address"</p>
                    </div>
                  </div>
                  <button type="button" onClick={handleUrlSubmit} className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors">✅ Gunakan URL</button>
                </div>
              )}
              {uploadMethod === 'file' && (
                <div className="space-y-4">
                  <label className="block">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all">
                      <div className="text-5xl mb-3">📤</div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Klik atau drag & drop</p>
                      <p className="text-xs text-gray-500">JPG, PNG, WEBP (Max 5MB)</p>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                    </div>
                  </label>
                  {uploading && (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Uploading...</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}