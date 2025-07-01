
"use client";

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

function IntroContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleRedirect = () => {
    const isGuest = searchParams.get('guest') === 'true';
    // If not a guest, send to the main app page (auth flow would handle this later)
    const destination = isGuest ? '/app?guest=true' : '/app';
    router.push(destination);
  };

  return (
    <main className="min-h-screen bg-black text-foreground flex items-center justify-center relative">
      <video
        // The video file should be placed in the `public` folder
        src="/intro-video.mp4"
        autoPlay
        muted
        playsInline
        onEnded={handleRedirect}
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      <div className="absolute bottom-10 right-10 z-10">
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
