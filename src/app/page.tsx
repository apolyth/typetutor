"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TypeSelector } from "@/components/type-selector";
import { EffectivenessDisplay } from "@/components/effectiveness-display";
import { ResistanceDisplay } from "@/components/resistance-display";
import { Quiz } from "@/components/quiz";
import { POKEMON_TYPES } from "@/lib/pokemon-data";
import { TypeIcon } from "@/components/icons";

export default function Home() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center min-h-screen w-full p-4 sm:p-8 font-body">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-2">
            <TypeIcon typeName="Normal" className="h-10 w-10" />
            <h1 className="text-4xl sm:text-5xl font-bold font-headline text-primary">
              Type Tutor
            </h1>
            <TypeIcon typeName="Ghost" className="h-10 w-10" />
          </div>
          <p className="text-lg text-muted-foreground mt-2">
            Master Pokémon Type Matchups with ease.
          </p>
        </header>

        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle>Select a Type to Study</CardTitle>
          </CardHeader>
          <CardContent>
            <TypeSelector
              types={POKEMON_TYPES.map((t) => t.name)}
              selectedType={selectedType}
              onSelectType={setSelectedType}
            />
          </CardContent>
        </Card>

        {selectedType && (
          <Tabs defaultValue="study" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="study">Effectiveness</TabsTrigger>
              <TabsTrigger value="resistances">Resistances & Weaknesses</TabsTrigger>
              <TabsTrigger value="quiz">Quiz</TabsTrigger>
            </TabsList>
            <TabsContent value="study" className="mt-4">
              <EffectivenessDisplay attackingType={selectedType} />
            </TabsContent>
            <TabsContent value="resistances" className="mt-4">
              <ResistanceDisplay defendingType={selectedType} />
            </TabsContent>
            <TabsContent value="quiz" className="mt-4">
              <Quiz key={selectedType} attackingType={selectedType} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
