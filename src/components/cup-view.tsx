
"use client"

import { useRef, useEffect, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Check, Download, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Task = {
  id: string;
  text: string;
};

interface BowlViewProps {
  task: Task | null;
  onComplete: () => void;
  isFocusMode?: boolean;
}

export function BowlView({ task, onComplete, isFocusMode = false }: BowlViewProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const { isOver, setNodeRef } = useDroppable({
    id: 'bowl-droppable',
    disabled: isFocusMode || !!task,
  });

  const bowlVideoRef = useRef<HTMLVideoElement>(null);
  const completedVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = bowlVideoRef.current;
    if (!video) return;

    if (!isCompleting && (task || isOver)) {
      video.play().catch(error => {
        console.warn("Video playback was prevented. This can happen if the user hasn't interacted with the page yet.", error);
      });
    } else {
      video.pause();
    }
  }, [task, isOver, isCompleting]);
  
  useEffect(() => {
    const video = completedVideoRef.current;
    if (!video) return;

    if (isCompleting) {
        video.play().catch(error => {
            console.warn("Completion video playback was prevented. This can happen if the user hasn't interacted with the page yet.", error);
        });
    }
  }, [isCompleting]);

  const handleComplete = () => {
    if (isCompleting) return;
    setIsCompleting(true);
    setTimeout(() => {
        onComplete();
        setIsCompleting(false); // Reset for next time
    }, 2500); // Show completion state for 2.5 seconds
  }

  return (
    <Card ref={setNodeRef} className={cn(
        "h-full flex flex-col shadow-lg border-primary/20 transition-all duration-300 relative overflow-hidden bg-transparent",
        isFocusMode && "w-full max-w-3xl h-auto",
        isOver && !task && "ring-2 ring-accent shadow-[0_0_30px_hsl(var(--accent))] scale-105"
    )}>
      <video
        ref={bowlVideoRef}
        src="/bowl-video.mp4"
        loop
        muted
        playsInline
        className={cn("absolute top-0 left-0 w-full h-full object-cover z-0 opacity-25", isCompleting && "hidden")}
      />
      <video
        ref={completedVideoRef}
        src="/completed-video.mp4"
        loop
        muted
        playsInline
        className={cn("absolute top-0 left-0 w-full h-full object-cover z-0 opacity-25", !isCompleting && "hidden")}
      />
      <div className="relative z-10 flex flex-col h-full bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3 text-primary">
            <Target className="w-8 h-8"/>
            <CardTitle className="font-headline text-3xl">Bowl</CardTitle>
          </div>
          <CardDescription className="font-body pt-1">The one task you are focusing on.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center min-h-[150px]">
          {isCompleting ? (
            <div className="text-center p-6 flex flex-col items-center justify-center gap-4 text-primary transition-all duration-300">
                <Sparkles className="w-16 h-16" />
                <p className="font-headline text-3xl">Complete!</p>
            </div>
          ) : task ? (
            <div className="text-center p-6 bg-background/50 rounded-lg transition-all duration-300">
              <p className={cn(
                  "font-headline text-2xl md:text-3xl text-foreground",
                  isFocusMode && "text-4xl md:text-5xl lg:text-6xl"
              )}>{task.text}</p>
            </div>
          ) : (
            <div className="text-center p-6 flex flex-col items-center justify-center gap-4 text-muted-foreground transition-all duration-300">
              <Download className={cn("w-10 h-10 transition-transform", isOver && "scale-125 -translate-y-1 text-accent")} />
              <p className="font-headline text-lg">
                {isOver ? "Release to begin focus" : "Drag a stone here"}
              </p>
            </div>
          )}
        </CardContent>
        {task && !isCompleting && (
          <CardFooter>
            <Button 
              onClick={handleComplete} 
              className={cn(
                "w-full font-body text-lg py-6 bg-primary text-primary-foreground shadow-[0_0_10px_hsl(var(--primary))] hover:shadow-[0_0_20px_hsl(var(--primary))] transition-all duration-300",
                isFocusMode && "py-8 text-2xl"
              )}>
              <Check className={cn("mr-2 h-5 w-5", isFocusMode && "h-6 w-6")} />
              Mark as Done
            </Button>
          </CardFooter>
        )}
      </div>
    </Card>
  );
}
