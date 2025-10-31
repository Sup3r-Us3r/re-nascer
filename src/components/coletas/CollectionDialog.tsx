import { useEffect } from 'react';
import { useData } from '@/hooks/useData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { format, parse, isValid } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const collectionSchema = z.object({
  supplierId: z.string().min(1, 'Fornecedor é obrigatório'),
  productId: z.string().min(1, 'Tipo de produto é obrigatório'),
  date: z.date({
    required_error: 'Data é obrigatória',
    invalid_type_error: 'Data inválida',
  }),
  time: z.string().min(1, 'Hora é obrigatória'),
  location: z.string().min(1, 'Localização é obrigatória'),
  weight: z
    .string()
    .min(1, 'Peso é obrigatório')
    .refine(
      (val) => !isNaN(parseFloat(val.replace(',', '.'))),
      'Peso inválido'
    ),
  value: z
    .string()
    .min(1, 'Valor é obrigatório')
    .refine(
      (val) =>
        !isNaN(parseFloat(val.replace(/[R$\s.]/g, '').replace(',', '.'))),
      'Valor inválido'
    ),
  status: z.enum(['agendado', 'confirmado', 'coletado']),
});

type CollectionFormData = z.infer<typeof collectionSchema>;

interface CollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CollectionDialog({
  open,
  onOpenChange,
}: CollectionDialogProps) {
  const { suppliers, productTypes, addCollection } = useData();

  const form = useForm<CollectionFormData>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      supplierId: '',
      productId: '',
      date: undefined,
      time: '',
      location: '',
      weight: '',
      value: '',
      status: 'agendado',
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset({
        supplierId: '',
        productId: '',
        date: undefined,
        time: '',
        location: '',
        weight: '',
        value: '',
        status: 'agendado',
      });
    }
  }, [open, form]);

  const onSubmit = async (data: CollectionFormData) => {
    try {
      const supplier = suppliers.find((s) => s.id === data.supplierId);
      if (!supplier) {
        toast.error('Fornecedor não encontrado');
        return;
      }

      await addCollection({
        supplierId: data.supplierId,
        supplierType: supplier.type,
        productId: data.productId,
        date: format(data.date, 'yyyy-MM-dd'),
        time: data.time,
        location: data.location,
        weight: parseFloat(data.weight.replace(',', '.')),
        value: parseFloat(data.value.replace(/[R$\s.]/g, '').replace(',', '.')),
        status: data.status,
      });
      toast.success('Coleta agendada com sucesso');
      onOpenChange(false);
    } catch (error) {
      // Error handling is done in the DataContext
    }
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
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Produto *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o produto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {productTypes.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                  <FormItem className="flex flex-col">
                    <FormLabel>Data *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'dd/MM/yyyy')
                            ) : (
                              <span>Selecione a data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
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
                      <Input
                        {...field}
                        placeholder="0,00"
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d,]/g, '');
                          const parts = value.split(',');
                          if (parts.length > 2) return;
                          if (parts[1] && parts[1].length > 2) return;
                          field.onChange(value);
                        }}
                      />
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
                      <Input
                        {...field}
                        placeholder="R$ 0,00"
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value === '') {
                            field.onChange('');
                            return;
                          }
                          const numValue = parseInt(value) / 100;
                          const formatted = numValue.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          });
                          field.onChange(formatted);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
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
