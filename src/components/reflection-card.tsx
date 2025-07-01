import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const reflections = [
  {
    source: "Tao Te Ching",
    text: "The journey of a thousand miles begins with a single step."
  },
  {
    source: "Haiku",
    text: "An old silent pond... A frog jumps into the pond, splash! Silence again."
  },
  {
    source: "Rumi",
    text: "What you seek is seeking you."
  }
];

export function ReflectionCard() {
  const reflection = reflections[0]; 

  return (
    <Card className="bg-accent/20 border-dashed border-accent/40 shadow-md">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-accent-foreground/90">A Moment of Reflection</CardTitle>
      </CardHeader>
      <CardContent>
        <blockquote className="font-headline text-2xl italic text-center text-foreground/80">
          "{reflection.text}"
        </blockquote>
        <p className="text-right font-headline text-sm text-muted-foreground mt-4">- {reflection.source}</p>
      </CardContent>
    </Card>
  );
}
