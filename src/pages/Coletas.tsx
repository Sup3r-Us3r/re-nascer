import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CollectionsTable } from '@/components/coletas/CollectionsTable';
import { CollectionsCalendar } from '@/components/coletas/CollectionsCalendar';
import { CollectionDialog } from '@/components/coletas/CollectionDialog';

export default function Coletas() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('table');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Agendamento de Coletas</h2>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Coleta
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="table">Lista</TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            Calendário
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <CollectionsTable />
        </TabsContent>

        <TabsContent value="calendar">
          <CollectionsCalendar />
        </TabsContent>
      </Tabs>

      <CollectionDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
