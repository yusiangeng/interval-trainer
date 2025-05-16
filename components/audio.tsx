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

  const selectedAnswerIsCorrect = selectedAnswer === secondNote - firstNote;

  // Generate a new problem
  const generateProblem = () => {
    const first = Math.floor(Math.random() * 12); // 0 to 11
    const interval = Math.floor(Math.random() * 12) + 1; // 1 to 12
    const second = first + interval;

    setFirstNote(first);
    setSecondNote(second);
    setSelectedAnswer(null);
  };

  // Initialize on first render
  useEffect(() => {
    generateProblem();
  }, []);

  // Check the user's answer
  const checkAnswer = (num: number) => {
    setSelectedAnswer(num);

    const correctDifference = secondNote - firstNote;
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
          <div className="grid grid-cols-2 gap-2">
            <Button variant={selectedAnswerIsCorrect ? "secondary" : "default"} onClick={playNotes}>
              Play Notes
            </Button>
            <Button variant="default" disabled={!selectedAnswerIsCorrect} onClick={generateProblem}>
              Next Question
            </Button>
          </div>

          <div className="space-y-3">
            <div className="font-medium text-center">What is the interval played? Select your answer:</div>

            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                <Button
                  key={num}
                  variant={selectedAnswer !== num ? "outline" : selectedAnswerIsCorrect ? "success" : "destructive"}
                  onClick={() => checkAnswer(num)}
                >
                  {INTERVALS[num]}
                </Button>
              ))}
            </div>
          </div>

          <div
            className={`flex items-center gap-2 rounded-md p-3 ${
              !selectedAnswer ? "" : selectedAnswerIsCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}
          >
            {!selectedAnswer ? <></> : selectedAnswerIsCorrect ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            <span className="h-5">
              {!selectedAnswer ? "" : selectedAnswerIsCorrect ? `Correct! (${NOTES[firstNote]}, ${NOTES[secondNote]})` : "That's not right. Try again."}
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-2">
          <div className="flex gap-2"></div>
        </CardFooter>
      </Card>
    </div>
  );
}
