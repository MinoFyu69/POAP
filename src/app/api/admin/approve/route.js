// src/app/api/admin/approve/route.js
import { NextResponse } from 'next/server';
import { getDb, initDb } from '@/lib/db';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'
);

const ROLES = {
  STAF: 3,
  ADMIN: 4
};

// Helper: Get user from token
async function getUserFromRequest(req) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return null;
    
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.id,
      username: payload.username,
      role_id: payload.role_id
    };
  } catch (error) {
    console.error('❌ Token verification failed:', error);
    return null;
  }
}

// GET - Ambil buku yang menunggu approval (status = pending)
export async function GET(req) {
  try {
    const user = await getUserFromRequest(req);
    
    if (!user || ![ROLES.STAF, ROLES.ADMIN].includes(user.role_id)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await initDb();
    const db = getDb();

    // Query buku dengan status pending
    const query = `
      SELECT 
        b.*,
        g.nama_genre,
        u.username as created_by_username,
        u.nama_lengkap as created_by_name
      FROM buku b
      LEFT JOIN genre g ON b.genre_id = g.id
      LEFT JOIN users u ON b.created_by = u.id
      WHERE b.status = 'pending'
      ORDER BY b.created_at DESC
    `;

    const result = await db.query(query);

    console.log('✅ Pending books for approval:', result.rows.length);
    return NextResponse.json(result.rows);
    
  } catch (error) {
    console.error('❌ Error fetching pending books:', error);
    return NextResponse.json({ 
      message: 'Failed to fetch pending books', 
      error: error.message 
    }, { status: 500 });
  }
}

// POST - Approve atau Reject buku
export async function POST(req) {
  try {
    const user = await getUserFromRequest(req);
    
    if (!user || ![ROLES.STAF, ROLES.ADMIN].includes(user.role_id)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await initDb();
    const db = getDb();

    const body = await req.json();
    const { id, action, rejection_reason } = body;

    console.log('📥 Approval request:', { id, action, rejection_reason });

    if (!id || !action) {
      return NextResponse.json({ 
        message: 'ID dan action diperlukan' 
      }, { status: 400 });
    }

    // Cek apakah buku ada dan masih pending
    const checkResult = await db.query(
      'SELECT * FROM buku WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ 
        message: 'Buku tidak ditemukan' 
      }, { status: 404 });
    }

    const buku = checkResult.rows[0];

    if (buku.status !== 'pending') {
      return NextResponse.json({ 
        message: `Buku sudah ${buku.status}` 
      }, { status: 400 });
    }

    let result;

    if (action === 'approve') {
      // Approve buku
      result = await db.query(`
        UPDATE buku 
        SET 
          status = 'approved',
          approved_by = $1,
          approved_at = CURRENT_TIMESTAMP,
          rejection_reason = NULL,
          rejected_at = NULL,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
      `, [user.userId, id]);

      console.log('✅ Book approved:', id);

      return NextResponse.json({
        success: true,
        message: 'Buku berhasil disetujui dan ditambahkan ke katalog',
        data: result.rows[0]
      });
    } 
    else if (action === 'reject') {
      // Reject buku
      if (!rejection_reason || rejection_reason.trim() === '') {
        return NextResponse.json({ 
          message: 'Alasan penolakan harus diisi' 
        }, { status: 400 });
      }

      result = await db.query(`
        UPDATE buku 
        SET 
          status = 'rejected',
          rejected_at = CURRENT_TIMESTAMP,
          rejection_reason = $1,
          approved_by = NULL,
          approved_at = NULL,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
      `, [rejection_reason, id]);

      console.log('✅ Book rejected:', id);

      return NextResponse.json({
        success: true,
        message: 'Buku berhasil ditolak',
        data: result.rows[0]
      });
    }
    else {
      return NextResponse.json({ 
        message: 'Action tidak valid. Gunakan "approve" atau "reject"' 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Error processing approval:', error);
    return NextResponse.json({ 
      message: 'Gagal memproses approval', 
      error: error.message 
    }, { status: 500 });
  }
}