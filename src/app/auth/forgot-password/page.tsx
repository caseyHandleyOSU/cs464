import { Box, Container } from "@mui/material";
import { ForgotPasswordForm } from "@/components/supabase/forgot-password-form";

export default function Page() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, py: 4, background: 'linear-gradient(180deg, #f7fbff 0%, #eef4fb 100%)' }}>
      <Container maxWidth="sm">
        <ForgotPasswordForm />
      </Container>
    </Box>
  );
}
