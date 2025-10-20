import { useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { ProductType } from '@/types';

const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  description: z.string().min(1, 'Descrição é obrigatória').max(200, 'Descrição muito longa'),
  unit: z.string().min(1, 'Unidade é obrigatória'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: ProductType;
}

export function ProductTypeDialog({ open, onOpenChange, product }: ProductTypeDialogProps) {
  const { addProductType, updateProductType } = useData();
  const isEditing = !!product;

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      unit: 'kg',
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description,
        unit: product.unit,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        unit: 'kg',
      });
    }
  }, [product, form, open]);

  const onSubmit = (data: ProductFormData) => {
    if (isEditing && product) {
      updateProductType(product.id, data as Omit<ProductType, 'id' | 'createdAt'>);
      toast.success('Tipo de produto atualizado com sucesso');
    } else {
      addProductType(data as Omit<ProductType, 'id' | 'createdAt'>);
      toast.success('Tipo de produto cadastrado com sucesso');
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Tipo de Produto' : 'Novo Tipo de Produto'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: PP Moído" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Polipropileno moído" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidade *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: kg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">{isEditing ? 'Atualizar' : 'Cadastrar'}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
