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
          className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={15} /> Back to Marketplace
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header card */}
            <motion.div className="glass-card p-7"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`text-xs px-3 py-1.5 rounded-full font-medium border ${
                  request.status === 'open'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
                    : request.status === 'in-progress'
                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/25'
                    : 'bg-white/5 text-white/30 border-white/10'
                } capitalize`}>
                  {request.status === 'open' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5" />}
                  {request.status.replace('-', ' ')}
                </span>
                <span className="tag-pill">{request.subject}</span>
                <span className="flex items-center gap-1 text-xs text-white/40">
                  {request.sessionType === 'online' ? <Wifi size={11} /> : <MapPin size={11} />}
                  {request.sessionType}
                </span>
              </div>

              <h1 className="font-display font-bold text-2xl sm:text-3xl mb-4">{request.title}</h1>
              <p className="text-white/60 leading-relaxed mb-6">{request.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {request.tags.map(tag => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full text-white/40"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Request stats */}
              <div className="grid grid-cols-3 gap-4 p-5 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-center">
                  <DollarSign size={16} className="text-brand-400 mx-auto mb-1" />
                  <div className="font-bold text-lg">PKR {request.budget.toLocaleString()}</div>
                  <div className="text-white/40 text-xs">Budget</div>
                </div>
                <div className="text-center">
                  <Clock size={16} className="text-cyan-400 mx-auto mb-1" />
                  <div className="font-bold text-sm">{request.duration}</div>
                  <div className="text-white/40 text-xs">Duration</div>
                </div>
                <div className="text-center">
                  <MessageSquare size={16} className="text-purple-400 mx-auto mb-1" />
                  <div className="font-bold text-lg">{request.bids.length}</div>
                  <div className="text-white/40 text-xs">Bids Received</div>
                </div>
              </div>
            </motion.div>

            {/* Bids */}
            <motion.div className="glass-card p-7"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <h2 className="font-semibold text-lg mb-5 flex items-center gap-2">
                <MessageSquare size={18} className="text-brand-400" />
                Bids ({request.bids.length})
              </h2>

              {request.bids.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="text-white/40">No bids yet. Be the first to bid!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {request.bids.map((bid, i) => (
                    <motion.div key={bid.id}
                      className="p-5 rounded-2xl"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}>
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <img src={bid.tutor.avatar} alt={bid.tutor.name}
                            className="w-10 h-10 rounded-full border border-white/10" />
                          <div>
                            <div className="font-semibold text-sm">{bid.tutor.name}</div>
                            <div className="text-white/40 text-xs">{bid.tutor.university}</div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-bold text-lg text-brand-400">PKR {bid.amount.toLocaleString()}</div>
                          <div className="flex items-center justify-end gap-1 text-xs text-white/40 mt-0.5">
                            <Star size={10} className="fill-yellow-400 text-yellow-400" />
                            {bid.tutor.rating} · {bid.tutor.completedSessions} sessions
                          </div>
                        </div>
                      </div>

                      <p className="text-white/60 text-sm leading-relaxed mb-4">{bid.message}</p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {bid.tutor.expertise.map(e => (
                          <span key={e} className="tag-pill text-xs">{e}</span>
                        ))}
                      </div>

                      {bid.status === 'pending' && request.status === 'open' && (
                        <div className="flex gap-2">
                          <button className="btn-primary text-xs py-2 px-4">
                            <CheckCircle size={13} /> Accept
                          </button>
                          <button className="btn-ghost text-xs py-2 px-3">
                            Negotiate
                          </button>
                          <button className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl text-white/40 hover:text-red-400 transition-colors"
                            style={{ background: 'rgba(255,255,255,0.04)' }}>
                            <X size={13} /> Reject
                          </button>
                        </div>
                      )}

                      {bid.status === 'accepted' && (
                        <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
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
                    className="mt-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2"
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
              <h3 className="text-white/60 text-sm font-semibold mb-4">Posted by</h3>
              <div className="flex items-center gap-3 mb-4">
                <img src={request.student.avatar} alt={request.student.name}
                  className="w-12 h-12 rounded-full border border-white/10" />
                <div>
                  <div className="font-semibold">{request.student.name}</div>
                  <div className="text-white/40 text-xs">{request.student.university}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm mb-4">
                <Star size={13} className="fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{request.student.rating}</span>
                <span className="text-white/40">student rating</span>
              </div>
              <div className="text-xs text-white/35">
                Posted {new Date(request.postedAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </motion.div>

            {/* Place bid CTA */}
            {request.status === 'open' && !submitted && (
              <motion.div
                className="p-6 rounded-2xl"
                style={{ background: 'linear-gradient(135deg, rgba(91,99,245,0.12), rgba(124,58,237,0.08))', border: '1px solid rgba(91,99,245,0.2)' }}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <h3 className="font-semibold mb-2">Want to help?</h3>
                <p className="text-white/45 text-xs mb-4">Place your bid and start teaching immediately after acceptance.</p>
                <button onClick={() => setShowBidForm(!showBidForm)} className="btn-primary w-full">
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
                  <h3 className="font-semibold text-sm mb-4">Your Bid</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-white/50 mb-1.5 block">Bid Amount (PKR)</label>
                      <input type="number" value={bidAmount} onChange={e => setBidAmount(e.target.value)}
                        placeholder={`≤ ${request.budget}`} className="input-field" />
                    </div>
                    <div>
                      <label className="text-xs text-white/50 mb-1.5 block">Message to Student</label>
                      <textarea value={bidMessage} onChange={e => setBidMessage(e.target.value)}
                        placeholder="Introduce yourself and explain why you're the best fit..."
                        rows={4} className="input-field resize-none" />
                    </div>
                    <button onClick={handleSubmitBid} className="btn-primary w-full text-sm py-2.5">
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
