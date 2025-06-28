"use client";

import { useState, useEffect, useCallback } from "react";
import { POKEMON_TYPES } from "@/lib/pokemon-data";

const STORAGE_KEY = "pokemon-type-tutor-progress";

type MatchupProgress = {
  level: number; // 0-5, where 0 is unlearned, 5 is mastered
  lastCorrect: number | null;
  lastIncorrect: number | null;
};

type AllProgress = {
  [attackingType: string]: {
    [defendingType: string]: MatchupProgress;
  };
};

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function useSpacedRepetition() {
  const [progress, setProgress] = useState<AllProgress>({});

  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(STORAGE_KEY);
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }
    } catch (error) {
      console.error("Could not load progress from localStorage", error);
    }
  }, []);

  const saveProgress = useCallback((newProgress: AllProgress) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
      setProgress(newProgress);
    } catch (error) {
      console.error("Could not save progress to localStorage", error);
    }
  }, []);

  const recordResult = useCallback(
    (attackingType: string, defendingType: string, isCorrect: boolean) => {
      const newProgress = { ...progress };
      if (!newProgress[attackingType]) {
        newProgress[attackingType] = {};
      }
      
      const currentMatchup = newProgress[attackingType][defendingType] || {
        level: 0,
        lastCorrect: null,
        lastIncorrect: null,
      };

      if (isCorrect) {
        currentMatchup.level = Math.min(5, currentMatchup.level + 1);
        currentMatchup.lastCorrect = Date.now();
      } else {
        currentMatchup.level = Math.max(0, currentMatchup.level - 1);
        currentMatchup.lastIncorrect = Date.now();
      }
      
      newProgress[attackingType][defendingType] = currentMatchup;
      saveProgress(newProgress);
    },
    [progress, saveProgress]
  );

  const getQuizQuestions = useCallback(
    (attackingType: string): string[] => {
      const defendingTypes = POKEMON_TYPES.map(t => t.name).filter(t => t !== attackingType);
      
      const typeProgress = progress[attackingType] || {};

      const weightedList = defendingTypes.flatMap(type => {
        const level = typeProgress[type]?.level ?? 0;
        // Higher weight for lower level (more difficult) matchups
        const weight = 6 - level; 
        return Array(weight).fill(type);
      });
      
      const shuffled = shuffleArray(weightedList);
      const uniqueQuestions = [...new Set(shuffled)];

      // Ensure all types are included at least once if not mastered
      const unmasteredTypes = defendingTypes.filter(type => (typeProgress[type]?.level ?? 0) < 5);
      const questionsWithUnmastered = [...new Set([...uniqueQuestions, ...unmasteredTypes])];

      return shuffleArray(questionsWithUnmastered).slice(0, 10);
    },
    [progress]
  );
  
  return { recordResult, getQuizQuestions };
}
