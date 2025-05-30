"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ArchiveRestore, Users, FileText, Building2, Euro, Earth, Map, Settings, CpuIcon, Clock, DatabaseBackupIcon  } from "lucide-react";
import { useState } from "react";


const iconMap = {
  Users,
  Clock,
  FileText,
  Building2,
  Euro,
  Earth,
  Map,
  Settings,
  ArchiveRestore,
  CpuIcon,
  DatabaseBackupIcon,
};

type ReportCardProps = {
    title: string;
    description: string;
    href: string;
    icon: keyof typeof iconMap;
    hasFilters?: boolean;
  };

  export const GeneratorCard: React.FC<ReportCardProps> = ({
    title,
    description,
    href,
    icon,
    hasFilters = false,
  }) => {
    const Icon = iconMap[icon];
    const [showFilters, setShowFilters] = useState(false);
  
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-800">
              {title}
            </CardTitle>
            {Icon && <Icon className="h-5 w-5 text-blue-600" />}
          </div>
          <CardDescription className="mt-2 text-sm text-gray-500">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between mt-2">
            <Button
              variant="outline"
              onClick={() => {
                if (hasFilters) {
                  setShowFilters(!showFilters);
                } else {
                  window.location.href = `${href}?format=txt`;
                }
              }}
            >
              Select
            </Button>
  
            
          </div>
  
          
        </CardContent>
      </Card>
    );
  };