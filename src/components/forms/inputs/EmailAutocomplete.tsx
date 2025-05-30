'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';

type Contact = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

type EmailAutocompleteProps = {
  endpoint: string;
  label: string;
  onSelect: (contact: Contact) => void;
  defaultText?: string;
};

const EmailAutocomplete: React.FC<EmailAutocompleteProps> = ({
  endpoint,
  label,
  onSelect,
  defaultText = '',
}) => {
  const [query, setQuery] = useState(defaultText);
  const [results, setResults] = useState<Contact[]>([]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (query.length < 3) return;

      const res = await fetch(`${endpoint}?email=${query}`);
      if (!res.ok) return;

      const data = await res.json();
      if (Array.isArray(data)) {
        setResults(data);
      } else if (data) {
        setResults([data]); // en caso de que la API devuelva un solo contacto
      }
    };

    fetchContacts();
  }, [query]);

  const handleSelect = (contact: Contact) => {
    setQuery(contact.email);
    setResults([]);
    onSelect(contact);
  };

  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-600">{label}</label>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por email"
      />
      {results.length > 0 && (
        <ul className="bg-white border rounded shadow mt-1 max-h-40 overflow-auto text-sm z-10 relative">
          {results.map((contact) => (
            <li
              key={contact.id}
              className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(contact)}
            >
              {contact.email} - {contact.firstName} {contact.lastName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmailAutocomplete;