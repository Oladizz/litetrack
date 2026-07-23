"use client";

import React, { useState } from 'react';
import { 
  Activity, ShieldCheck, Bug, AlertTriangle, DollarSign, Network, Search, Sparkles 
} from 'lucide-react';
import { ObservabilityEvent, ServiceHealth, StackErrorItem, AlertTrigger, CostItem, InvestigationReport } from './types';
import { ObservabilityOverview } from './overview-stream';
import { ErrorCenter } from './error-center';
import { AIInvestigatorModal } from './ai-investigator';
import { AlertsAndCostCenter } from './alerts-cost';
import { DependencyAndReplay } from './dependency-replay';
import { toast } from '@/components/ui/toast';

export function UniversalObservability() {
  const [activeTab, setActiveTab] = useState<'overview' | 'errors' | 'alerts_cost' | 'dependency'>('overview');
  const [investigationReport, setInvestigationReport] = useState<InvestigationReport | null>(null);

  const [events, setEvents] = useState<ObservabilityEvent[]>([
    { id: 'ev_1', timestamp: '10:02:14', event: 'Updated Order #ORD-381', actor: 'John Doe', actorType: 'user', resource: 'Orders', module: 'E-Commerce', status: 'success', durationMs: 14 },
    { id: 'ev_2', timestamp: '10:02:40', event: 'Generated PDF Executive Report', actor: 'Analytics AI', actorType: 'ai_agent', resource: 'Reports', module: 'AI Studio', status: 'success', durationMs: 240 },
    { id: 'ev_3', timestamp: '10:03:01', event: 'HTTP 504 Gateway Timeout', actor: 'Stripe Webhook', actorType: 'system', resource: '/api/v2/webhooks', module: 'API', status: 'error', durationMs: 5010 },
    { id: 'ev_4', timestamp: '10:03:15', event: 'Completed Crypto Payout', actor: 'Finance Manager', actorType: 'admin', resource: 'Wallets', module: 'Treasury', status: 'success', durationMs: 42 }
  ]);

  const services: ServiceHealth[] = [
    { name: 'Platform Core', score: 99, status: 'healthy', latencyMs: 12, uptime: '99.99%' },
    { name: 'API Gateway', score: 99, status: 'healthy', latencyMs: 24, uptime: '99.98%' },
    { name: 'Database (BigQuery)', score: 95, status: 'healthy', latencyMs: 48, uptime: '99.95%' },
    { name: 'AI Engine', score: 92, status: 'degraded', latencyMs: 280, uptime: '99.90%' },
    { name: 'Automations', score: 98, status: 'healthy', latencyMs: 18, uptime: '99.99%' }
  ];

  const [errors, setErrors] = useState<StackErrorItem[]>([
    {
      id: 'err_1',
      errorName: 'GatewayTimeoutError (HTTP 504)',
      errorMessage: 'Stripe webhook listener timed out after 5000ms waiting for DB connection release.',
      stackTrace: 'Error: Connection pool exhausted at ConnectionPool.acquire (pool.js:84)\n at StripeWebhook.handle (webhooks.js:142)\n at Layer.handle [as handle_request] (express/layer.js:95)',
      affectedEndpoint: '/api/v2/webhooks/stripe',
      actor: 'Stripe Webhook',
      timestamp: '10 mins ago',
      aiExplanation: 'The connection pool size (100) was exhausted due to un-indexed SQL joins on the orders table during high velocity webhook traffic.',
      suggestedFix: 'Add index on orders.stripe_payment_id and expand connection pool max_size to 200.',
      status: 'unresolved'
    }
  ]);

  const alerts: AlertTrigger[] = [
    { id: 'alt_1', title: 'Stripe Webhook Latency High', severity: 'high', category: 'latency', message: 'Latency exceeded 5000ms threshold.', triggeredAt: '10 mins ago', status: 'active' },
    { id: 'alt_2', title: 'AI Token Budget Warning', severity: 'medium', category: 'budget', message: 'Daily token cost reached 85% of $40 budget limit.', triggeredAt: '1 hour ago', status: 'active' }
  ];

  const costs: CostItem[] = [
    { category: 'AI Models (Google Gemini)', costUsd: 68.40, deltaPercent: 12.4, details: '14.2M tokens processed' },
    { category: 'Database & BigQuery Storage', costUsd: 42.10, deltaPercent: 3.1, details: '1.2 TB active dataset' },
    { category: 'Compute & Cloud Run', costUsd: 32.30, deltaPercent: 1.8, details: '4 active microservice instances' }
  ];

  const handleTriggerInvestigate = (title: string, cause: string) => {
    setInvestigationReport({
      targetTitle: title,
      probableCause: cause,
      confidenceScore: 94,
      evidenceList: [
        'Stripe webhook latency exceeded 5000ms threshold.',
        'BigQuery connection pool hit 100% capacity.',
        '482 HTTP 504 timeout logs emitted between 10:00 - 10:05 AM.'
      ],
      suggestedAction: 'Apply automated database index optimization and scale connection pool.'
    });
    toast(`AI Investigator spawned for: ${title}`, { type: 'info' });
  };

  return (
    <div className="space-y-6 w-full font-sans">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#262626]">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#2266ec]" /> Tool #7: Intelligence & Observability Center
          </h1>
          <p className="text-xs text-[#a6a6a6] mt-1">
            Datadog + Grafana + Kibana + Sentry in one unified interface. Features real-time event telemetry, error stack traces, cost analytics, and the ⭐ Universal '🔍 Investigate' Button Engine.
          </p>
        </div>
      </div>

      {/* 4 Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#262626] pb-3 overflow-x-auto hide-scrollbar text-xs font-semibold">
        {[
          { id: 'overview', label: '1. Live Telemetry & Health Stream', icon: Activity },
          { id: 'errors', label: '2. Error Center & Stack Traces', icon: Bug },
          { id: 'alerts_cost', label: '3. Alerts & Multi-Cloud Cost', icon: AlertTriangle },
          { id: 'dependency', label: '4. Dependency Graph & Time Travel', icon: Network },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl border transition-all shrink-0 flex items-center gap-2 ${
                isActive
                  ? 'bg-[#2266ec] border-[#2266ec] text-white shadow-lg shadow-[#2266ec]/20'
                  : 'bg-[#1a1a1a] border-[#262626] text-[#a6a6a6] hover:text-white hover:bg-[#262626]'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Renderers */}
      {activeTab === 'overview' && (
        <ObservabilityOverview
          events={events}
          services={services}
          onInvestigate={handleTriggerInvestigate}
        />
      )}

      {activeTab === 'errors' && (
        <ErrorCenter
          errors={errors}
          onResolveError={(id) => {
            setErrors(prev => prev.filter(e => e.id !== id));
          }}
        />
      )}

      {activeTab === 'alerts_cost' && <AlertsAndCostCenter alerts={alerts} costs={costs} />}

      {activeTab === 'dependency' && <DependencyAndReplay />}

      {/* ⭐ Universal Investigate AI Modal */}
      <AIInvestigatorModal
        report={investigationReport}
        onClose={() => setInvestigationReport(null)}
      />
    </div>
  );
}
