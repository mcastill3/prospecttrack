"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LeadFormSchema } from "./LeadFormschema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { createLead } from "@/lib/actions";
import { LeadFormData } from '@/components/forms/Modal/LeadFormschema';
import { toast } from "react-toastify";



type Activity = {
  id: string;
  name: string | null;
  date: string; // Usa Date si haces new Date() al cargarlo
  areaId: string | null;
  area?: {
    name: string;
  };
};

interface LeadFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  onDirtyChange?: (dirty: boolean) => void;
  defaultValues?: Partial<any>;
  isSubmitting?: boolean; // 
  mode?: "create" | "edit"; //
}


const LeadForm: React.FC<LeadFormProps> = ({ onCancel, onDirtyChange, defaultValues }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(LeadFormSchema),
    defaultValues,
  });

  const [isPending, startTransition] = useTransition();

 const onSubmit = (data: Partial<LeadFormData>) => {
  startTransition(async () => {
    try {
      // 1. Buscar contacto por email
      const contactRes = await fetch(`/api/contacts?email=${data.email}`);
      if (!contactRes.ok) throw new Error("Error buscando contacto");

      let contact = await contactRes.json();

      // 2. Si no existe, lo creamos
      if (!contact?.id) {
        const createContactRes = await fetch("/api/contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email ?? "", // ya validado como string opcional
            firstName: data.contactFirstName ?? "",
            lastName: data.contactLastName ?? "",
            jobTitle: "", // campos requeridos por Prisma aunque no uses aún
            type: "CLIENT", // ejemplo por si tu modelo lo requiere
            country: { connect: { id: data.countryId ?? "" } },
            city: { connect: { id: data.cityId ?? "" } },
          }),
        });

        if (typeof data.value === "number" && isNaN(data.value)) {
          data.value = null;
        }

        if (!createContactRes.ok) throw new Error("Error creando contacto");
        contact = await createContactRes.json();
      }

      // 3. Crear Lead con valores seguros
      const leadData = {
        name: data.name ?? "",
        value: data.value ?? 0,
        contactId: contact.id ?? null,
        companyId: data.companyId ?? null,
        activityId: data.activityId ?? null,
        areaId: data.areaId ?? null,
        countryId: data.countryId ?? null,
        cityId: data.cityId ?? null,
        accountManagerId: data.accountManagerId ?? null,
      };
      console.log("🟡 Enviando a createLead:", leadData);


      const res = await fetch("/api/insert/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(leadData),
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Error al crear lead: ${errorText}`);
      }

      const result = await res.json();
      console.log("Lead creado", result);

      toast.success("Lead creado correctamente");
      onCancel(); // Cerrar modal o limpiar form

    } catch (error) {
      console.error("Error creando lead", error);
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("Unknown error occurred");
      }
    }
  });
};


  React.useEffect(() => {
    if (onDirtyChange) onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const [accountManagers, setAccountManagers] = useState<
  { id: string; firstName: string; lastName: string; areaId: string }[]
>([]);

useEffect(() => {
  fetch("/api/selects/account-managers")
    .then((res) => res.json())
    .then(setAccountManagers)
    .catch((err) => console.error("Error loading account managers:", err));
}, []);

const [activities, setActivities] = React.useState<Activity[]>([]);
const [fromActivity, setFromActivity] = React.useState(false);

React.useEffect(() => {
  const fetchActivities = async () => {
    const res = await fetch("/api/selects/activities");
    const data = await res.json();
    setActivities(data);
  };
  fetchActivities();
}, []);

const handleActivityChange = (selectedActivityId: string) => {
  const selectedActivity = activities.find((a) => a.id === selectedActivityId);

  if (selectedActivity) {
    // 1. Set activityId in the form
    setValue("activityId", selectedActivityId);

    // 2. Set areaId from the selected activity
    if (selectedActivity.areaId) {
      setValue("areaId", selectedActivity.areaId);
    } else {
      setValue("areaId", "");
    }

    // 3. Set areaName from the related area (optional but useful for UI)
    if (selectedActivity.area?.name) {
      setValue("areaName", selectedActivity.area.name);
    } else {
      setValue("areaName", "");
    }
  }
};

const email = watch("email");


useEffect(() => {
  const fetchContact = async () => {
    if (!email || !email.includes("@")) return;
                         
    try {
      const res = await fetch(`/api/selects/contact/lookup/${encodeURIComponent(email)}`);
      if (!res.ok) return;

      const data = await res.json();

      // Mostrar datos visibles
      setValue("contactFirstName", data.firstName);
      setValue("contactLastName", data.lastName);
      setValue("companyName", data.company?.name ?? "");
      setValue("countryName", data.country?.name ?? "");
      setValue("cityName", data.city?.name ?? "");

      // Guardar IDs reales para la base de datos
      setValue("contactId", data.id);
      setValue("companyId", data.company?.id ?? "");
      setValue("countryId", data.country?.id ?? "");
      setValue("cityId", data.city?.id ?? "");

      // 🛑 Solo sobrescribir areaId si no hay uno ya establecido (desde actividad)
      if (!watch("areaId")) {
        setValue("areaId", data.area?.id ?? "");
      }

    } catch (error) {
      console.error("Error fetching contact:", error);
    }
  };

  fetchContact();
}, [email, setValue, watch]);

useEffect(() => {
  const subscription = watch((value) => {
    console.log("Form values:", value);
  });
  return () => subscription.unsubscribe();
}, [watch]);


return (
  <div className="relative max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md space-y-6">
      
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Lead Name */}
      <div>
        <Label htmlFor="leadName">Lead Name</Label>
        <Input
          id="leadName"
          placeholder="Enter lead name"
          {...register("name")}
        />
        {typeof errors.name?.message === "string" && (
          <p className="text-red-600">{errors.name?.message}</p>
        )}
      </div>
      {/* Lead Value */}
      <div>
        <Label htmlFor="leadName">Estimated value - €</Label>
        <Input 
          type="number"
          id="value"
          {...register("value", {
            setValueAs: (v) => v === "" ? null : Number(v),
          })}
        />
        {errors.name?.message && (
          <p className="text-red-600">{String(errors.value?.message)}</p>
        )}
        
      </div>
      {/* Account Manager */}
        <div>
          <Label>Account Manager</Label>
          <Select onValueChange={(value) => setValue("accountManagerId", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select an Account Manager" />
            </SelectTrigger>
            <SelectContent>
              {accountManagers.map((manager) => (
                <SelectItem key={manager.id} value={manager.id}>
                  {`${manager.firstName} ${manager.lastName}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
       <div>
        
       </div>
       {/* Checkbox */}
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="fromActivity"
            checked={fromActivity}
            onCheckedChange={(checked) => {
              const value = typeof checked === "boolean" ? checked : false;
              setFromActivity(value);

              if (!value) {
                // Limpia valores si se desactiva
                setValue("activityId", "");
                setValue("areaId", "");
                setValue("areaName", "");
              }
            }}
          />
          <Label htmlFor="fromActivity" className="mb-0">
            This lead comes from an activity
          </Label>
        </div>
         {/* Activity select */}
          {fromActivity && (
            <>
              <div className="mb-4">
                <Label htmlFor="activityId">Actividad</Label>
                <Select onValueChange={handleActivityChange}>
                  <SelectTrigger id="activityId">
                    <SelectValue placeholder="Select an Activity" />
                  </SelectTrigger>
                  <SelectContent>
                    {activities.map((activity) => (
                      <SelectItem key={activity.id} value={activity.id}>
                        {`${activity.name} - ${new Date(activity.date).toLocaleDateString("es-ES")}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-4">
                <Label htmlFor="areaName">Area</Label>
                <Input
                  id="areaName"
                  disabled
                  {...register("areaName")}
                />
              </div>
            </>
          )}
        
      <div>
        {/* Email */}
        <Label htmlFor="email">Email</Label>
          <Input 
              id="email"
              placeholder="Contact email"
              {...register("email")}
          />
      </div>
      
      {/* Contact details */}
      <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contactFirstName">First Name</Label>
            <Input
              id="contactFirstName"
              placeholder="First Name"
              disabled
              {...register("contactFirstName")}
            />
          </div>
          <div>
            <Label htmlFor="contactlastName">Last Name</Label>
            <Input 
              id="contactLastName"
              disabled 
              {...register("contactLastName")}
            />
          </div>
      </div> 
      <div>
          <Label htmlFor="company">Company</Label>
          <Input 
            id="company" 
            disabled 
            {...register("companyName")}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="country">Country</Label>
            <Input 
             id="country" 
             disabled 
             {...register("countryName")}
            />
          </div>
          <div>
            <Label htmlFor="cityName">City</Label>
            <Input 
              id="cityName" 
              disabled 
              {...register("cityName")}
            />
          </div>
        </div> 
        {/* Buttons */} 
      <div className="flex justify-end space-x-4 mt-6">
          <Button onClick={onCancel} variant="outline" >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            Submit
          </Button>
        
      </div>
      <input type="hidden" {...register("contactId")} />
      <input type="hidden" {...register("companyId")} />
      <input type="hidden" {...register("activityId")} />
      <input type="hidden" {...register("areaId")} />
      <input type="hidden" {...register("countryId")} />
      <input type="hidden" {...register("cityId")} />
      <input type="hidden" {...register("accountManagerId")} />
    </form>
  </div>
  );
};

export default LeadForm;