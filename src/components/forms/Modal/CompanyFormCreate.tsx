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
import { toast } from "react-toastify";
import { createCompany } from "@/app/actions/create-company";

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
};

const sectors = [
  "AGRICULTURE_AND_FARMING",
  "CONSTRUCTION_AND_INFRASTRUCTURE",
  "CONSUMER_AND_RETAIL",
  "DEFENSE_AND_SECURITY",
  "DESIGN_AND_CREATIVE",
  "EDUCATION",
  "ENERGY_AND_ENVIRONMENT",
  "EVENTS_AND_HOSPITALITY",
  "FINANCE_AND_INSURANCE",
  "HEALTH_AND_WELLNESS",
  "INDUSTRY_AND_MANUFACTURING",
  "INFORMATION_TECHNOLOGY_AND_SERVICES",
  "LOGISTICS_AND_TRANSPORTATION",
  "MEDIA_AND_ENTERTAINMENT",
  "NON_PROFITS_AND_PHILANTHROPY",
  "OTHER_MATERIALS_AND_PRODUCTION",
  "PHARMACEUTICALS",
  "PROFESSIONAL_SERVICES_AND_CONSULTING",
  "PUBLIC_SECTOR_AND_GOVERNMENT",
  "REAL_ESTATE",
  "TECHNOLOGY_AND_TELECOMMUNICATIONS",
];

const CompanyFormCreate = ({ countries, cities }: Props) => {

  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    sector: "OTHER_MATERIALS_AND_PRODUCTION",
    size: 0,
    website: "",
    revenue: 0,
    countryId: "",
    cityId: "",
    status: "ACTIVE",
  });

  // Función para saber si el formulario está vacío
  const isFormEmpty = () => {
    return (
      !formData.name &&
      !formData.sector &&
      (!formData.size || formData.size === 0) &&
      !formData.website &&
      (!formData.revenue || formData.revenue === 0) &&
      !formData.countryId &&
      !formData.cityId
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
    name: "",
    sector: "OTHER_MATERIALS_AND_PRODUCTION",
    size: 0,
    website: "",
    revenue: 0,
    countryId: "",
    cityId: "",
    status: "ACTIVE",
  });
};

  const filteredCities = cities.filter((city) => city.countryId === formData.countryId);

  const handleCountryChange = (value: string) => {
    setFormData({
      ...formData,
      countryId: value,
      cityId: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createCompany(formData);
      toast.success("Company created successfully ✅");
      setFormData({
        name: "",
        sector: "OTHER_MATERIALS_AND_PRODUCTION",
        size: 0,
        website: "",
        revenue: 0,
        countryId: "",
        cityId: "",
        status: "ACTIVE",
      });
    } catch (error) {
      console.error("Error creating company:", error);
      toast.error("❌ Error creating company.");
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
        <Button className="bg-blue-500 hover:bg-blue-600">+ Add Company</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Company</DialogTitle>
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
            <Label>Sector</Label>
            <Select
              value={formData.sector}
              onValueChange={(value) => setFormData({ ...formData, sector: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Sector" />
              </SelectTrigger>
              <SelectContent>
                {sectors.map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    {sector.replace(/_/g, " ").toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Size (number of employees)</Label>
            <Input
              type="number"
              min={1}
              required
              value={formData.size || ""}
              onChange={(e) =>
                setFormData({ ...formData, size: parseInt(e.target.value) || 0 })
              }
            />
          </div>

          <div>
            <Label>Website</Label>
            <Input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://example.com"
            />
          </div>

          <div>
            <Label>Revenue</Label>
            <Input
              type="number"
              min={0}
              step="0.01"
              value={formData.revenue || ""}
              onChange={(e) =>
                setFormData({ ...formData, revenue: parseFloat(e.target.value) || 0 })
              }
              placeholder="Annual revenue"
            />
          </div>

          <div>
            <Label>Country</Label>
            <Select value={formData.countryId} onValueChange={handleCountryChange}>
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
              disabled={!formData.countryId}
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

          <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" className="bg-green-500 hover:bg-green-600">
                Save Company
              </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
     {/* Modal de confirmación */}
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

export default CompanyFormCreate;