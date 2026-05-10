import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

// POST /api/set-admin  { uid: string }
// Uses Admin SDK — bypasses ALL Firestore security rules
export async function POST(req: NextRequest) {
  try {
    // Simple secret check to avoid abuse (only works in dev)
    const secret = req.headers.get('x-admin-secret');
    if (secret !== process.env.ADMIN_SETUP_SECRET && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { uid } = await req.json();
    if (!uid || typeof uid !== 'string') {
      return NextResponse.json({ error: 'uid required' }, { status: 400 });
    }

    const ref = adminDb.collection('users').doc(uid);
    const snap = await ref.get();

    if (snap.exists) {
      // Update only the role field
      await ref.update({ role: 'admin', isVerified: true });
    } else {
      // Create full document
      await ref.set({
        uid,
        role: 'admin',
        isVerified: true,
        email: '',
        name: 'Admin',
        university: 'NUST',
        createdAt: new Date(),
      });
    }

    const updated = await ref.get();
    return NextResponse.json({ success: true, data: updated.data() });
  } catch (err: any) {
    console.error('[set-admin API]', err);
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
