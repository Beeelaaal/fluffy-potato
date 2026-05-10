'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

type Status = 'idle' | 'working' | 'ok' | 'error';

interface StepResult {
  label: string;
  status: Status;
  detail?: string;
}

export default function DebugPage() {
  const [authUser, setAuthUser] = useState<User | null | 'loading'>('loading');
  const [fsDoc, setFsDoc] = useState<any>(null);
  const [fsError, setFsError] = useState<string | null>(null);
  const [steps, setSteps] = useState<StepResult[]>([]);
  const [busy, setBusy] = useState(false);
  const [finalMsg, setFinalMsg] = useState<{ ok: boolean; text: string } | null>(null);

  /* ── Listen to Firebase Auth state ── */
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setAuthUser(u);
      if (u) loadDoc(u.uid);
    });
  }, []);

  /* ── Read the Firestore user document ── */
  async function loadDoc(uid: string) {
    setFsError(null);
    setFsDoc(null);
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        setFsDoc(snap.data());
      } else {
        setFsDoc('NO_DOC');
      }
    } catch (e: any) {
      setFsError(e?.message ?? String(e));
    }
  }

  /* ── The main "Force Admin" flow ── */
  async function forceAdmin() {
    if (!authUser || authUser === 'loading') return;
    const u = authUser as User;
    setBusy(true);
    setSteps([]);
    setFinalMsg(null);

    const addStep = (step: StepResult) =>
      setSteps((prev) => [...prev, step]);

    // ── Step 1: Firestore SDK direct write (user writes their own doc) ──
    addStep({ label: 'Step 1: Firestore SDK (direct write)', status: 'working' });
    try {
      await setDoc(
        doc(db, 'users', u.uid),
        { uid: u.uid, email: u.email ?? '', name: u.displayName ?? 'Admin', role: 'admin', university: 'NUST', isVerified: true, photoURL: u.photoURL ?? '' },
        { merge: true }
      );
      addStep({ label: 'Step 1: Firestore SDK (direct write)', status: 'ok', detail: 'Role set to admin via Firestore SDK ✅' });
      await loadDoc(u.uid);
      setFinalMsg({ ok: true, text: '✅ Admin role set! Sign out → sign back in → visit /admin' });
      setBusy(false);
      return;
    } catch (e: any) {
      addStep({ label: 'Step 1: Firestore SDK (direct write)', status: 'error', detail: e?.message ?? String(e) });
    }

    // ── Step 2: API route with user's ID token (REST fallback) ──
    addStep({ label: 'Step 2: /api/set-admin with ID token', status: 'working' });
    try {
      const idToken = await u.getIdToken(true);
      const res = await fetch('/api/set-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ uid: u.uid }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        addStep({ label: 'Step 2: /api/set-admin with ID token', status: 'ok', detail: `Method: ${json.method} ✅` });
        await loadDoc(u.uid);
        setFinalMsg({ ok: true, text: '✅ Admin role set via API! Sign out → sign back in → visit /admin' });
        setBusy(false);
        return;
      }
      throw new Error(json.error ?? `HTTP ${res.status}`);
    } catch (e: any) {
      addStep({ label: 'Step 2: /api/set-admin with ID token', status: 'error', detail: e?.message ?? String(e) });
    }

    // ── Step 3: Firebase REST API with user token directly from browser ──
    addStep({ label: 'Step 3: Firebase REST API (browser direct)', status: 'working' });
    try {
      const idToken = await u.getIdToken(true);
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
      const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${u.uid}`;
      const fields = {
        uid: { stringValue: u.uid },
        email: { stringValue: u.email ?? '' },
        name: { stringValue: u.displayName ?? 'Admin' },
        role: { stringValue: 'admin' },
        university: { stringValue: 'NUST' },
        isVerified: { booleanValue: true },
        photoURL: { stringValue: u.photoURL ?? '' },
      };

      // Try PATCH first (doc exists)
      const patchRes = await fetch(
        `${baseUrl}?updateMask.fieldPaths=role&updateMask.fieldPaths=isVerified`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${idToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ fields: { role: { stringValue: 'admin' }, isVerified: { booleanValue: true } } }),
        }
      );

      if (patchRes.ok) {
        addStep({ label: 'Step 3: Firebase REST API (browser direct)', status: 'ok', detail: 'PATCH succeeded ✅' });
        await loadDoc(u.uid);
        setFinalMsg({ ok: true, text: '✅ Admin role set via REST! Sign out → sign back in → visit /admin' });
        setBusy(false);
        return;
      }

      // PATCH failed — try POST (create doc)
      const postRes = await fetch(
        `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users?documentId=${u.uid}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${idToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ fields }),
        }
      );
      if (!postRes.ok) {
        const txt = await postRes.text();
        throw new Error(`PATCH (${patchRes.status}) & POST (${postRes.status}): ${txt.slice(0, 300)}`);
      }
      addStep({ label: 'Step 3: Firebase REST API (browser direct)', status: 'ok', detail: 'POST (create) succeeded ✅' });
      await loadDoc(u.uid);
      setFinalMsg({ ok: true, text: '✅ Admin role set via REST! Sign out → sign back in → visit /admin' });
      setBusy(false);
      return;
    } catch (e: any) {
      addStep({ label: 'Step 3: Firebase REST API (browser direct)', status: 'error', detail: e?.message ?? String(e) });
    }

    // All failed
    setFinalMsg({
      ok: false,
      text: '❌ All automatic methods failed. Follow the MANUAL STEPS below to set admin via Firebase Console.',
    });
    setBusy(false);
  }

  /* ── Inline styles ── */
  const uid = authUser !== 'loading' && authUser ? (authUser as User).uid : null;
  const role = fsDoc && typeof fsDoc === 'object' ? fsDoc.role : null;
  const isAdmin = role === 'admin';

  const s = {
    page: {
      minHeight: '100vh',
      background: '#0A0514',
      color: 'white',
      padding: '28px 22px',
      paddingTop: '90px',
      fontFamily: 'monospace',
      fontSize: 14,
      maxWidth: 800,
      margin: '0 auto',
    } as React.CSSProperties,
    h1: { fontFamily: 'sans-serif', fontSize: 26, marginBottom: 6, fontWeight: 900 },
    box: (c = '#2EF2FF') =>
      ({
        background: `${c}0D`,
        border: `1px solid ${c}33`,
        borderRadius: 14,
        padding: 18,
        marginBottom: 16,
      } as React.CSSProperties),
    lbl: (c = '#2EF2FF') =>
      ({
        color: c,
        fontSize: 10,
        fontWeight: 900,
        letterSpacing: '0.2em',
        textTransform: 'uppercase' as const,
        marginBottom: 8,
        display: 'block',
      }),
    pre: { margin: 0, whiteSpace: 'pre-wrap' as const, wordBreak: 'break-all' as const, lineHeight: 1.65 },
    btn: (c = '#2EF2FF') =>
      ({
        background: `${c}18`,
        border: `1px solid ${c}55`,
        color: c,
        borderRadius: 12,
        padding: '10px 22px',
        cursor: 'pointer',
        fontWeight: 700,
        fontSize: 13,
        marginRight: 10,
        marginBottom: 10,
        opacity: busy ? 0.6 : 1,
      } as React.CSSProperties),
  };

  const statusIcon = (st: Status) =>
    st === 'working' ? '⏳' : st === 'ok' ? '✅' : st === 'error' ? '❌' : '○';
  const statusColor = (st: Status) =>
    st === 'ok' ? '#D8FF3E' : st === 'error' ? '#FF5050' : st === 'working' ? '#2EF2FF' : 'rgba(255,255,255,0.5)';

  return (
    <div style={s.page}>
      <h1 style={s.h1}>🔧 Firebase Admin Debug</h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 24, fontSize: 13 }}>
        Tries 3 methods to set your Firestore role to <code style={{ color: '#2EF2FF' }}>admin</code>.
        Completely bypasses the AuthContext.
      </p>

      {/* ── Already admin banner ── */}
      {isAdmin && (
        <div style={{ ...s.box('#D8FF3E'), color: '#D8FF3E', fontWeight: 700, fontSize: 15, marginBottom: 20 }}>
          🎉 You ARE already admin! &nbsp;
          <a href="/admin" style={{ color: '#2EF2FF', textDecoration: 'underline' }}>Open /admin →</a>
        </div>
      )}

      {/* ── Final result banner ── */}
      {finalMsg && (
        <div
          style={{
            ...s.box(finalMsg.ok ? '#D8FF3E' : '#FF5050'),
            color: finalMsg.ok ? '#D8FF3E' : '#FF8888',
            fontWeight: 700,
            marginBottom: 20,
          }}
        >
          {finalMsg.text}
          {finalMsg.ok && (
            <div style={{ marginTop: 10 }}>
              <a href="/login" style={{ ...s.btn('#9B6DFF'), display: 'inline-block', textDecoration: 'none' }}>
                → Sign Out & Sign In
              </a>
              <a href="/admin" style={{ ...s.btn('#FF7A18'), display: 'inline-block', textDecoration: 'none' }}>
                → /admin
              </a>
            </div>
          )}
        </div>
      )}

      {/* ── Action buttons ── */}
      <div style={{ marginBottom: 24 }}>
        <button style={s.btn()} disabled={busy || !uid} onClick={() => uid && loadDoc(uid)}>
          🔄 Reload Doc
        </button>
        <button style={s.btn('#D8FF3E')} disabled={busy || !uid} onClick={forceAdmin}>
          {busy ? '⏳ Working…' : '⚡ Force Set role = admin'}
        </button>
        <a href="/admin" style={{ ...s.btn('#FF7A18'), display: 'inline-block', textDecoration: 'none' }}>
          → /admin
        </a>
        <a href="/login" style={{ ...s.btn('#9B6DFF'), display: 'inline-block', textDecoration: 'none' }}>
          → /login
        </a>
      </div>

      {/* ── Step-by-step results ── */}
      {steps.length > 0 && (
        <div style={s.box('#2EF2FF')}>
          <span style={s.lbl()}>Attempt Log</span>
          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 10,
                alignItems: 'flex-start',
                marginBottom: 8,
                color: statusColor(step.status),
              }}
            >
              <span style={{ minWidth: 20, fontSize: 15 }}>{statusIcon(step.status)}</span>
              <div>
                <div style={{ fontWeight: 700 }}>{step.label}</div>
                {step.detail && (
                  <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, marginTop: 2 }}>
                    {step.detail}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Firebase Auth state ── */}
      <div style={s.box()}>
        <span style={s.lbl()}>Firebase Auth State</span>
        <pre style={s.pre}>
          {authUser === 'loading'
            ? 'Loading…'
            : !authUser
            ? '❌ NOT SIGNED IN — go to /login first'
            : JSON.stringify(
                {
                  uid: (authUser as User).uid,
                  email: (authUser as User).email,
                  emailVerified: (authUser as User).emailVerified,
                },
                null,
                2
              )}
        </pre>
      </div>

      {/* ── Firestore document ── */}
      <div style={s.box('#FF7A18')}>
        <span style={s.lbl('#FF7A18')}>Firestore  users/{uid ?? '?'}</span>
        <pre style={s.pre}>
          {fsError
            ? `❌ READ ERROR:\n${fsError}\n\n→ Deploy the Firestore rules below`
            : !fsDoc
            ? 'Not loaded yet'
            : fsDoc === 'NO_DOC'
            ? '⚠️  Document does not exist yet — click ⚡ Force Set role = admin'
            : JSON.stringify(fsDoc, null, 2)}
        </pre>
        {fsDoc && typeof fsDoc === 'object' && (
          <div
            style={{
              marginTop: 10,
              padding: '6px 14px',
              borderRadius: 8,
              display: 'inline-block',
              background: isAdmin ? '#D8FF3E22' : '#FF505022',
              border: `1px solid ${isAdmin ? '#D8FF3E55' : '#FF505055'}`,
              color: isAdmin ? '#D8FF3E' : '#FF5050',
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            role = &quot;{role ?? 'unknown'}&quot;{isAdmin ? ' ← ✅ you are admin' : ' ← ❌ not admin yet'}
          </div>
        )}
      </div>

      {/* ── Manual Steps ── */}
      <div style={s.box('#9B6DFF')}>
        <span style={s.lbl('#9B6DFF')}>Manual Fix (if all automatic methods fail)</span>
        <ol style={{ paddingLeft: 20, lineHeight: 2.2, color: 'rgba(255,255,255,0.75)' }}>
          <li>
            Open{' '}
            <a
              href={`https://console.firebase.google.com/project/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/firestore/rules`}
              target="_blank"
              style={{ color: '#2EF2FF' }}
              rel="noreferrer"
            >
              Firebase Console → Firestore → Rules
            </a>
          </li>
          <li>Paste the rules shown below → click <strong style={{ color: 'white' }}>Publish</strong></li>
          <li>
            Then open{' '}
            <a
              href={`https://console.firebase.google.com/project/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/firestore/databases/-default-/data/users`}
              target="_blank"
              style={{ color: '#FF7A18' }}
              rel="noreferrer"
            >
              Firestore → Data → users collection
            </a>
          </li>
          <li>
            Find your doc with UID: <code style={{ color: '#2EF2FF' }}>{uid ?? '(sign in first)'}</code>
          </li>
          <li>
            Set field <code style={{ color: '#D8FF3E' }}>role</code> →{' '}
            <code style={{ color: '#D8FF3E' }}>&quot;admin&quot;</code> (string)
          </li>
          <li>Sign out and sign back in, then visit <a href="/admin" style={{ color: '#FF7A18' }}>/admin</a></li>
        </ol>
      </div>

      {/* ── Firestore Rules ── */}
      <div style={s.box('#2EF2FF')}>
        <span style={s.lbl()}>Firestore Rules — paste these in Firebase Console</span>
        <pre
          style={{
            ...s.pre,
            fontSize: 12,
            color: 'rgba(255,255,255,0.85)',
            background: 'rgba(0,0,0,0.35)',
            padding: 14,
            borderRadius: 10,
          }}
        >{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{uid} {
      // User can read/write their OWN document
      allow read, write: if request.auth != null && request.auth.uid == uid;

      // Admin can read/write ALL user documents
      allow read, write: if request.auth != null
        && exists(/databases/$(database)/documents/users/$(request.auth.uid))
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }

    match /resources/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /universities/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /marketplace/{id} {
      allow read, write: if request.auth != null;
    }

    match /bids/{id} {
      allow read, write: if request.auth != null;
    }

    match /helpRequests/{id} {
      allow read, write: if request.auth != null;
    }
  }
}`}</pre>
      </div>
    </div>
  );
}