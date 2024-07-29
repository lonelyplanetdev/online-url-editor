'use client';

import * as React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { LogoutForm } from '~/components/logout-form';

export default function AuthLogoutPage() {
  return (
    <main className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-sm bg-primary-foreground">
        <CardHeader>
          <CardTitle className="text-2xl">Logout</CardTitle>
        </CardHeader>
        <CardContent>
          <LogoutForm successRedirect="/auth/login" />
        </CardContent>
      </Card>
    </main>
  );
}
