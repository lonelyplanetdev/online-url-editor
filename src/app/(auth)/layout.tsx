import { Footer } from '~/components/footer';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <footer className="border-t bg-primary-foreground">
        <Footer hideAuth />
      </footer>
    </>
  );
}
