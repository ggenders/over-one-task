
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { signInWithGoogle, signInWithFacebook, signInWithEmailPassword, signUpWithEmailPassword, sendPasswordReset } from '@/services/auth';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';

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

const authFormSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type AuthFormValues = z.infer<typeof authFormSchema>;

const forgotPasswordSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email." }),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

function ForgotPasswordDialog() {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const form = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    });

    const onSubmit = async (data: ForgotPasswordValues) => {
        try {
            await sendPasswordReset(data.email);
            toast({
                title: "Password Reset Email Sent",
                description: "Check your inbox for a link to reset your password.",
            });
            form.reset();
            setOpen(false); // Close dialog on success
        } catch (error: any) {
            let description = "Could not send reset email. Please try again.";
            if (error.code === 'auth/user-not-found') {
                description = "No account found with this email address.";
            }
            toast({
                title: "Request Failed",
                description: description,
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="link" size="sm" className="p-0 h-auto self-start text-sm font-normal text-muted-foreground hover:text-primary">
                    Forgot Password?
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                    <DialogDescription>
                        Enter your email address and we'll send you a link to reset your password.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="name@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Sending..." : "Send Reset Link"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function SignUpForm() {
    const router = useRouter();
    const { toast } = useToast();
    const form = useForm<AuthFormValues>({
        resolver: zodResolver(authFormSchema),
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = async (data: AuthFormValues) => {
        try {
            await signUpWithEmailPassword(data.email, data.password);
            router.push('/intro');
        } catch (error: any) {
            let description = "Could not create account. Please try again.";
            if (error.code) {
                 switch (error.code) {
                    case 'auth/email-already-in-use':
                        description = "This email is already registered. Please use the 'Sign In' tab.";
                        break;
                    case 'auth/weak-password':
                        description = "The password is too weak. It must be at least 6 characters long.";
                        break;
                    case 'auth/invalid-email':
                        description = "The email address is not valid.";
                        break;
                    default:
                        description = `An unexpected error occurred. Please try again. (${error.code})`;
                }
            } else if (error.message) {
                description = error.message;
            }
            toast({
                title: "Sign-Up Failed",
                description: description,
                variant: "destructive",
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="name@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full font-body text-lg py-6" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Creating Account..." : "Create Account"}
                </Button>
            </form>
        </Form>
    );
}

function SignInForm() {
    const router = useRouter();
    const { toast } = useToast();
    const form = useForm<AuthFormValues>({
        resolver: zodResolver(authFormSchema),
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = async (data: AuthFormValues) => {
        try {
            await signInWithEmailPassword(data.email, data.password);
            router.push('/intro');
        } catch (error: any) {
            let description = "An unexpected error occurred. Please try again.";
            if (error.code) {
                switch (error.code) {
                    case 'auth/invalid-credential':
                    case 'auth/user-not-found': // Included for older SDK versions
                    case 'auth/wrong-password': // Included for older SDK versions
                        description = "The email or password you entered is incorrect. Please try again.";
                        break;
                    case 'auth/user-disabled':
                        description = "This account has been disabled.";
                        break;
                    default:
                        description = `An error occurred. Please check configuration and try again. (${error.code})`;
                }
            } else if (error.message) {
                description = error.message;
            }
            toast({
                title: "Sign-In Failed",
                description: description,
                variant: "destructive",
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="name@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center justify-between">
                                <FormLabel>Password</FormLabel>
                                <ForgotPasswordDialog />
                            </div>
                            <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full font-body text-lg py-6" disabled={form.formState.isSubmitting}>
                     {form.formState.isSubmitting ? "Signing In..." : "Sign In"}
                </Button>
            </form>
        </Form>
    );
}


export default function LandingPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSocialSignIn = async (provider: 'google' | 'facebook') => {
    try {
      if (provider === 'google') {
        await signInWithGoogle();
      } else {
        await signInWithFacebook();
      }
      router.push('/intro');
    } catch (error) {
      console.error(`${provider} Sign-In Error:`, error);
      toast({
        title: "Sign-In Failed",
        description: `Could not sign in with ${provider}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
          <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg">
              <CardHeader className="text-center">
                  <CardTitle className="font-headline text-4xl md:text-5xl">The Cup and Stone</CardTitle>
                  <CardDescription className="font-body pt-2">A quiet space for focus.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="signin" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signin">Sign In</TabsTrigger>
                        <TabsTrigger value="signup">Create Account</TabsTrigger>
                    </TabsList>
                    <TabsContent value="signin" className="pt-4">
                        <SignInForm />
                    </TabsContent>
                    <TabsContent value="signup" className="pt-4">
                        <SignUpForm />
                    </TabsContent>
                </Tabs>

                <div className="flex items-center space-x-2 my-6">
                    <Separator className="flex-1" />
                    <span className="text-xs text-muted-foreground">OR</span>
                    <Separator className="flex-1" />
                </div>
                
                <div className="space-y-4">
                    <Button onClick={() => handleSocialSignIn('google')} variant="outline" className="w-full font-body text-lg py-6">
                        <GoogleIcon className="mr-2 h-5 w-5" />
                        Continue with Google
                    </Button>
                    <Button onClick={() => handleSocialSignIn('facebook')} variant="outline" className="w-full font-body text-lg py-6">
                        <FacebookIcon className="mr-2 h-5 w-5" />
                        Continue with Facebook
                    </Button>
                    <Link href="/intro?guest=true" passHref>
                        <Button variant="outline" className="w-full font-body text-lg py-6">
                            Continue as Guest
                        </Button>
                    </Link>
                </div>
              </CardContent>
          </Card>
      </div>
    </main>
  );
}
