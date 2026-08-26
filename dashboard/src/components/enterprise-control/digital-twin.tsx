"use client";
import { IconRenderer } from '@/components/ui/IconRenderer';
import React, { useState } from 'react';
import {
  Network, ChevronRight, ChevronDown, Building2, AppWindow, Bot,
  Database, Users, Server, Gauge, DollarSign, AlertTriangle,
  Activity, Sparkles
} from 'lucide-react';
import { DigitalTwinNode } from './types';
import { toast } from '@/components/ui/toast';

const TYPE_ICONS: Record<string, { icon: React.ReactNode; color: string }> = {
  organization: { icon: <Building2 className="w-3.5 h-3.5" />, color: 'text-[#2266ec]' },
  application: { icon: <AppWindow className="w-3.5 h-3.5" />, color: 'text-cyan-400' },
  ai_agent: { icon: <Bot className="w-3.5 h-3.5" />, color: 'text-purple-400' },
  resource: { icon: <Database className="w-3.5 h-3.5" />, color: 'text-amber-400' },
  user_group: { icon: <Users className="w-3.5 h-3.5" />, color: 'text-green-400' },
  infrastructure: { icon: <Server className="w-3.5 h-3.5" />, color: 'text-pink-400' },
};

const TWIN_DATA: DigitalTwinNode = {
  id: 'root',
  label: 'Enterprise Ecosystem',
  type: 'organization',
  icon: 'Globe',
  health: 98,
  children: [
    {
      id: 'org_1', label: 'OLADIZZ Corp', type: 'organization', icon: 'Building', health: 98,
      stats: [{ label: 'MRR', value: '$48,200' }, { label: 'Users', value: '2,493' }, { label: 'Plan', value: 'Enterprise' }],
      children: [
        {
          id: 'app_analytics', label: 'Analytics Pro', type: 'application', icon: 'BarChart2', health: 99,
          stats: [{ label: 'Uptime', value: '99.99%' }, { label: 'Latency', value: '24ms' }, { label: 'Daily Events', value: '3.2M' }],
          children: [
            { id: 'ai_analytics', label: 'Analytics AI', type: 'ai_agent', icon: 'Bot', health: 94, stats: [{ label: 'Status', value: 'Running' }, { label: 'Decisions', value: '142' }, { label: 'Cost', value: '$12.40' }] },
            { id: 'res_dashboards', label: 'Dashboards', type: 'resource', icon: 'TrendingUp', health: 100, stats: [{ label: 'Count', value: '28' }, { label: 'Active', value: '24' }] },
            { id: 'users_analytics', label: 'Analytics Users', type: 'user_group', icon: 'Users', health: 100, stats: [{ label: 'Active', value: '340' }, { label: 'Admins', value: '12' }] },
          ],
        },
        {
          id: 'app_crm', label: 'CRM Engine', type: 'application', icon: 'Handshake', health: 92,
          stats: [{ label: 'Uptime', value: '99.95%' }, { label: 'Latency', value: '142ms' }, { label: 'Daily Events', value: '1.8M' }],
          children: [
            { id: 'ai_sales', label: 'Sales AI', type: 'ai_agent', icon: 'Briefcase', health: 96, stats: [{ label: 'Status', value: 'Running' }, { label: 'Leads Scored', value: '2,891' }] },
            { id: 'res_contacts', label: 'Contacts DB', type: 'resource', icon: 'Contact', health: 88, stats: [{ label: 'Records', value: '124K' }, { label: 'Size', value: '2.4 GB' }] },
          ],
        },
        {
          id: 'app_school', label: 'SchoolTrack', type: 'application', icon: 'GraduationCap', health: 97,
          stats: [{ label: 'Uptime', value: '99.98%' }, { label: 'Students', value: '8,400' }],
          children: [
            { id: 'ai_education', label: 'Education AI', type: 'ai_agent', icon: 'BookOpen', health: 95, stats: [{ label: 'Status', value: 'Running' }, { label: 'Assessments', value: '430' }] },
          ],
        },
        {
          id: 'infra', label: 'Infrastructure', type: 'infrastructure', icon: 'Monitor', health: 99,
          stats: [{ label: 'Regions', value: '3' }, { label: 'Instances', value: '12' }, { label: 'CDN', value: 'Cloudflare' }],
          children: [
            { id: 'infra_db', label: 'BigQuery Cluster', type: 'infrastructure', icon: 'Database', health: 95, stats: [{ label: 'Storage', value: '4.2 TB' }, { label: 'Queries/day', value: '84K' }] },
            { id: 'infra_api', label: 'API Gateway', type: 'infrastructure', icon: 'Plug', health: 99, stats: [{ label: 'Requests/min', value: '12,400' }, { label: 'P99', value: '48ms' }] },
            { id: 'infra_ai', label: 'AI Compute', type: 'infrastructure', icon: 'Zap', health: 94, stats: [{ label: 'GPU Util', value: '72%' }, { label: 'Tokens/day', value: '14.2M' }] },
          ],
        },
      ],
    },
  ],
};

