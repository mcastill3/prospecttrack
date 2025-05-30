'use client';

import ActivityFormCreate from '@/components/forms/Modal/ActivityFormCreate';
import { useEffect, useState } from 'react';


const ActivityCreatePage = () => {
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('selectedContactIds');
    if (stored) {
      setSelectedContactIds(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Activity</h1>
      <ActivityFormCreate selectedContactIds={selectedContactIds} />
    </div>
  );
};

export default ActivityCreatePage;
