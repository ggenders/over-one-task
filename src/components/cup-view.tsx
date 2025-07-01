"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coffee, Check } from "lucide-react";

type Task = {
  id: string;
  text: string;
};

interface CupViewProps {
  task: Task | null;
  onComplete: () => void;
}

export function CupView({ task, onComplete }: CupViewProps) {
  return (
    <Card className="h-full flex flex-col shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3 text-primary">
          <Coffee className="w-8 h-8"/>
          <CardTitle className="font-headline text-3xl">Your Cup</CardTitle>
        </div>
        <CardDescription className="font-body pt-1">The one task you are focusing on.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center">
        {task ? (
          <div className="text-center p-6 bg-background rounded-lg transition-all duration-300">
            <p className="font-headline text-2xl md:text-3xl text-foreground">{task.text}</p>
          </div>
        ) : (
          <div className="text-center p-6">
            <p className="font-headline text-lg text-muted-foreground">Your cup is empty. <br/> Select a task from your stones to begin.</p>
          </div>
        )}
      </CardContent>
      {task && (
        <CardFooter>
          <Button onClick={onComplete} className="w-full font-body text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Check className="mr-2 h-5 w-5" />
            Mark as Done
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
