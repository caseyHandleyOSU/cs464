"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Alert, Box, Button, Card, CardContent, CardHeader, Stack, TextField, Typography } from "@mui/material";
import { createBrowserClient } from "@/lib/supabase/createBrowserClient";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [supabase] = useState(() => createBrowserClient());
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/api/auth/confirm?next=/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }} className={className} {...props}>
      {success ? (
        <Card>
          <CardHeader
            title={<Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>Check Your Email</Typography>}
            subheader="Password reset instructions sent"
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              If you registered using your email and password, you will receive a password reset email.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader
            title={<Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>Reset Your Password</Typography>}
            subheader="Type in your email and we'll send you a link to reset your password"
          />
          <CardContent>
            <Stack component="form" spacing={2.5} onSubmit={handleForgotPassword}>
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
              {error ? <Alert severity="error">{error}</Alert> : null}
              <Button type="submit" variant="contained" size="large" disabled={isLoading} fullWidth>
                {isLoading ? "Sending..." : "Send reset email"}
              </Button>
              <Box sx={{ typography: "body2", textAlign: "center", color: "text.secondary" }}>
                Already have an account? <Link href="/auth/login">Login</Link>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
