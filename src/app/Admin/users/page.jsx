// D:\Projek Coding\projek_pkl\src\app\Admin\users\page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X, User, Users, UserCheck, UserX, Shield } from 'lucide-react';

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

const UserForm = ({ user, roles, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(user || {
    username: '',
    email: '',
    password: '',
    nama_lengkap: '',
    role_id: 2,
    is_active: true
  });

  const filteredRoles = roles.filter(role => role.id !== 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Username *</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
        <input
          type="text"
          value={formData.nama_lengkap || ''}
          onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {!user && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Password *</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
        <select
          value={formData.role_id}
          onChange={(e) => setFormData({ ...formData, role_id: Number(e.target.value) })}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
        >
          {filteredRoles.map((role) => (
            <option key={role.id} value={role.id}>{role.nama_role}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
        <input
          type="checkbox"
          checked={formData.is_active}
          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
        />
        <label className="text-sm font-semibold text-gray-700">Akun Aktif</label>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          {user ? '💾 Update User' : '➕ Tambah User'}
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

const RoleBadge = ({ roleId }) => {
  const roleConfig = {
    1: { color: 'bg-gray-100 text-gray-700', icon: '👤', name: 'Visitor' },
    2: { color: 'bg-blue-100 text-blue-700', icon: '📚', name: 'Member' },
    3: { color: 'bg-purple-100 text-purple-700', icon: '📝', name: 'Staf' },
    4: { color: 'bg-red-100 text-red-700', icon: '👑', name: 'Admin' }
  };
  
  const config = roleConfig[roleId] || roleConfig[1];

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
      <span>{config.icon}</span>
      {config.name}
    </span>
  );
};

export default function ManajemenUsersPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rolesRes, usersRes] = await Promise.all([
        fetch('/api/admin/roles'),
        fetch('/api/admin/users')
      ]);

      const rolesData = await rolesRes.json();
      const usersData = await usersRes.json();
      
      console.log('📊 Users data:', usersData);
      
      setRoles(Array.isArray(rolesData) ? rolesData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      showToast('Gagal memuat data: ' + error.message, 'error');
      setUsers([]);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const url = '/api/admin/users';
      const method = editingUser ? 'PUT' : 'POST';
      const body = editingUser ? { ...formData, id: editingUser.id } : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const result = await response.json();

      if (response.ok) {
        showToast(
          editingUser ? '✅ User berhasil diupdate!' : '✅ User berhasil ditambahkan!',
          'success'
        );
        setIsModalOpen(false);
        setEditingUser(null);
        fetchData();
      } else {
        showToast(result.message || 'Terjadi kesalahan', 'error');
      }
    } catch (error) {
      console.error('❌ Error saving user:', error);
      showToast('Gagal menyimpan user: ' + error.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('⚠️ Yakin ingin menghapus user ini?\n\nData user akan dihapus permanen.')) return;

    try {
      const response = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
      const result = await response.json();
      
      if (response.ok) {
        showToast('🗑️ User berhasil dihapus!', 'success');
        fetchData();
      } else {
        showToast(result.message || 'Gagal menghapus user', 'error');
      }
    } catch (error) {
      console.error('❌ Error deleting user:', error);
      showToast('Gagal menghapus user: ' + error.message, 'error');
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, is_active: !currentStatus })
      });

      if (response.ok) {
        showToast(
          !currentStatus ? '✅ User diaktifkan!' : '⏸️ User dinonaktifkan!',
          'success'
        );
        fetchData();
      }
    } catch (error) {
      console.error('❌ Error toggling user status:', error);
      showToast('Gagal mengubah status user', 'error');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.nama_lengkap?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role_id === Number(filterRole);
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && user.is_active) ||
      (filterStatus === 'inactive' && !user.is_active);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.is_active).length,
    inactive: users.filter(u => !u.is_active).length,
    members: users.filter(u => u.role_id === 2).length,
    staff: users.filter(u => u.role_id === 3).length,
    admins: users.filter(u => u.role_id === 4).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat data users...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          👥 Manajemen User
        </h1>
        <p className="text-gray-600">Kelola akun pengguna perpustakaan</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-xl shadow-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs opacity-90 mb-1">Total Users</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <Users size={32} className="opacity-80" />
          </div>
        </div>

        <div 
          className={`bg-white rounded-xl shadow-md p-5 cursor-pointer transition-all hover:shadow-lg ${filterStatus === 'active' ? 'ring-2 ring-green-500' : ''}`}
          onClick={() => setFilterStatus(filterStatus === 'active' ? 'all' : 'active')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Aktif</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <UserCheck size={28} className="text-green-500" />
          </div>
        </div>

        <div 
          className={`bg-white rounded-xl shadow-md p-5 cursor-pointer transition-all hover:shadow-lg ${filterStatus === 'inactive' ? 'ring-2 ring-gray-500' : ''}`}
          onClick={() => setFilterStatus(filterStatus === 'inactive' ? 'all' : 'inactive')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Nonaktif</p>
              <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
            </div>
            <UserX size={28} className="text-gray-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl shadow-lg p-5">
          <p className="text-xs opacity-90 mb-1">Member</p>
          <p className="text-2xl font-bold">{stats.members}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl shadow-lg p-5">
          <p className="text-xs opacity-90 mb-1">Staf</p>
          <p className="text-2xl font-bold">{stats.staff}</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-xl shadow-lg p-5">
          <p className="text-xs opacity-90 mb-1">Admin</p>
          <p className="text-2xl font-bold">{stats.admins}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari username, email, atau nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          >
            <option value="all">Semua Role</option>
            {roles.filter(role => role.id !== 1).map((role) => (
              <option key={role.id} value={role.id}>{role.nama_role}</option>
            ))}
          </select>
          <button
            onClick={() => {
              setEditingUser(null);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            <Plus size={20} />
            Tambah User
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-600 font-medium">
          Menampilkan <span className="text-indigo-600 font-bold">{filteredUsers.length}</span> dari <span className="font-bold">{users.length}</span> users
        </p>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">User</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Email</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Role</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <div className="text-5xl mb-4">👤</div>
                    <p className="text-xl font-medium">Tidak ada user ditemukan</p>
                    <p className="text-sm mt-2">Coba ubah filter atau kata kunci pencarian</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, idx) => (
                  <tr key={user.id} className={`hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center shadow-md">
                          <User size={24} className="text-indigo-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{user.username}</div>
                          <div className="text-sm text-gray-500">{user.nama_lengkap || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <RoleBadge roleId={user.role_id} />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleUserStatus(user.id, user.is_active)}
                        className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                          user.is_active
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {user.is_active ? '✅ Aktif' : '⏸️ Nonaktif'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
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
          setEditingUser(null);
        }}
        title={editingUser ? '✏️ Edit User' : '➕ Tambah User Baru'}
      >
        <UserForm
          user={editingUser}
          roles={roles}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingUser(null);
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