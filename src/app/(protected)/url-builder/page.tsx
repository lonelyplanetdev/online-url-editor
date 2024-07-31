import { URLBuilder } from '~/components/tools/url-builder';

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
