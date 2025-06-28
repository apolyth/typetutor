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

interface EffectivenessCardProps {
  title: string;
  description: string;
  types: string[];
  onTypeClick: (type: string) => void;
  attackingType: string;
}

function EffectivenessCard({
  title,
  description,
  types,
  onTypeClick,
}: EffectivenessCardProps) {
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
              title={`Explain ${attackingType} vs ${type}`}
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
  attackingType: string;
  defendingType: string | null;
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

  const multiplier = defendingType ? TYPE_CHART[attackingType][defendingType] : 1;
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
            <Badge variant={
                multiplier === 2 ? "default" :
                multiplier === 0.5 ? "secondary" :
                multiplier === 0 ? "destructive" : "outline"
            }>
                {effectivenessLabel} ({multiplier}x)
            </Badge>

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

export function EffectivenessDisplay({
  attackingType,
}: {
  attackingType: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDefendingType, setSelectedDefendingType] = useState<
    string | null
  >(null);

  const matchups = useMemo(() => {
    const allTypes = POKEMON_TYPES.map((t) => t.name);
    const superEffective: string[] = [];
    const notVeryEffective: string[] = [];
    const noEffect: string[] = [];

    allTypes.forEach((defendingType) => {
      const multiplier = TYPE_CHART[attackingType][defendingType];
      if (multiplier === 2) {
        superEffective.push(defendingType);
      } else if (multiplier === 0.5) {
        notVeryEffective.push(defendingType);
      } else if (multiplier === 0) {
        noEffect.push(defendingType);
      }
    });

    return { superEffective, notVeryEffective, noEffect };
  }, [attackingType]);

  const handleTypeClick = (type: string) => {
    setSelectedDefendingType(type);
    setModalOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        <EffectivenessCard
          title="Super Effective (2x)"
          description={`Strong against these types.`}
          types={matchups.superEffective}
          onTypeClick={handleTypeClick}
          attackingType={attackingType}
        />
        <EffectivenessCard
          title="Not Very Effective (0.5x)"
          description={`Weak against these types.`}
          types={matchups.notVeryEffective}
          onTypeClick={handleTypeClick}
          attackingType={attackingType}
        />
        <EffectivenessCard
          title="No Effect (0x)"
          description={`Has no effect on these types.`}
          types={matchups.noEffect}
          onTypeClick={handleTypeClick}
          attackingType={attackingType}
        />
      </div>
      <ExplanationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        attackingType={attackingType}
        defendingType={selectedDefendingType}
      />
    </>
  );
}
