import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import ws from "ws";

// Node 20 nao tem WebSocket nativo, e o supabase-js sempre inicializa um
// cliente de Realtime internamente mesmo so usando Storage — sem isso o
// createClient() lanca erro na hora de subir o servidor.
const supabase = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_PUBLISHABLE_KEY ?? "",
  { realtime: { transport: ws as any } }
);

const BUCKET = "imagens";

export async function enviarImagem(arquivo: Express.Multer.File): Promise<string> {
  const extensao = arquivo.originalname.split(".").pop()?.toLowerCase() ?? "jpg";
  const nomeArquivo = `${randomUUID()}.${extensao}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(nomeArquivo, arquivo.buffer, { contentType: arquivo.mimetype });

  if (error) {
    throw new Error(`Falha ao enviar imagem: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(nomeArquivo);
  return data.publicUrl;
}
