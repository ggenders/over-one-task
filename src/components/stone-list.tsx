
'use client'

import { useState, useEffect } from "react";
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Mountain, Sparkles, HelpCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useToast } from "@/hooks/use-toast";
import { HelpDialog } from "./help-dialog";
import { MusicToggle } from "./music-toggle";

type Task = {
  id: string;
  text: string;
};

interface StoneListProps {
  stones: Task[];
  onAddTask: (text: string) => void;
  isGuest?: boolean;
  isOwner?: boolean;
}

function SortableStoneItem({ stone }: { stone: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stone.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group flex items-center justify-between p-3 rounded-lg bg-background/30 hover:bg-accent/20 transition-colors duration-200 cursor-grab"
    >
      <div className="flex items-center gap-3 flex-grow font-body">
        <div className="text-accent">
            <Mountain className="w-5 h-5" />
        </div>
        <span className="text-foreground">{stone.text}</span>
      </div>
    </div>
  );
}


export function StoneList({ stones, onAddTask, isGuest = false, isOwner = false }: StoneListProps) {
  const [newTaskText, setNewTaskText] = useState("");
  const { toast } = useToast();
  const guestLimitReached = isGuest && stones.length >= 2;
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    if (isOwner) {
      // The owner is recognized and will not see the help dialog.
      // We can also permanently mark it as seen for them.
      localStorage.setItem('hasSeenHelpDialog', 'true');
      setIsHelpOpen(false);
      return;
    }
    
    if (isGuest) {
        if (sessionStorage.getItem('hasSeenHelpDialog') !== 'true') {
            setIsHelpOpen(true);
            sessionStorage.setItem('hasSeenHelpDialog', 'true');
        }
    } else { // Registered user
        if (localStorage.getItem('hasSeenHelpDialog') !== 'true') {
            setIsHelpOpen(true);
        }
    }
  }, [isGuest, isOwner]);

  const handleConfirmHelp = () => {
    if (!isGuest) {
      localStorage.setItem('hasSeenHelpDialog', 'true');
    }
    setIsHelpOpen(false);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (guestLimitReached) {
      toast({
        title: "Guest Limit Reached",
        description: "Please create an account to add more stones.",
        variant: "destructive",
      });
      return;
    }
    if (newTaskText.trim()) {
      onAddTask(newTaskText.trim());
      setNewTaskText("");
    }
  };

  return (
    <Card className="h-full flex flex-col shadow-lg bg-card/80 backdrop-blur-sm border-accent/20">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <div className="flex items-center gap-3">
                    <Mountain className="w-8 h-8 text-foreground" />
                    <CardTitle className="font-headline text-3xl">Stones</CardTitle>
                </div>
                <CardDescription className="font-body pt-1">All the tasks weighing on your mind. Drag to reorder or drop in the bowl.</CardDescription>
            </div>
            <div className="flex items-center gap-1">
                <MusicToggle />
                <Button variant="ghost" size="icon" onClick={() => setIsHelpOpen(true)} className="rounded-full bg-card/60 backdrop-blur-sm hover:bg-accent/20">
                    <HelpCircle className="h-5 w-5 text-foreground/70" />
                    <span className="sr-only">How to use</span>
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4 overflow-hidden">
        {guestLimitReached ? (
           <div className="flex flex-col items-center gap-4 text-center p-4 bg-background/50 rounded-lg">
              <p className="font-body text-muted-foreground">You've reached the guest limit of 2 stones.</p>
              <Link href="/" passHref>
                  <Button className="w-full font-body text-lg py-6 bg-primary text-primary-foreground shadow-[0_0_10px_hsl(var(--primary))] hover:shadow-[0_0_20px_hsl(var(--primary))] transition-all duration-300">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Upgrade & Save Progress
                  </Button>
              </Link>
          </div>
        ) : (
          <form onSubmit={handleAddTask} className="flex gap-2">
            <Input
              type="text"
              placeholder="Add a new stone..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              className="font-body bg-background/50 focus:bg-background"
            />
            <Button type="submit" size="icon" aria-label="Add Task" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </form>
        )}
        <SortableContext items={stones.map(s => s.id)} strategy={verticalListSortingStrategy}>
          <ScrollArea className="flex-grow">
            <div className="space-y-2 pr-4">
              {stones.length > 0 ? (
                stones.map(stone => (
                  <SortableStoneItem key={stone.id} stone={stone} />
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <Mountain className="w-16 h-16 text-muted-foreground/20 mb-4" />
                    <p className="font-body text-muted-foreground">Your mind is clear.</p>
                    <p className="font-body text-muted-foreground text-sm">Add a task to create your first stone.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </SortableContext>
      </CardContent>
      <HelpDialog 
        open={isHelpOpen} 
        onOpenChange={setIsHelpOpen}
        onConfirm={handleConfirmHelp}
        isGuest={isGuest}
      />
    </Card>
  );
}
