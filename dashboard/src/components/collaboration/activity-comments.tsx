"use client";

import React, { useState } from 'react';
import {
  Activity, MessageSquare, AtSign, SmilePlus, Code2, Paperclip,
  Send, Bot, User, Settings, ChevronDown, Heart, ThumbsUp, Flame
} from 'lucide-react';
import { ActivityEvent, Comment } from './types';
import { toast } from '@/components/ui/toast';

interface Props {
  activities: ActivityEvent[];
  comments: Comment[];
  onAddComment: (text: string) => void;
}

const TYPE_STYLES: Record<string, { color: string; icon: string }> = {
  assignment: { color: 'text-[#2266ec]', icon: '👤' },
  ai_action: { color: 'text-purple-400', icon: '🤖' },
  comment: { color: 'text-cyan-400', icon: '💬' },
  approval: { color: 'text-green-400', icon: '✅' },
  task_update: { color: 'text-amber-400', icon: '📋' },
  system: { color: 'text-[#656565]', icon: '⚙️' },
  decision: { color: 'text-pink-400', icon: '⚖️' },
};

const REACTIONS = [
  { emoji: '👍', label: 'Thumbs Up' },
  { emoji: '❤️', label: 'Heart' },
  { emoji: '🔥', label: 'Fire' },
  { emoji: '🎯', label: 'Bullseye' },
  { emoji: '👀', label: 'Eyes' },
  { emoji: '🚀', label: 'Rocket' },
];

