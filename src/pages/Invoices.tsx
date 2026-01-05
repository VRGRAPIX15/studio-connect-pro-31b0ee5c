import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInvoices } from '@/hooks/useInvoices';
import InvoiceCard from '@/components/invoices/InvoiceCard';
import InvoiceTable from '@/components/invoices/InvoiceTable';
import InvoiceDetailSheet from '@/components/invoices/InvoiceDetailSheet';
import CreateInvoiceDialog from '@/components/invoices/CreateInvoiceDialog';
import { formatCurrency } from '@/lib/invoicePdf';
import { Invoice } from '@/types';

export default function Invoices() {
  const {
    invoices,
    stats,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    recordPayment,
    generateInvoiceNumber,
    addInvoice,
  } = useInvoices();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const statCards = [
    {
      title: 'Total Billed',
      value: formatCurrency(stats.total),
      icon: Receipt,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Collected',
      value: formatCurrency(stats.collected),
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Pending',
      value: formatCurrency(stats.pending),
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Overdue',
      value: stats.overdue.toString(),
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      suffix: 'invoices',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-semibold">
            Invoices & Payments
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage invoices, track payments, and send reminders
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="card-hover">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-xl md:text-2xl font-semibold mt-1">
                      {stat.value}
                      {stat.suffix && (
                        <span className="text-sm font-normal text-muted-foreground ml-1">
                          {stat.suffix}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as any)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-1 border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {invoices.map((invoice, index) => (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <InvoiceCard
                invoice={invoice}
                onClick={() => setSelectedInvoice(invoice)}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <InvoiceTable
          invoices={invoices}
          onSelect={(invoice) => setSelectedInvoice(invoice)}
        />
      )}

      {invoices.length === 0 && (
        <div className="text-center py-12">
          <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No invoices found</h3>
          <p className="text-muted-foreground mt-1">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first invoice to get started'}
          </p>
        </div>
      )}

      {/* Invoice Detail Sheet */}
      <InvoiceDetailSheet
        invoice={selectedInvoice}
        open={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        onRecordPayment={recordPayment}
      />

      {/* Create Invoice Dialog */}
      <CreateInvoiceDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={addInvoice}
        generateInvoiceNumber={generateInvoiceNumber}
      />
    </div>
  );
}
