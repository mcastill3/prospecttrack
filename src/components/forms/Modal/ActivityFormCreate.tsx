'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { createActivity } from '@/app/actions/create-activity';


const ACTIVITY_TYPES = [
  'WEBINAR', 'TRADESHOW', 'PHYSICAL_EVENT', 'LINKEDIN_CAMPAIGN', 'GOOGLE_CAMPAIGN',
  'PAID_MEDIA_BRANDED_CONTENT', 'WEBSITE_FORM', 'WEBSITE_REFERRAL', 'WEBINAR_WITH_VENDOR',
  'TRADESHOW_WITH_VENDOR', 'PHYSICAL_EVENT_WITH_VENDOR', 'VENDOR_REFERRAL',
  'BDR', 'DIGITAL_SALES'
];

const AREA_ENUMS = [
  'CYBERSECURITY', 'ADVISORY', 'SECURE_FILE_TRANSFER_B2B',
  'SECURE_CLOUD', 'SECURE_DATA', 'COMERCIAL'
];

interface ActivityFormCreateProps {
  selectedContactIds: string[];
}

const ActivityFormCreate: React.FC<ActivityFormCreateProps> = ({ selectedContactIds }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showConfirmCancel, setShowConfirmCancel] = useState(false);
    const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
    const router = useRouter();

    const getFlagImageUrl = (countryName: string) => {
    return `/flags/${countryName.toLowerCase()}.svg`; // ejemplo
  };


  const handleAddContacts = () => {
  const width = 900;
  const height = 700;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  window.open(
    '/select-contacts',
    'SelectContactsPopup',
    `width=${width},height=${height},left=${left},top=${top},resizable,scrollbars`
  );
};

useEffect(() => {
  const updateContacts = () => {
    const stored = localStorage.getItem('selectedContactIds');
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('📦 Contact IDs leídos:', parsed);
      setSelectedContacts(JSON.parse(stored));
    }
  };

  updateContacts(); // carga inicial
  window.addEventListener('focus', updateContacts); // al volver de la ventana popup

  return () => {
    window.removeEventListener('focus', updateContacts);
  };
}, []);

  
const selectedContactsCount = selectedContactIds.length;

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    date: '',
    areaName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (selectedContacts.length === 0) {
    toast.error("⚠️ You must select at least one contact.");
    return;
  }

  try {
    const payload = {
      ...formData,
      date: new Date(formData.date), // Convierte string a Date
      contacts: selectedContacts.map((id) => ({
        contactId: id,
        attended: null, // o false si prefieres marcar como no asistido por defecto
      })),
      costId: 'd30318e2-06c4-4141-9e37-2a8cef4be924', // Fijo o dinámico según tu lógica
      targetContacts: selectedContacts.length,
    };

    await createActivity(payload);

    toast.success('✅ Activity created successfully');
    setFormData({ name: '', type: '', date: '', areaName: '' });
    setSelectedContacts([]);
    localStorage.removeItem('selectedContactIds');
    setIsOpen(false);
    router.refresh(); // Si quieres que se actualice la lista en la UI
  } catch (err) {
    console.error(err);
    toast.error('❌ Error creating activity');
  }
};

const isFormEmpty = () => {
  const { name, type, date, areaName } = formData;

  return (
    !name.trim() &&
    !type.trim() &&
    !date.trim() &&
    !areaName.trim() &&
    selectedContacts.length === 0
  );
};

const resetForm = () => {
  setFormData({
    name: '',
    type: '',
    date: '',
    areaName: '',
  });
  setSelectedContacts([]);
  localStorage.removeItem('selectedContactIds');
};

const handleCancel = () => {
  if (isFormEmpty()) {
    setIsOpen(false);
  } else {
    setShowConfirmCancel(true);
  }
};

  return (
  <>  
    <Dialog       
        open={isOpen}
        onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
            resetForm();  // resetear formulario al cerrar el modal
            }
        }}
     >
     <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => setIsOpen(true)}>
            + New Activity
        </Button>
     </DialogTrigger>
        <DialogContent>
         <DialogHeader>
            <DialogTitle>Create New Activity</DialogTitle>
         </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 p-4">
                <div>
                    <Label>Name</Label>
                    <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    />
                </div>

                <div>
                    <Label>Type</Label>
                    <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                    >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                        {ACTIVITY_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                            {type.replace(/_/g, ' ')}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Date</Label>
                    <Input
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    />
                </div>

                <div>
                    <Label>Area</Label>
                    <Select
                    value={formData.areaName}
                    onValueChange={(value) => setFormData({ ...formData, areaName: value })}
                    >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Area" />
                    </SelectTrigger>
                    <SelectContent>
                        {AREA_ENUMS.map((area) => (
                        <SelectItem key={area} value={area}>
                            {area.replace(/_/g, ' ')}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Selected Contacts</Label>
                   {selectedContacts.length > 0 && (
                      <p className="text-xs text-gray-500">
                        {selectedContacts.length} contacts selected
                      </p>
                    )}
                    <div>
                      <Button type="button" onClick={handleAddContacts} className="bg-gray-600 hover:bg-black">
                        Add Contacts
                      </Button>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                    </Button>
                    <Button type="submit" className="bg-green-500 hover:bg-green-600">
                    Save Activity
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>        
    </Dialog>
    <Dialog open={showConfirmCancel} onOpenChange={setShowConfirmCancel}>
            <DialogContent>
            <DialogHeader>
            <DialogTitle>Confirm Cancel</DialogTitle>
            </DialogHeader>
            <p>You have unsaved changes. Are you sure you want to cancel?</p>
            <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setShowConfirmCancel(false)}>
                No, Keep Editing
            </Button>
            <Button
                className="bg-red-500 hover:bg-red-600"
                onClick={() => {
                    setShowConfirmCancel(false);
                    setIsOpen(false);
                    resetForm(); // <--- Aquí reseteas el formulario
                }}
            >
                Yes, Cancel
            </Button>
            </div>
          </DialogContent>
          </Dialog>
      </>    
  );
}

export default ActivityFormCreate