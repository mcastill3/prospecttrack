'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { updateActivity } from '@/app/actions/update-activity';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AreaEnum } from '@/lib/formValidationSchema';

interface Activity {
  area: { name: AreaEnum } | null;
  date: string | Date;
  type: string;
  id: string;
  name?: string | null;
  contacts?: { contactId: string }[];
}

const ACTIVITY_TYPES = [
  'WEBINAR', 'TRADESHOW', 'PHYSICAL_EVENT', 'LINKEDIN_CAMPAIGN',
  'GOOGLE_CAMPAIGN', 'PAID_MEDIA_BRANDED_CONTENT', 'WEBSITE_FORM',
  'WEBSITE_REFERRAL', 'WEBINAR_WITH_VENDOR', 'TRADESHOW_WITH_VENDOR',
  'PHYSICAL_EVENT_WITH_VENDOR', 'VENDOR_REFERRAL', 'BDR', 'DIGITAL_SALES'
];

const AREA_ENUMS: AreaEnum[] = [
  'CYBERSECURITY', 'ADVISORY', 'SECURE_FILE_TRANSFER_B2B',
  'SECURE_CLOUD', 'SECURE_DATA', 'COMERCIAL'
];

export default function ActivityFormEdit({ activity, onClose }: { activity: Activity; onClose: () => void }) {

  const [selectedContacts, setSelectedContacts] = useState<string[]>(activity.contacts?.map(c => c.contactId) || []);


  const [formData, setFormData] = useState({
    name: activity.name || '',
    type: activity.type || '',
    date: activity.date ? new Date(activity.date).toISOString().slice(0, 16) : '',
    areaName: activity.area?.name || '',
  });

  const router = useRouter();

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
      setSelectedContacts(JSON.parse(stored));
    }
  };

  updateContacts();
  window.addEventListener('focus', updateContacts);

  return () => {
    window.removeEventListener('focus', updateContacts);
  };
}, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateActivity({
        id: activity.id,
        name: formData.name,
        type: formData.type,
        date: new Date(formData.date),
        areaName: formData.areaName as AreaEnum,
        contacts: selectedContacts.map((id) => ({ contactId: id })),
      });

      toast.success('✅ Activity updated');
      onClose();
      router.refresh();
    } catch (err: any) {
      console.error('Update failed:', err);
      toast.error(`❌ Failed to update activity: ${err.message || err}`);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Activity</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
                <SelectValue placeholder="Select type" />
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
                <SelectValue placeholder="Select area" />
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
                <p className="text-xs text-gray-500">{selectedContacts.length} contacts selected</p>
            )}
            <div>
                <Button
                type="button"
                onClick={handleAddContacts}
                className="bg-gray-600 hover:bg-black"
                >
                Add Contacts
                </Button>
            </div>
          </div>          
          <DialogFooter>
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
