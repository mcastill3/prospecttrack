"use client"

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createLead } from '@/lib/actions'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { LeadFormData } from "@/lib/formValidationSchema";


type Option = {
  id: string;
  name: string;
};

type CityOption = Option & {
  countryId: string;
};

type AccountManagerOption = {
  id: string;
  firstName: string;
  lastName: string;
};

type ActivityWithArea = {
  id: string;
  name: string;
  areaId?: string | null;
};

type Props = {
  activities: ActivityWithArea[];
  countries: Option[];
  cities: CityOption[];
  accountManagers: AccountManagerOption[];
  areas: Option[];
};


const LeadFormCreate = ({ activities, countries, cities, accountManagers, areas }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
     const [showConfirmCancel, setShowConfirmCancel] = useState(false);
     


    const [formData, setFormData] = useState({
        name: "",
        value: 0,
        email: "", // utilizado para buscar el contacto
        activityId: "", // select con actividades, puede ser vacío para "No Activity"
        contactId: "",
        companyId: "",
        countryId: "",
        cityId: "",
        accountManagerId: "",
        areaId: "",
    });

    const [contactDetails, setContactDetails] = useState({
        companyName: "",
        countryName: "",
        cityName: "",
    });

    const handleEmailSearch = async () => {
        if (!formData.email) return;

        try {
            const res = await fetch(`/api/selects/contact/lookup/${formData.email}`);
            if (!res.ok) {
            toast.error("Contact not found");
            return;
            }

            const contact = await res.json();

            setFormData({
            ...formData,
            contactId: contact.id,
            companyId: contact.company?.id || "",
            countryId: contact.country?.id || "",
            cityId: contact.city?.id || "",
            });

            setContactDetails({
            companyName: contact.company?.name || "",
            countryName: contact.country?.name || "",
            cityName: contact.city?.name || "",
            });

            toast.success("Contact loaded");
        } catch (error) {
            console.error("Error fetching contact:", error);
            toast.error("Error fetching contact");
        }
    };

    const formattedManagers = accountManagers.map((am) => ({
        id: am.id,
        name: `${am.firstName} ${am.lastName}`,
    }));

    const isFormEmpty = () => {
  const {
    name,
    value,
    email,
    activityId,
    contactId,
    companyId,
    countryId,
    cityId,
    accountManagerId,
    areaId,
  } = formData;

  return (
    !name.trim() &&
    (value === 0 || value === null) &&
    !email.trim() &&
    !activityId.trim() &&
    !contactId.trim() &&
    !companyId.trim() &&
    !countryId.trim() &&
    !cityId.trim() &&
    !accountManagerId.trim() &&
    !areaId.trim()
  );
};

const resetForm = () => {
  setFormData({
    name: "",
    value: 0,
    email: "",
    activityId: "",
    contactId: "",
    companyId: "",
    countryId: "",
    cityId: "",
    accountManagerId: "",
    areaId: "",
  });
  setContactDetails({
    companyName: "",
    countryName: "",
    cityName: "",
  });
};

const handleCancel = () => {
  if (isFormEmpty()) {
    setIsOpen(false);
  } else {
    setShowConfirmCancel(true);
  }
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const normalizedActivityId = 
    formData.activityId === "none" || formData.activityId === "" 
      ? null 
      : formData.activityId;

  const payload = {
    ...formData,
    activityId: normalizedActivityId,
  };

  try {
    await createLead(payload as LeadFormData); // Asegura que formData cumple con el esquema
    toast.success("Lead created successfully ✅");

    // Resetear formulario
    setFormData({
      name: "",
      value: 0,
      email: "",
      activityId: "",
      contactId: "",
      companyId: "",
      countryId: "",
      cityId: "",
      accountManagerId: "",
      areaId: "",
    });

    setContactDetails({
      companyName: "",
      countryName: "",
      cityName: "",
    });

    setIsOpen(false);
  } catch (error) {
    console.error("Error creating lead:", error);
    toast.error("❌ Error creating lead.");
  }
};

const handleActivityChange = (activityId: string) => {
  setFormData((prev) => {
    const selectedActivity = activities.find((a) => a.id === activityId);
    return {
      ...prev,
      activityId,
      areaId: selectedActivity?.areaId || '', // Aquí ya no debería dar error
    };
  });
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
                 + New Lead
               </Button>
             </DialogTrigger>
             <DialogContent>
                 <DialogHeader>
                    <DialogTitle>Create New Lead</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                   <div>
                        <Label>Name</Label>
                        <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <Label>Value (€)</Label>
                        <Input
                        type="number"
                        required
                        min={0}
                        value={formData.value || ""}
                        onChange={(e) =>
                            setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })
                        }
                        />
                    </div>

                    <div>
                        <Label>Contact Email</Label>
                        <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <Button
                        type="button"
                        className="mt-2"
                        onClick={handleEmailSearch}
                        >
                        Search Contact
                        </Button>
                    </div>
                    <Select onValueChange={(value) => setFormData({ ...formData, accountManagerId: value })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Account Manager" />
                        </SelectTrigger>
                        <SelectContent>
                            {accountManagers.map((manager) => (
                            <SelectItem key={manager.id} value={manager.id}>
                                {manager.firstName} {manager.lastName}
                            </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div>
                        <Label>Activity</Label>
                        <Select
                            value={formData.activityId}
                            onValueChange={handleActivityChange}
                            >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Activity" />
                            </SelectTrigger>
                            <SelectContent>
                                {activities.map((activity) => (
                                <SelectItem key={activity.id} value={activity.id}>
                                    {activity.name}
                                </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Mostrar área asociada */}
                        <div>
                            <Label>Area</Label>
                            <Input
                                readOnly
                                value={areas.find((a) => a.id === formData.areaId)?.name || ''}
                            />
                        </div>
                    </div>

                    {/* Campos de solo lectura que se llenan desde la búsqueda por email */}
                    <div>
                        <Label>Company</Label>
                        <Input value={contactDetails.companyName} readOnly />
                    </div>

                    <div>
                        <Label>Country</Label>
                        <Input value={contactDetails.countryName} readOnly />
                    </div>

                    <div>
                        <Label>City</Label>
                        <Input value={contactDetails.cityName} readOnly />
                    </div>
                    

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleCancel}>
                        Cancel
                        </Button>
                        <Button type="submit" className="bg-green-500 hover:bg-green-600">
                        Save Lead
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
  )
}

export default LeadFormCreate