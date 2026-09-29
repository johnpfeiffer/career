import { useEffect, useState } from "react";
import { AppBar, Container, CssBaseline, FormControl, InputLabel, MenuItem, Select, ThemeProvider, Toolbar, Typography, createTheme } from "@mui/material";
import { Link, Navigate, Outlet, RouterProvider, createBrowserRouter, useNavigate, useParams } from "react-router-dom";
import HomePage from "./components/HomePage";
import Footer from "./components/Footer";
import { ladders, type ViewId } from "./models/ladder";

const viewStorageKey = "career-coach-view-v1";

function readViewId(): ViewId {
  const saved = localStorage.getItem(viewStorageKey);
  return ladders.some((view) => view.id === saved) ? saved as ViewId : "general";
}

function Layout() {
  const [viewId, setViewId] = useState<ViewId>(readViewId);
  const navigate = useNavigate();
  const { app = "" } = useParams();
  const homePath = app ? `/${app}` : "/";

  useEffect(() => { localStorage.setItem(viewStorageKey, viewId); }, [viewId]);

  return (
    <>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 2 }}>
            <Typography variant="subtitle1" component={Link} to={homePath} sx={{ color: "text.primary", textDecoration: "none", fontWeight: 600, flexGrow: 1 }}>
              Career Coach
            </Typography>
            <FormControl size="small" sx={{ minWidth: { xs: 165, sm: 210 } }}>
              <InputLabel id="view-select-label">View</InputLabel>
              <Select
                labelId="view-select-label"
                value={viewId}
                label="View"
                onChange={(event) => { setViewId(event.target.value as ViewId); navigate(homePath); }}
              >
                {ladders.map((view) => <MenuItem key={view.id} value={view.id}>{view.label}</MenuItem>)}
              </Select>
            </FormControl>
          </Toolbar>
        </Container>
      </AppBar>
      <Outlet context={{ viewId }} />
      <Footer />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "references", element: <Navigate to="/" replace /> },
      {
        path: ":app",
        children: [
          { index: true, element: <HomePage /> },
          { path: "references", element: <Navigate to=".." replace /> },
        ],
      },
    ],
  },
]);

const theme = createTheme();

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
