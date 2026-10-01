import { Fragment } from "react";
import {
  Accordion, AccordionDetails, AccordionSummary, Box, Link, Paper, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography,
} from "@mui/material";
import type { DetailArticle } from "../models/ladder";

export const ladderAccordionSx = {
  border: 1,
  borderColor: "divider",
  borderRadius: 1,
  boxShadow: "none",
  "&:before": { display: "none" },
};

// Render the kernel's inline Markdown as React text/elements; raw HTML is never evaluated.
export function InlineContent({ text }: { text: string }) {
  const tokens = text.split(/(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|<https?:\/\/[^>]+>|\*\*.+?\*\*|\*[^*]+?\*)/g);
  return <>{tokens.map((token, index) => {
    const link = token.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
    const autoLink = token.match(/^<(https?:\/\/[^>]+)>$/);
    if (link || autoLink) {
      const href = link ? link[2] : autoLink![1];
      return <Link key={index} href={href} target="_blank" rel="noopener noreferrer" sx={{ overflowWrap: "anywhere" }}>
        {link ? link[1] : href}
      </Link>;
    }
    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={index}><InlineContent text={token.slice(2, -2)} /></strong>;
    }
    if (token.startsWith("*") && token.endsWith("*") && token.length > 1) {
      return <em key={index}><InlineContent text={token.slice(1, -1)} /></em>;
    }
    return <Fragment key={index}>{token}</Fragment>;
  })}</>;
}

export function LadderArticle({ article }: { article: DetailArticle }) {
  let tableNumber = 0;
  return <Accordion sx={ladderAccordionSx}>
    <AccordionSummary aria-label={article.title} expandIcon={<span aria-hidden="true">▾</span>}>
      <Typography fontWeight={600}>{article.title}</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Stack gap={2}>
        {article.blocks.map((block, index) => {
          if (block.kind === "heading") {
            return <Typography key={index} variant="h6" component="h3"><InlineContent text={block.text ?? ""} /></Typography>;
          }
          if (block.kind === "list") {
            return <Stack key={index} component={block.ordered ? "ol" : "ul"} gap={1} sx={{ pl: 3, m: 0 }}>
              {block.items?.map((item, itemIndex) => <Typography key={itemIndex} component="li"><InlineContent text={item} /></Typography>)}
            </Stack>;
          }
          if (block.kind === "table") {
            const tableName = `${article.title} table ${++tableNumber}`;
            return <Box key={index}>
              <TableContainer component={Paper} variant="outlined" sx={{ display: { xs: "none", md: "block" } }}>
                <Table size="small" aria-label={tableName} sx={{ tableLayout: "fixed" }}>
                  <TableHead><TableRow>
                    {block.headers?.map((header) => <TableCell key={header} sx={{ fontWeight: 700, verticalAlign: "top" }}>
                      <InlineContent text={header} />
                    </TableCell>)}
                  </TableRow></TableHead>
                  <TableBody>
                    {block.rows?.map((row, rowIndex) => <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => <TableCell key={cellIndex} component={cellIndex === 0 ? "th" : "td"} scope={cellIndex === 0 ? "row" : undefined} sx={{ verticalAlign: "top", overflowWrap: "anywhere" }}>
                        <InlineContent text={cell} />
                      </TableCell>)}
                    </TableRow>)}
                  </TableBody>
                </Table>
              </TableContainer>
              <Stack gap={1.5} sx={{ display: { xs: "flex", md: "none" } }}>
                {block.rows?.map((row, rowIndex) => <Paper key={rowIndex} variant="outlined" sx={{ p: 2 }}>
                  <Stack gap={1}>
                    {row.map((cell, cellIndex) => <Box key={cellIndex}>
                      <Typography variant="subtitle2" fontWeight={700}><InlineContent text={block.headers?.[cellIndex] ?? ""} /></Typography>
                      <Typography variant="body2"><InlineContent text={cell} /></Typography>
                    </Box>)}
                  </Stack>
                </Paper>)}
              </Stack>
            </Box>;
          }
          return <Typography key={index}><InlineContent text={block.text ?? ""} /></Typography>;
        })}
      </Stack>
    </AccordionDetails>
  </Accordion>;
}
