
"use client";

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function IntroContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isExiting, setIsExiting] = useState(false);
  const exitingRef = useRef(false);
  
  const handleRedirect = () => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    setIsExiting(true);

    setTimeout(() => {
        const isGuest = searchParams.get('guest') === 'true';
        const destination = isGuest ? '/app?guest=true' : '/app';
        router.push(destination);
    }, 800);
  };

  useEffect(() => {
    const redirectTimeout = setTimeout(handleRedirect, 6000);

    return () => {
      clearTimeout(redirectTimeout);
    };
  }, []);
  
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
