'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { ContactType, JobTitle } from '@prisma/client';

interface ContactFormData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone1?: string;
  jobTitle: JobTitle;
  type: ContactType;
  countryId: string;
  cityId: string;
  companyId?: string;
}

interface EditContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: ContactFormData | null;
  onSave: (updated: ContactFormData) => void;
}

export default function EditContactModal({
  isOpen,
  onClose,
  contact,
  onSave,
}: EditContactModalProps) {
  const [formData, setFormData] = useState<ContactFormData | null>(contact);

  useEffect(() => {
    setFormData(contact);
  }, [contact]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Contact</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" />
          <Input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
          <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
          <Input name="phone1" value={formData.phone1 || ''} onChange={handleChange} placeholder="Phone" />
          <Input name="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="Job Title" />
          <Input name="type" value={formData.type} onChange={handleChange} placeholder="Type" />
          <Input name="countryId" value={formData.countryId} onChange={handleChange} placeholder="Country ID" />
          <Input name="cityId" value={formData.cityId} onChange={handleChange} placeholder="City ID" />
          <Input name="companyId" value={formData.companyId || ''} onChange={handleChange} placeholder="Company ID" />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}