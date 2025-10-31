import { useData } from '@/hooks/useData';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function CollectionsCalendar() {
  const { collections, collectionsLoading } = useData();

  const groupedByDate = collections.reduce((acc, collection) => {
    const date = collection.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(collection);
    return acc;
  }, {} as Record<string, typeof collections>);

  const sortedDates = Object.keys(groupedByDate).sort();

  const getStatusColor = (status: string) => {
    const colors = {
      agendado: 'bg-warning/20 text-warning',
      confirmado: 'bg-info/20 text-info',
      coletado: 'bg-success/20 text-success',
    };
    return colors[status as keyof typeof colors] || 'bg-muted';
  };

  return (
    <Card className="p-6">
      {collectionsLoading ? (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">Carregando coletas...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date}>
              <h3 className="mb-3 text-lg font-semibold text-foreground">
                {new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h3>
              <div className="space-y-3">
                {groupedByDate[date].map((collection) => (
                  <div
                    key={collection.id}
                    className="rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">
                            {collection.time}
                          </span>
                          <Badge className={getStatusColor(collection.status)}>
                            {collection.status.charAt(0).toUpperCase() +
                              collection.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="mt-1 font-semibold text-foreground">
                          {collection.supplierName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          📍 {collection.location}
                        </p>
                        {collection.productName && (
                          <p className="text-sm text-muted-foreground">
                            🏷️ {collection.productName}
                          </p>
                        )}
                        <div className="mt-2 flex gap-4 text-sm">
                          <span className="text-muted-foreground">
                            ⚖️ {collection.weight} kg
                          </span>
                          <span className="text-muted-foreground">
                            💰 R$ {collection.value.toLocaleString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {sortedDates.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">
              Nenhuma coleta agendada
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
