"use client";

import { useState, useEffect } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { CupView } from '@/components/cup-view';
import { StoneList } from '@/components/stone-list';
import { MusicToggle } from '@/components/music-toggle';
import { Skeleton } from '@/components/ui/skeleton';

type Task = {
  id: string;
  text: string;
};

const initialStones: Task[] = [
  { id: '1', text: 'Respond to important emails' },
  { id: '2', text: 'Prepare presentation for tomorrow' },
  { id: '3', text: 'Go for a 15-minute walk' },
  { id: '4', text: 'Meditate for 5 minutes' },
  { id: '5', text: 'Plan dinner for tonight' }
];

export default function Home() {
  const [stones, setStones] = useState<Task[]>([]);
  const [cup, setCup] = useState<Task | null>(null);
  const [isClient, setIsClient] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    // This ensures code runs only on the client
    setIsClient(true);
    try {
      const savedStones = localStorage.getItem('stones');
      const savedCup = localStorage.getItem('cup');
      if (savedStones) {
        setStones(JSON.parse(savedStones));
      } else {
        setStones(initialStones);
      }
      if (savedCup) {
        setCup(JSON.parse(savedCup));
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
      setStones(initialStones);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem('stones', JSON.stringify(stones));
        if (cup) {
          localStorage.setItem('cup', JSON.stringify(cup));
        } else {
          localStorage.removeItem('cup');
        }
      } catch (error) {
        console.error("Failed to save state to localStorage", error);
      }
    }
  }, [stones, cup, isClient]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setStones((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddTask = (taskText: string) => {
    const newTask: Task = { id: Date.now().toString(), text: taskText };
    setStones(prevStones => [...prevStones, newTask]);
  };

  const handleSelectTask = (taskId: string) => {
    const taskToMove = stones.find(t => t.id === taskId);
    if (taskToMove) {
      setStones(prevStones => {
        const newStones = prevStones.filter(t => t.id !== taskId);
        if (cup) {
          return [...newStones, cup];
        }
        return newStones;
      });
      setCup(taskToMove);
    }
  };

  const handleCompleteTask = () => {
    setCup(null);
  };
  
  if (!isClient) {
    return (
      <main className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto max-w-7xl">
          <header className="text-center mb-12">
            <Skeleton className="h-12 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto mt-4" />
          </header>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <Skeleton className="h-[300px] lg:h-[400px] w-full" />
            </div>
            <div className="lg:col-span-2">
              <Skeleton className="h-[500px] w-full" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-7xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">The Cup and Stone</h1>
          <p className="text-muted-foreground font-body mt-2">A space for mindful focus.</p>
        </header>
        
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 min-h-[300px] lg:min-h-[400px]">
              <CupView task={cup} onComplete={handleCompleteTask} />
            </div>
            <div className="lg:col-span-2 min-h-[500px]">
              <StoneList stones={stones} onAddTask={handleAddTask} onSelectTask={handleSelectTask} />
            </div>
          </div>
        </DndContext>
        
        <MusicToggle />
      </div>
    </main>
  );
}
