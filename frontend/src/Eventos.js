import React, { useEffect, useState } from 'react';

function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [form, setForm] = useState({
    titulo: '',
    data: '',
    hora: '',
    local: '',
    participantes: '', // ids separados por vírgula
    congregacaoId: '',
    tipoEvento: 'ensaio',
  });
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');

  const fetchEventos = async () => {
    setLoading(true);
    const res = await fetch('/api/eventos');
    const data = await res.json();
    setEventos(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const participantesArray = form.participantes.split(',').map(p => p.trim()).filter(Boolean);
    if (editId) {
      await fetch(`/api/eventos/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, participantes: participantesArray }),
      });
    } else {
      await fetch('/api/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, participantes: participantesArray }),
      });
    }
    setForm({
      titulo: '',
      data: '',
      hora: '',
      local: '',
      participantes: '',
      congregacaoId: '',
      tipoEvento: 'ensaio',
    });
    setEditId(null);
    fetchEventos();
  };

  const handleEdit = e => {
    setForm({
      titulo: e.titulo,
      data: e.data,
      hora: e.hora,
      local: e.local,
      participantes: e.participantes ? e.participantes.join(', ') : '',
      congregacaoId: e.congregacaoId,
      tipoEvento: e.tipoEvento,
    });
    setEditId(e.id);
  };

  const handleDelete = async id => {
    if (window.confirm('Deseja excluir este evento?')) {
      await fetch(`/api/eventos/${id}`, { method: 'DELETE' });
      fetchEventos();
    }
  };

  // Filtro e busca
  const eventosFiltrados = eventos.filter(e => {
    const buscaLower = busca.toLowerCase();
    const tituloMatch = e.titulo.toLowerCase().includes(buscaLower);
    const localMatch = e.local.toLowerCase().includes(buscaLower);
    const congMatch = e.congregacaoId.toLowerCase().includes(buscaLower);
    const tipoMatch = filtroTipo ? e.tipoEvento === filtroTipo : true;
    return (tituloMatch || localMatch || congMatch) && tipoMatch;
  });

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, marginBottom: 24, background: '#f6f8fa' }}>
      <h2 style={{ color: '#2c3e50' }}>Cadastro de Ensaios/Eventos</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input name="titulo" placeholder="Título" value={form.titulo} onChange={handleChange} required style={{ flex: 2 }} />
        <input name="data" type="date" value={form.data} onChange={handleChange} required style={{ flex: 1 }} />
        <input name="hora" type="time" value={form.hora} onChange={handleChange} required style={{ flex: 1 }} />
        <input name="local" placeholder="Local" value={form.local} onChange={handleChange} required style={{ flex: 2 }} />
        <input name="participantes" placeholder="IDs dos Participantes (separados por vírgula)" value={form.participantes} onChange={handleChange} required style={{ flex: 2 }} />
        <input name="congregacaoId" placeholder="ID Congregação" value={form.congregacaoId} onChange={handleChange} required style={{ flex: 1 }} />
        <select name="tipoEvento" value={form.tipoEvento} onChange={handleChange} style={{ flex: 1 }}>
          <option value="ensaio">Ensaio</option>
          <option value="culto">Culto</option>
          <option value="outro">Outro</option>
        </select>
        <button type="submit" style={{ flex: 1, minWidth: 100 }}>{editId ? 'Salvar' : 'Cadastrar'}</button>
        {editId && <button type="button" onClick={() => { setForm({
          titulo: '',
          data: '',
          hora: '',
          local: '',
          participantes: '',
          congregacaoId: '',
          tipoEvento: 'ensaio',
        }); setEditId(null); }} style={{ flex: 1, minWidth: 100 }}>Cancelar</button>}
      </form>
      <div style={{ marginBottom: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input placeholder="Buscar por título, local ou congregação" value={busca} onChange={e => setBusca(e.target.value)} style={{ flex: 2 }} />
        <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} style={{ flex: 1 }}>
          <option value="">Todos</option>
          <option value="ensaio">Ensaio</option>
          <option value="culto">Culto</option>
          <option value="outro">Outro</option>
        </select>
      </div>
      <h3 style={{ color: '#34495e' }}>Lista de Ensaios/Eventos</h3>
      {loading ? <p>Carregando...</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {eventosFiltrados.map(e => (
            <li key={e.id} style={{ background: '#fff', marginBottom: 8, padding: 8, borderRadius: 4, boxShadow: '0 1px 2px #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>
                <b>{e.titulo}</b> - {e.data} {e.hora} - {e.local} - Congregação: {e.congregacaoId} - Tipo: {e.tipoEvento} - Participantes: {e.participantes && e.participantes.join(', ')}
              </span>
              <span>
                <button onClick={() => handleEdit(e)} style={{ marginLeft: 8 }}>Editar</button>
                <button onClick={() => handleDelete(e.id)} style={{ marginLeft: 4 }}>Excluir</button>
              </span>
            </li>
          ))}
          {eventosFiltrados.length === 0 && <li>Nenhum evento encontrado.</li>}
        </ul>
      )}
    </div>
  );
}

export default Eventos;
