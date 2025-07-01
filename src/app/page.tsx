
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
          <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg">
              <CardHeader className="text-center">
                  <CardTitle className="font-headline text-4xl md:text-5xl">Bowl and Stone</CardTitle>
                  <CardDescription className="font-body pt-2">A space for mindful focus.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                  <div className="space-y-4">
                      <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" placeholder="you@example.com" />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <Input id="password" type="password" placeholder="••••••••" />
                      </div>
                  </div>
                  <div className="space-y-2">
                      <Button className="w-full font-body text-lg py-6" type="submit">Login</Button>
                      <Button variant="secondary" className="w-full font-body text-lg py-6">Sign Up</Button>
                  </div>
                  <div className="flex items-center space-x-2">
                      <Separator className="flex-1" />
                      <span className="text-xs text-muted-foreground">OR</span>
                      <Separator className="flex-1" />
                  </div>
                  <Link href="/app?guest=true" passHref>
                      <Button variant="outline" className="w-full font-body text-lg py-6">
                          Continue as Guest
                      </Button>
                  </Link>
              </CardContent>
          </Card>
      </div>
    </main>
  );
}
