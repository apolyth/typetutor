"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { POKEMON_TYPES, TYPE_CHART, getTypeColor } from "@/lib/pokemon-data";
import { TypeIcon } from "./icons";
import { typeTutorExplanation } from "@/ai/flows/type-tutor-explanation";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface ResistanceCardProps {
  title: string;
  description: string;
  types: string[];
  onTypeClick: (type: string) => void;
  defendingType: string;
}

function ResistanceCard({
  title,
  description,
  types,
  onTypeClick,
  defendingType,
}: ResistanceCardProps) {
  if (types.length === 0) return null;

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        {types.map((type) => {
          const color = getTypeColor(type);
          return (
            <button
              key={type}
              onClick={() => onTypeClick(type)}
              className="flex items-center gap-2 p-2 rounded-md transition-colors"
              style={{ backgroundColor: `${color}20`, color: color }}
              title={`Explain ${type} vs ${defendingType}`}
            >
              <TypeIcon typeName={type} className="h-5 w-5" />
              <span className="font-semibold text-sm">{type}</span>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}

function ExplanationModal({
  isOpen,
  onClose,
  attackingType,
  defendingType,
}: {
  isOpen: boolean;
  onClose: () => void;
  attackingType: string | null;
  defendingType: string;
}) {
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && attackingType && defendingType) {
      const fetchExplanation = async () => {
        setIsLoading(true);
        setError(null);
        setExplanation("");
        try {
          const result = await typeTutorExplanation({
            attackingType,
            defendingType,
          });
          setExplanation(result.explanation);
        } catch (e) {
          setError("Failed to fetch explanation. Please try again.");
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      };
      fetchExplanation();
    }
  }, [isOpen, attackingType, defendingType]);

  const multiplier = attackingType ? TYPE_CHART[attackingType][defendingType] : 1;
  const effectivenessLabel = 
    multiplier === 2 ? "Super Effective" :
    multiplier === 0.5 ? "Not Very Effective" :
    multiplier === 0 ? "No Effect" : "Normal";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Matchup: {attackingType} vs. {defendingType}
          </DialogTitle>
          <DialogDescription>
            An AI-powered explanation to help you remember.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            {attackingType && <Badge variant={
                multiplier === 2 ? "default" :
                multiplier === 0.5 ? "secondary" :
                multiplier === 0 ? "destructive" : "outline"
            }>
                {effectivenessLabel} ({multiplier}x)
            </Badge>}

          {isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          )}
          {error && <p className="text-destructive">{error}</p>}
          {explanation && (
            <p className="text-base leading-relaxed">{explanation}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ResistanceDisplay({
  defendingType,
}: {
  defendingType: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAttackingType, setSelectedAttackingType] = useState<
    string | null
  >(null);

  const matchups = useMemo(() => {
    const allTypes = POKEMON_TYPES.map((t) => t.name);
    const weaknesses: string[] = [];
    const resistances: string[] = [];
    const immunities: string[] = [];

    allTypes.forEach((attackingType) => {
      const multiplier = TYPE_CHART[attackingType][defendingType];
      if (multiplier === 2) {
        weaknesses.push(attackingType);
      } else if (multiplier === 0.5) {
        resistances.push(attackingType);
      } else if (multiplier === 0) {
        immunities.push(attackingType);
      }
    });

    return { weaknesses, resistances, immunities };
  }, [defendingType]);

  const handleTypeClick = (type: string) => {
    setSelectedAttackingType(type);
    setModalOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        <ResistanceCard
          title="Weaknesses (2x Damage)"
          description={`Vulnerable to these types.`}
          types={matchups.weaknesses}
          onTypeClick={handleTypeClick}
          defendingType={defendingType}
        />
        <ResistanceCard
          title="Resistances (0.5x Damage)"
          description={`Takes reduced damage from these types.`}
          types={matchups.resistances}
          onTypeClick={handleTypeClick}
          defendingType={defendingType}
        />
        <ResistanceCard
          title="Immunities (0x Damage)"
          description={`Takes no damage from these types.`}
          types={matchups.immunities}
          onTypeClick={handleTypeClick}
          defendingType={defendingType}
        />
      </div>
      <ExplanationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        attackingType={selectedAttackingType}
        defendingType={defendingType}
      />
    </>
  );
}
