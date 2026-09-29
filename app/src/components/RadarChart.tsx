import { useRef, type PointerEvent } from "react";
import { Box, Button, Typography, alpha, useMediaQuery, useTheme } from "@mui/material";
import { getLevelAtPoint, getLevelLabel, type Ladder, type Profile } from "../models/ladder";

type Props = {
  view: Ladder;
  profile: Profile;
  selectedAxisId: string;
  onSelectAxis: (id: string) => void;
  onSetAxisLevel: (id: string, level: number) => void;
};

const labelLines: Record<string, string[]> = {
  "Engineering Best Practices": ["Engineering", "Best Practices"],
  "Vision and Strategy": ["Vision and", "Strategy"],
  "Scope of Influence": ["Scope of", "Influence"],
};

function point(index: number, distance: number, center: { x: number; y: number }, axisCount: number) {
  const angle = -Math.PI / 2 + index * Math.PI * 2 / axisCount;
  return { x: center.x + Math.cos(angle) * distance, y: center.y + Math.sin(angle) * distance };
}

function polygon(view: Ladder, distance: (index: number) => number, center: { x: number; y: number }) {
  return view.axes.map((_, index) => {
    const { x, y } = point(index, distance(index), center, view.axes.length);
    return `${x},${y}`;
  }).join(" ");
}

export default function RadarChart({ view, profile, selectedAxisId, onSelectAxis, onSetAxisLevel }: Props) {
  const theme = useTheme();
  const compact = useMediaQuery("(max-width:700px)");
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ axisIndex: number; pointerId: number } | null>(null);
  const center = compact ? { x: 200, y: 195 } : { x: 350, y: 280 };
  const radius = compact ? 125 : 175;
  const labelRadius = 226;

  function adjust(event: PointerEvent<SVGElement>, axisIndex: number) {
    const transform = svgRef.current?.getScreenCTM();
    if (!transform) return;
    const position = new DOMPoint(event.clientX, event.clientY).matrixTransform(transform.inverse());
    onSetAxisLevel(view.axes[axisIndex].id, getLevelAtPoint(view, axisIndex, position, center, radius));
  }

  return (
    <Box sx={{
      '& svg [tabindex]': { outline: "none" },
      '& [role="slider"]:focus-visible circle:last-of-type': { stroke: "text.primary", strokeWidth: 4 },
      '& [role="button"]:focus-visible text': { textDecoration: "underline" },
    }}>
      <svg
        ref={svgRef}
        viewBox={compact ? "0 0 400 390" : "0 0 700 560"}
        width="100%"
        role="group"
        aria-label={`Interactive spider graph of ${view.label} levels across ${view.axes.length} capabilities`}
        onPointerMove={(event) => {
          if (drag.current?.pointerId === event.pointerId) adjust(event, drag.current.axisIndex);
        }}
        onPointerUp={(event) => {
          if (drag.current?.pointerId === event.pointerId) adjust(event, drag.current.axisIndex);
          drag.current = null;
        }}
        onPointerCancel={() => { drag.current = null; }}
        onLostPointerCapture={() => { drag.current = null; }}
      >
        {view.levels.map((level, index) => <g key={level.id}>
          <polygon points={polygon(view, () => radius * (index + 1) / view.levels.length, center)} fill="none" stroke={theme.palette.divider} strokeWidth="1" />
          <text x={center.x + 9} y={center.y - radius * (index + 1) / view.levels.length + 4} fontSize={compact ? "16" : "14"} fill={theme.palette.text.secondary}>{index + 1}</text>
        </g>)}
        <polygon
          points={polygon(view, (index) => radius * profile[view.axes[index].id] / view.levels.length, center)}
          fill={alpha(theme.palette.primary.main, 0.17)}
          stroke={theme.palette.primary.main}
          strokeWidth="3"
          pointerEvents="none"
        />
        {view.axes.map((axis, index) => {
          const selected = axis.id === selectedAxisId;
          const edge = point(index, radius, center, view.axes.length);
          const inner = point(index, radius / view.levels.length, center, view.axes.length);
          const dot = point(index, radius * profile[axis.id] / view.levels.length, center, view.axes.length);
          const label = point(index, labelRadius, center, view.axes.length);
          const anchor = label.x < center.x - 15 ? "end" : label.x > center.x + 15 ? "start" : "middle";
          const words = labelLines[axis.label] ?? [axis.label];
          return <g key={axis.id}>
            <g
              role="slider"
              tabIndex={0}
              aria-label={`${axis.label} graph level`}
              aria-valuemin={1}
              aria-valuemax={view.levels.length}
              aria-valuenow={profile[axis.id]}
              aria-valuetext={getLevelLabel(view, axis, profile[axis.id])}
              onPointerDown={(event) => {
                if (event.button !== 0) return;
                event.preventDefault();
                event.currentTarget.focus();
                event.currentTarget.setPointerCapture(event.pointerId);
                drag.current = { axisIndex: index, pointerId: event.pointerId };
                adjust(event, index);
              }}
              onKeyDown={(event) => {
                const value = event.key === "Home" ? 1 : event.key === "End" ? view.levels.length
                  : ["ArrowUp", "ArrowRight"].includes(event.key) ? profile[axis.id] + 1
                  : ["ArrowDown", "ArrowLeft"].includes(event.key) ? profile[axis.id] - 1 : null;
                if (value !== null) { event.preventDefault(); onSetAxisLevel(axis.id, value); }
              }}
              style={{ cursor: "pointer", touchAction: "none" }}
            >
              <title>{axis.label}: {getLevelLabel(view, axis, profile[axis.id])}</title>
              <line x1={center.x} y1={center.y} x2={edge.x} y2={edge.y} stroke={theme.palette.divider} strokeWidth="1" pointerEvents="none" />
              <line x1={inner.x} y1={inner.y} x2={edge.x} y2={edge.y} stroke="transparent" strokeWidth="24" strokeLinecap="round" />
              <circle cx={dot.x} cy={dot.y} r="15" fill="transparent" />
              <circle cx={dot.x} cy={dot.y} r={selected ? 9 : 7} fill={theme.palette.primary.main} stroke={theme.palette.background.paper} strokeWidth="3" />
            </g>
            {!compact && <g
              role="button"
              tabIndex={0}
              aria-label={`Inspect ${axis.label}`}
              onClick={() => onSelectAxis(axis.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelectAxis(axis.id); }
              }}
              style={{ cursor: "pointer", fontWeight: selected ? 700 : 500, textDecoration: selected ? "underline" : "none" }}
            >
              <text x={label.x} y={label.y - (words.length - 1) * 9} textAnchor={anchor} fontSize="15" fill={selected ? theme.palette.primary.main : theme.palette.text.primary}>
                {words.map((word, line) => <tspan key={word} x={label.x} dy={line === 0 ? 0 : 18}>{word}</tspan>)}
              </text>
            </g>}
          </g>;
        })}
      </svg>
      {compact && <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 1, mb: 2 }}>
        {view.axes.map((axis) => <Button
          key={axis.id}
          size="small"
          aria-label={`Inspect ${axis.label}`}
          variant={axis.id === selectedAxisId ? "contained" : "outlined"}
          onClick={() => onSelectAxis(axis.id)}
          sx={{ fontWeight: axis.id === selectedAxisId ? 700 : 500, textDecoration: axis.id === selectedAxisId ? "underline" : "none" }}
        >{axis.label}</Button>)}
      </Box>}
      <Typography variant="body2" color="text.secondary" align="center" sx={{ fontStyle: "italic" }}>
        Click to adjust a point along any axis
      </Typography>
    </Box>
  );
}
