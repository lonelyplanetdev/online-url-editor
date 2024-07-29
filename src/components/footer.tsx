import { AuthStatus } from './auth-status';
import { ModeToggle } from './mode-toggle';

interface FooterProps {
  hideAuth?: boolean;
}
export async function Footer({ hideAuth = false }: FooterProps) {
  return (
    <div className="container mx-auto grid grid-cols-[128px_auto_128px] py-4">
      <div className="col-span-1 flex flex-row items-center justify-center">
        <ModeToggle />
      </div>
      <div className="col-span-1 flex flex-row items-center justify-center">
        <p>Footer Info Here</p>
      </div>
      <div className="col-span-1 flex flex-row items-center justify-center">
        {!hideAuth && <AuthStatus />}
      </div>
    </div>
  );
}
