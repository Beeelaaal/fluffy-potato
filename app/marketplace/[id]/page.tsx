'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, Clock, DollarSign, MessageSquare, Star, CheckCircle,
  X, SendHorizontal, User, Wifi, MapPin
} from 'lucide-react';
import { marketplaceRequests } from '@/data/marketplace';
import { db } from '@/lib/firebase';
import {
  doc, getDoc, collection, query, where, onSnapshot,
  addDoc, updateDoc, increment, serverTimestamp, setDoc, orderBy
} from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

function ChatPanel({
  chatId,
  onClose,
  currentUid,
  currentName
}: {
  chatId: string;
  onClose: () => void;
  currentUid: string;
  currentName: string;
}) {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      setLoading(false);
    }, (err) => {
      console.error("Chat messages error:", err);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [chatId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const msgText = text.trim();
    setText('');
    try {
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        senderId: currentUid,
        senderName: currentName,
        text: msgText,
        createdAt: serverTimestamp(),
      });
      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: msgText,
        lastMessageAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="glass-card p-6 border-funky-cyan/30 shadow-cyan mt-6">
      <div className="flex items-center justify-between border-b border-black/5 pb-4 mb-4">
        <h3 className="font-display font-black text-lg text-[#0B071E] flex items-center gap-2">
          <MessageSquare className="text-funky-cyan" size={18} />
          Negotiation Chat Room
        </h3>
        <button onClick={onClose} className="text-xs font-bold text-[#0B071E]/50 hover:text-red-500 bg-black/5 px-2.5 py-1 rounded-lg">
          Close Chat
        </button>
      </div>

      <div className="h-64 overflow-y-auto space-y-3 mb-4 p-4 bg-white/50 rounded-xl border border-black/5 flex flex-col">
        {loading ? (
          <p className="text-center text-xs text-[#0B071E]/50 my-auto font-bold">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-xs text-[#0B071E]/50 my-auto font-bold">No messages yet. Start chatting below!</p>
        ) : (
          messages.map((m) => {
            const isMe = m.senderId === currentUid;
            return (
              <div key={m.id} className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm font-semibold ${
                isMe
                  ? 'bg-[#8B5CF6] text-white self-end rounded-tr-none'
                  : 'bg-white text-[#0B071E] border border-black/5 self-start rounded-tl-none'
              }`}>
                {!isMe && <div className="text-[9px] text-[#8B5CF6] font-black mb-0.5">{m.senderName}</div>}
                <div>{m.text}</div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message to negotiate details..."
          className="input-field py-2"
        />
        <button type="submit" className="btn-primary py-2 px-4">
          <SendHorizontal size={16} />
        </button>
      </form>
    </div>
  );
}

export default function RequestDetailPage({ params }: { params: { id: string } }) {
  const { user, profile } = useAuth();
  const [request, setRequest] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showBidForm, setShowBidForm] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittingBid, setSubmittingBid] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  useEffect(() => {
    // 1. Fetch request document from Firestore or fall back to mock requests
    const fetchRequest = async () => {
      try {
        const reqRef = doc(db, 'marketplace', params.id);
        const reqSnap = await getDoc(reqRef);

        if (reqSnap.exists()) {
          setRequest({ id: reqSnap.id, ...reqSnap.data() });
        } else {
          // Check mock requests
          const mockReq = marketplaceRequests.find(r => r.id === params.id);
          if (mockReq) {
            setRequest(mockReq);
          } else {
            setRequest(null);
          }
        }
      } catch (err) {
        console.error("Error fetching request:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [params.id]);

  useEffect(() => {
    // 2. Fetch bids from Firestore dynamically & merge with mock bids if mock exists
    const bidsQuery = query(collection(db, 'bids'), where('requestId', '==', params.id));
    const unsubscribe = onSnapshot(bidsQuery, (snapshot) => {
      const dbBids = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const mockReq = marketplaceRequests.find(r => r.id === params.id);
      const mockBids = mockReq ? mockReq.bids : [];

      // Merge: dbBids takes priority, mockBids filtered out if duplicates exist
      const mergedBids = [
        ...dbBids,
        ...mockBids.filter(mb => !dbBids.some(db => db.id === mb.id))
      ];
      setBids(mergedBids);
    });

    return () => unsubscribe();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="text-[#0B071E] font-display font-black text-xl animate-pulse">Loading request details...</div>
      </div>
    );
  }

  if (!request) notFound();

  const handleSubmitBid = async () => {
    if (!user) {
      alert("Please sign in to place a bid! 🎓");
      return;
    }
    if (!bidAmount || !bidMessage) return;
    setSubmittingBid(true);
    try {
      // Create bid document in Firestore
      await addDoc(collection(db, 'bids'), {
        requestId: params.id,
        tutorId: user.uid,
        tutor: {
          id: user.uid,
          name: profile?.name || user.displayName || 'Anonymous Tutor',
          avatar: profile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}&backgroundColor=0f0f1a`,
          university: profile?.university || 'University Tutor',
          rating: 4.8,
          completedSessions: 14,
          expertise: profile?.role === 'tutor' ? ['Academic Tutoring'] : ['Expert Helper'],
        },
        amount: Number(bidAmount),
        message: bidMessage,
        status: 'pending',
        postedAt: new Date().toISOString(),
      });

      // Update bids count on Firestore request if it exists there
      const reqRef = doc(db, 'marketplace', params.id);
      const reqSnap = await getDoc(reqRef);
      if (reqSnap.exists()) {
        await updateDoc(reqRef, { bidsCount: increment(1) });
      }

      setSubmitted(true);
      setShowBidForm(false);
      setBidAmount('');
      setBidMessage('');
    } catch (err: any) {
      console.error("Error submitting bid:", err);
      alert("Failed to submit bid: " + (err?.message || "Please try again."));
    } finally {
      setSubmittingBid(false);
    }
  };

  const handleStartChat = async (bid: any, newStatus?: string) => {
    if (!user) {
      alert("Please sign in first!");
      return;
    }
    const tutorId = bid.tutorId || bid.tutor.id;
    const chatId = `${params.id}_${tutorId}`;
    try {
      const chatRef = doc(db, 'chats', chatId);
      const chatSnap = await getDoc(chatRef);
      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          requestId: params.id,
          requestTitle: request.title,
          studentId: request.studentId || request.student.id,
          tutorId: tutorId,
          studentName: request.student.name,
          tutorName: bid.tutor.name,
          studentAvatar: request.student.avatar,
          tutorAvatar: bid.tutor.avatar,
          status: 'active',
          lastMessage: 'Chat started',
          lastMessageAt: new Date().toISOString(),
        });
      }

      if (newStatus === 'accepted') {
        // Update bid status
        if (bid.id && !bid.id.startsWith('b0')) {
          await updateDoc(doc(db, 'bids', bid.id), { status: 'accepted' });
        }
        // Update request status
        const reqRef = doc(db, 'marketplace', params.id);
        const reqSnap = await getDoc(reqRef);
        if (reqSnap.exists()) {
          await updateDoc(reqRef, { status: 'in-progress' });
        }
        alert("Bid accepted! Negotiation chat room initialized. 🤝");
      }

      setActiveChatId(chatId);
    } catch (err: any) {
      console.error("Error initiating chat:", err);
      alert("Failed to start chat: " + (err?.message || "Please check your network rules."));
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 relative">
      <div className="absolute top-0 left-1/4 w-[400px] h-[300px] bg-funky-purple/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="section-container relative">
        <Link href="/marketplace"
          className="inline-flex items-center gap-2 text-[#0B071E]/60 hover:text-[#8B5CF6] text-sm mb-8 transition-colors font-bold">
          <ArrowLeft size={15} /> Back to Marketplace
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header card */}
            <motion.div className="glass-card p-7"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`text-xs px-3 py-1.5 rounded-full font-bold border ${
                  request.status === 'open'
                    ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/25'
                    : request.status === 'in-progress'
                    ? 'bg-amber-500/15 text-amber-600 border-amber-500/25'
                    : 'bg-black/5 text-[#0B071E]/50 border-black/10'
                } capitalize`}>
                  {request.status === 'open' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5" />}
                  {request.status.replace('-', ' ')}
                </span>
                <span className="tag-pill">{request.subject}</span>
                <span className="flex items-center gap-1 text-xs text-[#0B071E]/60 font-bold">
                  {request.sessionType === 'online' ? <Wifi size={11} /> : <MapPin size={11} />}
                  {request.sessionType}
                </span>
              </div>

              <h1 className="font-display font-black text-3xl mb-4 text-[#0B071E]">{request.title}</h1>
              <p className="text-[#0B071E]/80 text-sm leading-relaxed mb-6 font-semibold">{request.description}</p>

              {request.tags && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {request.tags.map((tag: string) => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-full text-[#0B071E]/60 font-bold border border-black/10 bg-white/60">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Request stats */}
              <div className="grid grid-cols-3 gap-4 p-5 rounded-2xl bg-white/60 border border-black/5">
                <div className="text-center">
                  <DollarSign size={16} className="text-[#8B5CF6] mx-auto mb-1" />
                  <div className="font-display font-black text-xl text-[#0B071E]">PKR {request.budget.toLocaleString()}</div>
                  <div className="text-[#0B071E]/50 text-xs font-bold">Budget</div>
                </div>
                <div className="text-center">
                  <Clock size={16} className="text-[#0891B2] mx-auto mb-1" />
                  <div className="font-bold text-sm text-[#0B071E]">{request.duration}</div>
                  <div className="text-[#0B071E]/50 text-xs font-bold">Duration</div>
                </div>
                <div className="text-center">
                  <MessageSquare size={16} className="text-[#EA580C] mx-auto mb-1" />
                  <div className="font-display font-black text-xl text-[#0B071E]">{bids.length}</div>
                  <div className="text-[#0B071E]/50 text-xs font-bold">Bids Received</div>
                </div>
              </div>
            </motion.div>

            {/* Negotiation Chat Panel (If active) */}
            {activeChatId && user && (
              <ChatPanel
                chatId={activeChatId}
                onClose={() => setActiveChatId(null)}
                currentUid={user.uid}
                currentName={profile?.name || user.displayName || 'User'}
              />
            )}

            {/* Bids List */}
            <motion.div className="glass-card p-7"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <h2 className="font-display font-black text-xl mb-5 flex items-center gap-2 text-[#0B071E]">
                <MessageSquare size={18} className="text-[#8B5CF6]" />
                Bids ({bids.length})
              </h2>

              {bids.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="text-[#0B071E]/50 font-bold">No bids yet. Be the first to bid!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bids.map((bid, i) => {
                    const tutorId = bid.tutorId || bid.tutor.id;
                    const studentId = request.studentId || request.student.id;
                    const canNegotiate = user && (user.uid === studentId || user.uid === tutorId || profile?.role === 'admin');

                    return (
                      <motion.div key={bid.id || i}
                        className="p-5 rounded-2xl bg-white/60 border border-black/5"
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}>
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3">
                            <img src={bid.tutor.avatar} alt={bid.tutor.name}
                              className="w-10 h-10 rounded-full border border-black/10" />
                            <div>
                              <div className="font-bold text-sm text-[#0B071E]">{bid.tutor.name}</div>
                              <div className="text-[#0B071E]/50 text-xs font-semibold">{bid.tutor.university}</div>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="font-display font-black text-lg text-[#8B5CF6]">PKR {bid.amount.toLocaleString()}</div>
                            <div className="flex items-center justify-end gap-1 text-xs text-[#0B071E]/50 font-bold mt-0.5">
                              <Star size={10} className="fill-yellow-500 text-yellow-500" />
                              {bid.tutor.rating} · {bid.tutor.completedSessions} sessions
                            </div>
                          </div>
                        </div>

                        <p className="text-[#0B071E]/75 text-sm leading-relaxed mb-4 font-semibold">{bid.message}</p>

                        {bid.tutor.expertise && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {bid.tutor.expertise.map((e: string) => (
                              <span key={e} className="tag-pill text-xs font-bold">{e}</span>
                            ))}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2 items-center">
                          {bid.status === 'pending' && (
                            <>
                              {user && user.uid === studentId && (
                                <button
                                  onClick={() => handleStartChat(bid, 'accepted')}
                                  className="btn-primary text-xs py-2 px-4 font-bold"
                                >
                                  <CheckCircle size={13} /> Accept
                                </button>
                              )}

                              {canNegotiate && (
                                <button
                                  onClick={() => handleStartChat(bid)}
                                  className="btn-ghost text-xs py-2 px-3 font-bold flex items-center gap-1"
                                >
                                  <MessageSquare size={13} /> Negotiate
                                </button>
                              )}
                            </>
                          )}

                          {bid.status === 'accepted' && (
                            <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-bold bg-emerald-500/15 text-emerald-600 border border-emerald-500/25">
                              <CheckCircle size={12} /> Accepted
                            </span>
                          )}

                          {bid.status === 'accepted' && canNegotiate && (
                            <button
                              onClick={() => handleStartChat(bid)}
                              className="btn-ghost text-xs py-1.5 px-3 font-bold flex items-center gap-1"
                            >
                              <MessageSquare size={12} /> Open Chat
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Success message */}
              <AnimatePresence>
                {submitted && (
                  <motion.div
                    className="mt-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm flex items-center gap-2 font-bold"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <CheckCircle size={16} /> Your bid has been submitted successfully!
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Posted by */}
            <motion.div className="glass-card p-6"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <h3 className="text-[#0B071E]/50 text-xs font-bold mb-4 uppercase tracking-widest">Posted by</h3>
              <div className="flex items-center gap-3 mb-4">
                <img src={request.student.avatar} alt={request.student.name}
                  className="w-12 h-12 rounded-full border border-black/10" />
                <div>
                  <div className="font-bold text-[#0B071E]">{request.student.name}</div>
                  <div className="text-[#0B071E]/50 text-xs font-semibold">{request.student.university}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm mb-4">
                <Star size={13} className="fill-yellow-500 text-yellow-500" />
                <span className="font-extrabold text-[#0B071E]">{request.student.rating}</span>
                <span className="text-[#0B071E]/50 font-bold">student rating</span>
              </div>
              <div className="text-xs text-[#0B071E]/40 font-bold">
                Posted {new Date(request.postedAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </motion.div>

            {/* Place bid CTA */}
            {request.status === 'open' && !submitted && (
              <motion.div
                className="p-6 rounded-2xl bg-gradient-to-br from-[#8B5CF6]/10 to-[#0891B2]/5 border border-[#8B5CF6]/20"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <h3 className="font-display font-black text-lg mb-2 text-[#0B071E]">Want to help?</h3>
                <p className="text-[#0B071E]/60 text-xs mb-4 font-semibold">Place your bid and start teaching immediately after acceptance.</p>
                <button onClick={() => setShowBidForm(!showBidForm)} className="btn-primary w-full font-bold">
                  <SendHorizontal size={15} />
                  {showBidForm ? 'Hide Bid Form' : 'Place a Bid'}
                </button>
              </motion.div>
            )}

            {/* Bid form */}
            <AnimatePresence>
              {showBidForm && (
                <motion.div className="glass-card p-6"
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}>
                  <h3 className="font-display font-black text-sm mb-4 text-[#0B071E]">Your Bid</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-[#0B071E]/60 font-bold mb-1.5 block">Bid Amount (PKR)</label>
                      <input type="number" value={bidAmount} onChange={e => setBidAmount(e.target.value)}
                        placeholder={`≤ ${request.budget}`} className="input-field" />
                    </div>
                    <div>
                      <label className="text-xs text-[#0B071E]/60 font-bold mb-1.5 block">Message to Student</label>
                      <textarea value={bidMessage} onChange={e => setBidMessage(e.target.value)}
                        placeholder="Introduce yourself and explain why you're the best fit..."
                        rows={4} className="input-field resize-none" />
                    </div>
                    <button 
                      onClick={handleSubmitBid} 
                      disabled={submittingBid}
                      className="btn-primary w-full text-sm py-2.5 font-bold disabled:opacity-60"
                    >
                      {submittingBid ? 'Submitting...' : 'Submit Bid'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