export function ActivityFeedComments({ activities, comments, onAddComment }: Props) {
  const [newComment, setNewComment] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [localReactions, setLocalReactions] = useState<Record<string, Record<string, number>>>({});
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);
  const [feedFilter, setFeedFilter] = useState<'all' | 'human' | 'ai'>('all');

  const filteredActivities = activities.filter(a => {
    if (feedFilter === 'human') return a.actorType === 'user';
    if (feedFilter === 'ai') return a.actorType === 'ai_agent';
    return true;
  });

  const handleReact = (commentId: string, emoji: string) => {
    setLocalReactions(prev => {
      const existing = prev[commentId] ?? {};
      return { ...prev, [commentId]: { ...existing, [emoji]: (existing[emoji] ?? 0) + 1 } };
    });
    setShowReactionPicker(null);
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    onAddComment(newComment);
    setNewComment('');
    setShowCode(false);
    toast('Comment posted', { type: 'success' });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Universal Activity Feed */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#2266ec]" /> Universal Activity Feed
          </h3>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold">
            {(['all', 'human', 'ai'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFeedFilter(f)}
                className={`px-2.5 py-1 rounded-lg border transition-all capitalize ${
                  feedFilter === f
                    ? 'bg-[#2266ec] border-[#2266ec] text-white'
                    : 'bg-[#121212] border-[#262626] text-[#656565] hover:text-white'
                }`}
              >
                {f === 'all' ? 'All Events' : f === 'human' ? 'Human' : 'AI'}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="relative space-y-0">
          <div className="absolute left-[15px] top-3 bottom-3 w-0.5 bg-[#262626]" />
          {filteredActivities.map(ev => {
            const style = TYPE_STYLES[ev.type] ?? TYPE_STYLES.system;
            return (
              <div key={ev.id} className="relative flex gap-3 py-2.5">
                <div className="relative z-10 w-8 h-8 rounded-full bg-[#121212] border border-[#262626] flex items-center justify-center text-sm shrink-0">
                  {ev.actorAvatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs">
                    <span className="font-bold text-white">{ev.actor}</span>
                    <span className="text-[#a6a6a6]"> {ev.action} </span>
                    <span className={`font-semibold ${style.color}`}>{ev.target}</span>
                  </div>
                  <div className="text-[10px] text-[#656565] font-mono mt-0.5 flex items-center gap-2">
                    <span>{ev.timestamp}</span>
                    <span className="text-[9px] bg-[#1a1a1a] px-1.5 py-0.5 rounded border border-[#262626]">{style.icon} {ev.type.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comments Engine */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" /> Comments & Discussion
          </h3>
          <span className="text-[10px] text-[#656565] font-mono">{comments.length} comments</span>
        </div>

        {/* Comment List */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {comments.map(c => {
            const extraReactions = localReactions[c.id] ?? {};
            return (
              <div key={c.id} className="bg-[#121212] border border-[#262626] rounded-xl p-4 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#1a1a1a] border border-[#262626] flex items-center justify-center text-sm">
                    {c.authorAvatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-xs">{c.author}</span>
                      {c.authorType === 'ai_agent' && (
                        <span className="text-[8px] bg-purple-500/20 text-purple-400 px-1 py-0.5 rounded font-bold">AI</span>
                      )}
                    </div>
                    <div className="text-[9px] text-[#656565] font-mono">{c.timestamp}</div>
                  </div>
                </div>

                {/* Content */}
                <div className="text-xs text-[#a6a6a6] leading-relaxed whitespace-pre-wrap">
                  {c.content.split(/(@\w+)/g).map((part, i) =>
                    part.startsWith('@') ? (
                      <span key={i} className="text-[#2266ec] font-bold cursor-pointer hover:underline">{part}</span>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </div>

                {/* Code Block */}
                {c.hasCode && (
                  <div className="bg-[#0f0f0f] border border-[#262626] rounded-lg p-3 font-mono text-[10px] text-green-400">
                    <div className="text-[9px] text-[#656565] mb-1 flex items-center gap-1"><Code2 className="w-3 h-3" /> Code snippet</div>
                    {`SELECT customer_id, SUM(amount)\nFROM payments\nWHERE status = 'failed'\nGROUP BY customer_id\nORDER BY SUM(amount) DESC\nLIMIT 10;`}
                  </div>
                )}

                {/* Mentions */}
                {c.mentions.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <AtSign className="w-3 h-3 text-[#656565]" />
                    {c.mentions.map(m => (
                      <span key={m} className="text-[9px] bg-[#2266ec]/10 text-[#2266ec] px-1.5 py-0.5 rounded font-semibold">{m}</span>
                    ))}
                  </div>
                )}

                {/* Reactions */}
                <div className="flex items-center gap-1.5 flex-wrap relative">
                  {c.reactions.map(r => (
                    <span key={r.emoji} className="text-[10px] bg-[#1a1a1a] border border-[#262626] px-1.5 py-0.5 rounded-full flex items-center gap-1 cursor-pointer hover:border-[#333]">
                      {r.emoji} <span className="text-[#a6a6a6] font-mono">{r.count + (extraReactions[r.emoji] ?? 0)}</span>
                    </span>
                  ))}
                  {Object.entries(extraReactions).filter(([emoji]) => !c.reactions.find(r => r.emoji === emoji)).map(([emoji, count]) => (
                    <span key={emoji} className="text-[10px] bg-[#2266ec]/10 border border-[#2266ec]/30 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                      {emoji} <span className="text-[#2266ec] font-mono">{count}</span>
                    </span>
                  ))}
                  <button
                    onClick={() => setShowReactionPicker(showReactionPicker === c.id ? null : c.id)}
                    className="text-[#656565] hover:text-white p-0.5 rounded transition-colors"
                  >
                    <SmilePlus className="w-3.5 h-3.5" />
                  </button>
                  {showReactionPicker === c.id && (
                    <div className="absolute bottom-full left-0 mb-1 bg-[#1a1a1a] border border-[#262626] rounded-lg p-1.5 flex gap-1 shadow-xl z-10">
                      {REACTIONS.map(r => (
                        <button key={r.emoji} onClick={() => handleReact(c.id, r.emoji)} className="text-sm hover:scale-125 transition-transform" title={r.label}>
                          {r.emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* New Comment Composer */}
        <div className="bg-[#121212] border border-[#262626] rounded-xl p-3 space-y-2">
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Write a comment... Use @mention to tag people or AI agents"
            className="w-full bg-transparent text-xs text-white outline-none resize-none min-h-[60px] placeholder:text-[#656565]"
            onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleSubmitComment(); }}
          />
          {showCode && (
            <div className="bg-[#0f0f0f] border border-[#262626] rounded-lg p-2">
              <textarea
                placeholder="Paste code here..."
                className="w-full bg-transparent text-[10px] font-mono text-green-400 outline-none resize-none min-h-[40px] placeholder:text-[#333]"
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <button onClick={() => toast('Mention picker', { type: 'info' })} className="p-1.5 rounded-lg bg-[#1a1a1a] border border-[#262626] text-[#656565] hover:text-[#2266ec] transition-colors" title="Mention">
                <AtSign className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setShowCode(!showCode)} className={`p-1.5 rounded-lg border transition-colors ${showCode ? 'bg-[#2266ec]/10 border-[#2266ec]/30 text-[#2266ec]' : 'bg-[#1a1a1a] border-[#262626] text-[#656565] hover:text-white'}`} title="Code block">
                <Code2 className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 rounded-lg bg-[#1a1a1a] border border-[#262626] text-[#656565] hover:text-white transition-colors" title="Attach file">
                <Paperclip className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 rounded-lg bg-[#1a1a1a] border border-[#262626] text-[#656565] hover:text-white transition-colors" title="Emoji">
                <SmilePlus className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                newComment.trim()
                  ? 'bg-[#2266ec] text-white shadow-lg shadow-[#2266ec]/20'
                  : 'bg-[#1a1a1a] border border-[#262626] text-[#656565] cursor-not-allowed'
              }`}
            >
              <Send className="w-3 h-3" /> Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
