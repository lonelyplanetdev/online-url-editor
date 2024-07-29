'use client';

import * as React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { LoginForm } from '~/components/login-form';

export default function AuthLoginPage() {
  return (
    <main className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-sm bg-primary-foreground">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm successRedirect="/" />
        </CardContent>
      </Card>
    </main>
  );
}
