// components/button/OpenCreateModalButton.tsx
'use client'

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'

interface OpenCreateModalButtonProps {
  label: string;
  ModalComponent: React.ComponentType<{ open: boolean; onClose: () => void }>;
}

export default function OpenCreateModalButton({ label, ModalComponent }: OpenCreateModalButtonProps) {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  return (
    <>
      <Badge
        className="cursor-pointer flex items-center gap-2 bg-gray-400 text-black font-semibold text-md rounded-md px-3 py-1.5 shadow-md hover:bg-black hover:text-white transition-colors duration-300"
        onClick={() => setOpen(true)}
      >
        <Plus className="w-5 h-5" />
        {label}
      </Badge>

      <ModalComponent open={open} onClose={handleClose} />
    </>
  );
}

