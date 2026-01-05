import { useState, useCallback } from 'react';
import { ContractTemplate, EventType } from '@/types';
import { demoContractTemplates } from '@/data/demoData';

export function useContractTemplates() {
  const [templates, setTemplates] = useState<ContractTemplate[]>(demoContractTemplates);

  const getTemplate = useCallback((id: string) => {
    return templates.find(t => t.id === id);
  }, [templates]);

  const getDefaultTemplate = useCallback((eventType: EventType) => {
    return templates.find(t => t.eventType === eventType && t.isDefault) 
      || templates.find(t => t.eventType === 'other' && t.isDefault);
  }, [templates]);

  const createTemplate = useCallback((template: Omit<ContractTemplate, 'id' | 'createdAt'>) => {
    const newTemplate: ContractTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      createdAt: new Date(),
    };
    setTemplates(prev => [...prev, newTemplate]);
    return newTemplate;
  }, []);

  const updateTemplate = useCallback((id: string, updates: Partial<ContractTemplate>) => {
    setTemplates(prev => prev.map(template =>
      template.id === id ? { ...template, ...updates } : template
    ));
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    setTemplates(prev => prev.filter(template => template.id !== id));
  }, []);

  const fillTemplate = useCallback((templateId: string, data: {
    clientName: string;
    eventDate: Date;
    venue?: string;
    packageName: string;
    totalAmount: number;
  }) => {
    const template = getTemplate(templateId);
    if (!template) return { content: '', terms: '' };

    const formatDate = (date: Date) => date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);

    const replacePlaceholders = (text: string) => {
      return text
        .replace(/{{clientName}}/g, data.clientName)
        .replace(/{{eventDate}}/g, formatDate(data.eventDate))
        .replace(/{{venue}}/g, data.venue || 'To be confirmed')
        .replace(/{{packageName}}/g, data.packageName)
        .replace(/{{totalAmount}}/g, formatCurrency(data.totalAmount))
        .replace(/{{currentDate}}/g, formatDate(new Date()))
        .replace(/{{studioName}}/g, 'Varnika Visuals & SD Event Avenue');
    };

    return {
      content: replacePlaceholders(template.content),
      terms: replacePlaceholders(template.terms),
    };
  }, [getTemplate]);

  return {
    templates,
    getTemplate,
    getDefaultTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    fillTemplate,
  };
}
