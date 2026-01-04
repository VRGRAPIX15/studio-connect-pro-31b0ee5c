import { Lead, LeadStatus } from '@/types';
import { LeadCard } from './LeadCard';
import { motion } from 'framer-motion';

interface LeadPipelineProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
  onStatusChange: (leadId: string, status: LeadStatus) => void;
}

const stages: { status: LeadStatus; label: string; color: string }[] = [
  { status: 'new', label: 'New', color: 'bg-blue-500' },
  { status: 'contacted', label: 'Contacted', color: 'bg-yellow-500' },
  { status: 'quoted', label: 'Quoted', color: 'bg-purple-500' },
  { status: 'converted', label: 'Converted', color: 'bg-green-500' },
  { status: 'lost', label: 'Lost', color: 'bg-red-500' },
];

export function LeadPipeline({ leads, onLeadClick, onStatusChange }: LeadPipelineProps) {
  const getLeadsByStatus = (status: LeadStatus) => {
    return leads.filter(lead => lead.status === status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto">
      {stages.map((stage, stageIndex) => {
        const stageLeads = getLeadsByStatus(stage.status);
        return (
          <motion.div
            key={stage.status}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stageIndex * 0.1 }}
            className="flex flex-col min-w-[280px]"
          >
            {/* Stage Header */}
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className={`w-3 h-3 rounded-full ${stage.color}`} />
              <h3 className="font-medium text-foreground">{stage.label}</h3>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {stageLeads.length}
              </span>
            </div>

            {/* Stage Content */}
            <div className="flex-1 bg-muted/30 rounded-lg p-2 space-y-2 min-h-[400px]">
              {stageLeads.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                  No leads
                </div>
              ) : (
                stageLeads.map((lead, index) => (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <LeadCard
                      lead={lead}
                      onClick={() => onLeadClick(lead)}
                      onStatusChange={onStatusChange}
                    />
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
