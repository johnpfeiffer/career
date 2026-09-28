import { Box, Button, Typography, alpha, useMediaQuery, useTheme } from "@mui/material";
import { getLevelLabel, type CareerView, type Profile } from "../models/ladder";

type Props = {
  view: CareerView;
  profile: Profile;
  selectedAxisId: string;
  onSelectAxis: (id: string) => void;
};

const labelLines: Record<string, string[]> = {
  "Engineering Best Practices": ["Engineering", "Best Practices"],
  "Vision and Strategy": ["Vision and", "Strategy"],
  "Scope of Influence": ["Scope of", "Influence"],
};

function point(index: number, distance: number, center: { x: number; y: number }, axisCount: number) {
  const angle = -Math.PI / 2 + index * Math.PI * 2 / axisCount;
  return {
    x: center.x + Math.cos(angle) * distance,
    y: center.y + Math.sin(angle) * distance,
  };
}

function polygon(view: CareerView, distance: (index: number) => number, center: { x: number; y: number }) {
  return view.axes.map((_, index) => {
    const { x, y } = point(index, distance(index), center, view.axes.length);
    return `${x},${y}`;
  }).join(" ");
}

export default function RadarChart({ view, profile, selectedAxisId, onSelectAxis }: Props) {
  const theme = useTheme();
  const compact = useMediaQuery("(max-width:700px)");
  const center = compact ? { x: 200, y: 195 } : { x: 350, y: 280 };
  const radius = compact ? 125 : 175;
  const labelRadius = 226;
  return (
    <Box>
      <svg viewBox={compact ? "0 0 400 390" : "0 0 700 560"} width="100%" role="group" aria-label={`Interactive spider graph of ${view.label} levels across ${view.axes.length} capabilities`}>
        {view.levels.map((level, index) => (
          <g key={level.id}>
            <polygon
              points={polygon(view, () => radius * (index + 1) / view.levels.length, center)}
              fill="none"
              stroke={theme.palette.divider}
              strokeWidth="1"
            />
            <text x={center.x + 9} y={center.y - radius * (index + 1) / view.levels.length + 4} fontSize={compact ? "16" : "14"} fill={theme.palette.text.secondary}>
              {index + 1}
            </text>
          </g>
        ))}
        {view.axes.map((axis, index) => {
          const edge = point(index, radius, center, view.axes.length);
          return <line key={axis.id} x1={center.x} y1={center.y} x2={edge.x} y2={edge.y} stroke={theme.palette.divider} strokeWidth="1" />;
        })}
        <polygon
          points={polygon(view, (index) => radius * profile[view.axes[index].id] / view.levels.length, center)}
          fill={alpha(theme.palette.primary.main, 0.17)}
          stroke={theme.palette.primary.main}
          strokeWidth="3"
        />
        {view.axes.map((axis, index) => {
          const selected = axis.id === selectedAxisId;
          const dot = point(index, radius * profile[axis.id] / view.levels.length, center, view.axes.length);
          const label = point(index, labelRadius, center, view.axes.length);
          const anchor = label.x < center.x - 15 ? "end" : label.x > center.x + 15 ? "start" : "middle";
          const words = labelLines[axis.label] ?? [axis.label];
          return (
            <g
              key={axis.id}
              role="button"
              tabIndex={0}
              aria-label={`Inspect ${axis.label}, ${getLevelLabel(view, axis, profile[axis.id])}`}
              onClick={() => onSelectAxis(axis.id)}
              onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelectAxis(axis.id); } }}
              style={{ cursor: "pointer", outline: "none" }}
            >
              <title>{axis.label}: {getLevelLabel(view, axis, profile[axis.id])}</title>
              <circle cx={dot.x} cy={dot.y} r="15" fill="transparent" />
              <circle cx={dot.x} cy={dot.y} r={selected ? 9 : 7} fill={theme.palette.primary.main} stroke={theme.palette.background.paper} strokeWidth="3" />
              {!compact && <>
                <text x={label.x} y={label.y - (words.length - 1) * 9} textAnchor={anchor} fontSize="15" fontWeight={selected ? 700 : 500} fill={selected ? theme.palette.primary.main : theme.palette.text.primary}>
                  {words.map((word, line) => <tspan key={word} x={label.x} dy={line === 0 ? 0 : 18}>{word}</tspan>)}
                </text>
                <circle cx={label.x} cy={label.y} r="32" fill="transparent" />
              </>}
            </g>
          );
        })}
      </svg>
      {compact && <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 1, mb: 2 }}>
        {view.axes.map((axis) => <Button
          key={axis.id}
          size="small"
          variant={axis.id === selectedAxisId ? "contained" : "outlined"}
          onClick={() => onSelectAxis(axis.id)}
        >{axis.label}</Button>)}
      </Box>}
      <Typography variant="body2" color="text.secondary" align="center">
        Center: {view.levels[0].label} · Outer edge: {view.levels[view.levels.length - 1].label}. Select an axis to inspect it.
      </Typography>
    </Box>
  );
}
