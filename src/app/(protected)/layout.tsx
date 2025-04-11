import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { ModeToggle } from '~/components/mode-toggle';
import TabList from '~/components/tab-list';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-[16rem_auto]">
      <div className="flex flex-col justify-between border-r bg-primary-foreground/50 p-4">
        <div>
          {/* top of side */}
          <div className="flex gap-2">
            <Image
              className="w-10 object-contain"
              src="https://dcs-media-library-uploads.s3.us-west-1.amazonaws.com/ptl_logo_3bb5691491.png"
              alt="alt"
              width={230}
              height={200}
            />
            <div>
              <h1 className="font-semibold">ARB Tools</h1>
              <h2 className="text-xs text-muted-foreground">PREMIUM TRAFFIC LIMITED</h2>
            </div>
          </div>
          <Separator className="my-4" />
          {/* tabs */}
          <TabList
            tabs={[
              { name: 'Home', href: '/', disabled: false },
              {
                name: 'URL Builder',
                href: '/tools/url-builder',
                disabled: false,
              },
              {
                name: 'Report Reformatter',
                href: '/tools/report-reformatter',
                disabled: false,
              },
              {
                name: 'DOTS Analysis',
                href: '/tools/dots-analysis',
                disabled: false,
              },
              {
                name: 'Deep Analysis',
                href: '/tools/deep-analysis',
                disabled: false,
              },
              {
                name: 'DA Library',
                href: '/tools/da-library',
                disabled: false,
              },
              {
                name: 'Ads.com Report',
                href: '/tools/ads.com-report',
                disabled: false,
              },
              {
                name: 'DCS Content Manager',
                href: 'https://cms.ptlinternaltools.com/',
                external: true,
                disabled: false,
              },
              {
                name: 'Newsbreak Launcher',
                href: 'https://nwb.ptlinternaltools.com/',
                external: true,
                disabled: false,
              },
              {
                name: 'Campaign Launch',
                href: 'https://launch.ptlinternaltools.com/',
                external: true,
                disabled: false,
              },
              {
                name: 'Dynamic URLs Generator',
                href: 'https://urls.ptlinternaltools.com/',
                external: true,
                disabled: false,
              },
            ]}
          />
        </div>
        <div>
          {/* bottom of side */}
          <Separator className="my-4" />
          <div className="flex justify-evenly">
            <ModeToggle />
            <Button
              variant="link"
              className="w-full grow basis-1/3 text-xs"
              size="sm"
              asChild
            >
              <Link href="/auth/manage">Settings</Link>
            </Button>
            <Button
              variant="link"
              className="w-full grow basis-1/3 text-xs"
              size="sm"
              asChild
            >
              <Link href="/auth/signout">Sign Out</Link>
            </Button>
          </div>
        </div>
      </div>
      <div>
        <Suspense fallback={<div className="flex h-full items-center justify-center">Loading...</div>}>
          {children}
        </Suspense>
      </div>
    </div>
  );
}
