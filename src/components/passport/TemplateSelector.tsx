import { useState, useMemo } from 'react';
import { Search, Globe, Star, Clock, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  COUNTRY_TEMPLATES, 
  searchTemplates, 
  getPopularTemplates,
  CountryTemplate 
} from '@/data/countryTemplates';

interface TemplateSelectorProps {
  selectedTemplate: CountryTemplate | null;
  onSelect: (template: CountryTemplate) => void;
  recentTemplates?: string[];
}

export function TemplateSelector({ 
  selectedTemplate, 
  onSelect,
  recentTemplates = []
}: TemplateSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredTemplates = useMemo(() => {
    if (searchQuery) {
      return searchTemplates(searchQuery);
    }
    return COUNTRY_TEMPLATES;
  }, [searchQuery]);

  const popularTemplates = useMemo(() => getPopularTemplates(), []);
  
  const recentTemplatesList = useMemo(() => {
    return recentTemplates
      .map(id => COUNTRY_TEMPLATES.find(t => t.id === id))
      .filter(Boolean) as CountryTemplate[];
  }, [recentTemplates]);

  // Group templates by country
  const groupedTemplates = useMemo(() => {
    const groups: Record<string, CountryTemplate[]> = {};
    filteredTemplates.forEach(template => {
      if (!groups[template.country]) {
        groups[template.country] = [];
      }
      groups[template.country].push(template);
    });
    return groups;
  }, [filteredTemplates]);

  const renderTemplateCard = (template: CountryTemplate) => (
    <button
      key={template.id}
      onClick={() => onSelect(template)}
      className={`w-full text-left p-3 rounded-lg border transition-all hover:shadow-md ${
        selectedTemplate?.id === template.id
          ? 'border-primary bg-primary/5 ring-1 ring-primary'
          : 'border-border hover:border-primary/50'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{template.documentType}</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {template.widthMM} × {template.heightMM} mm
          </div>
        </div>
        <Badge 
          variant={template.bgColor === '#FFFFFF' ? 'outline' : 'secondary'}
          className="text-xs shrink-0"
          style={{ 
            backgroundColor: template.bgColor === '#FFFFFF' ? undefined : template.bgColor,
            color: template.bgColor === '#FFFFFF' ? undefined : '#000'
          }}
        >
          {template.bgColor === '#FFFFFF' ? 'White' : 
           template.bgColor === '#E8F4FF' ? 'Blue' : 'Grey'}
        </Badge>
      </div>
      {template.notes && (
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {template.notes}
        </p>
      )}
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search countries or document types..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="all" className="text-xs">
            <Globe className="h-3 w-3 mr-1" />
            All
          </TabsTrigger>
          <TabsTrigger value="popular" className="text-xs">
            <Star className="h-3 w-3 mr-1" />
            Popular
          </TabsTrigger>
          <TabsTrigger value="recent" className="text-xs" disabled={recentTemplatesList.length === 0}>
            <Clock className="h-3 w-3 mr-1" />
            Recent
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-3">
          <ScrollArea className="h-[300px] pr-3">
            <div className="space-y-4">
              {Object.entries(groupedTemplates).map(([country, templates]) => (
                <div key={country}>
                  <div className="sticky top-0 bg-background py-1 mb-2">
                    <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                      <Globe className="h-3 w-3" />
                      {country}
                      <Badge variant="secondary" className="text-xs">
                        {templates.length}
                      </Badge>
                    </h4>
                  </div>
                  <div className="grid gap-2">
                    {templates.map(renderTemplateCard)}
                  </div>
                </div>
              ))}
              {filteredTemplates.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No templates found</p>
                  <p className="text-xs">Try a different search term</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="popular" className="mt-3">
          <ScrollArea className="h-[300px] pr-3">
            <div className="grid gap-2">
              {popularTemplates.map(renderTemplateCard)}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="recent" className="mt-3">
          <ScrollArea className="h-[300px] pr-3">
            {recentTemplatesList.length > 0 ? (
              <div className="grid gap-2">
                {recentTemplatesList.map(renderTemplateCard)}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No recent templates</p>
                <p className="text-xs">Templates you use will appear here</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Selected template info */}
      {selectedTemplate && (
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">{selectedTemplate.country} - {selectedTemplate.documentType}</div>
              <div className="text-xs text-muted-foreground">
                {selectedTemplate.widthMM} × {selectedTemplate.heightMM} mm • {selectedTemplate.dpi} DPI
              </div>
            </div>
            <div 
              className="w-8 h-10 rounded border"
              style={{ backgroundColor: selectedTemplate.bgColor }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
