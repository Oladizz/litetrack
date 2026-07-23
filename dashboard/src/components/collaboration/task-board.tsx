"use client";

import React, { useState } from 'react';
import {
  ClipboardList, Plus, Calendar, Flag, User, Users, Bot, ArrowRight,
  MoreHorizontal, GripVertical, Tag, Clock
} from 'lucide-react';
import { TaskItem, TaskStatus, TaskPriority } from './types';
import { toast } from '@/components/ui/toast';

interface Props {
  tasks: TaskItem[];
  onUpdateTask: (id: string, status: TaskStatus) => void;
}

const COLUMNS: { status: TaskStatus; label: string; color: string }[] = [
  { status: 'backlog', label: 'Backlog', color: 'border-[#656565]' },
  { status: 'in_progress', label: 'In Progress', color: 'border-[#2266ec]' },
  { status: 'review', label: 'Review', color: 'border-amber-400' },
  { status: 'done', label: 'Done', color: 'border-green-400' },
];

const PRIORITY_STYLES: Record<TaskPriority, { color: string; bg: string; label: string }> = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/20', label: 'Critical' },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/20', label: 'High' },
  medium: { color: 'text-amber-400', bg: 'bg-amber-500/20', label: 'Medium' },
  low: { color: 'text-[#656565]', bg: 'bg-[#333]/30', label: 'Low' },
};

const ASSIGNEE_ICON: Record<string, React.ReactNode> = {
  user: <User className="w-3 h-3" />,
  team: <Users className="w-3 h-3" />,
  ai_agent: <Bot className="w-3 h-3" />,
};

export function TaskBoardAssignments({ tasks, onUpdateTask }: Props) {
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const getNextStatus = (current: TaskStatus): TaskStatus | null => {
    const order: TaskStatus[] = ['backlog', 'in_progress', 'review', 'done'];
    const idx = order.indexOf(current);
    return idx < order.length - 1 ? order[idx + 1] : null;
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-amber-400" /> Universal Task Board
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#656565] font-mono">{tasks.length} tasks</span>
            <button
              onClick={() => toast('Create new task', { type: 'info' })}
              className="text-[10px] bg-[#2266ec] text-white px-3 py-1 rounded-lg font-semibold flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> New Task
            </button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {COLUMNS.map(col => {
            const colTasks = tasks.filter(t => t.status === col.status);
            return (
              <div
                key={col.status}
                className="space-y-2"
                onDragOver={e => e.preventDefault()}
                onDrop={() => {
                  if (draggedTask) {
                    onUpdateTask(draggedTask, col.status);
                    toast(`Task moved to ${col.label}`, { type: 'success' });
                    setDraggedTask(null);
                  }
                }}
              >
                {/* Column Header */}
                <div className={`flex items-center justify-between px-3 py-2 rounded-lg bg-[#121212] border-l-2 ${col.color}`}>
                  <span className="text-xs font-bold text-white">{col.label}</span>
                  <span className="text-[9px] bg-[#1a1a1a] text-[#a6a6a6] px-1.5 py-0.5 rounded-full font-mono border border-[#262626]">
                    {colTasks.length}
                  </span>
                </div>

                {/* Task Cards */}
                <div className="space-y-2 min-h-[120px]">
                  {colTasks.map(task => {
                    const pri = PRIORITY_STYLES[task.priority];
                    const next = getNextStatus(task.status);
                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={() => setDraggedTask(task.id)}
                        onDragEnd={() => setDraggedTask(null)}
                        className={`bg-[#121212] border border-[#262626] rounded-xl p-3 space-y-2.5 cursor-grab active:cursor-grabbing transition-all hover:border-[#333] ${
                          draggedTask === task.id ? 'opacity-50 scale-95' : ''
                        }`}
                      >
                        {/* Priority + Menu */}
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${pri.bg} ${pri.color}`}>
                            {pri.label}
                          </span>
                          <div className="flex items-center gap-1">
                            <GripVertical className="w-3 h-3 text-[#333]" />
                          </div>
                        </div>

                        {/* Title */}
                        <div className="text-xs font-bold text-white leading-snug">{task.title}</div>
                        <div className="text-[10px] text-[#656565] leading-relaxed line-clamp-2">{task.description}</div>

                        {/* Tags */}
                        <div className="flex items-center gap-1 flex-wrap">
                          {task.tags.map(tag => (
                            <span key={tag} className="text-[8px] bg-[#1a1a1a] text-[#a6a6a6] px-1.5 py-0.5 rounded border border-[#262626] font-mono">
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-1.5 border-t border-[#262626]">
                          <div className="flex items-center gap-1.5 text-[10px] text-[#a6a6a6]">
                            <div className="w-5 h-5 rounded-full bg-[#1a1a1a] border border-[#262626] flex items-center justify-center text-[10px]">
                              {task.assigneeAvatar}
                            </div>
                            <span>{task.assignee}</span>
                            <span className="text-[#656565]">{ASSIGNEE_ICON[task.assigneeType]}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[9px] text-[#656565] font-mono">
                            <Clock className="w-3 h-3" /> {task.dueDate}
                          </div>
                        </div>

                        {/* Move to next */}
                        {next && (
                          <button
                            onClick={() => { onUpdateTask(task.id, next); toast(`Moved to ${COLUMNS.find(c => c.status === next)?.label}`, { type: 'success' }); }}
                            className="w-full text-[9px] text-[#2266ec] font-semibold flex items-center justify-center gap-1 py-1 rounded-lg border border-[#262626] hover:bg-[#2266ec]/10 transition-colors"
                          >
                            Move to {COLUMNS.find(c => c.status === next)?.label} <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
