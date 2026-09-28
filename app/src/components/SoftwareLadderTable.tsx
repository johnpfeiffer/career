import {
  Accordion, AccordionDetails, AccordionSummary, Box, Paper, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography,
} from "@mui/material";
import {
  getExpectation, getLevelLabel, softwareDetail,
  type CareerView, type Profile,
} from "../models/ladder";

type Props = {
  view: CareerView;
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

export default function SoftwareLadderTable({ view, profile, onSelectAxis }: Props) {
  return (
    <Stack gap={1.5}>
      <Accordion sx={accordionSx}>
        <AccordionSummary expandIcon={<span aria-hidden="true">▾</span>}>
          <Typography fontWeight={600}>How to read this draft ladder</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack gap={2}>
            {softwareDetail.guide.map((paragraph) => <Typography key={paragraph}>{paragraph}</Typography>)}
            <Typography variant="h6" component="h3">Advanced engineer patterns</Typography>
            {softwareDetail.patterns.map((pattern) => <Typography key={pattern.label}>
              <Box component="strong">{pattern.label}: </Box>{pattern.text}
            </Typography>)}
          </Stack>
        </AccordionDetails>
      </Accordion>

      {softwareDetail.sections.map((section) => {
        const axis = view.axes.find((item) => item.id === section.axisId);
        if (!axis) return null;
        const selectedLevel = profile[axis.id];
        const selectedLabel = getLevelLabel(view, axis, selectedLevel);
        const selectedExpectation = getExpectation(view, axis, selectedLevel);
        return <Accordion key={section.axisId} sx={accordionSx} onChange={(_, expanded) => { if (expanded) onSelectAxis(axis.id); }}>
          <AccordionSummary expandIcon={<span aria-hidden="true">▾</span>}>
            <Box>
              <Typography fontWeight={600}>{section.title}</Typography>
              <Typography variant="body2" color="text.secondary">Selected example: {selectedLabel}</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={700}>Selected example: {selectedLabel}</Typography>
              <Typography>{selectedExpectation.summary}</Typography>
              {selectedLevel > softwareDetail.levels.length && <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                The detailed draft matrix below ends at Senior Engineer I. This selected level uses the broader ladder summary above.
              </Typography>}
            </Paper>

            <TableContainer component={Paper} variant="outlined" sx={{ display: { xs: "none", md: "block" } }}>
              <Table size="small" sx={{ tableLayout: "fixed" }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ ...headingSx, width: "16%" }}>Competency</TableCell>
                    {softwareDetail.levels.map((level, index) => <TableCell key={level} sx={{ ...headingSx, width: "21%", bgcolor: selectedLevel === index + 1 ? "action.selected" : undefined }}>
                      {level}
                    </TableCell>)}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {section.rows.map((row) => <TableRow key={row.label}>
                    <TableCell component="th" scope="row" sx={headingSx}>{row.label}</TableCell>
                    {row.levels.map((value, index) => <TableCell key={softwareDetail.levels[index]} sx={{ ...bodySx, bgcolor: selectedLevel === index + 1 ? "action.selected" : undefined }}>
                      {value ?? "—"}
                    </TableCell>)}
                  </TableRow>)}
                </TableBody>
              </Table>
            </TableContainer>

            <Stack gap={1.5} sx={{ display: { xs: "flex", md: "none" } }}>
              {section.rows.map((row) => <Paper key={row.label} variant="outlined" sx={{ p: 2 }}>
                <Typography fontWeight={700} sx={{ mb: 1 }}>{row.label}</Typography>
                <Stack gap={1}>
                  {row.levels.map((value, index) => <Box key={softwareDetail.levels[index]}>
                    <Typography variant="subtitle2" fontWeight={700}>{softwareDetail.levels[index]}</Typography>
                    <Typography variant="body2">{value ?? "—"}</Typography>
                  </Box>)}
                </Stack>
              </Paper>)}
            </Stack>
            {section.notes.map((note) => <Typography key={note} variant="body2" color="text.secondary" sx={{ mt: 2 }}>{note}</Typography>)}
          </AccordionDetails>
        </Accordion>;
      })}

      <Accordion sx={accordionSx}>
        <AccordionSummary expandIcon={<span aria-hidden="true">▾</span>}>
          <Typography fontWeight={600}>Backlog and parking lot</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ mb: 2 }}>{softwareDetail.parkingLotIntro}</Typography>
          <Stack gap={1.5}>
            {softwareDetail.parkingLot.map((note) => <Typography key={note.label}>
              <Box component="strong">{note.label}: </Box>{note.text}
            </Typography>)}
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
}
