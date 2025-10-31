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
import InputMask from 'react-input-mask';
import { CollectionPoint } from '@/types';

const pointSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  address: z.string().min(1, 'Endereço é obrigatório'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  email: z.string().email('E-mail inválido'),
  responsible: z.string().min(1, 'Responsável é obrigatório'),
});

type PointFormData = z.infer<typeof pointSchema>;

interface CollectionPointDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  point?: CollectionPoint;
}

export function CollectionPointDialog({
  open,
  onOpenChange,
  point,
}: CollectionPointDialogProps) {
  const { addCollectionPoint, updateCollectionPoint } = useData();
  const isEditing = !!point;

  const form = useForm<PointFormData>({
    resolver: zodResolver(pointSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      email: '',
      responsible: '',
    },
  });

  useEffect(() => {
    if (point) {
      form.reset({
        name: point.name,
        address: point.address,
        phone: point.phone,
        email: point.email,
        responsible: point.responsible,
      });
    } else {
      form.reset({
        name: '',
        address: '',
        phone: '',
        email: '',
        responsible: '',
      });
    }
  }, [point, form, open]);

  const onSubmit = async (data: PointFormData) => {
    try {
      if (isEditing && point) {
        await updateCollectionPoint(
          point.id,
          data as Omit<CollectionPoint, 'id' | 'createdAt'>
        );
        toast.success('Ponto de coleta atualizado com sucesso');
      } else {
        await addCollectionPoint(
          data as Omit<CollectionPoint, 'id' | 'createdAt'>
        );
        toast.success('Ponto de coleta cadastrado com sucesso');
      }
      onOpenChange(false);
    } catch (error) {
      // Error is already handled by the context
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Ponto de Coleta' : 'Novo Ponto de Coleta'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="responsible"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Endereço *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone *</FormLabel>
                    <FormControl>
                      <InputMask
                        mask="(99) 99999-9999"
                        value={field.value}
                        onChange={field.onChange}
                      >
                        {(
                          inputProps: React.InputHTMLAttributes<HTMLInputElement>
                        ) => <Input {...inputProps} />}
                      </InputMask>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail *</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
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
              <Button type="submit">
                {isEditing ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
