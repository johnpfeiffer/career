import {
  Accordion, AccordionDetails, AccordionSummary, Box, Paper, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography,
} from "@mui/material";
import {
  getExpectation, getLevelLabel, getCapabilityRows,
  type Ladder, type Profile,
} from "../models/ladder";

type Props = {
  view: Ladder;
  profile: Profile;
  onSelectAxis: (id: string) => void;
};

const accordionSx = {
  border: 1,
  borderColor: "divider",
  borderRadius: 1,
  boxShadow: "none",
  "&:before": { display: "none" },
};

const headingSx = { fontWeight: 700, verticalAlign: "top", overflowWrap: "anywhere" } as const;
const bodySx = { verticalAlign: "top", overflowWrap: "anywhere" } as const;

export default function LadderTable({ view, profile, onSelectAxis }: Props) {
  const detail = view.details;
  return (
    <Stack gap={1.5}>
      {detail && <Accordion sx={accordionSx}>
        <AccordionSummary expandIcon={<span aria-hidden="true">▾</span>}>
          <Typography fontWeight={600}>How to read this draft ladder</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack gap={2}>
            {detail.guide.map((paragraph) => <Typography key={paragraph}>{paragraph}</Typography>)}
            <Typography variant="h6" component="h3">Advanced engineer patterns</Typography>
            {detail.patterns.map((pattern) => <Typography key={pattern.label}>
              <Box component="strong">{pattern.label}: </Box>{pattern.text}
            </Typography>)}
          </Stack>
        </AccordionDetails>
      </Accordion>}

      {view.axes.map((axis) => {
        const section = detail?.sections.find((item) => item.axisId === axis.id);
        const rows = getCapabilityRows(view, axis);
        const selectedLevel = profile[axis.id];
        const selectedLabel = getLevelLabel(view, axis, selectedLevel);
        const selectedExpectation = getExpectation(view, axis, selectedLevel);
        return <Accordion key={axis.id} sx={accordionSx} onChange={(_, expanded) => { if (expanded) onSelectAxis(axis.id); }}>
          <AccordionSummary id={`${view.id}-${axis.id}-heading`} aria-controls={`${view.id}-${axis.id}-details`} aria-label={`Full ladder: ${axis.label}`} expandIcon={<span aria-hidden="true">▾</span>}>
            <Box>
              <Typography fontWeight={600}>{axis.label}</Typography>
              <Typography variant="body2" color="text.secondary">Selected level: {selectedLabel}</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={700}>Selected level: {selectedLabel}</Typography>
              <Typography>{selectedExpectation.summary}</Typography>
              {detail && selectedLevel > detail.levels.length && <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Detailed draft content ends at {detail.levels[detail.levels.length - 1]}; later competency cells are not provided.
              </Typography>}
            </Paper>

            <TableContainer component={Paper} variant="outlined" sx={{ display: { xs: "none", md: "block" } }}>
              <Table size="small" aria-label={`${axis.label} full ladder`} sx={{ tableLayout: "fixed" }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={headingSx}>Competency</TableCell>
                    {view.levels.map((level, index) => <TableCell key={level.id} sx={{ ...headingSx, bgcolor: selectedLevel === index + 1 ? "action.selected" : undefined }}>
                      {level.label}
                    </TableCell>)}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => <TableRow key={row.label}>
                    <TableCell component="th" scope="row" sx={headingSx}>{row.label}</TableCell>
                    {row.levels.map((value, index) => <TableCell key={view.levels[index].id} sx={{ ...bodySx, bgcolor: selectedLevel === index + 1 ? "action.selected" : undefined }}>
                      {value ?? "—"}
                    </TableCell>)}
                  </TableRow>)}
                </TableBody>
              </Table>
            </TableContainer>

            <Stack gap={1.5} sx={{ display: { xs: "flex", md: "none" } }}>
              {rows.map((row) => <Paper key={row.label} variant="outlined" sx={{ p: 2 }}>
                <Typography fontWeight={700} sx={{ mb: 1 }}>{row.label}</Typography>
                <Stack gap={1}>
                  {row.levels.map((value, index) => <Box key={view.levels[index].id} sx={{ bgcolor: selectedLevel === index + 1 ? "action.selected" : undefined }}>
                    <Typography variant="subtitle2" fontWeight={700}>{view.levels[index].label}</Typography>
                    <Typography variant="body2">{value ?? "—"}</Typography>
                  </Box>)}
                </Stack>
              </Paper>)}
            </Stack>
            {section?.notes.map((note) => <Typography key={note} variant="body2" color="text.secondary" sx={{ mt: 2 }}>{note}</Typography>)}
          </AccordionDetails>
        </Accordion>;
      })}

      {detail && <Accordion sx={accordionSx}>
        <AccordionSummary expandIcon={<span aria-hidden="true">▾</span>}>
          <Typography fontWeight={600}>Backlog and parking lot</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ mb: 2 }}>{detail.parkingLotIntro}</Typography>
          <Stack gap={1.5}>
            {detail.parkingLot.map((note) => <Typography key={note.label}>
              <Box component="strong">{note.label}: </Box>{note.text}
            </Typography>)}
          </Stack>
        </AccordionDetails>
      </Accordion>}
    </Stack>
  );
}
