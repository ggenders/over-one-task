
"use client";

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import * as Tone from 'tone';
import { Button } from '@/components/ui/button';
import { Music, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

function IntroContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  
  const synth = useRef<Tone.FMSynth | null>(null);
  const loop = useRef<Tone.Loop | null>(null);

  useEffect(() => {
    const initMusic = async () => {
      try {
        await Tone.start();
        
        synth.current = new Tone.FMSynth({
            harmonicity: 1.5,
            modulationIndex: 10,
            envelope: { attack: 0.1, decay: 0.2, sustain: 0.1, release: 1 },
            modulationEnvelope: { attack: 0.1, decay: 0, sustain: 1, release: 0.5 }
        }).toDestination();
        
        const notes = ['C4', 'E4', 'G4', 'A4', 'C5'];
        
        loop.current = new Tone.Loop(time => {
          if (synth.current) {
            const note = notes[Math.floor(Math.random() * notes.length)];
            synth.current.triggerAttackRelease(note, "8n", time);
          }
        }, "4n").start(0);

        Tone.Transport.bpm.value = 80;
        Tone.Transport.start();
        setIsMusicPlaying(true);
      } catch (error) {
        console.error("Could not autoplay music:", error);
      }
    };
    
    initMusic();

    return () => {
      if (Tone.Transport.state === 'started') {
        Tone.Transport.stop();
      }
      Tone.Transport.cancel();
      synth.current?.dispose();
      loop.current?.dispose();
    };
  }, []);

  const handleRedirect = () => {
    if (isExiting) return;
    setIsExiting(true);

    if (loop.current) {
      loop.current.stop();
    }
    
    if (synth.current) {
      // Play a final, low note
      synth.current.triggerAttackRelease('C2', '1.5s', Tone.now());
    }

    setTimeout(() => {
        const isGuest = searchParams.get('guest') === 'true';
        const destination = isGuest ? '/app?guest=true' : '/app';
        router.push(destination);
    }, 800);
  };
  
  const toggleMusic = () => {
      if (!synth.current) return;
      
      if (isMusicPlaying) {
          Tone.Transport.pause();
      } else {
          Tone.Transport.start();
      }
      setIsMusicPlaying(!isMusicPlaying);
  };

  return (
    <main className={cn(
        "min-h-screen bg-black text-foreground flex items-center justify-center relative transition-opacity duration-500 ease-in-out",
        isExiting && "opacity-0"
    )}>
      <video
        // The video file should be placed in the `public` folder
        src="/intro-video.mp4"
        autoPlay
        muted
        playsInline
        onEnded={handleRedirect}
        className="w-1/2 rounded-lg shadow-2xl shadow-primary/20"
      />
      <div className="absolute bottom-10 right-10 z-10 flex items-center gap-4">
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleMusic}
            className="rounded-full bg-card/60 backdrop-blur-sm hover:bg-accent/20"
            aria-label="Toggle Music"
            >
            {isMusicPlaying ? <Music className="h-5 w-5 text-primary" /> : <VolumeX className="h-5 w-5 text-foreground/70" />}
        </Button>
        <Button
          onClick={handleRedirect}
          variant="outline"
          className="font-body bg-card/80 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground"
        >
          Skip Intro
        </Button>
      </div>
    </main>
  );
}

export default function IntroPage() {
  return (
    <Suspense fallback={<div className="w-screen h-screen bg-black" />}>
      <IntroContent />
    </Suspense>
  )
}
