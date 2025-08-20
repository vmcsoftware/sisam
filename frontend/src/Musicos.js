import React, { useEffect, useState } from 'react';

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
    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, marginBottom: 24, background: '#fafbfc' }}>
      <h2 style={{ color: '#2c3e50' }}>Cadastro de Músicos/Organistas</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} required style={{ flex: 1 }} />
        <input name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} required style={{ flex: 1 }} />
        <input name="congregacaoId" placeholder="ID Congregação" value={form.congregacaoId} onChange={handleChange} required style={{ flex: 1 }} />
        <select name="tipo" value={form.tipo} onChange={handleChange} style={{ flex: 1 }}>
          <option value="musico">Músico</option>
          <option value="organista">Organista</option>
        </select>
        <button type="submit" style={{ flex: 1, minWidth: 100 }}>{editId ? 'Salvar' : 'Cadastrar'}</button>
        {editId && <button type="button" onClick={() => { setForm({ nome: '', telefone: '', congregacaoId: '', tipo: 'musico' }); setEditId(null); }} style={{ flex: 1, minWidth: 100 }}>Cancelar</button>}
      </form>
      <div style={{ marginBottom: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input placeholder="Buscar por nome, telefone ou congregação" value={busca} onChange={e => setBusca(e.target.value)} style={{ flex: 2 }} />
        <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} style={{ flex: 1 }}>
          <option value="">Todos</option>
          <option value="musico">Músico</option>
          <option value="organista">Organista</option>
        </select>
      </div>
      <h3 style={{ color: '#34495e' }}>Lista de Músicos/Organistas</h3>
      {loading ? <p>Carregando...</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {musicosFiltrados.map(m => (
            <li key={m.id} style={{ background: '#fff', marginBottom: 8, padding: 8, borderRadius: 4, boxShadow: '0 1px 2px #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>
                <b>{m.nome}</b> - {m.telefone} - {m.tipo} - Congregação: {m.congregacaoId}
              </span>
              <span>
                <button onClick={() => handleEdit(m)} style={{ marginLeft: 8 }}>Editar</button>
                <button onClick={() => handleDelete(m.id)} style={{ marginLeft: 4 }}>Excluir</button>
              </span>
            </li>
          ))}
          {musicosFiltrados.length === 0 && <li>Nenhum músico encontrado.</li>}
        </ul>
      )}
    </div>
  );
}

export default Musicos;
