import { Info, Search } from "@mui/icons-material";
import {
  Alert,
  Button,
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Snackbar,
  Stack,
  Tooltip,
} from "@mui/material";
import { Box } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import "./App.css";
import bdoLogo from "./bdo_logo.svg";

const columns = [
  {
    field: "Name",
    headerName: "Company name",
    flex: 2,
    headerClassName: "header-cell",
    sortable: false,
    renderCell: (params) => (
      <Tooltip title={params.row.Name}>
        <span className="wrap-cell">{params.row.Name}</span>
      </Tooltip>
    ),
  },
  {
    field: "Description",
    headerName: "Company description",
    flex: 8,
    headerClassName: "header-cell",
    sortable: false,
    renderCell: (params) => (
      <Tooltip title={params.row.Description}>
        <span className="wrap-cell">{params.row.Description}</span>
      </Tooltip>
    ),
  },
  {
    field: "BetaValue",
    headerName: "Beta value",
    flex: 1,
    headerClassName: "header-cell",
  },
];

const MAX_ROWS = 10;
const MIN_KEYWORDS = 2;
const KEYWORD_MESSAGE = `Enter at least ${MIN_KEYWORDS} keywords`;

function App() {
  const [hits, setHits] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [infoSnackbarOpen, setInfoSnackbarOpen] = useState(false);

  const fetchHits = async (queryString) => {
    setLoading(true);
    const response = await fetch(`/search/${queryString}`);
    const hits = await response.json();
    // Add a unique id to each hit, since the DataGrid component requires this
    const hitsWithId = hits.map((hit, index) => {
      return { ...hit, id: index };
    });
    setHits(hitsWithId);
    setLoading(false);
  };

  const handleQueryChanged = (event) => {
    setQuery(event.target.value);
  };

  const handleSearchClicked = () => {
    const numKeywords = query.trim().split(/\s+/).length;
    if (numKeywords < MIN_KEYWORDS) {
      setInfoSnackbarOpen(true);
    } else {
      setInfoSnackbarOpen(false);
      fetchHits(query);
    }
  };

  const closeSnackbar = () => setInfoSnackbarOpen(false);

  return (
    <Box id="wrapper">
      <Stack id="table" spacing={2} direction="column" justifyContent="center">
        <Box
          component="img"
          sx={{
            height: hits ? "5vh" : "15vh",
          }}
          alt="The house from the offer."
          src={bdoLogo}
        />
        <Box style={{ height: "2vh" }} />
        <Stack spacing={2} direction="row">
          <FormControl
            variant="outlined"
            sx={{
              flex: 4,
            }}
            onChange={handleQueryChanged}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                handleSearchClicked();
              }
            }}
          >
            <InputLabel>Keywords</InputLabel>
            <OutlinedInput
              type="text"
              endAdornment={
                <InputAdornment position="end">
                  <Tooltip title={KEYWORD_MESSAGE}>
                    <Info />
                  </Tooltip>
                </InputAdornment>
              }
              label="Keywords"
            />
          </FormControl>
          <Button
            startIcon={loading ? null : <Search />}
            variant="contained"
            onClick={handleSearchClicked}
            type="submit"
            sx={{
              flex: 1,
            }}
          >
            {loading ? <CircularProgress sx={{ color: "white" }} /> : "Search"}
          </Button>
        </Stack>
        {hits && (
          <DataGrid
            rows={hits}
            loading={loading}
            columns={columns}
            pageSize={MAX_ROWS}
            rowsPerPageOptions={[MAX_ROWS]}
            components={{
              NoRowsOverlay: () => (
                <Stack
                  height="100%"
                  alignItems="center"
                  justifyContent="center"
                >
                  No matches found!
                </Stack>
              ),
            }}
          />
        )}
      </Stack>
      <Snackbar
        autoHideDuration={5000}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={infoSnackbarOpen}
        onClose={closeSnackbar}
      >
        <Alert onClose={closeSnackbar} severity="error">
          {KEYWORD_MESSAGE}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
