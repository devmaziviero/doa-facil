// Se o contato parecer um telefone brasileiro, gera um link wa.me pra
// abrir a conversa direto no WhatsApp. Se for e-mail ou texto livre,
// retorna null e a página mostra só o contato como texto mesmo.
export function linkWhatsApp(contato: string): string | null {
  const digitos = contato.replace(/\D/g, "");

  if (digitos.length < 10 || digitos.length > 13) return null;
  if (contato.includes("@")) return null;

  const numeroComPais = digitos.startsWith("55") ? digitos : `55${digitos}`;
  return `https://wa.me/${numeroComPais}`;
}
