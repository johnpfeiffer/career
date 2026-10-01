import { useEffect, useState } from "react";
import {
  Box, Button, Container, Divider, Link as MuiLink, Paper, Slider, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography,
} from "@mui/material";
import { useOutletContext } from "react-router-dom";
import RadarChart from "./RadarChart";
import LadderTable from "./LadderTable";
import {
  clampLevel, ladders, getLadder, getExpectation, getLevelLabel,
  getNextStep, getSummary, getProfileStorageKey, normalizeProfile, type Ladder, type Profile, type ViewId,
} from "../models/ladder";

function readProfile(view: Ladder): Profile {
  try {
    const saved = localStorage.getItem(getProfileStorageKey(view))
      ?? (view.id === "software-engineer" ? localStorage.getItem("career-coach-profile-v1") : null);
    return normalizeProfile(view, JSON.parse(saved ?? "null"));
  } catch {
    return { ...view.defaultProfile };
  }
}

export default function HomePage() {
  const { viewId } = useOutletContext<{ viewId: ViewId }>();
  const view = getLadder(viewId);
  const [profiles, setProfiles] = useState<Record<ViewId, Profile>>(() => Object.fromEntries(
    ladders.map((item) => [item.id, readProfile(item)]),
  ) as Record<ViewId, Profile>);
  const [selectedAxes, setSelectedAxes] = useState<Record<ViewId, string>>(() => Object.fromEntries(
    ladders.map((item) => [item.id, item.axes[0].id]),
  ) as Record<ViewId, string>);
  const profile = profiles[view.id];
  const selectedAxisId = selectedAxes[view.id];
  const selectedAxis = view.axes.find((axis) => axis.id === selectedAxisId) ?? view.axes[0];
  const selectedLevel = profile[selectedAxis.id];
  const expectation = getExpectation(view, selectedAxis, selectedLevel);
  const next = getNextStep(view, selectedAxis, selectedLevel);
  const summary = getSummary(view, profile);

  useEffect(() => {
    for (const item of ladders) {
      localStorage.setItem(getProfileStorageKey(item), JSON.stringify(profiles[item.id]));
    }
  }, [profiles]);

  function selectAxis(id: string) {
    setSelectedAxes((current) => ({ ...current, [view.id]: id }));
  }

  function setAxisLevel(axisId: string, value: number) {
    selectAxis(axisId);
    setProfiles((current) => ({
      ...current,
      [view.id]: { ...current[view.id], [axisId]: clampLevel(view, value) },
    }));
  }

  function resetExample() {
    setProfiles((current) => ({ ...current, [view.id]: { ...view.defaultProfile } }));
  }

  return (
    <Container maxWidth="lg" component="main" sx={{ pt: { xs: 4, md: 6 } }}>
      <Typography variant="h3" component="h1" gutterBottom>{view.title}</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800, mb: 4 }}>
        Interactively explore your progression and growth.
      </Typography>

      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.5fr) minmax(300px, 1fr)" }, gap: { xs: 3, md: 4 }, alignItems: "start" }}>
          <Box>
            <RadarChart key={view.id} view={view} profile={profile} selectedAxisId={selectedAxisId} onSelectAxis={selectAxis} onSetAxisLevel={setAxisLevel} />
          </Box>
          <Box component="section" aria-label="Capability details" sx={{ borderTop: { xs: 1, md: 0 }, borderLeft: { xs: 0, md: 1 }, borderColor: "divider", pt: { xs: 3, md: 0 }, pl: { xs: 0, md: 4 } }}>
            <Typography variant="h5" component="h2" gutterBottom>{selectedAxis.label}</Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>{selectedAxis.description}</Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="h6">{getLevelLabel(view, selectedAxis, selectedLevel)}</Typography>
            <Slider
              aria-label={`${selectedAxis.label} level`}
              aria-valuetext={getLevelLabel(view, selectedAxis, selectedLevel)}
              value={selectedLevel}
              min={1}
              max={view.levels.length}
              step={1}
              marks={view.levels.map((level, index) => ({ value: index + 1, label: level.shortLabel }))}
              onChange={(_, value) => setAxisLevel(selectedAxis.id, value as number)}
              sx={{
                mt: 2, mb: 3,
                '& .MuiSlider-markLabel[data-index="0"]': { transform: "translateX(0)" },
                [`& .MuiSlider-markLabel[data-index="${view.levels.length - 1}"]`]: { transform: "translateX(-100%)" },
              }}
            />
            <Typography variant="subtitle2" gutterBottom>At this level</Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>{expectation.summary}</Typography>
            {view.levels[selectedLevel - 1].note && <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {view.levels[selectedLevel - 1].note}
            </Typography>}
            <Typography variant="subtitle2" gutterBottom>{next ? "Next level" : "At the outer level"}</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {next ? `${next.label ?? view.levels[selectedLevel].label}: ${next.summary}` : "This is the highest level in this example ladder."}
            </Typography>
            <Button variant="text" onClick={resetExample} sx={{ textTransform: "none" }}>Reset to Default</Button>
          </Box>
        </Box>
      </Paper>

      <Box component="section" aria-labelledby="summary-title" sx={{ mt: 6 }}>
        <Typography id="summary-title" variant="h4" component="h2" gutterBottom>Summary</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Strengths: {summary.highest.join(", ")}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Lowest: {summary.focus.join(", ")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Levels describe typical scope, not a promotion checklist. Use the detailed expectations and a manager conversation for context.
        </Typography>
      </Box>

      <Box component="section" aria-labelledby="table-title" sx={{ mt: 6 }}>
        <Typography id="table-title" variant="h4" component="h2" gutterBottom>Capability table</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Your selected levels are shown first. Open a capability below to explore its full ladder.
        </Typography>
        <TableContainer component={Paper} variant="outlined" sx={{ display: { xs: "none", md: "block" } }}>
          <Table size="small" aria-label="Selected capability values">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Capability</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Selected level</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Expectation</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Next level</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {view.axes.map((axis) => {
                const level = profile[axis.id];
                const nextStep = getNextStep(view, axis, level);
                return <TableRow key={axis.id} selected={axis.id === selectedAxisId}>
                  <TableCell sx={{ minWidth: 180 }}><Button onClick={() => selectAxis(axis.id)} sx={{ textAlign: "left", justifyContent: "flex-start", p: 0 }}>{axis.label}</Button></TableCell>
                  <TableCell sx={{ minWidth: 140 }}>{getLevelLabel(view, axis, level)}</TableCell>
                  <TableCell>{getExpectation(view, axis, level).summary}</TableCell>
                  <TableCell>{nextStep?.summary ?? "Highest level shown"}</TableCell>
                </TableRow>;
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack gap={2} sx={{ display: { xs: "flex", md: "none" } }}>
          {view.axes.map((axis) => {
            const level = profile[axis.id];
            return <Paper key={axis.id} variant="outlined" sx={{ p: 2 }}>
              <Button onClick={() => selectAxis(axis.id)} sx={{ p: 0, mb: 1, textAlign: "left" }}>{axis.label}</Button>
              <Typography variant="subtitle2">{getLevelLabel(view, axis, level)}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>{getExpectation(view, axis, level).summary}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Next: {getNextStep(view, axis, level)?.summary ?? "Highest level shown"}
              </Typography>
            </Paper>;
          })}
        </Stack>
        <Box sx={{ mt: 3 }}>
          <LadderTable key={view.id} view={view} profile={profile} onSelectAxis={selectAxis} />
        </Box>
        <Box component="section" aria-labelledby="references-title" sx={{ borderTop: 1, borderColor: "divider", pt: 3, mt: 4 }}>
          <Typography id="references-title" variant="h5" component="h3" gutterBottom>References</Typography>
          <Stack component="ul" spacing={1} sx={{ pl: 3, mt: 1 }}>
            {view.references.map((reference) => <Box component="li" key={reference.href}>
              <MuiLink href={reference.href} target="_blank" rel="noopener noreferrer">{reference.label}</MuiLink>
            </Box>)}
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}
