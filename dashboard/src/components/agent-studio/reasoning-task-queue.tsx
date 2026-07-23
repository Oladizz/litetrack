"use client";

import React, { useState } from 'react';
import { ListTodo, CheckCircle2, Clock, AlertTriangle, ArrowRight, Eye } from 'lucide-react';
import { AgentTask, ReasoningStep } from './types';

export function ReasoningTaskQueue() {
  const [tasks, setTasks] = useState<AgentTask[]>([
    {
      id: 'task_1',
      agentId: 'a_exec',
      agentName: 'CEO Executive Agent',
      prompt: 'Why has user retention dropped over the last two months?',
      status: 'completed',
      timestamp: '10 mins ago',
      reasoningSteps: [
        { step: 1, observation: 'User retention dropped 8.4% over 60 days.', deduction: 'Traffic was steady (+2.1%), so cause is post-signup churn.', actionTaken: 'Queried Analytics Agent for regional breakdown.' },
        { step: 2, observation: 'Lagos regional retention fell from 74% to 61%.', deduction: 'Drop matches the release date of the new payment API.', actionTaken: 'Queried Developer Agent for error logs.' },
        { step: 3, observation: 'Stripe webhook returned 482 gateway timeouts (HTTP 504).', deduction: 'Failed payments caused automatic account suspensions.', actionTaken: 'Inserted Gateway Latency Chart and composed investigation workspace.' }
      ]
    },
    {
      id: 'task_2',
      agentId: 'a_dev',
      agentName: 'Developer Agent',
      prompt: 'Inspect database connection pool spikes during peak hours',
      status: 'running',
      timestamp: 'Just now',
      reasoningSteps: [
        { step: 1, observation: 'Connection pool hit 98/100 connections at 14:30.', deduction: 'Un-indexed SQL join in users table causing lock contention.', actionTaken: 'Analyzing query execution plan.' }
      ]
    }
  ]);

  const [selectedTask, setSelectedTask] = useState<AgentTask>(tasks[0]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
      {/* Task Queue List */}
      <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <ListTodo className="w-4 h-4 text-[#2266ec]" /> Task Queue ({tasks.length})
          </h4>
        </div>

        <div className="space-y-2">
          {tasks.map(t => {
            const isSelected = selectedTask.id === t.id;
            return (
              <div
                key={t.id}
                onClick={() => setSelectedTask(t)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#2266ec]/20 border-[#2266ec] text-white shadow-md'
                    : 'bg-[#121212] border-[#262626] text-[#a6a6a6] hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#2266ec]">{t.agentName}</span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded capitalize ${
                    t.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {t.status}
                  </span>
                </div>
                <div className="text-[11px] text-white mt-1 font-medium truncate">{t.prompt}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step-by-Step Reasoning Panel */}
      <div className="md:col-span-2 bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#2266ec]" /> Step-by-Step Explainable Reasoning Log
            </h3>
            <p className="text-xs text-[#a6a6a6] mt-0.5">Task: "{selectedTask.prompt}" by {selectedTask.agentName}</p>
          </div>
        </div>

        <div className="space-y-3">
          {selectedTask.reasoningSteps.map(step => (
            <div key={step.step} className="bg-[#121212] p-4 rounded-xl border border-[#262626] space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-amber-400 font-bold">
                <span>Step #{step.step} Reasoning Chain</span>
                <span className="text-[10px] text-[#656565]">Verified Deduction</span>
              </div>
              <div className="text-[#a6a6a6]"><strong className="text-white">Observation:</strong> {step.observation}</div>
              <div className="text-[#a6a6a6]"><strong className="text-white">Deduction:</strong> {step.deduction}</div>
              <div className="text-green-400 font-bold bg-green-500/10 p-2 rounded border border-green-500/20">
                Action Taken: {step.actionTaken}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
