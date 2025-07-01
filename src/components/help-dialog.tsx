
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

interface HelpDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isGuest: boolean;
}

export function HelpDialog({ open, onOpenChange, onConfirm, isGuest }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] bg-card/90 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">How to Use the App</DialogTitle>
          <DialogDescription className="font-body pt-2">
            A simple guide to mindful productivity with Bowl and Stone.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 font-body text-foreground/90">
            <div className="space-y-1">
                <h3 className="font-headline font-bold">Settle In</h3>
                <p>Find a quiet moment. You can make tea or just take a breath before beginning.</p>
            </div>
            <div className="space-y-1">
                <h3 className="font-headline font-bold">List Your Tasks</h3>
                <p>Write down everything you need or want to do today. Don’t worry about order—just get it out of your head.</p>
            </div>
            <div className="space-y-1">
                <h3 className="font-headline font-bold">Pick One Task</h3>
                <p>Look over your list and choose one task to focus on. Don’t overthink it—just pick the one that feels right to start with.</p>
            </div>
            <div className="space-y-1">
                <h3 className="font-headline font-bold">Focus on That Task</h3>
                <p>The app will highlight your chosen task. Set the rest aside for now. Focus only on completing this one thing.</p>
            </div>
            <div className="space-y-1">
                <h3 className="font-headline font-bold">Complete the Task</h3>
                <p>Take your time and do just this one task, without distractions.</p>
            </div>
            <div className="space-y-1">
                <h3 className="font-headline font-bold">Return and Repeat</h3>
                <p>When you’re done, come back to your list. You can pick another task or stop for the day. Either choice is okay.</p>
            </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
            {isGuest ? (
                <Link href="/" passHref className="w-full">
                    <Button className="w-full">
                        <Sparkles className="mr-2 h-5 w-5" />
                        Sign Up & Remove This
                    </Button>
                </Link>
            ) : (
                <Button onClick={onConfirm} className="w-full">
                    Don't Show Again
                </Button>
            )}
             <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
                Close
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
