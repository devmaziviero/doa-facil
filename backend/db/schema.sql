create extension if not exists pgcrypto;

create table if not exists doacoes (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  categoria text not null,
  estado text not null,
  cidade text not null,
  contato text not null,
  imagens_urls text[] not null default '{}',
  status text not null default 'disponivel' check (status in ('disponivel', 'reservada', 'retirada')),
  codigo_gerenciamento text not null,
  criado_em timestamptz not null default now()
);

create index if not exists idx_doacoes_status on doacoes (status);
create index if not exists idx_doacoes_estado on doacoes (estado);
create index if not exists idx_doacoes_cidade on doacoes (cidade);
create index if not exists idx_doacoes_categoria on doacoes (categoria);

-- Storage: bucket publico para as fotos das doacoes
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('imagens', 'imagens', true, 5242880, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif'];

drop policy if exists "Leitura publica imagens" on storage.objects;
create policy "Leitura publica imagens" on storage.objects
  for select to public using (bucket_id = 'imagens');

drop policy if exists "Upload publico imagens" on storage.objects;
create policy "Upload publico imagens" on storage.objects
  for insert to public with check (bucket_id = 'imagens');
