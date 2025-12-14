// src/app/api/member/genre/route.js

import { NextResponse } from 'next/server';
import { getDb, initDb } from '@/lib/db';
import { requireRole, ROLES } from '@/lib/roles';

export async function GET(req) {
	try {
		// ✅ ADD AWAIT here
		const { ok } = await requireRole(req, [ROLES.MEMBER, ROLES.ADMIN]);
		if (!ok) {
			return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
		}
		
		await initDb();
		const db = getDb();
		
		const result = await db.query(`
			SELECT id, nama_genre, deskripsi, created_at 
			FROM genre 
			ORDER BY nama_genre ASC
		`);
		
		return NextResponse.json(result.rows);
	} catch (error) {
		console.error('❌ Genre API Error:', error);
		return NextResponse.json({
			success: false,
			message: 'Error fetching genres',
			error: error.message
		}, { status: 500 });
	}
}