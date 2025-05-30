'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

type AutocompleteProps = {
  endpoint: string;
  label: string;
  onSelect: (item: { id: string; name: string }) => void;
  defaultText?: string;
};

const AccountManagerAutocomplete: React.FC<AutocompleteProps> = ({ endpoint, label, onSelect, defaultText }) => {
  const [query, setQuery] = useState(defaultText || '');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (query.length < 2) return;
      const res = await fetch(`${endpoint}?q=${query}`);
      const data = await res.json();
      setResults(data);
    };

    fetchData();
  }, [query]);

  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-600">{label}</label>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`Buscar ${label.toLowerCase()}`}
      />
      {results.length > 0 && (
        <ul className="bg-white border rounded shadow mt-1 max-h-40 overflow-auto text-sm">
          {results.map((item: any) => (
            <li
              key={item.id}
              className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelect(item);
                setQuery(item.name);
                setResults([]);
              }}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AccountManagerAutocomplete;