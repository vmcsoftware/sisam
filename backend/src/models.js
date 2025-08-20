// Modelo de Músico/Organista
// Campos: nome, telefone, congregacaoId, tipo (musico/organista)

export const MusicoModel = {
  collection: 'musicos',
  fields: {
    nome: '',
    telefone: '',
    congregacaoId: '',
    tipo: '', // 'musico' ou 'organista'
  },
};

// Modelo de Congregação
// Campos: nome, endereco, diasCulto (array de strings)
export const CongregacaoModel = {
  collection: 'congregacoes',
  fields: {
    nome: '',
    endereco: '',
    diasCulto: [],
  },
};

// Modelo de Ensaio/Evento
// Campos: titulo, data, hora, local, participantes (array de musicosId), congregacaoId, tipoEvento
export const EventoModel = {
  collection: 'eventos',
  fields: {
    titulo: '',
    data: '',
    hora: '',
    local: '',
    participantes: [],
    congregacaoId: '',
    tipoEvento: '', // 'ensaio', 'culto', 'outro'
  },
};