export function DigitalTwinEngine() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    root: true, org_1: true, app_analytics: false, app_crm: false, infra: false,
  });
  const [selectedNode, setSelectedNode] = useState<DigitalTwinNode | null>(null);

  const toggleExpand = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const renderNode = (node: DigitalTwinNode, depth: number) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expanded[node.id];
    const isSelected = selectedNode?.id === node.id;
    const typeStyle = TYPE_ICONS[node.type];

    return (
      <div key={node.id}>
        <button
          onClick={() => {
            if (hasChildren) toggleExpand(node.id);
            setSelectedNode(node);
          }}
          className={`w-full text-left flex items-center gap-2 py-2 px-3 rounded-lg transition-all group ${
            isSelected
              ? 'bg-[#2266ec]/10 border border-[#2266ec]/30'
              : 'border border-transparent hover:bg-[#1a1a1a] hover:border-[#262626]'
          }`}
          style={{ paddingLeft: `${12 + depth * 24}px` }}
        >
          {hasChildren ? (
            <span className="text-[#656565] shrink-0">
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </span>
          ) : (
            <span className="w-3.5 shrink-0" />
          )}

          <IconRenderer name={node.icon} className="w-3.5 h-3.5 shrink-0 text-gray-300" />
          <span className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-[#a6a6a6] group-hover:text-white'}`}>
            {node.label}
          </span>
          <span className={`text-[9px] shrink-0 ml-auto ${typeStyle.color}`}>{typeStyle.icon}</span>

          {/* Health dot */}
          <div className={`w-5 text-right text-[9px] font-mono font-bold shrink-0 ${
            node.health >= 95 ? 'text-green-400' : node.health >= 80 ? 'text-amber-400' : 'text-red-400'
          }`}>
            {node.health}%
          </div>
        </button>

        {hasChildren && isExpanded && node.children!.map(child => renderNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-gradient-to-br from-purple-500/5 to-[#2266ec]/5 border border-purple-500/20 rounded-xl p-5 shadow-xl space-y-4">
        <div className="border-b border-purple-500/20 pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Network className="w-4 h-4 text-purple-400" /> ⭐ Digital Twin — Live Platform Model
          </h3>
          <p className="text-[10px] text-[#a6a6a6] mt-1">
            Interactive real-time model of your entire ecosystem. Click any node to inspect dependencies, performance, costs, and risks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Tree */}
          <div className="bg-[#121212] border border-[#262626] rounded-xl p-3 max-h-[500px] overflow-y-auto">
            {renderNode(TWIN_DATA, 0)}
          </div>

          {/* Inspector */}
          <div className="bg-[#121212] border border-[#262626] rounded-xl p-5 space-y-4">
            {selectedNode ? (
              <>
                <div className="flex items-center gap-3 border-b border-[#262626] pb-3">
                  <IconRenderer name={selectedNode.icon} className="w-6 h-6 text-white" />
                  <div>
                    <div className="font-bold text-white text-sm">{selectedNode.label}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[9px] ${TYPE_ICONS[selectedNode.type].color}`}>{TYPE_ICONS[selectedNode.type].icon}</span>
                      <span className="text-[9px] text-[#656565] capitalize">{selectedNode.type.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div className={`ml-auto text-2xl font-bold font-mono ${
                    selectedNode.health >= 95 ? 'text-green-400' : selectedNode.health >= 80 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {selectedNode.health}%
                  </div>
                </div>

                {/* Stats */}
                {selectedNode.stats && (
                  <div className="grid grid-cols-2 gap-2">
                    {selectedNode.stats.map(stat => (
                      <div key={stat.label} className="bg-[#1a1a1a] border border-[#262626] rounded-lg p-3 space-y-1">
                        <div className="text-[9px] text-[#656565] uppercase font-semibold">{stat.label}</div>
                        <div className="text-sm font-bold text-white font-mono">{stat.value}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Dependencies */}
                {selectedNode.children && selectedNode.children.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[10px] text-[#656565] font-semibold uppercase">Dependencies ({selectedNode.children.length})</div>
                    {selectedNode.children.map(child => (
                      <button
                        key={child.id}
                        onClick={() => { setSelectedNode(child); setExpanded(prev => ({ ...prev, [selectedNode.id]: true })); }}
                        className="w-full flex items-center gap-2 bg-[#0f0f0f] border border-[#262626] rounded-lg p-2.5 text-xs hover:border-[#333] transition-all"
                      >
                        <IconRenderer name={child.icon} className="w-3.5 h-3.5" />
                        <span className="text-white font-semibold">{child.label}</span>
                        <span className={`ml-auto text-[9px] font-mono font-bold ${
                          child.health >= 95 ? 'text-green-400' : child.health >= 80 ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          {child.health}%
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Risk Assessment */}
                <div className="bg-[#0f0f0f] border border-[#262626] rounded-lg p-3 space-y-1">
                  <div className="text-[10px] text-[#656565] font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-400" /> AI Risk Assessment
                  </div>
                  <div className="text-[11px] text-[#a6a6a6]">
                    {selectedNode.health >= 95
                      ? `${selectedNode.label} is operating within normal parameters. No risks detected.`
                      : selectedNode.health >= 80
                        ? `${selectedNode.label} shows signs of degradation. Recommend investigating latency patterns and resource utilization.`
                        : `AlertTriangle ${selectedNode.label} is in a critical state. Immediate investigation required. Check dependencies and recent changes.`
                    }
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-[#656565] text-xs">
                Select a node from the tree to inspect
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
