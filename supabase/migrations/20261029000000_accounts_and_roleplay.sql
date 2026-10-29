create table if not exists public.player_saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.player_saves enable row level security;

create policy "Players can read their own save"
  on public.player_saves for select
  using (auth.uid() = user_id);

create policy "Players can create their own save"
  on public.player_saves for insert
  with check (auth.uid() = user_id);

create policy "Players can update their own save"
  on public.player_saves for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists public.roleplay_sessions (
  id uuid primary key default gen_random_uuid(),
  invite_code text not null unique,
  creator_id uuid not null references auth.users(id) on delete cascade,
  creator_role text not null check (creator_role in ('student', 'tutor')),
  student_id uuid references auth.users(id) on delete set null,
  tutor_id uuid references auth.users(id) on delete set null,
  day_number integer not null check (day_number between 1 and 7),
  location_id text not null check (location_id in ('apartment', 'grocery', 'transit', 'cafe', 'community')),
  target_language text not null check (target_language in ('fr', 'es', 'it', 'en')),
  status text not null default 'waiting' check (status in ('waiting', 'active', 'closed')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '7 days',
  constraint roleplay_creator_is_participant check (
    (creator_role = 'student' and student_id = creator_id)
    or (creator_role = 'tutor' and tutor_id = creator_id)
  ),
  constraint roleplay_has_at_most_two_participants check (
    student_id is null or tutor_id is null or student_id <> tutor_id
  )
);

alter table public.roleplay_sessions enable row level security;

create policy "Participants can read their roleplay session"
  on public.roleplay_sessions for select
  using (auth.uid() = student_id or auth.uid() = tutor_id);

create policy "Authenticated users can create roleplay sessions"
  on public.roleplay_sessions for insert
  with check (
    auth.uid() = creator_id
    and (
      (creator_role = 'student' and student_id = auth.uid() and tutor_id is null)
      or (creator_role = 'tutor' and tutor_id = auth.uid() and student_id is null)
    )
  );

create table if not exists public.roleplay_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.roleplay_sessions(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 2000),
  input_mode text not null default 'text' check (input_mode in ('text', 'voice')),
  created_at timestamptz not null default now()
);

create index if not exists roleplay_messages_session_created_idx
  on public.roleplay_messages(session_id, created_at);

alter table public.roleplay_messages enable row level security;

create policy "Participants can read roleplay messages"
  on public.roleplay_messages for select
  using (
    exists (
      select 1 from public.roleplay_sessions s
      where s.id = session_id
        and (s.student_id = auth.uid() or s.tutor_id = auth.uid())
    )
  );

create policy "Participants can send roleplay messages"
  on public.roleplay_messages for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.roleplay_sessions s
      where s.id = session_id
        and s.status = 'active'
        and (s.student_id = auth.uid() or s.tutor_id = auth.uid())
    )
  );

create or replace function public.join_roleplay_session(p_invite_code text)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_session public.roleplay_sessions%rowtype;
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'Sign in before joining a roleplay.';
  end if;

  select * into v_session
  from public.roleplay_sessions
  where lower(invite_code) = lower(trim(p_invite_code))
    and status = 'waiting'
    and expires_at > now()
  for update;

  if not found then
    raise exception 'This invite code is invalid, expired, or already used.';
  end if;

  if v_session.creator_id = v_user_id then
    raise exception 'You cannot join your own invitation.';
  end if;

  if v_session.creator_role = 'student' and v_session.tutor_id is null then
    update public.roleplay_sessions
    set tutor_id = v_user_id, status = 'active'
    where id = v_session.id;
  elsif v_session.creator_role = 'tutor' and v_session.student_id is null then
    update public.roleplay_sessions
    set student_id = v_user_id, status = 'active'
    where id = v_session.id;
  else
    raise exception 'This roleplay already has both participants.';
  end if;

  return v_session.id;
end;
$$;

revoke all on function public.join_roleplay_session(text) from public;
grant execute on function public.join_roleplay_session(text) to authenticated;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'roleplay_messages'
  ) then
    alter publication supabase_realtime add table public.roleplay_messages;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'roleplay_sessions'
  ) then
    alter publication supabase_realtime add table public.roleplay_sessions;
  end if;
end;
$$;
