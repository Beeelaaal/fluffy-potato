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

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center justify-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={14} className={i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-black/10 dark:fill-white/10 text-black/10 dark:text-white/10'} />
      ))}
      <span className="ml-1.5 text-sm font-semibold">{rating.toFixed(1)}</span>
    </div>
  );
}

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

      <div className="h-64 overflow-y-auto space-y-3 mb-4 p-4 bg-white/50 dark:bg-white/5 rounded-xl border border-black/5 flex flex-col">
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
                  ? 'bg-[#0066FF] text-white self-end rounded-tr-none'
                  : 'bg-white dark:bg-[#1C1238] text-[#0B071E] border border-black/5 self-start rounded-tl-none'
              }`}>
                {!isMe && <div className="text-[9px] text-[#0066FF] font-black mb-0.5">{m.senderName}</div>}
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

  // Dynamic user profiles from Firestore
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [tutorProfiles, setTutorProfiles] = useState<Record<string, any>>({});

  // Bid submission state
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittingBid, setSubmittingBid] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Ratings session state
  const [ratingVal, setRatingVal] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);

  const fetchRequest = async () => {
    try {
      const reqRef = doc(db, 'marketplace', params.id);
      const reqSnap = await getDoc(reqRef);

      let reqData: any = null;
      if (reqSnap.exists()) {
        reqData = { id: reqSnap.id, ...reqSnap.data() };
      } else {
        const mockReq = marketplaceRequests.find(r => r.id === params.id);
        if (mockReq) {
          reqData = mockReq;
        }
      }
      
      setRequest(reqData);

      if (reqData) {
        const studentUid = reqData.studentId || reqData.student?.id;
        if (studentUid) {
          const studentSnap = await getDoc(doc(db, 'users', studentUid));
          if (studentSnap.exists()) {
            setStudentProfile(studentSnap.data());
          }
        }
      }
    } catch (err) {
      console.error("Error fetching request details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [params.id]);

  useEffect(() => {
    const bidsQuery = query(collection(db, 'bids'), where('requestId', '==', params.id));
    const unsubscribe = onSnapshot(bidsQuery, (snapshot) => {
      const dbBids = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const mockReq = marketplaceRequests.find(r => r.id === params.id);
      const mockBids = mockReq ? mockReq.bids : [];

      const mergedBids = [
        ...dbBids,
        ...mockBids.filter(mb => !dbBids.some(db => db.id === mb.id))
      ];
      setBids(mergedBids);
    });

    return () => unsubscribe();
  }, [params.id]);

  // Fetch tutor profiles when bids list changes
  useEffect(() => {
    if (bids.length === 0) return;
    const fetchTutorProfiles = async () => {
      const uids = [...new Set(bids.map(b => b.tutorId || b.tutor?.id).filter(Boolean))];
      const missing = uids.filter(uid => !tutorProfiles[uid]);
      if (missing.length === 0) return;

      try {
        const fetched: Record<string, any> = {};
        await Promise.all(missing.map(async (uid) => {
          const docRef = doc(db, 'users', uid);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            fetched[uid] = snap.data();
          }
        }));
        if (Object.keys(fetched).length > 0) {
          setTutorProfiles(prev => ({ ...prev, ...fetched }));
        }
      } catch (err) {
        console.error("Error fetching tutor profiles:", err);
      }
    };
    fetchTutorProfiles();
  }, [bids]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="text-[#0B071E] font-display font-black text-xl animate-pulse">Loading request details...</div>
      </div>
    );
  }

  if (!request) notFound();

  const studentId = request.studentId || request.student?.id;
  const studentName = studentProfile?.name || request.student?.name || 'Anonymous Student';
  const studentUniv = studentProfile?.university || request.student?.university || 'University Student';
  const studentRating = studentProfile?.rating || request.student?.rating || 5.0;
  
  const acceptedBid = bids.find(b => b.status === 'accepted');
  const acceptedTutorId = acceptedBid ? (acceptedBid.tutorId || acceptedBid.tutor?.id) : null;

  const handleSubmitBid = async () => {
    if (!user) {
      alert("Please sign in to place a bid! 🎓");
      return;
    }
    if (!bidAmount || !bidMessage) return;
    setSubmittingBid(true);
    try {
      await addDoc(collection(db, 'bids'), {
        requestId: params.id,
        tutorId: user.uid,
        tutor: {
          id: user.uid,
          name: profile?.name || user.displayName || 'Anonymous Tutor',
          avatar: profile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}&backgroundColor=0f0f1a`,
          university: profile?.university || 'University Tutor',
          rating: profile?.rating || 4.8,
          completedSessions: profile?.completedSessions || 14,
          expertise: profile?.preferences ? profile.preferences.split(',') : ['Academic Tutoring'],
        },
        amount: Number(bidAmount),
        message: bidMessage,
        status: 'pending',
        postedAt: new Date().toISOString(),
      });

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
    const tutorUid = bid.tutorId || bid.tutor.id;
    const chatId = `${params.id}_${tutorUid}`;
    try {
      const chatRef = doc(db, 'chats', chatId);
      const chatSnap = await getDoc(chatRef);
      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          requestId: params.id,
          requestTitle: request.title,
          studentId: studentId,
          tutorId: tutorUid,
          studentName: studentName,
          tutorName: bid.tutor.name,
          studentAvatar: studentProfile?.photoURL || request.student?.avatar,
          tutorAvatar: bid.tutor.avatar,
          status: 'active',
          lastMessage: 'Chat started',
          lastMessageAt: new Date().toISOString(),
        });
      }

      if (newStatus === 'accepted') {
        if (bid.id && !bid.id.startsWith('b0')) {
          await updateDoc(doc(db, 'bids', bid.id), { status: 'accepted' });
        }
        const reqRef = doc(db, 'marketplace', params.id);
        const reqSnap = await getDoc(reqRef);
        if (reqSnap.exists()) {
          await updateDoc(reqRef, { status: 'in-progress' });
        }
        alert("Bid accepted! Negotiation chat room initialized. 🤝");
      }

      setActiveChatId(chatId);
      await fetchRequest();
    } catch (err: any) {
      console.error("Error initiating chat:", err);
      alert("Failed to start chat: " + (err?.message || "Please check your network rules."));
    }
  };

  const handleSubmitRating = async (ratedRole: 'tutor' | 'student') => {
    if (!user) return;
    setSubmittingRating(true);
    try {
      const ratedUid = ratedRole === 'tutor' ? acceptedTutorId : studentId;
      if (!ratedUid) throw new Error("Target user ID not found");

      // 1. Recalculate average rating
      const ratedUserRef = doc(db, 'users', ratedUid);
      const ratedUserSnap = await getDoc(ratedUserRef);
      
      let oldCount = 0;
      let oldRating = 5.0;
      let currentCompletedSessions = 0;

      if (ratedUserSnap.exists()) {
        const data = ratedUserSnap.data();
        oldCount = data.ratingsCount || 0;
        oldRating = data.rating || 5.0;
        currentCompletedSessions = data.completedSessions || data.sessions || 0;
      }

      const newCount = oldCount + 1;
      const newRating = ((oldRating * oldCount) + ratingVal) / newCount;

      const userUpdate: any = {
        rating: Number(newRating.toFixed(2)),
        ratingsCount: newCount,
      };

      if (ratedRole === 'tutor') {
        userUpdate.completedSessions = currentCompletedSessions + 1;
      }

      await updateDoc(ratedUserRef, userUpdate);

      // 2. Update request status/rating info in Firestore
      const reqRef = doc(db, 'marketplace', params.id);
      const reqUpdate: any = {};
      if (ratedRole === 'tutor') {
        reqUpdate.studentRatedTutor = true;
        reqUpdate.tutorRatingFromStudent = ratingVal;
        reqUpdate.tutorReviewFromStudent = ratingComment;
      } else {
        reqUpdate.tutorRatedStudent = true;
        reqUpdate.studentRatingFromTutor = ratingVal;
        reqUpdate.studentReviewFromTutor = ratingComment;
      }

      // Mark request as closed once rated
      reqUpdate.status = 'closed';

      await updateDoc(reqRef, reqUpdate);
      
      // Update local state
      setRequest((p: any) => p ? { ...p, ...reqUpdate } : null);
      setRatingVal(5);
      setRatingComment('');
      alert("Rating submitted successfully! 🌟");
      await fetchRequest();
    } catch (err: any) {
      console.error("Error submitting rating:", err);
      alert("Failed to submit rating: " + err.message);
    } finally {
      setSubmittingRating(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 relative">
      <div className="absolute top-0 left-1/4 w-[400px] h-[300px] bg-funky-blue/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="section-container relative">
        <Link href="/marketplace"
          className="inline-flex items-center gap-2 text-[#0B071E]/60 hover:text-[#0066FF] text-sm mb-8 transition-colors font-bold">
          <ArrowLeft size={15} /> Back to Marketplace
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
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
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-full text-[#0B071E]/60 font-bold border border-black/10 bg-white/60 dark:bg-white/5">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Request stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 p-5 rounded-2xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/5">
                <div className="text-center pb-4 sm:pb-0 border-b sm:border-b-0 sm:border-r border-black/5 dark:border-white/5">
                  <DollarSign size={16} className="text-[#0066FF] mx-auto mb-1" />
                  <div className="font-display font-black text-lg sm:text-xl text-[#0B071E]">PKR {request.budget.toLocaleString()}</div>
                  <div className="text-[#0B071E]/50 text-xs font-bold">Budget</div>
                </div>
                <div className="text-center pb-4 sm:pb-0 border-b sm:border-b-0 sm:border-r border-black/5 dark:border-white/5">
                  <Clock size={16} className="text-[#0891B2] mx-auto mb-1" />
                  <div className="font-bold text-sm sm:text-base text-[#0B071E]">{request.duration}</div>
                  <div className="text-[#0B071E]/50 text-xs font-bold">Duration</div>
                </div>
                <div className="text-center">
                  <MessageSquare size={16} className="text-[#EA580C] mx-auto mb-1" />
                  <div className="font-display font-black text-lg sm:text-xl text-[#0B071E]">{bids.length}</div>
                  <div className="text-[#0B071E]/50 text-xs font-bold">Bids Received</div>
                </div>
              </div>
            </motion.div>

            {/* Active Session & Rating Actions */}
            {request.status === 'in-progress' && acceptedBid && (
              <motion.div 
                className="glass-card p-6 border-[#0066FF]/30 shadow-lime"
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="font-display font-black text-xl mb-4 text-[#0B071E] flex items-center gap-2">
                  <Star className="text-amber-500 fill-amber-500" size={20} />
                  Active Learning Session
                </h3>
                <p className="text-sm font-semibold text-[#0B071E]/70 mb-5">
                  Your session is actively ongoing with tutor <strong>{acceptedBid.tutor.name}</strong>. Once complete, please rate each other below to close the request.
                </p>

                {/* Case A: Current user is the Student (Request Owner) */}
                {user && user.uid === studentId && (
                  !request.studentRatedTutor ? (
                    <div className="space-y-4 border-t border-black/5 pt-4">
                      <h4 className="font-display font-bold text-sm text-[#0B071E]">Rate your Tutor: {acceptedBid.tutor.name}</h4>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button 
                            key={star} 
                            type="button" 
                            onClick={() => setRatingVal(star)}
                            className="p-1 hover:scale-115 transition-transform"
                          >
                            <Star 
                              size={26} 
                              className={star <= ratingVal ? 'fill-yellow-500 text-yellow-500' : 'text-black/20 dark:text-white/20'} 
                            />
                          </button>
                        ))}
                      </div>
                      <div>
                        <label className="text-xs text-[#0B071E]/60 font-bold block mb-1.5 uppercase">Review Message</label>
                        <textarea
                          value={ratingComment}
                          onChange={e => setRatingComment(e.target.value)}
                          placeholder="Introduce how helpful the tutor was..."
                          rows={3}
                          className="input-field resize-none"
                        />
                      </div>
                      <button
                        onClick={() => handleSubmitRating('tutor')}
                        disabled={submittingRating}
                        className="btn-primary py-2.5 px-5 text-xs font-bold"
                      >
                        {submittingRating ? 'Submitting...' : 'Complete Session & Rate Tutor'}
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-emerald-600 font-bold bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                      ✓ You have submitted your rating for tutor {acceptedBid.tutor.name}.
                    </p>
                  )
                )}

                {/* Case B: Current user is the accepted Tutor */}
                {user && user.uid === acceptedTutorId && (
                  !request.tutorRatedStudent ? (
                    <div className="space-y-4 border-t border-black/5 pt-4">
                      <h4 className="font-display font-bold text-sm text-[#0B071E]">Rate your Student: {studentName}</h4>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button 
                            key={star} 
                            type="button" 
                            onClick={() => setRatingVal(star)}
                            className="p-1 hover:scale-115 transition-transform"
                          >
                            <Star 
                              size={26} 
                              className={star <= ratingVal ? 'fill-yellow-500 text-yellow-500' : 'text-black/20 dark:text-white/20'} 
                            />
                          </button>
                        ))}
                      </div>
                      <div>
                        <label className="text-xs text-[#0B071E]/60 font-bold block mb-1.5 uppercase">Review Message</label>
                        <textarea
                          value={ratingComment}
                          onChange={e => setRatingComment(e.target.value)}
                          placeholder="How prepared was the student? Did they coordinate well?"
                          rows={3}
                          className="input-field resize-none"
                        />
                      </div>
                      <button
                        onClick={() => handleSubmitRating('student')}
                        disabled={submittingRating}
                        className="btn-primary py-2.5 px-5 text-xs font-bold"
                      >
                        {submittingRating ? 'Submitting...' : 'Complete Session & Rate Student'}
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-emerald-600 font-bold bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                      ✓ You have submitted your rating for student {studentName}.
                    </p>
                  )
                )}
              </motion.div>
            )}

            {/* Session Rating Outcomes for Completed requests */}
            {request.status === 'closed' && (request.tutorRatingFromStudent || request.studentRatingFromTutor) && (
              <motion.div 
                className="glass-card p-6 border-emerald-500/30 bg-emerald-500/5"
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="font-display font-black text-xl mb-4 text-[#0B071E] flex items-center gap-2">
                  <CheckCircle className="text-emerald-500" size={20} />
                  Session Feedback & Reviews
                </h3>
                <div className="space-y-4">
                  {request.tutorRatingFromStudent && (
                    <div className="bg-white/40 dark:bg-white/5 p-4 rounded-xl border border-black/5">
                      <div className="text-xs font-bold text-[#0066FF] mb-1.5 uppercase tracking-wider">Student's Review of Tutor</div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <StarRating rating={request.tutorRatingFromStudent} />
                      </div>
                      <p className="text-[#0B071E]/80 text-sm italic">"{request.tutorReviewFromStudent || 'No comments left.'}"</p>
                    </div>
                  )}
                  {request.studentRatingFromTutor && (
                    <div className="bg-white/40 dark:bg-white/5 p-4 rounded-xl border border-black/5">
                      <div className="text-xs font-bold text-[#0066FF] mb-1.5 uppercase tracking-wider">Tutor's Review of Student</div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <StarRating rating={request.studentRatingFromTutor} />
                      </div>
                      <p className="text-[#0B071E]/80 text-sm italic">"{request.studentReviewFromTutor || 'No comments left.'}"</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Negotiation Chat Panel */}
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
                <MessageSquare size={18} className="text-[#0066FF]" />
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
                    const tutorUid = bid.tutorId || bid.tutor.id;
                    const canNegotiate = user && (user.uid === studentId || user.uid === tutorUid || profile?.role === 'admin');

                    // Read dynamic tutor details from Firestore profiles dictionary
                    const dynamicTutor = tutorProfiles[tutorUid];
                    const tutorNameText = dynamicTutor?.name || bid.tutor.name;
                    const tutorUnivText = dynamicTutor?.university || bid.tutor.university;
                    const tutorRatingVal = dynamicTutor?.rating || bid.tutor.rating || 4.8;
                    const tutorSessionsCount = dynamicTutor?.completedSessions || dynamicTutor?.sessions || bid.tutor.completedSessions || 0;
                    const tutorBio = dynamicTutor?.bio || '';
                    const tutorPrefs = dynamicTutor?.preferences || '';

                    return (
                      <motion.div key={bid.id || i}
                        className="p-5 rounded-2xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 hover:border-[#0066FF]/30 hover:bg-white dark:hover:bg-[#1C1238] hover:shadow-[4px_4px_0px_#0066FF] hover:-translate-y-1 transition-all duration-200 cursor-pointer text-[#0B071E] dark:text-white"
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}>
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3 pb-3 border-b border-black/5 sm:border-0 sm:pb-0">
                          <div className="flex items-center gap-3">
                            <img src={bid.tutor.avatar} alt={tutorNameText}
                              className="w-10 h-10 rounded-full border border-black/10" />
                            <div>
                              <div className="font-bold text-sm text-[#0B071E] dark:text-white">{tutorNameText}</div>
                              <div className="text-[#0B071E]/50 dark:text-white/60 text-xs font-semibold">{tutorUnivText}</div>
                            </div>
                          </div>
                          <div className="text-left sm:text-right">
                            <div className="font-display font-black text-lg text-[#0066FF] dark:text-[#60A5FA]">PKR {bid.amount.toLocaleString()}</div>
                            <div className="flex items-center sm:justify-end gap-1 text-xs text-[#0B071E]/50 dark:text-white/40 font-bold mt-0.5">
                              <Star size={10} className="fill-yellow-500 text-yellow-500" />
                              {tutorRatingVal.toFixed(1)} · {tutorSessionsCount} sessions
                            </div>
                          </div>
                        </div>

                        <p className="text-[#0B071E]/75 dark:text-white/80 text-sm leading-relaxed mb-3 font-semibold">{bid.message}</p>

                        {/* Display Tutor Bio & Preferences if loaded */}
                        {(tutorBio || tutorPrefs) && (
                          <div className="my-3 p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 text-xs space-y-2">
                            {tutorBio && (
                              <p className="text-[#0B071E]/60 dark:text-white/70 italic font-semibold">"About: {tutorBio}"</p>
                            )}
                            {tutorPrefs && (
                              <div>
                                <span className="font-bold text-[#0066FF] dark:text-[#60A5FA]">Preferences: </span>
                                <span className="text-[#0B071E]/70 dark:text-white/80 font-medium">{tutorPrefs}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {bid.tutor.expertise && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {bid.tutor.expertise.map((exp: string) => (
                              <span key={exp} className="tag-pill text-xs font-bold">{exp}</span>
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
                                  <CheckCircle size={13} /> Accept Bid
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
                              <CheckCircle size={12} /> Accepted Partner
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
              <h3 className="text-[#0B071E]/50 dark:text-white/40 text-xs font-bold mb-4 uppercase tracking-widest">Posted by</h3>
              <div className="flex items-center gap-3 mb-4">
                <img src={studentProfile?.photoURL || request.student?.avatar} alt={studentName}
                  className="w-12 h-12 rounded-full border border-black/10" />
                <div>
                  <div className="font-bold text-[#0B071E] dark:text-white">{studentName}</div>
                  <div className="text-[#0B071E]/50 dark:text-white/60 text-xs font-semibold">{studentUniv}</div>
                </div>
              </div>
              
              {/* Dynamic Student Rating */}
              <div className="flex items-center gap-1.5 text-sm mb-4">
                <Star size={13} className="fill-yellow-500 text-yellow-500" />
                <span className="font-extrabold text-[#0B071E] dark:text-white">{studentRating.toFixed(1)}</span>
                <span className="text-[#0B071E]/50 dark:text-white/50 font-bold">student rating</span>
              </div>

              {/* Dynamic Student Bio and Preferences */}
              {(studentProfile?.bio || studentProfile?.preferences) && (
                <div className="border-t border-black/5 dark:border-white/5 pt-4 mt-3 space-y-3 text-xs">
                  {studentProfile?.bio && (
                    <div>
                      <span className="font-bold text-[#0066FF] dark:text-[#60A5FA] block mb-1">About Student:</span>
                      <p className="text-[#0B071E]/70 dark:text-white/80 leading-relaxed font-semibold italic">"{studentProfile.bio}"</p>
                    </div>
                  )}
                  {studentProfile?.preferences && (
                    <div>
                      <span className="font-bold text-[#0066FF] dark:text-[#60A5FA] block mb-1">Student Interests:</span>
                      <p className="text-[#0B071E]/70 dark:text-white/80 font-semibold">{studentProfile.preferences}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="text-xs text-[#0B071E]/40 dark:text-white/30 font-bold border-t border-black/5 dark:border-white/5 pt-4 mt-4">
                Posted {new Date(request.postedAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </motion.div>

            {/* Place bid CTA */}
            {request.status === 'open' && !submitted && (
              <motion.div
                className="p-6 rounded-2xl bg-gradient-to-br from-[#0066FF]/10 to-[#0891B2]/5 border border-[#0066FF]/20"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <h3 className="font-display font-black text-lg mb-2 text-[#0B071E] dark:text-white">Want to help?</h3>
                <p className="text-[#0B071E]/60 dark:text-white/60 text-xs mb-4 font-semibold">Place your bid and start teaching immediately after acceptance.</p>
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
                  <h3 className="font-display font-black text-sm mb-4 text-[#0B071E] dark:text-white">Your Bid</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-[#0B071E]/60 dark:text-white/60 font-bold mb-1.5 block">Bid Amount (PKR)</label>
                      <input type="number" value={bidAmount} onChange={e => setBidAmount(e.target.value)}
                        placeholder={`≤ ${request.budget}`} className="input-field" />
                    </div>
                    <div>
                      <label className="text-xs text-[#0B071E]/60 dark:text-white/60 font-bold mb-1.5 block">Message to Student</label>
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
