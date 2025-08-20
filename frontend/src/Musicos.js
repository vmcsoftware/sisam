import React, { useState, useEffect } from 'react';

import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, MenuItem, Grid, Paper, IconButton, Stack, Divider, InputAdornment, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

function Musicos() {
  const [musicos, setMusicos] = useState([]);
  const [form, setForm] = useState({ nome: '', telefone: '', congregacaoId: '', tipo: 'musico' });
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const fetchMusicos = async () => {
    setLoading(true);
    const res = await fetch('/api/musicos');
    const data = await res.json();
    setMusicos(data);
    setLoading(false);
  };
  useEffect(() => {
    fetchMusicos();
  }, []);
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (editId) {
      await fetch(`/api/musicos/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } else {
      await fetch('/api/musicos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setForm({ nome: '', telefone: '', congregacaoId: '', tipo: 'musico' });
    setEditId(null);
    fetchMusicos();
  };
  const handleEdit = m => {
    setForm({ nome: m.nome, telefone: m.telefone, congregacaoId: m.congregacaoId, tipo: m.tipo });
    setEditId(m.id);
  };
  const handleDelete = async id => {
    if (window.confirm('Deseja excluir este músico?')) {
      await fetch(`/api/musicos/${id}`, { method: 'DELETE' });
      fetchMusicos();
    }
  };
  // Filtro e busca
  const musicosFiltrados = musicos.filter(m => {
    const buscaLower = busca.toLowerCase();
    const nomeMatch = m.nome.toLowerCase().includes(buscaLower);
    const telMatch = m.telefone.toLowerCase().includes(buscaLower);
    const congMatch = m.congregacaoId.toLowerCase().includes(buscaLower);
    const tipoMatch = filtroTipo ? m.tipo === filtroTipo : true;
    return (nomeMatch || telMatch || congMatch) && tipoMatch;
  });
  return (
    <Box>
      <Typography variant="h5" color="primary" gutterBottom>Cadastro de Músicos/Organistas</Typography>
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField name="nome" label="Nome" value={form.nome} onChange={handleChange} required fullWidth size="small" />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField name="telefone" label="Telefone" value={form.telefone} onChange={handleChange} required fullWidth size="small" />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField name="congregacaoId" label="ID Congregação" value={form.congregacaoId} onChange={handleChange} required fullWidth size="small" />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField select name="tipo" label="Tipo" value={form.tipo} onChange={handleChange} fullWidth size="small">
                <MenuItem value="musico">Músico</MenuItem>
                <MenuItem value="organista">Organista</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={1}>
              <Button type="submit" variant="contained" color="primary" fullWidth>{editId ? 'Salvar' : 'Cadastrar'}</Button>
            </Grid>
            {editId && (
              <Grid item xs={12} sm={1}>
                <Button type="button" variant="outlined" color="secondary" fullWidth onClick={() => { setForm({ nome: '', telefone: '', congregacaoId: '', tipo: 'musico' }); setEditId(null); }}>Cancelar</Button>
              </Grid>
            )}
          </Grid>
        </form>
      </Paper>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
        <TextField
          placeholder="Buscar por nome, telefone ou congregação"
          value={busca}
          onChange={e => setBusca(e.target.value)}
          size="small"
          fullWidth
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
        />
        <TextField
          select
          label="Tipo"
          value={filtroTipo}
          onChange={e => setFiltroTipo(e.target.value)}
          size="small"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="musico">Músico</MenuItem>
          <MenuItem value="organista">Organista</MenuItem>
        </TextField>
      </Stack>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>Lista de Músicos/Organistas</Typography>
      {loading ? <CircularProgress /> : (
        <Box>
          {musicosFiltrados.length === 0 ? (
            <Typography>Nenhum músico encontrado.</Typography>
          ) : (
            <Grid container spacing={1}>
              {musicosFiltrados.map(m => (
                <Grid item xs={12} key={m.id}>
                  <Paper sx={{ p: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography component="span" fontWeight={600}>{m.nome}</Typography> - {m.telefone} - {m.tipo} - Congregação: {m.congregacaoId}
                    </Box>
                    <Box>
                      <IconButton color="primary" onClick={() => handleEdit(m)}><EditIcon /></IconButton>
                      <IconButton color="error" onClick={() => handleDelete(m.id)}><DeleteIcon /></IconButton>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}
    </Box>
  );
}

export default Musicos;
