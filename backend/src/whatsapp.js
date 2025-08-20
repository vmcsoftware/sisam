// Serviço para envio de WhatsApp via API (exemplo com Z-API)
import fetch from 'node-fetch';

export async function enviarWhatsapp(numero, mensagem) {
  const ZAPI_URL = process.env.ZAPI_URL; // Ex: 'https://api.z-api.io/instances/SEU_ID/token/SEU_TOKEN/v2/send-message'
  if (!ZAPI_URL) throw new Error('ZAPI_URL não configurada');

  const body = {
    phone: numero,
    message: mensagem,
  };

  const res = await fetch(ZAPI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error('Erro ao enviar WhatsApp: ' + error);
  }

  return await res.json();
}
