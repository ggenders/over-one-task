
"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { BowlView } from '@/components/cup-view';
import { StoneList } from '@/components/stone-list';
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

function AppContent() {
  const [stones, setStones] = useState<Task[]>([]);
  const [bowl, setBowl] = useState<Task | null>(null);
  const [isClient, setIsClient] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
        distance: 8,
    },
  }));
  
  const searchParams = useSearchParams();
  const isGuest = searchParams.get('guest') === 'true';

  useEffect(() => {
    setIsClient(true);
    try {
      const savedStones = localStorage.getItem('stones');
      const savedBowl = localStorage.getItem('bowl');

      let loadedStones = savedStones ? JSON.parse(savedStones) : initialStones;
      
      if (isGuest) {
        setStones(loadedStones.slice(0, 2));
      } else {
        setStones(loadedStones);
      }

      if (savedBowl) {
        setBowl(JSON.parse(savedBowl));
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
      setStones(isGuest ? initialStones.slice(0, 2) : initialStones);
    }
  }, [isGuest]);

  useEffect(() => {
    if (isClient) {
      try {
        if (!isGuest) {
            localStorage.setItem('stones', JSON.stringify(stones));
            if (bowl) {
            localStorage.setItem('bowl', JSON.stringify(bowl));
            } else {
            localStorage.removeItem('bowl');
            }
        }
      } catch (error) {
        console.error("Failed to save state to localStorage", error);
      }
    }
  }, [stones, bowl, isClient, isGuest]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeId = String(active.id);

    if (over.id === 'bowl-droppable') {
      const taskToMove = stones.find((t) => t.id === activeId);
      if (taskToMove) {
        setStones((prevStones) => {
          const newStones = prevStones.filter((t) => t.id !== activeId);
          if (bowl) {
            return [...newStones, bowl];
          }
          return newStones;
        });
        setBowl(taskToMove);
      }
      return;
    }
    
    const overId = String(over.id);

    if (activeId !== overId) {
      setStones((items) => {
        const oldIndex = items.findIndex((item) => item.id === activeId);
        const newIndex = items.findIndex((item) => item.id === overId);

        if (oldIndex > -1 && newIndex > -1) {
          return arrayMove(items, oldIndex, newIndex);
        }
        
        return items;
      });
    }
  };

  const handleAddTask = (taskText: string) => {
    const newTask: Task = { id: Date.now().toString(), text: taskText };
    setStones(prevStones => [...prevStones, newTask]);
  };

  const handleCompleteTask = () => {
    setBowl(null);
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
    <main className="min-h-screen bg-background text-foreground">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {bowl ? (
          <div className="w-full h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <BowlView task={bowl} onComplete={handleCompleteTask} isFocusMode={true} />
          </div>
        ) : (
          <div className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            <header className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-headline font-bold">when tasks overwhelm</h1>
              <p className="text-muted-foreground font-body mt-2">Bowl and Stone</p>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3 min-h-[300px] lg:min-h-[400px]">
                <BowlView task={bowl} onComplete={handleCompleteTask} />
              </div>
              <div className="lg:col-span-2 min-h-[500px]">
                <StoneList stones={stones} onAddTask={handleAddTask} isGuest={isGuest} />
              </div>
            </div>
          </div>
        )}
      </DndContext>
    </main>
  );
}

export default function AppPage() {
  return (
    <Suspense>
      <AppContent />
    </Suspense>
  )
}
