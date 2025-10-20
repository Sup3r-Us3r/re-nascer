import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ProductTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductTypeDialog({ open, onOpenChange }: ProductTypeDialogProps) {
  const { addProductType } = useData();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    unit: 'kg',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProductType(formData);
    toast.success('Tipo de produto cadastrado com sucesso');
    onOpenChange(false);
    setFormData({
      name: '',
      description: '',
      unit: 'kg',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Tipo de Produto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: PP Moído"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Input
              id="description"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ex: Polipropileno moído"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">Unidade *</Label>
            <Input
              id="unit"
              required
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              placeholder="Ex: kg"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Cadastrar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
