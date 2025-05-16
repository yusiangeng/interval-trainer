"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";
import * as Tone from "tone";

const NOTES = [
  "C4",
  "C#4",
  "D4",
  "D#4",
  "E4",
  "F4",
  "F#4",
  "G4",
  "G#4",
  "A4",
  "A#4",
  "B4",
  "C5",
  "C#5",
  "D5",
  "D#5",
  "E5",
  "F5",
  "F#5",
  "G5",
  "G#5",
  "A5",
  "A#5",
  "B5",
] as const;

const INTERVALS = [
  "DUMMY_INTERVAL_SHOULD_NOT_DISPLAY",
  "Minor 2nd",
  "Major 2nd",
  "Minor 3rd",
  "Major 3rd",
  "Perfect 4th",
  "Tritone",
  "Perfect 5th",
  "Minor 6th",
  "Major 6th",
  "Minor 7th",
  "Major 7th",
  "Octave",
] as const;

export default function Audio() {
  const [isAudioReady, setIsAudioReady] = useState(false);

  const [firstNote, setFirstNote] = useState(0);
  const [secondNote, setSecondNote] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<null | { correct: boolean; message: string }>(null);

  // Generate a new problem
  const generateProblem = () => {
    const first = Math.floor(Math.random() * 12); // 0 to 11
    const interval = Math.floor(Math.random() * 12) + 1; // 1 to 12
    const second = first + interval;

    setFirstNote(first);
    setSecondNote(second);
    setSelectedAnswer(null);
    setFeedback(null);
  };

  // Initialize on first render
  useEffect(() => {
    generateProblem();
  }, []);

  // Check the user's answer
  const checkAnswer = () => {
    if (selectedAnswer === null) return;

    const correctDifference = secondNote - firstNote;

    if (selectedAnswer === correctDifference) {
      setFeedback({
        correct: true,
        message: "Correct! Great job!",
      });
    } else {
      setFeedback({
        correct: false,
        message: "That's not right. Try again or check the answer.",
      });
    }
  };

  // Initialize a synth connected to the main output (speakers)
  const synth = new Tone.Synth().toDestination();

  const playNotes = async () => {
    if (isAudioReady) {
      await Tone.start(); // Required to start the AudioContext due to browser restrictions
      setIsAudioReady(true);
      console.log("Audio is ready");
    }
    const now = Tone.now();
    synth.triggerAttackRelease(NOTES[firstNote], "8n", now); // play note for x
    synth.triggerAttackRelease(NOTES[secondNote], "8n", now + 1); // play note for y with delay
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Intervals Practice</CardTitle>
          <CardDescription className="text-center">Identify the interval between two notes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center gap-12 text-4xl font-bold">
            <div className="text-center">
              <div className="mb-2 text-sm font-normal text-muted-foreground">First Note</div>
              <div>{NOTES[firstNote]}</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-sm font-normal text-muted-foreground">Second Note</div>
              <div>{NOTES[secondNote]}</div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button onClick={playNotes}>Play Notes</Button>
          </div>

          <div className="space-y-3">
            <div className="font-medium text-center">What is the interval played? Select your answer:</div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-2">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                <Button key={num} variant={selectedAnswer === num ? "default" : "outline"} className="h-12 w-full" onClick={() => setSelectedAnswer(num)}>
                  {INTERVALS[num]}
                </Button>
              ))}
            </div>
          </div>

          {feedback && (
            <div className={`flex items-center gap-2 rounded-md p-3 ${feedback.correct ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {feedback.correct ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
              <span>{feedback.message}</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between gap-2">
          <div className="flex gap-2">
            <Button onClick={checkAnswer} disabled={selectedAnswer === null}>
              Check Answer
            </Button>
            <Button variant="secondary" onClick={generateProblem} className="px-3">
              Next Question
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
