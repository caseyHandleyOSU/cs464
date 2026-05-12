"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Alert, Box, Button, Card, CardContent, CardHeader, Stack, TextField, Typography } from "@mui/material";
import { createBrowserClient } from "@/lib/supabase/createBrowserClient";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [supabase] = useState(() => createBrowserClient());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }} className={className} {...props}>
      <Card>
        <CardHeader
          title={<Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>Login</Typography>}
          subheader="Enter your email below to login to your account"
        />
        <CardContent>
          <Stack component="form" spacing={2.5} onSubmit={handleLogin}>
            <TextField
              label="Email"
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 1 }}>
                <Typography component="label" htmlFor="password" variant="body2" sx={{ fontWeight: 600 }}>
                  Password
                </Typography>
                <Link href="/auth/forgot-password">Forgot your password?</Link>
              </Box>
              <TextField
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
              />
            </Box>
            {error ? <Alert severity="error">{error}</Alert> : null}
            <Button type="submit" variant="contained" size="large" disabled={isLoading} fullWidth>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <Box sx={{ typography: "body2", textAlign: "center", color: "text.secondary" }}>
              Don&apos;t have an account? <Link href="/auth/sign-up">Sign up</Link>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
