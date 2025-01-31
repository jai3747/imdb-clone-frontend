
import './App.css';
import { ThemeProvider } from '@emotion/react';
import { AppBar, Button, Paper, Toolbar, createTheme } from '@mui/material';
import { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import AddMovie from './AddMovie';
import Movie from './Movie';
import AddActor from './AddActor';
import AddProducer from './AddProducer';
import EditMovies from './EditMovies';

function App() {
  const [mode, setMode] = useState("dark");
  const navigate = useNavigate();

  const theme = createTheme({
    palette: {
      mode: mode,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Paper className="paper" elevation={5} style={{ borderRadius: "0px", minHeight: "100vh" }}>
        <AppBar className="nav-bar" position="static">
          <Toolbar>
            <Button
              onClick={() => {
                navigate("/");
              }}
              color="inherit"
            >
              <span className='logo'>IMDB</span>
            </Button>
            <Button
              onClick={() => {
                navigate("/");
              }}
              color="inherit"
            >
              All Movies
            </Button>
            <Button
              onClick={() => {
                navigate("/add-movies");
              }}
              color="inherit"
            >
              Add Movies
            </Button>
            <Button
              onClick={() => {
                navigate("/add-actor");
              }}
              color="inherit"
            >
              Add Actor
            </Button>
            <Button
              onClick={() => {
                navigate("/add-producer");
              }}
              color="inherit"
            >
              Add Producer
            </Button>
            <Button
              style={{marginLeft : "auto"}}
              startIcon = {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              onClick={() => {
                setMode(mode === "light" ? "dark" : "light");
              }}
              color="inherit"
            >
              {mode === "light" ? "dark" : "light"} mode
            </Button>
          </Toolbar>
        </AppBar>

        <Routes>
          <Route
           exact
            path="/"
            element={<Movie  />}
          />
          <Route
            path="/add-movies"
            element={
              <AddMovie  />
            }
          />
          <Route
            path="/add-actor"
            element={
              <AddActor  />
            }
          />
          <Route
            path="/add-producer"
            element={
              <AddProducer />
            }
          />
          
          <Route
            path="movies/edit/:id"
            element={
              <EditMovies  />
            }
          />
        </Routes>

      </Paper>
    </ThemeProvider>
  );
}



export default App;
