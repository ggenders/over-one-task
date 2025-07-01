
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>Google</title>
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.08-2.58 2.2-4.82 2.2-5.46 0-9.9-4.5-9.9-10s4.44-10 9.9-10c2.95 0 5.08 1.25 6.63 2.66l2.3-2.3C18.1.5 15.47 0 12.48 0 5.88 0 0 5.9 0 12s5.88 12 12.48 12c7.2 0 12.24-4.8 12.24-12.36 0-.8-.08-1.5-.2-2.22h-12z" fill="currentColor" />
    </svg>
);
  
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>Facebook</title>
      <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.35C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.732 0 1.325-.593 1.325-1.325V1.325C24 .593 23.407 0 22.675 0z" fill="currentColor"/>
    </svg>
);

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
          <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg">
              <CardHeader className="text-center">
                  <CardTitle className="font-headline text-4xl md:text-5xl">when tasks overwhelm</CardTitle>
                  <CardDescription className="font-body pt-2">one task</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <Button variant="outline" className="w-full font-body text-lg py-6">
                            <GoogleIcon className="mr-2 h-5 w-5" />
                            Continue with Google
                        </Button>
                        <Button variant="outline" className="w-full font-body text-lg py-6">
                            <FacebookIcon className="mr-2 h-5 w-5" />
                            Continue with Facebook
                        </Button>
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
