"use client"

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import LeadForm from './LeadForm';
import { LeadFormData } from './LeadFormschema';


type LeadModalFormProps = {
  open: boolean;
  onClose: () => void;
  mode?: 'create' | 'edit';
  defaultValues?: Partial<LeadFormData>;
};


const LeadModalForm: React.FC<LeadModalFormProps> = ({ open, onClose, mode = 'create', defaultValues }) => {

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: LeadFormData) => {
  setIsSubmitting(true);
  try {
    console.log('[LeadForm Submitted]', data);
    onClose();
  } catch (error) {
    console.error('Error al guardar el lead:', error);
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? 'Edit a Lead' : 'Create New Lead'}</DialogTitle>
        </DialogHeader>
        <LeadForm
            mode={mode}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default LeadModalForm;