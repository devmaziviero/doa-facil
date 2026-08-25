create extension if not exists pgcrypto;

create table if not exists doacoes (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  categoria text not null,
  estado text not null,
  cidade text not null,
  contato text not null,
  status text not null default 'disponivel' check (status in ('disponivel', 'reservada', 'retirada')),
  codigo_gerenciamento text not null,
  criado_em timestamptz not null default now()
);

create index if not exists idx_doacoes_status on doacoes (status);
create index if not exists idx_doacoes_estado on doacoes (estado);
create index if not exists idx_doacoes_cidade on doacoes (cidade);
create index if not exists idx_doacoes_categoria on doacoes (categoria);
