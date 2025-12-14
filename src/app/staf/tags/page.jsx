// src\app\staf\tags\page.jsx
'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api-client';

export default function ManajemenGenreTagsPage() {
  const [activeTab, setActiveTab] = useState('genre');
  
  // Genre State
  const [genres, setGenres] = useState([]);
  const [genresLoading, setGenresLoading] = useState(false);
  const [genresError, setGenresError] = useState(null);
  const [showGenreModal, setShowGenreModal] = useState(false);
  const [genreModalMode, setGenreModalMode] = useState('add');
  const [currentGenre, setCurrentGenre] = useState(null);
  const [genreFormData, setGenreFormData] = useState({
    nama_genre: '',
    deskripsi: ''
  });

  // Tags State
  const [tags, setTags] = useState([]);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [tagsError, setTagsError] = useState(null);
  const [showTagModal, setShowTagModal] = useState(false);
  const [tagModalMode, setTagModalMode] = useState('add');
  const [currentTag, setCurrentTag] = useState(null);
  const [tagFormData, setTagFormData] = useState({
    nama_tag: ''
  });

  useEffect(() => {
    fetchGenres();
    fetchTags();
  }, []);

  // ==================== GENRE FUNCTIONS ====================
  async function fetchGenres() {
    try {
      setGenresLoading(true);
      setGenresError(null);
      const data = await apiFetch('/api/staf/genre');
      setGenres(data);
    } catch (err) {
      console.error('❌ Error fetching genres:', err);
      setGenresError(err.message || 'Failed to fetch genres');
    } finally {
      setGenresLoading(false);
    }
  }

  function openAddGenreModal() {
    setGenreModalMode('add');
    setCurrentGenre(null);
    setGenreFormData({ nama_genre: '', deskripsi: '' });
    setShowGenreModal(true);
  }

  function openEditGenreModal(genre) {
    setGenreModalMode('edit');
    setCurrentGenre(genre);
    setGenreFormData({
      nama_genre: genre.nama_genre || '',
      deskripsi: genre.deskripsi || ''
    });
    setShowGenreModal(true);
  }

  function closeGenreModal() {
    setShowGenreModal(false);
    setCurrentGenre(null);
  }

  function handleGenreInputChange(e) {
    const { name, value } = e.target;
    setGenreFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleGenreSubmit(e) {
    e.preventDefault();
    try {
      if (genreModalMode === 'add') {
        await apiFetch('/api/staf/genre', {
          method: 'POST',
          body: JSON.stringify(genreFormData)
        });
        alert('✅ Genre berhasil ditambahkan!');
      } else {
        await apiFetch('/api/staf/genre', {
          method: 'PUT',
          body: JSON.stringify({ id: currentGenre.id, ...genreFormData })
        });
        alert('✅ Genre berhasil diupdate!');
      }
      closeGenreModal();
      fetchGenres();
    } catch (err) {
      console.error('❌ Error saving genre:', err);
      alert('❌ Gagal menyimpan genre: ' + err.message);
    }
  }

  async function handleDeleteGenre(genreId) {
    if (!confirm('Yakin ingin menghapus genre ini?')) return;
    try {
      await apiFetch(`/api/staf/genre?id=${genreId}`, { method: 'DELETE' });
      alert('✅ Genre berhasil dihapus!');
      fetchGenres();
    } catch (err) {
      console.error('❌ Error deleting genre:', err);
      alert('❌ Gagal menghapus genre: ' + err.message);
    }
  }

  // ==================== TAGS FUNCTIONS ====================
  async function fetchTags() {
    try {
      setTagsLoading(true);
      setTagsError(null);
      const data = await apiFetch('/api/staf/tags');
      setTags(data);
    } catch (err) {
      console.error('❌ Error fetching tags:', err);
      setTagsError(err.message || 'Failed to fetch tags');
    } finally {
      setTagsLoading(false);
    }
  }

  function openAddTagModal() {
    setTagModalMode('add');
    setCurrentTag(null);
    setTagFormData({ nama_tag: '' });
    setShowTagModal(true);
  }

  function openEditTagModal(tag) {
    setTagModalMode('edit');
    setCurrentTag(tag);
    setTagFormData({ nama_tag: tag.nama_tag || '' });
    setShowTagModal(true);
  }

  function closeTagModal() {
    setShowTagModal(false);
    setCurrentTag(null);
  }

  function handleTagInputChange(e) {
    const { name, value } = e.target;
    setTagFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleTagSubmit(e) {
    e.preventDefault();
    try {
      if (tagModalMode === 'add') {
        await apiFetch('/api/staf/tags', {
          method: 'POST',
          body: JSON.stringify(tagFormData)
        });
        alert('✅ Tag berhasil ditambahkan!');
      } else {
        await apiFetch('/api/staf/tags', {
          method: 'PUT',
          body: JSON.stringify({ id: currentTag.id, ...tagFormData })
        });
        alert('✅ Tag berhasil diupdate!');
      }
      closeTagModal();
      fetchTags();
    } catch (err) {
      console.error('❌ Error saving tag:', err);
      alert('❌ Gagal menyimpan tag: ' + err.message);
    }
  }

  async function handleDeleteTag(tagId) {
    if (!confirm('Yakin ingin menghapus tag ini?')) return;
    try {
      await apiFetch(`/api/staf/tags?id=${tagId}`, { method: 'DELETE' });
      alert('✅ Tag berhasil dihapus!');
      fetchTags();
    } catch (err) {
      console.error('❌ Error deleting tag:', err);
      alert('❌ Gagal menghapus tag: ' + err.message);
    }
  }

  const isLoading = genresLoading || tagsLoading;

  if (isLoading && genres.length === 0 && tags.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">🏷️ Manajemen Genre & Tags</h1>
              <p className="text-gray-600 mt-2">Kelola kategori dan label buku perpustakaan</p>
            </div>
            <button
              onClick={activeTab === 'genre' ? openAddGenreModal : openAddTagModal}
              className={`${
                activeTab === 'genre' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-green-600 hover:bg-green-700'
              } text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors`}
            >
              ➕ Tambah {activeTab === 'genre' ? 'Genre' : 'Tag'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('genre')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'genre'
                  ? 'border-b-2 border-purple-600 text-purple-600 bg-purple-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              📚 Genre ({genres.length})
            </button>
            <button
              onClick={() => setActiveTab('tags')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'tags'
                  ? 'border-b-2 border-green-600 text-green-600 bg-green-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              🏷️ Tags ({tags.length})
            </button>
          </div>
        </div>

        {/* Stats Card */}
        <div className={`bg-gradient-to-r ${
          activeTab === 'genre' 
            ? 'from-purple-500 to-purple-600' 
            : 'from-green-500 to-teal-600'
        } text-white rounded-lg shadow p-6 mb-6 transition-all`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">
                Total {activeTab === 'genre' ? 'Genre' : 'Tags'}
              </h3>
              <p className="text-4xl font-bold">
                {activeTab === 'genre' ? genres.length : tags.length}
              </p>
            </div>
            <div className="text-6xl">{activeTab === 'genre' ? '📚' : '🏷️'}</div>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'genre' ? (
          /* GENRE CONTENT */
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-xl font-bold text-gray-800">Daftar Genre</h2>
            </div>
            
            {genresError && (
              <div className="p-4 bg-red-50 border-b border-red-200">
                <p className="text-red-700">❌ {genresError}</p>
              </div>
            )}

            {genres.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p className="text-xl mb-2">🔭 Tidak ada genre</p>
                <p className="text-sm">Klik tombol "Tambah Genre" untuk menambahkan genre baru</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                {genres.map((genre) => (
                  <div 
                    key={genre.id} 
                    className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-5 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                          🏷️ {genre.nama_genre}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {genre.deskripsi || 'Tidak ada deskripsi'}
                        </p>
                      </div>
                      <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded">
                        ID: {genre.id}
                      </span>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => openEditGenreModal(genre)}
                        className="flex-1 bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 text-sm font-semibold"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteGenre(genre.id)}
                        className="flex-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-sm font-semibold"
                      >
                        🗑️ Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Info Card */}
            <div className="m-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">💡</div>
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Tips Manajemen Genre:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Genre membantu pengguna menemukan buku dengan mudah</li>
                    <li>Gunakan nama genre yang jelas dan mudah dipahami</li>
                    <li>Hapus genre hanya jika tidak ada buku yang menggunakannya</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* TAGS CONTENT */
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-xl font-bold text-gray-800">Daftar Tags</h2>
              <p className="text-sm text-gray-600 mt-1">Tags untuk memberikan label tambahan pada buku</p>
            </div>
            
            {tagsError && (
              <div className="p-4 bg-red-50 border-b border-red-200">
                <p className="text-red-700">❌ {tagsError}</p>
              </div>
            )}

            {tags.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p className="text-xl mb-2">🔭 Tidak ada tags</p>
                <p className="text-sm">Klik tombol "Tambah Tag" untuk menambahkan tag baru</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-6">
                {tags.map((tag) => (
                  <div 
                    key={tag.id} 
                    className="bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200 rounded-lg p-4 hover:shadow-md transition-all hover:border-green-400"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-2xl flex-shrink-0">🏷️</span>
                        <span className="font-bold text-gray-800 truncate">
                          {tag.nama_tag}
                        </span>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded flex-shrink-0">
                        #{tag.id}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditTagModal(tag)}
                        className="flex-1 bg-yellow-500 text-white px-2 py-1.5 rounded hover:bg-yellow-600 text-xs font-semibold"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTag(tag.id)}
                        className="flex-1 bg-red-500 text-white px-2 py-1.5 rounded hover:bg-red-600 text-xs font-semibold"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Popular Tags Examples */}
            <div className="m-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">💡</div>
                <div className="text-sm text-green-800">
                  <p className="font-semibold mb-2">Contoh Tags yang Umum Digunakan:</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">Best Seller</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">Buku Baru</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">Rekomendasi</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">Klasik</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">Populer</span>
                  </div>
                  <p className="mt-3 text-xs">
                    <strong>Tips:</strong> Tags membantu pengguna filter buku. Hapus tag hanya jika tidak ada buku yang menggunakannya.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Genre Modal */}
      {showGenreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 bg-purple-600 text-white flex justify-between items-center rounded-t-lg">
              <h3 className="text-xl font-bold">
                {genreModalMode === 'add' ? '➕ Tambah Genre Baru' : '✏️ Edit Genre'}
              </h3>
              <button onClick={closeGenreModal} className="text-white hover:text-gray-200 text-2xl">×</button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Genre *</label>
                  <input
                    type="text"
                    name="nama_genre"
                    value={genreFormData.nama_genre}
                    onChange={handleGenreInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Contoh: Fiksi, Non-Fiksi, Sains"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <textarea
                    name="deskripsi"
                    value={genreFormData.deskripsi}
                    onChange={handleGenreInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Deskripsi singkat tentang genre ini"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={closeGenreModal} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                  Batal
                </button>
                <button onClick={handleGenreSubmit} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  {genreModalMode === 'add' ? '➕ Tambah' : '💾 Simpan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tag Modal */}
      {showTagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 bg-green-600 text-white flex justify-between items-center rounded-t-lg">
              <h3 className="text-xl font-bold">
                {tagModalMode === 'add' ? '➕ Tambah Tag Baru' : '✏️ Edit Tag'}
              </h3>
              <button onClick={closeTagModal} className="text-white hover:text-gray-200 text-2xl">×</button>
            </div>
            
            <div className="p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Tag *</label>
                <input
                  type="text"
                  name="nama_tag"
                  value={tagFormData.nama_tag}
                  onChange={handleTagInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Contoh: Best Seller, Buku Baru"
                />
                <p className="mt-1 text-xs text-gray-500">Gunakan nama tag yang singkat dan jelas</p>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={closeTagModal} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                  Batal
                </button>
                <button onClick={handleTagSubmit} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  {tagModalMode === 'add' ? '➕ Tambah' : '💾 Simpan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}