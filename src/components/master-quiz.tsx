"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { POKEMON_TYPES, getCombinedEffectiveness, getTypeColor } from "@/lib/pokemon-data";
import { TypeIcon } from "./icons";
import { CheckCircle2, XCircle, ArrowRight, Dices } from "lucide-react";
import { shuffleArray } from "@/lib/utils";

const EFFECTIVENESS_OPTIONS = [
  { label: "4x Super Effective", multiplier: 4 },
  { label: "2x Super Effective", multiplier: 2 },
  { label: "Normal Damage", multiplier: 1 },
  { label: "0.5x Not Very Effective", multiplier: 0.5 },
  { label: "0.25x Not Very Effective", multiplier: 0.25 },
  { label: "No Effect", multiplier: 0 },
];

type MasterQuizQuestion = {
  attackingType: string;
  defendingTypes: [string, string];
};

function generateMasterQuizQuestions(): MasterQuizQuestion[] {
    const questions: MasterQuizQuestion[] = [];
    const allTypes = POKEMON_TYPES.map(t => t.name);
    const questionSet = new Set<string>();

    while (questions.length < 10) {
        const attackingType = allTypes[Math.floor(Math.random() * allTypes.length)];
        const shuffledDefenders = shuffleArray(allTypes.filter(t => t !== attackingType));

        if (shuffledDefenders.length < 2) continue;

        const defendingTypes: [string, string] = [shuffledDefenders[0], shuffledDefenders[1]];
        
        const { multiplier } = getCombinedEffectiveness(attackingType, defendingTypes);

        if (multiplier !== 1) {
            const sortedDefenders = [...defendingTypes].sort();
            const questionKey = `${attackingType}-${sortedDefenders[0]}-${sortedDefenders[1]}`;

            if (!questionSet.has(questionKey)) {
                questions.push({ attackingType, defendingTypes });
                questionSet.add(questionKey);
            }
        }
    }
    return questions;
}


export function MasterQuiz() {
  const [questions, setQuestions] = useState<MasterQuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    if (isStarted) {
      setQuestions(generateMasterQuizQuestions());
    }
  }, [isStarted]);

  const currentQuestion = useMemo(
    () => questions[currentQuestionIndex],
    [questions, currentQuestionIndex]
  );
  
  const { multiplier: correctMultiplier, label: correctLabel } = useMemo(() => {
    if (!currentQuestion) return { multiplier: 1, label: 'Normal' };
    return getCombinedEffectiveness(currentQuestion.attackingType, currentQuestion.defendingTypes);
  }, [currentQuestion]);

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === correctMultiplier;
    if (isCorrect) {
      setScore(score + 1);
    }
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsAnswered(false);
      setSelectedAnswer(null);
    } else {
      setShowResults(true);
    }
  };

  const restartQuiz = () => {
    setQuestions(generateMasterQuizQuestions());
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResults(false);
    setIsAnswered(false);
    setSelectedAnswer(null);
  };

  if (!isStarted) {
    return (
        <div className="text-center space-y-4">
            <p>Test your knowledge with dual-type matchups!</p>
            <Button onClick={() => setIsStarted(true)}>
                <Dices className="mr-2 h-4 w-4" /> Start Master Quiz
            </Button>
        </div>
    );
  }
  
  if (questions.length === 0) {
    return <Card><CardContent className="pt-6"><p>Generating questions...</p></CardContent></Card>
  }

  if (showResults) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-2xl">
            You scored {score} out of {questions.length}!
          </p>
          <Progress value={(score / questions.length) * 100} className="w-full" />
          <Button onClick={restartQuiz}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }
  
  const { attackingType, defendingTypes } = currentQuestion;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
        <div className="flex items-center justify-center gap-2 sm:gap-4 text-xl sm:text-2xl font-bold my-4">
            <div className="flex items-center gap-2">
                <TypeIcon typeName={attackingType} className="h-8 w-8" style={{color: getTypeColor(attackingType)}} />
                <span>{attackingType}</span>
            </div>
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
             <div className="flex items-center gap-2">
                <TypeIcon typeName={defendingTypes[0]} className="h-8 w-8" style={{color: getTypeColor(defendingTypes[0])}}/>
                <span>{defendingTypes[0]}</span>
                <span className="text-muted-foreground">/</span>
                <TypeIcon typeName={defendingTypes[1]} className="h-8 w-8" style={{color: getTypeColor(defendingTypes[1])}}/>
                <span>{defendingTypes[1]}</span>
            </div>
        </div>
        <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} />
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={selectedAnswer?.toString() ?? ''}
          onValueChange={(val) => setSelectedAnswer(parseFloat(val))}
          disabled={isAnswered}
        >
          {EFFECTIVENESS_OPTIONS.filter(o => o.multiplier !== 1).map((option) => (
            <div key={option.multiplier} className="flex items-center">
              <RadioGroupItem value={option.multiplier.toString()} id={option.label} />
              <Label htmlFor={option.label} className="ml-2 text-base">{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
        
        {isAnswered ? (
          <Button onClick={handleNext} className="w-full">
            {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Show Results"}
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={selectedAnswer === null} className="w-full">
            Submit
          </Button>
        )}

        {isAnswered && (
          <Alert variant={selectedAnswer === correctMultiplier ? "default" : "destructive"} className="bg-opacity-20">
            {selectedAnswer === correctMultiplier ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            <AlertTitle>
              {selectedAnswer === correctMultiplier ? "Correct!" : "Not quite..."}
            </AlertTitle>
            <AlertDescription>
                <p className="mb-2">The correct answer is <strong>{correctLabel}</strong>.</p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
