'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function DebugPage() {
  const [authUser, setAuthUser] = useState<User | null | 'loading'>('loading');
  const [fsDoc,    setFsDoc]    = useState<any>(null);
  const [fsError,  setFsError]  = useState<string | null>(null);
  const [msg,      setMsg]      = useState<string | null>(null);
  const [busy,     setBusy]     = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setAuthUser(u);
      if (u) loadDoc(u.uid);
    });
  }, []);

  async function loadDoc(uid: string) {
    setFsError(null);
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      setFsDoc(snap.exists() ? snap.data() : 'NO DOCUMENT IN FIRESTORE — click Force Admin below');
    } catch (e: any) {
      setFsError(e?.message ?? String(e));
    }
  }

  // Method 1: direct Firestore setDoc (works if rules allow user to write own doc)
  async function forceAdminViaFirestore() {
    const u = authUser as User;
    const payload = {
      uid: u.uid, email: u.email ?? '', name: u.displayName ?? 'Admin',
      role: 'admin', university: 'NUST', isVerified: true, photoURL: u.photoURL ?? '',
    };
    await setDoc(doc(db, 'users', u.uid), payload, { merge: true });
    return payload;
  }

  // Method 2: via REST API (Firebase REST endpoint — works as the signed-in user)
  async function forceAdminViaRest() {
    const u = authUser as User;
    const token = await u.getIdToken();
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${u.uid}`;

    const body = {
      fields: {
        uid:        { stringValue: u.uid },
        email:      { stringValue: u.email ?? '' },
        name:       { stringValue: u.displayName ?? 'Admin' },
        role:       { stringValue: 'admin' },
        university: { stringValue: 'NUST' },
        isVerified: { booleanValue: true },
        photoURL:   { stringValue: u.photoURL ?? '' },
      }
    };

    const res = await fetch(url + '?currentDocument.exists=false', {
      method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      // Document exists — use PATCH instead
      const patch = await fetch(
        `${url}?updateMask.fieldPaths=role&updateMask.fieldPaths=isVerified`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ fields: { role: { stringValue: 'admin' }, isVerified: { booleanValue: true } } }),
        }
      );
      if (!patch.ok) {
        const err = await patch.text();
        throw new Error(`REST PATCH failed: ${err}`);
      }
    }
  }

  async function forceAdmin() {
    if (!authUser || authUser === 'loading') return;
    setBusy(true); setMsg(null); setFsError(null);
    const errors: string[] = [];

    // Try method 1 first
    try {
      await forceAdminViaFirestore();
      setMsg('✅ SUCCESS via Firestore SDK! Role = admin. Sign out then sign back in, then go to /admin.');
      await loadDoc((authUser as User).uid);
      setBusy(false); return;
    } catch (e: any) { errors.push('SDK: ' + (e?.message ?? String(e))); }

    // Try method 2 — REST API with user token
    try {
      await forceAdminViaRest();
      setMsg('✅ SUCCESS via REST API! Role = admin. Sign out then sign back in, then go to /admin.');
      await loadDoc((authUser as User).uid);
      setBusy(false); return;
    } catch (e: any) { errors.push('REST: ' + (e?.message ?? String(e))); }

    // Both failed — show manual instructions
    setFsError('Both methods failed:\n' + errors.join('\n') + '\n\n👉 Follow the MANUAL STEPS below.');
    setBusy(false);
  }

  const uid = authUser !== 'loading' && authUser ? (authUser as User).uid : null;
  const role = fsDoc && typeof fsDoc === 'object' ? fsDoc.role : null;

  const s = {
    page:  { minHeight:'100vh', background:'#0A0514', color:'white', padding:'28px 22px', paddingTop:'90px', fontFamily:'monospace', fontSize:14 } as React.CSSProperties,
    h1:    { fontFamily:'var(--font-display,sans-serif)', fontSize:28, marginBottom:6, fontWeight:900 },
    box:   (c='#2EF2FF') => ({ background:`${c}0D`, border:`1px solid ${c}33`, borderRadius:14, padding:18, marginBottom:16 } as React.CSSProperties),
    lbl:   (c='#2EF2FF') => ({ color:c, fontSize:10, fontWeight:900, letterSpacing:'0.2em', textTransform:'uppercase' as const, marginBottom:8, display:'block' }),
    pre:   { margin:0, whiteSpace:'pre-wrap' as const, wordBreak:'break-all' as const, lineHeight:1.65 },
    btn:   (c='#2EF2FF') => ({ background:`${c}18`, border:`1px solid ${c}55`, color:c, borderRadius:12, padding:'10px 22px', cursor:'pointer', fontWeight:700, fontSize:13, marginRight:10, marginBottom:10, opacity: busy ? 0.6 : 1 } as React.CSSProperties),
  };

  return (
    <div style={s.page}>
      <h1 style={s.h1}>🔧 Auth Debug</h1>
      <p style={{ color:'rgba(255,255,255,0.4)', marginBottom:24, fontSize:13 }}>Tries 2 methods to set admin role. Bypasses context completely.</p>

      {/* Status banner */}
      {authUser !== 'loading' && authUser && role === 'admin' && (
        <div style={{ ...s.box('#D8FF3E'), color:'#D8FF3E', fontWeight:700, fontSize:14 }}>
          🎉 You are already admin! Go to <a href="/admin" style={{ color:'#2EF2FF' }}>/admin</a>
        </div>
      )}
      {msg    && <div style={{ ...s.box('#D8FF3E'), color:'#D8FF3E' }}>{msg}</div>}
      {fsError && <div style={{ ...s.box('#FF5050'), color:'#FF8888' }}><strong>Error:</strong><br/><pre style={s.pre}>{fsError}</pre></div>}

      {/* Action buttons */}
      <div style={{ marginBottom:24 }}>
        <button style={s.btn()} disabled={busy||!uid} onClick={()=>uid&&loadDoc(uid)}>🔄 Reload Doc</button>
        <button style={s.btn('#D8FF3E')} disabled={busy||!uid} onClick={forceAdmin}>
          {busy ? 'Working…' : '⚡ Force Set role = admin'}
        </button>
        <a href="/admin" style={{ ...s.btn('#FF7A18'), display:'inline-block', textDecoration:'none' }}>→ /admin</a>
        <a href="/login" style={{ ...s.btn('#9B6DFF'), display:'inline-block', textDecoration:'none' }}>→ /login</a>
      </div>

      {/* Auth state */}
      <div style={s.box()}>
        <span style={s.lbl()}>Firebase Auth</span>
        <pre style={s.pre}>{
          authUser === 'loading' ? 'Loading…'
          : !authUser            ? '❌ NOT SIGNED IN'
          : JSON.stringify({ uid: (authUser as User).uid, email: (authUser as User).email }, null, 2)
        }</pre>
      </div>

      {/* Firestore doc */}
      <div style={s.box('#FF7A18')}>
        <span style={s.lbl('#FF7A18')}>Firestore  users/{uid ?? '?'}</span>
        <pre style={s.pre}>{
          fsError  ? '❌ READ BLOCKED — rules not deployed yet'
          : !fsDoc ? 'Not loaded'
          : typeof fsDoc === 'string' ? fsDoc
          : JSON.stringify(fsDoc, null, 2)
        }</pre>
      </div>

      {/* Manual steps */}
      <div style={s.box('#9B6DFF')}>
        <span style={s.lbl('#9B6DFF')}>Manual Fix (if Force Admin button fails)</span>
        <ol style={{ paddingLeft:20, lineHeight:2, color:'rgba(255,255,255,0.7)' }}>
          <li>Open <a href="https://console.firebase.google.com/project/tutor-tap/firestore/rules" target="_blank" style={{ color:'#2EF2FF' }}>Firebase Console → Firestore → Rules</a></li>
          <li>Replace ALL rules with the ruleset shown below</li>
          <li>Click <strong style={{ color:'white' }}>Publish</strong></li>
          <li>Come back here and click <strong style={{ color:'#D8FF3E' }}>⚡ Force Set role = admin</strong></li>
          <li>Then sign out and sign in again, then visit <a href="/admin" style={{ color:'#FF7A18' }}>/admin</a></li>
        </ol>
      </div>

      {/* Rules to paste */}
      <div style={s.box('#2EF2FF')}>
        <span style={s.lbl()}>Paste these rules in Firebase Console (click Publish after)</span>
        <pre style={{ ...s.pre, fontSize:12, color:'rgba(255,255,255,0.8)', background:'rgba(0,0,0,0.3)', padding:14, borderRadius:10 }}>{
`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
      allow read, write: if request.auth != null
        && exists(/databases/$(database)/documents/users/$(request.auth.uid))
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
    match /resources/{id}    { allow read: if true; allow write: if request.auth != null; }
    match /universities/{id} { allow read: if true; allow write: if request.auth != null; }
    match /marketplace/{id}  { allow read, write: if request.auth != null; }
    match /bids/{id}         { allow read, write: if request.auth != null; }
    match /helpRequests/{id} { allow read, write: if request.auth != null; }
  }
}`}</pre>
      </div>
    </div>
  );
}