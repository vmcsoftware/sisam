
import React, { useState } from 'react';
import Musicos from './Musicos';
import Congregacoes from './Congregacoes';
import Eventos from './Eventos';
import Login from './Login';
import { Container, CssBaseline, AppBar, Toolbar, Typography, Box, Tabs, Tab, Paper } from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';


function App() {
  const [tab, setTab] = useState(0);
  const [user, setUser] = useState(null);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <>
      <CssBaseline />
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar>
          <MusicNoteIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sistema de Agendamento de Ensaios Musicais
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            sx={{ mb: 2 }}
          >
            <Tab label="Músicos/Organistas" />
            <Tab label="Congregações" />
            <Tab label="Ensaios/Eventos" />
          </Tabs>
          <Box hidden={tab !== 0}><Musicos /></Box>
          <Box hidden={tab !== 1}><Congregacoes /></Box>
          <Box hidden={tab !== 2}><Eventos /></Box>
        </Paper>
      </Container>
    </>
  );
}

export default App;
