import React from 'react';
import Musicos from './Musicos';
import Congregacoes from './Congregacoes';
import Eventos from './Eventos';

function App() {
  return (
    <div>
      <h1>Sistema de Agendamento de Ensaios Musicais</h1>
      <Musicos />
      <Congregacoes />
      <Eventos />
    </div>
  );
}

export default App;
