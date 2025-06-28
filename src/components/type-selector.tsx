"use client";

import { cn } from "@/lib/utils";
import { getTypeColor } from "@/lib/pokemon-data";
import { TypeIcon } from "./icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TypeSelectorProps {
  types: string[];
  selectedType: string | null;
  onSelectType: (type: string) => void;
}

export function TypeSelector({
  types,
  selectedType,
  onSelectType,
}: TypeSelectorProps) {
  return (
    <TooltipProvider>
      <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-2">
        {types.map((type) => {
          const color = getTypeColor(type);
          return (
            <Tooltip key={type}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onSelectType(type)}
                  className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all duration-200",
                    selectedType === type
                      ? "border-primary scale-110 shadow-lg"
                      : "border-transparent hover:scale-105 hover:shadow-md"
                  )}
                  style={{
                    backgroundColor: selectedType === type ? `${color}40` : `${color}20`,
                    borderColor: selectedType === type ? color : 'transparent'
                  }}
                  aria-pressed={selectedType === type}
                >
                  <TypeIcon
                    typeName={type}
                    className="h-8 w-8"
                    style={{ color: color }}
                  />
                  <span
                    className="mt-1 text-xs font-semibold"
                    style={{ color: color }}
                  >
                    {type}
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{type}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
