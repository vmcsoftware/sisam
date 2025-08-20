import React, { useEffect, useState } from 'react';

const API_URL = "https://sisam-ecru.vercel.app/api";

function Congregacoes() {
  const [congregacoes, setCongregacoes] = useState([]);
  const [form, setForm] = useState({ nome: '', endereco: '', diasCulto: '' });
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [busca, setBusca] = useState('');

  const fetchCongregacoes = async () => {
    setLoading(true);
    const res = await fetch(`${API_URL}/congregacoes`);
    const data = await res.json();
    setCongregacoes(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCongregacoes();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const diasCultoArray = form.diasCulto.split(',').map(d => d.trim()).filter(Boolean);
    if (editId) {
      await fetch(`${API_URL}/congregacoes/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, diasCulto: diasCultoArray }),
      });
    } else {
      await fetch(`${API_URL}/congregacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, diasCulto: diasCultoArray }),
      });
    }
    setForm({ nome: '', endereco: '', diasCulto: '' });
    setEditId(null);
    fetchCongregacoes();
  };

  const handleEdit = c => {
    setForm({ nome: c.nome, endereco: c.endereco, diasCulto: c.diasCulto ? c.diasCulto.join(', ') : '' });
    setEditId(c.id);
  };

  const handleDelete = async id => {
    if (window.confirm('Deseja excluir esta congregação?')) {
      await fetch(`${API_URL}/congregacoes/${id}`, { method: 'DELETE' });
      fetchCongregacoes();
    }
  };

  // Filtro e busca
  const congregacoesFiltradas = congregacoes.filter(c => {
    const buscaLower = busca.toLowerCase();
    const nomeMatch = c.nome.toLowerCase().includes(buscaLower);
    const endMatch = c.endereco.toLowerCase().includes(buscaLower);
    const diasMatch = (c.diasCulto || []).join(', ').toLowerCase().includes(buscaLower);
    return nomeMatch || endMatch || diasMatch;
  });

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, marginBottom: 24, background: '#f8fafc' }}>
      <h2 style={{ color: '#2c3e50' }}>Cadastro de Congregações</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} required style={{ flex: 1 }} />
        <input name="endereco" placeholder="Endereço" value={form.endereco} onChange={handleChange} required style={{ flex: 2 }} />
        <input name="diasCulto" placeholder="Dias de Culto (separados por vírgula)" value={form.diasCulto} onChange={handleChange} required style={{ flex: 2 }} />
        <button type="submit" style={{ flex: 1, minWidth: 100 }}>{editId ? 'Salvar' : 'Cadastrar'}</button>
        {editId && <button type="button" onClick={() => { setForm({ nome: '', endereco: '', diasCulto: '' }); setEditId(null); }} style={{ flex: 1, minWidth: 100 }}>Cancelar</button>}
      </form>
      <div style={{ marginBottom: 12 }}>
        <input placeholder="Buscar por nome, endereço ou dias de culto" value={busca} onChange={e => setBusca(e.target.value)} style={{ width: '100%' }} />
      </div>
      <h3 style={{ color: '#34495e' }}>Lista de Congregações</h3>
      {loading ? <p>Carregando...</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {congregacoesFiltradas.map(c => (
            <li key={c.id} style={{ background: '#fff', marginBottom: 8, padding: 8, borderRadius: 4, boxShadow: '0 1px 2px #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>
                <b>{c.nome}</b> - {c.endereco} - Dias de Culto: {c.diasCulto && c.diasCulto.join(', ')}
              </span>
              <span>
                <button onClick={() => handleEdit(c)} style={{ marginLeft: 8 }}>Editar</button>
                <button onClick={() => handleDelete(c.id)} style={{ marginLeft: 4 }}>Excluir</button>
              </span>
            </li>
          ))}
          {congregacoesFiltradas.length === 0 && <li>Nenhuma congregação encontrada.</li>}
        </ul>
      )}
    </div>
  );
}

export default Congregacoes;
