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

import { Clock, Users, FileText } from "lucide-react";
import { useState } from "react";

const iconMap = {
  Users,
  Clock,
  FileText,
};

type ReportCardProps = {
    title: string;
    description: string;
    href: string;
    icon: keyof typeof iconMap;
    hasFilters?: boolean;
  };

  export const ReportCard: React.FC<ReportCardProps> = ({
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
              Download
            </Button>
  
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Formats</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {["pdf", "xls", "csv", "txt", "json", "html"].map((format) => (
                  <DropdownMenuItem key={format} asChild>
                    <a
                      href={`${href}?format=${format}`}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {format.toUpperCase()}
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
  
          {/* Filtros (sólo si aplica) */}
          {showFilters && hasFilters && (
            <div className="mt-4 space-y-2 border-t pt-4">
              <p className="text-sm text-gray-600">Add filters here...</p>
              {/* Aquí irían los inputs de fecha, usuario, país, etc */}
              <input
                type="text"
                placeholder="Filter by user"
                className="w-full border px-2 py-1 rounded text-sm"
              />
              <Button size="sm" className="mt-2">Generate</Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };