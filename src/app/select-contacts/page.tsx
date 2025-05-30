'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getContacts } from '@/app/actions/getContacts';
import ContactTableForm from '@/components/forms/Modal/ContacTableForm';

type CompanySector =
  | "AGRICULTURE_AND_FARMING"
  | "CONSTRUCTION_AND_INFRASTRUCTURE"
  | "CONSUMER_AND_RETAIL"
  | "DEFENSE_AND_SECURITY"
  | "DESIGN_AND_CREATIVE"
  | "EDUCATION"
  | "ENERGY_AND_ENVIRONMENT"
  | "EVENTS_AND_HOSPITALITY"
  | "FINANCE_AND_INSURANCE"
  | "HEALTH_AND_WELLNESS"
  | "INDUSTRY_AND_MANUFACTURING"
  | "INFORMATION_TECHNOLOGY_AND_SERVICES"
  | "LOGISTICS_AND_TRANSPORTATION"
  | "MEDIA_AND_ENTERTAINMENT"
  | "NON_PROFITS_AND_PHILANTHROPY"
  | "OTHER_MATERIALS_AND_PRODUCTION"
  | "PHARMACEUTICALS"
  | "PROFESSIONAL_SERVICES_AND_CONSULTING"
  | "PUBLIC_SECTOR_AND_GOVERNMENT"
  | "REAL_ESTATE"
  | "TECHNOLOGY_AND_TELECOMMUNICATIONS";


interface Country {
  name: string;
}

interface City {
  name: string;
}

interface Company {
  name: string;
  sector?: CompanySector | null;
}

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone1?: string | null;
  phone2?: string | null;
  city?: City;
  country?: Country;
  company?: Company | null;
  jobTitle: string;
}


const countryCodeMap: Record<string, string> = {
  Spain: "ES", France: "FR", Italy: "IT", "United States": "US", Mexico: "MX", USA: "US",
};

const getFlagImageUrl = (country: string) => {
  const code = countryCodeMap[country];
  return code
    ? `https://flagcdn.com/w40/${code.toLowerCase()}.png`
    : "https://via.placeholder.com/40x30";
};


const SelectContactsPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchContacts = async () => {
      const res = await fetch('/api/contacts');
      const data = await res.json();
      setContacts(data);
    };
    fetchContacts();
  }, []);

  const getFlagImageUrl = (countryName: string) => {
    const code = {
      Spain: 'ES',
      France: 'FR',
      Italy: 'IT',
      'United States': 'US',
      Mexico: 'MX',
      USA: 'US',
    }[countryName];
    return code ? `https://flagcdn.com/w40/${code.toLowerCase()}.png` : 'https://via.placeholder.com/40x30';
  };

  const handleConfirm = () => {
    localStorage.setItem('selectedContactIds', JSON.stringify(selectedContactIds));
    window.close();
  };

  return (
    <div>
      <ContactTableForm
        contacts={contacts}
        getFlagImageUrl={getFlagImageUrl}
        selectedContactIds={selectedContactIds}
        onSelectContact={setSelectedContactIds}
      />
      <button
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleConfirm}
      >
        Confirm Selection
      </button>
    </div>
  );
};

export default SelectContactsPage;