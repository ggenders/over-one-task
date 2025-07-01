'use client'

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, ArrowRightCircle, GripVertical } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type Task = {
  id: string;
  text: string;
};

interface StoneListProps {
  stones: Task[];
  onAddTask: (text: string) => void;
  onSelectTask: (id: string) => void;
}

function SortableStoneItem({ stone, onSelectTask }: { stone: Task; onSelectTask: (id: string) => void }) {
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
      className="group flex items-center justify-between p-3 rounded-lg bg-background/30 hover:bg-accent/20 transition-colors duration-200"
    >
      <div className="flex items-center gap-3 flex-grow text-foreground font-body">
        <button {...attributes} {...listeners} className="cursor-grab p-1 -ml-1 text-muted-foreground hover:text-foreground focus:outline-none">
           <GripVertical className="w-5 h-5" />
        </button>
        {stone.text}
      </div>
      <Button variant="ghost" size="icon" aria-label={`Focus on ${stone.text}`} className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onSelectTask(stone.id)}>
        <ArrowRightCircle className="h-5 w-5 text-accent" />
      </Button>
    </div>
  );
}


export function StoneList({ stones, onAddTask, onSelectTask }: StoneListProps) {
  const [newTaskText, setNewTaskText] = useState("");

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      onAddTask(newTaskText.trim());
      setNewTaskText("");
    }
  };

  return (
    <Card className="h-full flex flex-col shadow-lg bg-card/80 backdrop-blur-sm border-accent/20">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Your Stones</CardTitle>
        <CardDescription className="font-body pt-1">All the tasks weighing on your mind. Drag to reorder.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4 overflow-hidden">
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
        <SortableContext items={stones.map(s => s.id)} strategy={verticalListSortingStrategy}>
          <ScrollArea className="flex-grow">
            <div className="space-y-2 pr-4">
              {stones.length > 0 ? (
                stones.map(stone => (
                  <SortableStoneItem key={stone.id} stone={stone} onSelectTask={onSelectTask} />
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
