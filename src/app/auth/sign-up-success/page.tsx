import { Box, Card, CardContent, CardHeader, Container, Typography } from "@mui/material";

export default function Page() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, py: 4, background: 'linear-gradient(180deg, #f7fbff 0%, #eef4fb 100%)' }}>
      <Container maxWidth="sm">
        <Card>
          <CardHeader
            title={<Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>Thank you for signing up!</Typography>}
            subheader="Check your email to confirm"
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              You&apos;ve successfully signed up. Please check your email to confirm your account before signing in.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
