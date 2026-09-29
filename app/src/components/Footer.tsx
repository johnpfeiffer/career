import { Box, Container, Link, SvgIcon, Typography } from "@mui/material";

export default function Footer() {
  return <Box component="footer" sx={{ borderTop: 1, borderColor: "divider", py: 3, mt: 6 }}>
    <Container maxWidth="lg">
      <Typography variant="body2" color="text.secondary">
        Built by John Pfeiffer{" "}
        <Link aria-label="John Pfeiffer on LinkedIn" color="inherit" href="https://www.linkedin.com/in/foupfeiffer" target="_blank" rel="noopener noreferrer" sx={{ display: "inline-flex", verticalAlign: "text-bottom" }}>
          <SvgIcon><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2M8 18H5v-8h3M6.5 8.7a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4M19 18h-3v-4.2c0-1.1-.5-1.6-1.3-1.6-.9 0-1.7.6-1.7 1.8v4h-3v-8h3v1.1c.5-.8 1.5-1.3 2.6-1.3 2.2 0 3.4 1.4 3.4 3.8Z" /></SvgIcon>
        </Link>{" "}
        <Link aria-label="Source code on GitHub" color="inherit" href="https://github.com/johnpfeiffer/career-coach" target="_blank" rel="noopener noreferrer" sx={{ display: "inline-flex", verticalAlign: "text-bottom" }}>
          <SvgIcon><path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.3c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.4 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6a4.7 4.7 0 0 1 1.3-3.2 4.3 4.3 0 0 1 .1-3.2s1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.4 5.1 18.4 5.4 18.4 5.4a4.3 4.3 0 0 1 .1 3.2 4.7 4.7 0 0 1 1.3 3.2c0 4.7-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5" /></SvgIcon>
        </Link>
      </Typography>
    </Container>
  </Box>;
}
