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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

const saleSchema = z.object({
  clientId: z.string().min(1, 'Cliente é obrigatório'),
  productType: z.string().min(1, 'Tipo de produto é obrigatório'),
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
  date: z.string().min(1, 'Data é obrigatória'),
});

type SaleFormData = z.infer<typeof saleSchema>;

interface SaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SaleDialog({ open, onOpenChange }: SaleDialogProps) {
  const { clients, productTypes, addSale } = useData();

  const form = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      clientId: '',
      productType: '',
      weight: '',
      value: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset({
        clientId: '',
        productType: '',
        weight: '',
        value: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [open, form]);

  const onSubmit = (data: SaleFormData) => {
    const client = clients.find((c) => c.id === data.clientId);
    if (!client) return;

    addSale({
      clientId: data.clientId,
      clientName: client.name,
      productType: data.productType,
      weight: parseFloat(data.weight.replace(',', '.')),
      value: parseFloat(data.value.replace(/[R$\s.]/g, '').replace(',', '.')),
      date: data.date,
    });
    toast.success('Venda registrada com sucesso');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nova Venda</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
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
                name="productType"
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
                          <SelectItem key={product.id} value={product.name}>
                            {product.name}
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
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
                  <FormItem className="col-span-2">
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
              <Button type="submit">Registrar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
