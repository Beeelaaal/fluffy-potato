import { NextRequest, NextResponse } from 'next/server';

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
const HAS_ADMIN_SDK =
  !!process.env.FIREBASE_CLIENT_EMAIL && !!process.env.FIREBASE_PRIVATE_KEY;

// ── Helper: write via Firebase REST (no Admin SDK needed) ────────────────────
async function setAdminViaRest(uid: string, idToken: string) {
  const baseUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/users/${uid}`;

  // Try GET to see if doc exists
  const getRes = await fetch(baseUrl, {
    headers: { Authorization: `Bearer ${idToken}` },
  });

  const payload = {
    fields: {
      role: { stringValue: 'admin' },
      isVerified: { booleanValue: true },
    },
  };

  if (getRes.ok) {
    // PATCH — only update role + isVerified fields
    const patchRes = await fetch(
      `${baseUrl}?updateMask.fieldPaths=role&updateMask.fieldPaths=isVerified`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );
    if (!patchRes.ok) {
      const txt = await patchRes.text();
      throw new Error(`REST PATCH failed (${patchRes.status}): ${txt}`);
    }
    return await patchRes.json();
  } else {
    // POST — create new document
    const postUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/users?documentId=${uid}`;
    const postRes = await fetch(postUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          uid: { stringValue: uid },
          role: { stringValue: 'admin' },
          isVerified: { booleanValue: true },
          email: { stringValue: '' },
          name: { stringValue: 'Admin' },
          university: { stringValue: 'NUST' },
        },
      }),
    });
    if (!postRes.ok) {
      const txt = await postRes.text();
      throw new Error(`REST POST failed (${postRes.status}): ${txt}`);
    }
    return await postRes.json();
  }
}

// ── Helper: write via Admin SDK (requires service account in .env.local) ──────
async function setAdminViaSDK(uid: string) {
  // Dynamic import so the module doesn't crash when creds are missing
  const { adminDb } = await import('@/lib/firebaseAdmin');
  const ref = adminDb.collection('users').doc(uid);
  const snap = await ref.get();

  if (snap.exists) {
    await ref.update({ role: 'admin', isVerified: true });
  } else {
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
  return updated.data();
}

// ── POST /api/set-admin ───────────────────────────────────────────────────────
// Body: { uid: string }
// Header: Authorization: Bearer <idToken>   (the caller's Firebase Auth token)
// Header: x-admin-secret: <ADMIN_SETUP_SECRET>   (optional extra guard)
export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get('x-admin-secret');
    // In production always require the secret
    if (process.env.NODE_ENV === 'production') {
      if (!process.env.ADMIN_SETUP_SECRET || secret !== process.env.ADMIN_SETUP_SECRET) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const { uid } = await req.json();
    if (!uid || typeof uid !== 'string') {
      return NextResponse.json({ error: 'uid required' }, { status: 400 });
    }

    // Try Admin SDK first (requires FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY)
    if (HAS_ADMIN_SDK) {
      try {
        const data = await setAdminViaSDK(uid);
        return NextResponse.json({ success: true, method: 'admin-sdk', data });
      } catch (e: any) {
        console.warn('[set-admin] Admin SDK failed, trying REST fallback:', e.message);
      }
    }

    // Fallback: use the caller's own Firebase Auth ID token via REST API
    const authHeader = req.headers.get('authorization') ?? '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!idToken) {
      return NextResponse.json(
        {
          error:
            'No Firebase Admin credentials configured and no idToken provided. ' +
            'Add FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY to .env.local, or ' +
            'pass Authorization: Bearer <idToken> header.',
        },
        { status: 500 }
      );
    }

    const data = await setAdminViaRest(uid, idToken);
    return NextResponse.json({ success: true, method: 'rest-api', data });
  } catch (err: any) {
    console.error('[set-admin API]', err);
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
