// Rotas de cadastro, listagem e edição para músicos, congregações e eventos
import express from 'express';
import { db } from './firebase.js';
import { MusicoModel, CongregacaoModel, EventoModel } from './models.js';

const router = express.Router();

router.post('/musicos', async (req, res) => {
  try {
    const data = req.body;
    const ref = await db.collection(MusicoModel.collection).add(data);
    res.status(201).json({ id: ref.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/musicos', async (req, res) => {
  try {
    const snap = await db.collection(MusicoModel.collection).get();
    const result = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/musicos/:id', async (req, res) => {
  try {
    await db.collection(MusicoModel.collection).doc(req.params.id).update(req.body);
    res.sendStatus(204);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/musicos/:id', async (req, res) => {
  try {
    await db.collection(MusicoModel.collection).doc(req.params.id).delete();
    res.sendStatus(204);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/congregacoes', async (req, res) => {
  try {
    const data = req.body;
    const ref = await db.collection(CongregacaoModel.collection).add(data);
    res.status(201).json({ id: ref.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/congregacoes', async (req, res) => {
  try {
    const snap = await db.collection(CongregacaoModel.collection).get();
    const result = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/congregacoes/:id', async (req, res) => {
  try {
    await db.collection(CongregacaoModel.collection).doc(req.params.id).update(req.body);
    res.sendStatus(204);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/congregacoes/:id', async (req, res) => {
  try {
    await db.collection(CongregacaoModel.collection).doc(req.params.id).delete();
    res.sendStatus(204);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/eventos', async (req, res) => {
  try {
    const data = req.body;
    const ref = await db.collection(EventoModel.collection).add(data);

    // Enviar WhatsApp para cada participante
    if (Array.isArray(data.participantes) && data.participantes.length > 0) {
      const { enviarWhatsapp } = await import('./whatsapp.js');
      const snap = await db.collection('musicos').where(admin.firestore.FieldPath.documentId(), 'in', data.participantes).get();
      for (const doc of snap.docs) {
        const musico = doc.data();
        if (musico.telefone) {
          const msg = `Olá ${musico.nome}, lembrete: ${data.titulo} em ${data.data} às ${data.hora} na congregação ${data.congregacaoId}.`;
          try { await enviarWhatsapp(musico.telefone, msg); } catch (err) { /* log opcional */ }
        }
      }
    }

    res.status(201).json({ id: ref.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/eventos', async (req, res) => {
  try {
    const snap = await db.collection(EventoModel.collection).get();
    const result = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/eventos/:id', async (req, res) => {
  try {
    await db.collection(EventoModel.collection).doc(req.params.id).update(req.body);
    res.sendStatus(204);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/eventos/:id', async (req, res) => {
  try {
    await db.collection(EventoModel.collection).doc(req.params.id).delete();
    res.sendStatus(204);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
