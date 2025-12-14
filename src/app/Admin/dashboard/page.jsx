// D:\Projek Coding\projek_pkl\src\app\Admin\dashboard\page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Clock, CheckCircle, TrendingUp, AlertCircle, XCircle, Archive } from 'lucide-react';

const DashboardCard = ({ title, value, icon: Icon, color, trend, loading }) => (
  <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      {trend && (
        <div className="flex items-center text-green-600 text-sm font-medium">
          <TrendingUp size={16} className="mr-1" />
          {trend}
        </div>
      )}
    </div>
    <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
    {loading ? (
      <div className="h-9 w-20 bg-gray-200 animate-pulse rounded"></div>
    ) : (
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    )}
  </div>
);

const RecentActivity = ({ activities, loading }) => (
  <div className="bg-white rounded-xl shadow-md p-6">
    <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Aktivitas Terbaru</h3>
    <div className="space-y-3">
      {loading ? (
        // Loading skeleton
        Array(4).fill(0).map((_, i) => (
          <div key={i} className="flex items-start gap-3 p-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
            </div>
          </div>
        ))
      ) : activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Archive size={48} className="mx-auto mb-2 text-gray-300" />
          <p>Belum ada aktivitas</p>
        </div>
      ) : (
        activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className={`p-2 rounded-full ${activity.color}`}>
              <activity.icon size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{activity.title}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

const PendingApprovals = ({ approvals, loading }) => (
  <div className="bg-white rounded-xl shadow-md p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-bold text-gray-800">⏳ Menunggu Approval</h3>
      <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full">
        {loading ? '...' : approvals.length}
      </span>
    </div>
    <div className="space-y-3">
      {loading ? (
        // Loading skeleton
        Array(3).fill(0).map((_, i) => (
          <div key={i} className="p-3 bg-gray-100 rounded-lg animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))
      ) : approvals.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <CheckCircle size={48} className="mx-auto mb-2 text-green-300" />
          <p className="font-medium">Semua sudah diapprove! 🎉</p>
        </div>
      ) : (
        approvals.map((approval, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{approval.judul}</p>
              <p className="text-xs text-gray-500">
                {approval.penulis} • Diajukan {new Date(approval.created_at).toLocaleDateString('id-ID')}
              </p>
            </div>
            <AlertCircle size={20} className="text-amber-600" />
          </div>
        ))
      )}
    </div>
    {!loading && approvals.length > 0 && (
      <button 
        onClick={() => window.location.href = '/admin/approval-buku'}
        className="w-full mt-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-md hover:shadow-lg"
      >
        Lihat Semua
      </button>
    )}
  </div>
);

const PeminjamanStats = ({ stats, loading }) => (
  <div className="bg-white rounded-xl shadow-md p-6">
    <h3 className="text-lg font-bold text-gray-800 mb-4">📚 Status Peminjaman</h3>
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="text-yellow-600" size={20} />
          <span className="text-xs font-medium text-yellow-700">Pending</span>
        </div>
        {loading ? (
          <div className="h-8 w-12 bg-yellow-200 animate-pulse rounded"></div>
        ) : (
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        )}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="text-blue-600" size={20} />
          <span className="text-xs font-medium text-blue-700">Dipinjam</span>
        </div>
        {loading ? (
          <div className="h-8 w-12 bg-blue-200 animate-pulse rounded"></div>
        ) : (
          <p className="text-2xl font-bold text-blue-600">{stats.dipinjam}</p>
        )}
      </div>

      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="text-red-600" size={20} />
          <span className="text-xs font-medium text-red-700">Terlambat</span>
        </div>
        {loading ? (
          <div className="h-8 w-12 bg-red-200 animate-pulse rounded"></div>
        ) : (
          <p className="text-2xl font-bold text-red-600">{stats.terlambat}</p>
        )}
      </div>

      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="text-green-600" size={20} />
          <span className="text-xs font-medium text-green-700">Kembali</span>
        </div>
        {loading ? (
          <div className="h-8 w-12 bg-green-200 animate-pulse rounded"></div>
        ) : (
          <p className="text-2xl font-bold text-green-600">{stats.dikembalikan}</p>
        )}
      </div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    activeBorrowings: 0,
    pendingApprovals: 0
  });
  
  const [peminjamanStats, setPeminjamanStats] = useState({
    pending: 0,
    dipinjam: 0,
    dikembalikan: 0,
    terlambat: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch semua data secara parallel
      const [booksRes, usersRes, peminjamanRes, approvalsRes] = await Promise.all([
        fetch('/api/admin/buku'),
        fetch('/api/admin/users'),
        fetch('/api/peminjaman'),
        fetch('/api/admin/buku?status=pending')
      ]);

      const books = await booksRes.json();
      const users = await usersRes.json();
      const peminjaman = await peminjamanRes.json();
      const approvals = await approvalsRes.json();

      // Hitung stats
      const booksArray = Array.isArray(books) ? books : [];
      const usersArray = Array.isArray(users) ? users : [];
      const peminjamanArray = Array.isArray(peminjaman) ? peminjaman : [];
      const approvalsArray = Array.isArray(approvals) ? approvals : [];

      setStats({
        totalBooks: booksArray.length,
        totalUsers: usersArray.length,
        activeBorrowings: peminjamanArray.filter(p => p.status === 'dipinjam').length,
        pendingApprovals: approvalsArray.length
      });

      // Stats peminjaman detail
      setPeminjamanStats({
        pending: peminjamanArray.filter(p => p.status === 'pending').length,
        dipinjam: peminjamanArray.filter(p => p.status === 'dipinjam').length,
        dikembalikan: peminjamanArray.filter(p => p.status === 'dikembalikan').length,
        terlambat: peminjamanArray.filter(p => p.hari_terlambat > 0 && p.status === 'dipinjam').length
      });

      // Pending approvals untuk ditampilkan
      setPendingApprovals(approvalsArray.slice(0, 5)); // Ambil 5 teratas

      // Generate recent activities dari peminjaman terbaru
      const activities = generateActivities(peminjamanArray, booksArray, usersArray);
      setRecentActivities(activities);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const generateActivities = (peminjaman, books, users) => {
    const activities = [];
    
    // Sort peminjaman by updated_at or created_at
    const sortedPeminjaman = [...peminjaman].sort((a, b) => {
      const dateA = new Date(a.updated_at || a.created_at);
      const dateB = new Date(b.updated_at || b.created_at);
      return dateB - dateA;
    });

    // Ambil 5 aktivitas terbaru
    sortedPeminjaman.slice(0, 5).forEach(p => {
      let activity = null;

      if (p.status === 'dikembalikan') {
        activity = {
          icon: CheckCircle,
          title: `Buku "${p.buku_judul}" dikembalikan oleh ${p.nama_lengkap}`,
          time: formatTimeAgo(p.updated_at || p.created_at),
          color: 'bg-green-500'
        };
      } else if (p.status === 'dipinjam') {
        activity = {
          icon: BookOpen,
          title: `"${p.buku_judul}" dipinjam oleh ${p.nama_lengkap}`,
          time: formatTimeAgo(p.tanggal_pinjam || p.created_at),
          color: 'bg-blue-500'
        };
      } else if (p.status === 'pending') {
        activity = {
          icon: Clock,
          title: `${p.nama_lengkap} mengajukan peminjaman "${p.buku_judul}"`,
          time: formatTimeAgo(p.created_at),
          color: 'bg-orange-500'
        };
      } else if (p.status === 'rejected') {
        activity = {
          icon: XCircle,
          title: `Peminjaman "${p.buku_judul}" ditolak`,
          time: formatTimeAgo(p.updated_at || p.created_at),
          color: 'bg-red-500'
        };
      }

      if (activity) activities.push(activity);
    });

    // Tambah aktivitas user baru jika ada
    if (users && users.length > 0) {
      const recentUser = users[users.length - 1];
      activities.push({
        icon: Users,
        title: `Member baru "${recentUser.nama_lengkap}" terdaftar`,
        time: formatTimeAgo(recentUser.created_at),
        color: 'bg-purple-500'
      });
    }

    return activities.slice(0, 5);
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Baru saja';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          🏠 Dashboard
        </h1>
        <p className="text-gray-600">Ringkasan aktivitas perpustakaan</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total Buku"
          value={stats.totalBooks}
          icon={BookOpen}
          color="bg-blue-500"
          loading={loading}
        />
        <DashboardCard
          title="Total User"
          value={stats.totalUsers}
          icon={Users}
          color="bg-green-500"
          loading={loading}
        />
        <DashboardCard
          title="Sedang Dipinjam"
          value={stats.activeBorrowings}
          icon={Clock}
          color="bg-orange-500"
          loading={loading}
        />
        <DashboardCard
          title="Menunggu Approval"
          value={stats.pendingApprovals}
          icon={AlertCircle}
          color="bg-red-500"
          loading={loading}
        />
      </div>

      {/* Activity, Approvals, and Peminjaman Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentActivity activities={recentActivities} loading={loading} />
        <PendingApprovals approvals={pendingApprovals} loading={loading} />
        <PeminjamanStats stats={peminjamanStats} loading={loading} />
      </div>
    </div>
  );
}