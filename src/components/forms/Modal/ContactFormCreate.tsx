"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { createContact } from "@/app/actions/create-contact";
import { toast } from "react-toastify";
import useSWR from "swr";

type Option = {
  id: string;
  name: string;
};

type CityOption = Option & {
  countryId: string;
};

type Props = {
  countries: Option[];
  cities: CityOption[];
  companies: Option[];
};

const fetcher = (url: string) => fetch(url).then(res => res.json());

const ContactFormCreate = ({ countries, cities, companies }: Props) => {
     const [isOpen, setIsOpen] = useState(false);
     const { data: jobTitles, error } = useSWR("/api/selects/jobtitle", fetcher);
     const [showConfirmCancel, setShowConfirmCancel] = useState(false);


  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone1: "",
    jobTitle: "",
    type: "PROSPECT",
    countryId: "",
    cityId: "",
    companyId: "",
  });

  const isFormEmpty = () => {
  const { firstName, lastName, email, phone1, jobTitle, countryId, cityId, companyId } = formData;
  return (
    !firstName.trim() &&
    !lastName.trim() &&
    !email.trim() &&
    !phone1.trim() &&
    !jobTitle.trim() &&
    !countryId.trim() &&
    !cityId.trim() &&
    !companyId.trim()
  );
};

const handleCancel = () => {
  if (isFormEmpty()) {
    setIsOpen(false);
  } else {
    setShowConfirmCancel(true);
  }
};

const resetForm = () => {
  setFormData({
    firstName: "",
    lastName: "",
    email: "",
    phone1: "",
    jobTitle: "",
    type: "PROSPECT",
    countryId: "",
    cityId: "",
    companyId: "",
  });
};

  // Filtramos ciudades que pertenecen al país seleccionado
  const filteredCities = cities.filter(city => city.countryId === formData.countryId);

  const handleCountryChange = (value: string) => {
    setFormData({
      ...formData,
      countryId: value,
      cityId: "", // reset city cuando cambia país
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const payload = {
    ...formData,
    countryId: formData.countryId || "",
    cityId: formData.cityId || "",
    companyId: formData.companyId || undefined,
  };

  try {
    await createContact(payload);
    toast.success("Contact created successfully ✅");

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone1: "",
      jobTitle: "OTHER",
      type: "PROSPECT",
      countryId: "",
      cityId: "",
      companyId: "" ,
    });

    // Cierra modal o lo que necesites
  } catch (error) {
    console.error("Error creating contact:", error);
    toast.error("❌ Ocurrió un error al crear el contacto.");
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
        + Add Contact
      </Button>
    </DialogTrigger>

    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create New Contact</DialogTitle>
      </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>First Name</Label>
            <Input
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>

          <div>
            <Label>Last Name</Label>
            <Input
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <Label>Phone</Label>
            <Input
              value={formData.phone1}
              onChange={(e) => setFormData({ ...formData, phone1: e.target.value })}
            />
          </div>

          <div>
            <Label>Job Title</Label>
            <Select
                value={formData.jobTitle}
                onValueChange={(value) => setFormData({ ...formData, jobTitle: value })}
                >
                <SelectTrigger>
                    <SelectValue placeholder="Select Job Title" />
                </SelectTrigger>
                <SelectContent>
                    {jobTitles && jobTitles.length > 0 ? (
                        jobTitles.map((title: string) => (
                        <SelectItem key={title} value={title}>
                            {title}
                        </SelectItem>
                        ))
                    ) : (
                        <SelectItem value="" disabled>
                        {error ? "Failed to load job titles" : "Loading job titles..."}
                        </SelectItem>
                    )}
                </SelectContent>
            </Select>
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
                <SelectItem value="PROSPECT">Prospect</SelectItem>
                <SelectItem value="CLIENT">Client</SelectItem>
                <SelectItem value="PARTNER">Partner</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Country</Label>
            <Select
                value={formData.countryId}
                onValueChange={handleCountryChange}
            >
                <SelectTrigger>
                <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                {countries.map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                    {country.name}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
            </div>

            <div>
            <Label>City</Label>
            <Select
                value={formData.cityId}
                onValueChange={(value) => setFormData({ ...formData, cityId: value })}
                disabled={!formData.countryId}  // Deshabilitado si no hay país
            >
                <SelectTrigger>
                <SelectValue placeholder={formData.countryId ? "Select City" : "Select a country first"} />
                </SelectTrigger>
                <SelectContent>
                {filteredCities.length > 0 ? (
                    filteredCities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                        {city.name}
                    </SelectItem>
                    ))
                ) : (
                    <SelectItem value="no_cities_available" disabled>
                    No cities available
                    </SelectItem>
                )}
                </SelectContent>
            </Select>
            </div>

          <div>
            <Label>Company</Label>
            <Select
              value={formData.companyId}
              onValueChange={(value) => setFormData({ ...formData, companyId: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a company (optional)" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-500 hover:bg-green-600">
                Save Contact
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
};

export default ContactFormCreate;