'use client'

import { useState } from "react";
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Mountain, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useToast } from "@/hooks/use-toast";

type Task = {
  id: string;
  text: string;
};

interface StoneListProps {
  stones: Task[];
  onAddTask: (text: string) => void;
  isGuest?: boolean;
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
        <Mountain className="w-5 h-5 text-accent" />
        <span className="text-foreground">{stone.text}</span>
      </div>
    </div>
  );
}


export function StoneList({ stones, onAddTask, isGuest = false }: StoneListProps) {
  const [newTaskText, setNewTaskText] = useState("");
  const { toast } = useToast();
  const guestLimitReached = isGuest && stones.length >= 2;

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
        <CardTitle className="font-headline text-3xl">Stones</CardTitle>
        <CardDescription className="font-body pt-1">All the tasks weighing on your mind. Drag to reorder or drop in the bowl.</CardDescription>
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
                <div className="h-full flex items-center justify-center">
                  <p className="text-center font-body text-muted-foreground py-8">Your mind is clear. <br/> No stones to carry.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </SortableContext>
      </CardContent>
    </Card>
  );
}
