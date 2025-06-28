"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { POKEMON_TYPES, getEffectiveness, getTypeColor } from "@/lib/pokemon-data";
import { useSpacedRepetition } from "@/hooks/use-spaced-repetition";
import { TypeIcon } from "./icons";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { typeTutorExplanation } from "@/ai/flows/type-tutor-explanation";
import { Skeleton } from "./ui/skeleton";

const EFFECTIVENESS_OPTIONS = [
  "Super Effective",
  "Normal",
  "Not Very Effective",
  "No Effect",
];

export function Quiz({ attackingType }: { attackingType: string }) {
  const { recordResult, getQuizQuestions } = useSpacedRepetition();
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [aiExplanation, setAiExplanation] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    setQuestions(getQuizQuestions(attackingType));
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResults(false);
    setIsAnswered(false);
    setSelectedAnswer(null);
  }, [attackingType, getQuizQuestions]);

  const defendingType = useMemo(
    () => questions[currentQuestionIndex],
    [questions, currentQuestionIndex]
  );
  
  const { multiplier: correctMultiplier, label: correctLabel } = useMemo(() => {
    if (!defendingType) return { multiplier: 1, label: 'Normal' };
    return getEffectiveness(attackingType, defendingType);
  }, [attackingType, defendingType]);

  const fetchAiExplanation = useCallback(async () => {
    if (!defendingType) return;
    setIsAiLoading(true);
    setAiExplanation('');
    try {
        const result = await typeTutorExplanation({ attackingType, defendingType });
        setAiExplanation(result.explanation);
    } catch (error) {
        console.error("Failed to fetch AI explanation", error);
        setAiExplanation("Sorry, I couldn't come up with an explanation right now.");
    } finally {
        setIsAiLoading(false);
    }
  }, [attackingType, defendingType]);

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === correctLabel;
    if (isCorrect) {
      setScore(score + 1);
    }
    recordResult(attackingType, defendingType, isCorrect);
    setIsAnswered(true);
    fetchAiExplanation();
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsAnswered(false);
      setSelectedAnswer(null);
      setAiExplanation('');
    } else {
      setShowResults(true);
    }
  };

  const restartQuiz = () => {
    setQuestions(getQuizQuestions(attackingType));
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResults(false);
    setIsAnswered(false);
    setSelectedAnswer(null);
  };
  
  if (questions.length === 0) {
    return <Card><CardContent><p>Loading quiz...</p></CardContent></Card>
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
        <div className="flex items-center justify-center gap-4 text-xl sm:text-2xl font-bold my-4">
            <div className="flex items-center gap-2">
                <TypeIcon typeName={attackingType} className="h-8 w-8" style={{color: getTypeColor(attackingType)}} />
                <span>{attackingType}</span>
            </div>
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
             <div className="flex items-center gap-2">
                <TypeIcon typeName={defendingType} className="h-8 w-8" style={{color: getTypeColor(defendingType)}}/>
                <span>{defendingType}</span>
            </div>
        </div>
        <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} />
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={selectedAnswer ?? ''}
          onValueChange={setSelectedAnswer}
          disabled={isAnswered}
        >
          {EFFECTIVENESS_OPTIONS.map((option) => (
            <div key={option} className="flex items-center">
              <RadioGroupItem value={option} id={option} />
              <Label htmlFor={option} className="ml-2 text-base">{option}</Label>
            </div>
          ))}
        </RadioGroup>
        
        {isAnswered ? (
          <Button onClick={handleNext} className="w-full">
            {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Show Results"}
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!selectedAnswer} className="w-full">
            Submit
          </Button>
        )}

        {isAnswered && (
          <Alert variant={selectedAnswer === correctLabel ? "default" : "destructive"} className="bg-opacity-20">
            {selectedAnswer === correctLabel ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            <AlertTitle>
              {selectedAnswer === correctLabel ? "Correct!" : "Not quite..."}
            </AlertTitle>
            <AlertDescription>
                <p className="mb-2">The correct answer is <strong>{correctLabel} ({correctMultiplier}x)</strong>.</p>
                {isAiLoading ? (
                    <div className="space-y-2 mt-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                ) : (
                    <p>{aiExplanation}</p>
                )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
