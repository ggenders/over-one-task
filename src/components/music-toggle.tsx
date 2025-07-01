'use client';

import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { Music, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast"

export function MusicToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const synth = useRef<Tone.MonoSynth | null>(null);
  const loop = useRef<Tone.Loop | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isInitialized) {
        synth.current = new Tone.MonoSynth({
            oscillator: { type: 'sine' },
            envelope: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 0.8 },
        }).toDestination();
        
        const melody = ['C4', 'E4', 'G4', 'C5', 'G4', 'E4'];
        let step = 0;

        loop.current = new Tone.Loop((time) => {
            if (synth.current) {
                synth.current.triggerAttackRelease(melody[step % melody.length], '8n', time);
                step++;
            }
        }, '4n');
        
        Tone.Transport.bpm.value = 80;

        return () => {
            loop.current?.dispose();
            synth.current?.dispose();
        };
    }
  }, [isInitialized]);

  const toggleMusic = async () => {
    try {
      if (!isInitialized) {
        await Tone.start();
        setIsInitialized(true);
        // We need a slight delay to allow the synth to be created
        setTimeout(() => {
            Tone.Transport.start();
            loop.current?.start(0);
            setIsPlaying(true);
        }, 100);
        return;
      }

      if (isPlaying) {
        Tone.Transport.stop();
        loop.current?.stop();
        setIsPlaying(false);
      } else {
        Tone.Transport.start();
        loop.current?.start(0);
        setIsPlaying(true);
      }
    } catch(e) {
      toast({
          title: "Could not play audio",
          description: "Your browser might be blocking audio playback.",
          variant: "destructive"
      })
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleMusic} className="fixed bottom-6 right-6 z-50 rounded-full h-12 w-12 bg-card/60 backdrop-blur-sm hover:bg-accent/20">
      {isPlaying ? <Music className="h-6 w-6 text-primary" /> : <VolumeX className="h-6 w-6 text-foreground/70" />}
      <span className="sr-only">Toggle Music</span>
    </Button>
  );
}
