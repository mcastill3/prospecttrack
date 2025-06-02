'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { createAccountManager } from '@/app/actions/create-account-manager';
import { toast } from 'react-toastify';
import useSWR from 'swr';

type Option = {
  id: string;
  name: string;
};

type CityOption = Option & {
  countryId: string;
};



const fetcher = (url: string) => fetch(url).then(res => res.json());

const AccountManagerFormCreate = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  const { data: countries } = useSWR<Option[]>("/api/selects/country", fetcher);
  const { data: areas = [], isLoading } = useSWR<Option[]>('/api/selects/area', fetcher);

  const [cities, setCities] = useState<CityOption[]>([]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    countryId: '',
    cityId: '',
    areaId: '',
  });

  const isFormEmpty = () => {
    const { firstName, lastName, countryId, cityId, areaId } = formData;
    return (
      !firstName.trim() &&
      !lastName.trim() &&
      !countryId.trim() &&
      !cityId.trim() &&
      !areaId.trim()
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
      firstName: '',
      lastName: '',
      countryId: '',
      cityId: '',
      areaId: '',
    });
  };

  const handleCountryChange = async (value: string) => {
  setFormData((prev) => ({
    ...prev,
    countryId: value,
    cityId: '',
  }));

  try {
    const response = await fetch(`/api/selects/city?countryId=${value}`);
    const data = await response.json();
    setCities(data);
  } catch (error) {
    console.error("Error fetching cities:", error);
    setCities([]);
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      countryId: formData.countryId || null,
      cityId: formData.cityId || null,
      areaId: formData.areaId,
    };

    try {
      await createAccountManager(payload);
      toast.success('✅ Account Manager creado con éxito');
      resetForm();
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating account manager:', error);
      toast.error('❌ Ocurrió un error al crear el Account Manager');
    }
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogTrigger asChild>
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => setIsOpen(true)}>
            + Add Account Manager
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Account Manager</DialogTitle>
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
              <Label>Area</Label>
              <Select
                value={formData.areaId}
                onValueChange={(value) => setFormData({ ...formData, areaId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Area" />
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading areas...
                    </SelectItem>
                  ) : areas.length > 0 ? (
                    areas.map((area: Option) => (
                      <SelectItem key={area.id} value={area.id}>
                        {area.name.replace(/_/g, ' ')}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="empty" disabled>
                      No areas available
                    </SelectItem>
                  )}
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
                  {(countries || []).map((country) => (
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
                  {cities.length > 0 ? (
                    cities.map((city) => (
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
                Save Account Manager
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmación de cancelación */}
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
                resetForm();
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

export default AccountManagerFormCreate;