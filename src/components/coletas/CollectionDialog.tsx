import { useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import InputMask from 'react-input-mask';

const collectionSchema = z.object({
  supplierId: z.string().min(1, 'Fornecedor é obrigatório'),
  date: z.string().min(1, 'Data é obrigatória'),
  time: z.string().min(1, 'Hora é obrigatória'),
  location: z.string().min(1, 'Localização é obrigatória'),
  weight: z.string().min(1, 'Peso é obrigatório'),
  value: z.string().min(1, 'Valor é obrigatório'),
  status: z.enum(['agendado', 'confirmado', 'coletado']),
});

type CollectionFormData = z.infer<typeof collectionSchema>;

interface CollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CollectionDialog({ open, onOpenChange }: CollectionDialogProps) {
  const { suppliers, addCollection } = useData();

  const form = useForm<CollectionFormData>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      supplierId: '',
      date: '',
      time: '',
      location: '',
      weight: '',
      value: '',
      status: 'agendado',
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const formatDateToBR = (dateStr: string) => {
    if (!dateStr || !dateStr.includes('-')) return dateStr;
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const onSubmit = (data: CollectionFormData) => {
    const supplier = suppliers.find((s) => s.id === data.supplierId);
    if (!supplier) return;

    addCollection({
      supplierId: data.supplierId,
      supplierName: supplier.name,
      supplierType: supplier.type,
      date: data.date,
      time: data.time,
      location: data.location,
      weight: parseFloat(data.weight.replace(/\./g, '').replace(',', '.')),
      value: parseFloat(data.value.replace(/[R$\s]/g, '').replace(/\./g, '').replace(',', '.')),
      status: data.status,
    });
    toast.success('Coleta agendada com sucesso');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nova Coleta</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="supplierId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fornecedor *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o fornecedor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="agendado">Agendado</SelectItem>
                        <SelectItem value="confirmado">Confirmado</SelectItem>
                        <SelectItem value="coletado">Coletado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data *</FormLabel>
                    <FormControl>
                      <InputMask
                        mask="99/99/9999"
                        value={field.value ? formatDateToBR(field.value) : ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          const [day, month, year] = value.split('/');
                          if (day && month && year && year.length === 4) {
                            field.onChange(`${year}-${month}-${day}`);
                          }
                        }}
                      >
                        {/* @ts-ignore */}
                        {(inputProps: any) => <Input {...inputProps} placeholder="DD/MM/AAAA" />}
                      </InputMask>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora *</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Localização *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso (kg) *</FormLabel>
                    <FormControl>
                      <InputMask
                        mask="999999.99"
                        value={field.value}
                        onChange={field.onChange}
                      >
                        {/* @ts-ignore */}
                        {(inputProps: any) => <Input {...inputProps} placeholder="0.00" />}
                      </InputMask>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$) *</FormLabel>
                    <FormControl>
                      <InputMask
                        mask="R$ 999.999.999,99"
                        value={field.value}
                        onChange={field.onChange}
                      >
                        {/* @ts-ignore */}
                        {(inputProps: any) => <Input {...inputProps} placeholder="R$ 0,00" />}
                      </InputMask>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Agendar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
