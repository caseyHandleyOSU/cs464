import { Box, Card, CardContent, CardHeader, Container, Typography } from "@mui/material";
import { Suspense } from "react";

async function ErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      {params?.error ? (
        <Typography variant="body2" color="text.secondary">
          Code error: {params.error}
        </Typography>
      ) : (
        <Typography variant="body2" color="text.secondary">
          An unspecified error occurred.
        </Typography>
      )}
    </>
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, py: 4, background: 'linear-gradient(180deg, #f7fbff 0%, #eef4fb 100%)' }}>
      <Container maxWidth="sm">
        <Card>
          <CardHeader
            title={<Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>Sorry, something went wrong.</Typography>}
          />
          <CardContent>
            <Suspense>
              <ErrorContent searchParams={searchParams} />
            </Suspense>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
