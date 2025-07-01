"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const reflections = [
  {
    source: "Tao Te Ching",
    text: "The journey of a thousand miles begins with a single step."
  },
  {
    source: "Haiku",
    text: "An old silent pond... A frog jumps into the pond, splash! Silence again."
  },
  {
    source: "Rumi",
    text: "What you seek is seeking you."
  }
];

export function ReflectionCard() {
  const [reflection, setReflection] = useState(reflections[0]); 

  useEffect(() => {
    setReflection(reflections[Math.floor(Math.random() * reflections.length)]);
  }, []);

  return (
    <Card className="bg-transparent border-2 border-accent/50 shadow-[0_0_15px_hsl(var(--accent)/0.5)] transition-shadow hover:shadow-[0_0_25px_hsl(var(--accent)/0.7)]">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-accent">A Moment of Reflection</CardTitle>
      </CardHeader>
      <CardContent>
        <blockquote className="font-headline text-2xl italic text-center text-foreground/80">
          "{reflection.text}"
        </blockquote>
        <p className="text-right font-headline text-sm text-muted-foreground mt-4">- {reflection.source}</p>
      </CardContent>
    </Card>
  );
}
