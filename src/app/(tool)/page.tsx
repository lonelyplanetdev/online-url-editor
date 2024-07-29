import Image from 'next/image';
import { Button } from '~/components/ui/button';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Card, CardFooter, CardHeader } from '~/components/ui/card';
import { ModeToggle } from '~/components/mode-toggle';
import { Footer } from '~/components/footer';
import { URLBuilder } from '~/components/url-builder';

export default function Home() {
  return (
    <>
      <main className="flex h-screen flex-col gap-y-8 py-8">
        <header className="container mx-auto">
          <h1 className="text-2xl font-bold">Online URL Builder</h1>
          <p className="text-sm">
            Welcome to the online URL builder. Edit and Build your URLs on the
            fly.
          </p>
        </header>
        <URLBuilder />
      </main>
    </>
  );
}
