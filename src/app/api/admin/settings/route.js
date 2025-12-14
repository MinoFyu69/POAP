// src/app/api/admin/settings/route.js
import { NextResponse } from 'next/server';
import { getDb, initDb } from '@/lib/db';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'
);

const ROLES = {
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

// GET - Ambil semua settings atau setting tertentu
export async function GET(req) {
  try {
    const user = await getUserFromRequest(req);
    
    // Semua role bisa baca settings
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await initDb();
    const db = getDb();

    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (key) {
      // Get specific setting
      const result = await db.query(
        'SELECT * FROM settings WHERE key = $1',
        [key]
      );

      if (result.rows.length === 0) {
        // Return default value if not found
        if (key === 'denda_per_hari') {
          return NextResponse.json({
            key: 'denda_per_hari',
            value: '2000',
            description: 'Besaran denda keterlambatan per hari (default)'
          });
        }
        return NextResponse.json({ message: 'Setting not found' }, { status: 404 });
      }

      return NextResponse.json(result.rows[0]);
    } else {
      // Get all settings
      const result = await db.query('SELECT * FROM settings ORDER BY key');
      return NextResponse.json(result.rows);
    }
    
  } catch (error) {
    console.error('❌ Error fetching settings:', error);
    return NextResponse.json({ 
      message: 'Failed to fetch settings', 
      error: error.message 
    }, { status: 500 });
  }
}

// POST/PUT - Update setting (Admin only)
export async function POST(req) {
  try {
    const user = await getUserFromRequest(req);
    
    if (!user || user.role_id !== ROLES.ADMIN) {
      return NextResponse.json({ message: 'Forbidden - Admin only' }, { status: 403 });
    }

    await initDb();
    const db = getDb();

    const body = await req.json();
    const { key, value, description } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ 
        message: 'Key and value are required' 
      }, { status: 400 });
    }

    // Validate value untuk denda_per_hari harus angka
    if (key === 'denda_per_hari') {
      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue < 0) {
        return NextResponse.json({ 
          message: 'Denda harus berupa angka positif' 
        }, { status: 400 });
      }
    }

    // Cek apakah setting sudah ada
    const checkResult = await db.query(
      'SELECT id FROM settings WHERE key = $1',
      [key]
    );

    let result;
    if (checkResult.rows.length > 0) {
      // Update existing setting
      result = await db.query(`
        UPDATE settings 
        SET value = $1, 
            description = $2,
            updated_by = $3,
            updated_at = CURRENT_TIMESTAMP
        WHERE key = $4
        RETURNING *
      `, [value, description || null, user.userId, key]);
    } else {
      // Insert new setting
      result = await db.query(`
        INSERT INTO settings (key, value, description, updated_by)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `, [key, value, description || null, user.userId]);
    }

    console.log('✅ Setting updated:', key, '=', value);

    return NextResponse.json({
      success: true,
      message: 'Setting berhasil diupdate',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Error updating setting:', error);
    return NextResponse.json({ 
      message: 'Failed to update setting', 
      error: error.message 
    }, { status: 500 });
  }
}

// DELETE - Delete setting (Admin only)
export async function DELETE(req) {
  try {
    const user = await getUserFromRequest(req);
    
    if (!user || user.role_id !== ROLES.ADMIN) {
      return NextResponse.json({ message: 'Forbidden - Admin only' }, { status: 403 });
    }

    await initDb();
    const db = getDb();

    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ message: 'Key is required' }, { status: 400 });
    }

    // Prevent deleting critical settings
    if (key === 'denda_per_hari') {
      return NextResponse.json({ 
        message: 'Cannot delete critical system setting' 
      }, { status: 400 });
    }

    const result = await db.query('DELETE FROM settings WHERE key = $1', [key]);

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Setting not found' }, { status: 404 });
    }

    console.log('✅ Setting deleted:', key);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('❌ Error deleting setting:', error);
    return NextResponse.json({ 
      message: 'Failed to delete setting', 
      error: error.message 
    }, { status: 500 });
  }
}