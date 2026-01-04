import { motion } from 'framer-motion';

interface ConversionFunnelProps {
  data: { stage: string; count: number; percentage: number }[];
}

export function ConversionFunnel({ data }: ConversionFunnelProps) {
  const colors = [
    'bg-chart-1',
    'bg-chart-2',
    'bg-chart-3',
    'bg-chart-4',
  ];

  return (
    <div className="space-y-4 py-4">
      {data.map((stage, index) => (
        <motion.div
          key={stage.stage}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="space-y-2"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">{stage.stage}</span>
            <span className="text-sm text-muted-foreground">
              {stage.count} ({stage.percentage}%)
            </span>
          </div>
          <div className="h-8 bg-muted rounded-lg overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stage.percentage}%` }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`h-full ${colors[index]} flex items-center justify-end pr-3`}
            >
              <span className="text-xs font-medium text-white">
                {stage.percentage}%
              </span>
            </motion.div>
          </div>
        </motion.div>
      ))}
      
      {/* Conversion rate summary */}
      <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Overall Conversion Rate</p>
            <p className="text-2xl font-bold text-primary">{data[data.length - 1].percentage}%</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Converted Leads</p>
            <p className="text-2xl font-bold text-foreground">{data[data.length - 1].count}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
