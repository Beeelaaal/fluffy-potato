'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, Clock, DollarSign, MessageSquare, Star, CheckCircle,
  X, SendHorizontal, User, Wifi, MapPin
} from 'lucide-react';
import { marketplaceRequests } from '@/data/marketplace';

export default function RequestDetailPage({ params }: { params: { id: string } }) {
  const request = marketplaceRequests.find(r => r.id === params.id);
  if (!request) notFound();

  const [showBidForm, setShowBidForm] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitBid = () => {
    if (!bidAmount || !bidMessage) return;
    setSubmitted(true);
    setShowBidForm(false);
    setBidAmount(''); setBidMessage('');
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="absolute top-0 left-1/4 w-[400px] h-[300px] bg-brand-600/10 blur-[100px] rounded-full pointer-events-none" />

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

              <div className="flex flex-wrap gap-2 mb-6">
                {request.tags.map(tag => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full text-[#0B071E]/60 font-bold border border-black/10 bg-white/60">
                    #{tag}
                  </span>
                ))}
              </div>

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
                  <div className="font-display font-black text-xl text-[#0B071E]">{request.bids.length}</div>
                  <div className="text-[#0B071E]/50 text-xs font-bold">Bids Received</div>
                </div>
              </div>
            </motion.div>

            {/* Bids */}
            <motion.div className="glass-card p-7"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <h2 className="font-display font-black text-xl mb-5 flex items-center gap-2 text-[#0B071E]">
                <MessageSquare size={18} className="text-[#8B5CF6]" />
                Bids ({request.bids.length})
              </h2>

              {request.bids.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="text-[#0B071E]/50 font-bold">No bids yet. Be the first to bid!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {request.bids.map((bid, i) => (
                    <motion.div key={bid.id}
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

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {bid.tutor.expertise.map(e => (
                          <span key={e} className="tag-pill text-xs font-bold">{e}</span>
                        ))}
                      </div>

                      {bid.status === 'pending' && request.status === 'open' && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              window.dispatchEvent(new CustomEvent('tute-match-tutor'));
                              alert('Accepting bid... A matchmaking event has been triggered! 🤝');
                            }}
                            className="btn-primary text-xs py-2 px-4 font-bold"
                          >
                            <CheckCircle size={13} /> Accept
                          </button>
                          <button 
                            onClick={() => alert('Feature coming soon: chat with tutor to negotiate details! 💬')}
                            className="btn-ghost text-xs py-2 px-3 font-bold"
                          >
                            Negotiate
                          </button>
                          <button 
                            onClick={() => alert('Bid rejected.')}
                            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl text-[#0B071E]/50 hover:text-red-500 transition-colors bg-black/5"
                          >
                            <X size={13} /> Reject
                          </button>
                        </div>
                      )}

                      {bid.status === 'accepted' && (
                        <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-bold bg-emerald-500/15 text-emerald-600 border border-emerald-500/25">
                          <CheckCircle size={12} /> Accepted
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Success message */}
              <AnimatePresence>
                {submitted && (
                  <motion.div
                    className="mt-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm flex items-center gap-2 font-bold animate-pulse"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <CheckCircle size={16} /> Your bid has been submitted!
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
                    <button onClick={handleSubmitBid} className="btn-primary w-full text-sm py-2.5 font-bold">
                      Submit Bid
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
