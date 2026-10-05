-- ============================================================
-- SEED: dados fictícios para Front-end e QA (T05)
-- Região alvo: Maceió/AL (lat -9.72..-9.50 / lon -35.80..-35.69)
-- Status do DER:  pending = "Aguardando Triagem"
--                 assigned = "Em Atendimento"
-- ============================================================

-- Trava de segurança: só roda em banco vazio
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM users) OR EXISTS (SELECT 1 FROM occurrences) THEN
    RAISE EXCEPTION 'Banco já populado. Rode "pnpm db:truncate" antes de rodar o seed de novo.';
END IF;
END $$;

-- Helper temporário (some ao fechar a sessão): gera UUIDs fixos e legíveis
-- a = users, b = locations, c = occurrences, d = properties
CREATE FUNCTION pg_temp.uid(prefix text, n int) RETURNS uuid
LANGUAGE sql IMMUTABLE STRICT AS $$
SELECT (prefix || '0000000-0000-0000-0000-' || lpad(n::text, 12, '0'))::uuid
$$;

-- ------------------------------------------------------------
-- USERS (1 gestor, 2 agentes, 2 cidadãos)
-- password_hash é só um texto fictício: NÃO serve para login
-- ------------------------------------------------------------
INSERT INTO users (id, name, cpf, email, password_hash, role) VALUES
                                                                  (pg_temp.uid('a',1), 'Marcos Gestor',   '00000000001', 'gestor@mapeia.test',  '$2b$10$fakehashfakehashfakehashfakehashfakehashfakehashfake', 'manager'),
                                                                  (pg_temp.uid('a',2), 'Ana Agente',      '00000000002', 'ana@mapeia.test',     '$2b$10$fakehashfakehashfakehashfakehashfakehashfakehashfake', 'agent'),
                                                                  (pg_temp.uid('a',3), 'Carlos Agente',   '00000000003', 'carlos@mapeia.test',  '$2b$10$fakehashfakehashfakehashfakehashfakehashfakehashfake', 'agent'),
                                                                  (pg_temp.uid('a',4), 'Beatriz Cidadã',  '00000000004', 'beatriz@mapeia.test', '$2b$10$fakehashfakehashfakehashfakehashfakehashfakehashfake', 'citizen'),
                                                                  (pg_temp.uid('a',5), 'João Cidadão',    '00000000005', 'joao@mapeia.test',    '$2b$10$fakehashfakehashfakehashfakehashfakehashfakehashfake', 'citizen');

-- ------------------------------------------------------------
-- LOCATIONS (15, uma por ocorrência)
-- ------------------------------------------------------------
INSERT INTO locations (id, latitude, longitude, address, neighborhood, city, state, source)
SELECT pg_temp.uid('b', n), lat, lon, addr, neigh, 'Maceió', 'AL', src::location_source
FROM (VALUES
          (1,  -9.665900, -35.735000, 'Rua do Comércio, 120',        'Centro',               'gps'),
          (2,  -9.659400, -35.703800, 'Rua das Palmeiras, 45',       'Ponta Verde',          'gps'),
          (3,  -9.667200, -35.713500, 'Av. Beira Mar, 310',          'Pajuçara',             'gps'),
          (4,  -9.645800, -35.708200, 'Rua dos Coqueiros, 88',       'Jatiúca',              'manual'),
          (5,  -9.649900, -35.738500, 'Rua da Paz, 230',             'Farol',                'gps'),
          (6,  -9.621700, -35.731900, 'Rua das Acácias, 15',         'Gruta de Lourdes',     'gps'),
          (7,  -9.676000, -35.724500, 'Rua Nova, 67',                'Poço',                 'gps'),
          (8,  -9.670100, -35.727800, 'Rua do Porto, 9',             'Jaraguá',              'gps'),
          (9,  -9.630900, -35.713200, 'Travessa Esperança, 12',      'Cruz das Almas',       'manual'),
          (10, -9.639500, -35.725900, 'Rua Santa Luzia, 301',        'Jacintinho',           'gps'),
          (11, -9.563400, -35.717800, 'Rua A, 500',                  'Benedito Bentes',      'gps'),
          (12, -9.578300, -35.762400, 'Rua das Flores, 74',          'Tabuleiro do Martins', 'manual'),
          (13, -9.640100, -35.700500, 'Rua do Sol, 140',             'Mangabeiras',          'gps'),
          (14, -9.680700, -35.742300, 'Av. Principal, 1020',         'Ponta Grossa',         'gps'),
          (15, -9.688900, -35.748800, 'Rua São José, 33',            'Bebedouro',            'gps')
     ) AS t(n, lat, lon, addr, neigh, src);

-- ------------------------------------------------------------
-- PROPERTIES (3, opcional nas ocorrências)
-- ------------------------------------------------------------
INSERT INTO properties (id, address, neighborhood, city, state, complement, latitude, longitude) VALUES
                                                                                                     (pg_temp.uid('d',1), 'Rua das Acácias, 15',   'Gruta de Lourdes', 'Maceió', 'AL', 'Casa dos fundos', -9.621700, -35.731900),
                                                                                                     (pg_temp.uid('d',2), 'Rua do Sol, 140',       'Mangabeiras',      'Maceió', 'AL', 'Casa 2',          -9.640100, -35.700500),
                                                                                                     (pg_temp.uid('d',3), 'Av. Principal, 1020',   'Ponta Grossa',     'Maceió', 'AL', 'Borracharia',     -9.680700, -35.742300);

-- ------------------------------------------------------------
-- OCCURRENCES (15)
-- 5 pending | 2 validated | 2 discarded | 3 assigned | 1 inspected | 2 resolved
-- u = usuário que reportou (NULL = anônima) | p = imóvel | d = criada há N dias
-- ------------------------------------------------------------
INSERT INTO occurrences (id, description, status, is_anonymous, reported_by_user_id, location_id, property_id, created_at, updated_at)
SELECT pg_temp.uid('c', n), descr, status::occurrence_status, anon,
       pg_temp.uid('a', u), pg_temp.uid('b', n), pg_temp.uid('d', p),
       now() - make_interval(days => d), now() - make_interval(days => d)
FROM (VALUES
          (1,  'Pneus velhos acumulando água em terreno baldio',               'pending',   true,  NULL, NULL, 1),
          (2,  'Caixa-d''água sem tampa no quintal de casa abandonada',         'pending',   false, 4,    NULL, 2),
          (3,  'Garrafas e baldes com água parada atrás de oficina',           'pending',   true,  NULL, NULL, 2),
          (4,  'Piscina sem manutenção com água esverdeada',                   'pending',   true,  NULL, NULL, 3),
          (5,  'Calha entupida com água acumulada em prédio comercial',        'pending',   false, 5,    NULL, 4),
          (6,  'Tonéis abertos em quintal, com larvas visíveis',               'validated', true,  NULL, 1,    5),
          (7,  'Vasos com pratinhos cheios de água em área comum',             'validated', false, 4,    NULL, 6),
          (8,  'Poça de chuva em calçada, sem recipiente',                     'discarded', true,  NULL, NULL, 7),
          (9,  'Denúncia duplicada do mesmo terreno',                          'discarded', true,  NULL, NULL, 8),
          (10, 'Lixo acumulado com latas e copos cheios de água',              'assigned',  false, 5,    1,    9),
          (11, 'Entulho de obra com recipientes expostos à chuva',             'assigned',  true,  NULL, NULL, 10),
          (12, 'Fossa aberta sem tampa próxima a residências',                 'assigned',  true,  NULL, NULL, 10),
          (13, 'Caixa-d''água descoberta em casa fechada',                      'inspected', false, 4,    2,    12),
          (14, 'Pneus empilhados em borracharia',                              'resolved',  true,  NULL, 3,    15),
          (15, 'Reservatório de ar-condicionado com água parada',              'resolved',  false, 5,    NULL, 18)
     ) AS t(n, descr, status, anon, u, p, d);

-- ------------------------------------------------------------
-- MEDIA: 1 foto por ocorrência + extras (URLs fictícias de placeholder)
-- ------------------------------------------------------------
INSERT INTO media (occurrence_id, url, type, mime_type, file_size_bytes, is_public)
SELECT pg_temp.uid('c', n),
       'https://picsum.photos/seed/foco-' || n || '/800/600',
       'photo', 'image/jpeg', 180000 + n * 7000, (n % 3 <> 0)
FROM generate_series(1, 15) AS n;

INSERT INTO media (occurrence_id, url, type, mime_type, file_size_bytes, is_public)
SELECT pg_temp.uid('c', n), url, type::media_type, mime, size, pub
FROM (VALUES
          (2,  'https://picsum.photos/seed/foco-2b/800/600',  'photo', 'image/jpeg', 210000,  true),
          (6,  'https://picsum.photos/seed/foco-6b/800/600',  'photo', 'image/jpeg', 195000,  true),
          (10, 'https://picsum.photos/seed/foco-10b/800/600', 'photo', 'image/jpeg', 230000,  false),
          (12, 'https://example.com/videos/foco-12.mp4',      'video', 'video/mp4',  3500000, false),
          (14, 'https://example.com/videos/foco-14.mp4',      'video', 'video/mp4',  4200000, true)
     ) AS t(n, url, type, mime, size, pub);

-- ------------------------------------------------------------
-- TRIAGE (ocorrências 6 a 15, decidida pelo gestor)
-- ------------------------------------------------------------
INSERT INTO triage (occurrence_id, manager_id, decision, notes, decided_at)
SELECT pg_temp.uid('c', t.n), pg_temp.uid('a', 1), t.decision::triage_decision, t.notes,
       o.created_at + interval '1 day'
FROM (VALUES
          (6,  'validated', 'Foco confirmado pela foto.'),
          (7,  'validated', 'Denúncia procedente.'),
          (8,  'discarded', 'Sem recipiente, não é criadouro.'),
          (9,  'discarded', 'Duplicada de outra denúncia.'),
          (10, 'validated', 'Alto risco, priorizar.'),
          (11, 'validated', 'Foco confirmado.'),
          (12, 'validated', 'Foco confirmado.'),
          (13, 'validated', 'Foco confirmado.'),
          (14, 'validated', 'Foco confirmado.'),
          (15, 'validated', 'Foco confirmado.')
     ) AS t(n, decision, notes)
         JOIN occurrences o ON o.id = pg_temp.uid('c', t.n);

-- ------------------------------------------------------------
-- ASSIGNMENTS (ocorrências 10 a 15)
-- ------------------------------------------------------------
INSERT INTO assignments (occurrence_id, agent_id, assigned_by_manager_id, assigned_at, notes)
SELECT pg_temp.uid('c', t.n), pg_temp.uid('a', t.agent), pg_temp.uid('a', 1),
       o.created_at + interval '2 days', t.notes
FROM (VALUES
          (10, 2, 'Levar larvicida.'),
          (11, 3, NULL),
          (12, 2, 'Levar equipamento de proteção.'),
          (13, 2, NULL),
          (14, 3, NULL),
          (15, 2, NULL)
     ) AS t(n, agent, notes)
         JOIN occurrences o ON o.id = pg_temp.uid('c', t.n);

-- ------------------------------------------------------------
-- INSPECTIONS (ocorrências 13 a 15)
-- ------------------------------------------------------------
INSERT INTO inspections (occurrence_id, agent_id, result, notes, pending_return, inspected_at)
SELECT pg_temp.uid('c', t.n), pg_temp.uid('a', t.agent), t.result::inspection_result,
    t.notes, t.pending, o.created_at + interval '4 days'
FROM (VALUES
          (13, 2, 'property_closed',   'Imóvel fechado, ninguém atendeu.', true),
          (14, 3, 'focus_eliminated',  'Pneus removidos e recolhidos.',    false),
          (15, 2, 'larvicide_applied', 'Larvicida aplicado no reservatório.', false)
     ) AS t(n, agent, result, notes, pending)
         JOIN occurrences o ON o.id = pg_temp.uid('c', t.n);

-- ------------------------------------------------------------
-- STATUS_HISTORY
-- ------------------------------------------------------------
-- criação (NULL -> pending); NULL em changed_by = cidadão anônimo
INSERT INTO status_history (occurrence_id, changed_by_user_id, previous_status, new_status, reason, changed_at)
SELECT id, reported_by_user_id, NULL, 'pending', 'Ocorrência registrada', created_at
FROM occurrences;

-- transições (d = dias depois da criação)
INSERT INTO status_history (occurrence_id, changed_by_user_id, previous_status, new_status, reason, changed_at)
SELECT pg_temp.uid('c', t.n), pg_temp.uid('a', t.by), t.prev::occurrence_status,
    t.new::occurrence_status, t.reason, o.created_at + make_interval(days => t.d)
FROM (VALUES
          (6,  1, 'pending',   'validated', 'Triagem: denúncia válida',    1),
          (7,  1, 'pending',   'validated', 'Triagem: denúncia válida',    1),
          (8,  1, 'pending',   'discarded', 'Triagem: não é criadouro',    1),
          (9,  1, 'pending',   'discarded', 'Triagem: denúncia duplicada', 1),
          (10, 1, 'pending',   'validated', 'Triagem: denúncia válida',    1),
          (11, 1, 'pending',   'validated', 'Triagem: denúncia válida',    1),
          (12, 1, 'pending',   'validated', 'Triagem: denúncia válida',    1),
          (13, 1, 'pending',   'validated', 'Triagem: denúncia válida',    1),
          (14, 1, 'pending',   'validated', 'Triagem: denúncia válida',    1),
          (15, 1, 'pending',   'validated', 'Triagem: denúncia válida',    1),
          (10, 1, 'validated', 'assigned',  'Atribuída a agente',          2),
          (11, 1, 'validated', 'assigned',  'Atribuída a agente',          2),
          (12, 1, 'validated', 'assigned',  'Atribuída a agente',          2),
          (13, 1, 'validated', 'assigned',  'Atribuída a agente',          2),
          (14, 1, 'validated', 'assigned',  'Atribuída a agente',          2),
          (15, 1, 'validated', 'assigned',  'Atribuída a agente',          2),
          (13, 2, 'assigned',  'inspected', 'Vistoria realizada',          4),
          (14, 3, 'assigned',  'inspected', 'Vistoria realizada',          4),
          (15, 2, 'assigned',  'inspected', 'Vistoria realizada',          4),
          (14, 3, 'inspected', 'resolved',  'Foco eliminado',              5),
          (15, 2, 'inspected', 'resolved',  'Foco tratado com larvicida',  5)
     ) AS t(n, by, prev, new, reason, d)
         JOIN occurrences o ON o.id = pg_temp.uid('c', t.n);

-- ------------------------------------------------------------
-- NOTIFICATIONS
-- ------------------------------------------------------------
INSERT INTO notifications (recipient_user_id, occurrence_id, title, message, type, is_read, read_at)
SELECT pg_temp.uid('a', t.u), pg_temp.uid('c', t.n), t.title, t.msg, t.type::notification_type,
    t.is_read, CASE WHEN t.is_read THEN now() ELSE NULL END
FROM (VALUES
          (4, 7,  'Denúncia validada',     'Sua denúncia foi validada pela triagem.',            'status_update',     true),
          (5, 10, 'Agente designado',      'Um agente foi atribuído à sua denúncia.',            'assignment',        false),
          (4, 13, 'Resultado da vistoria', 'O imóvel estava fechado. Um retorno será agendado.', 'inspection_result', false),
          (5, 15, 'Denúncia resolvida',    'O foco foi tratado. Obrigado por colaborar!',        'status_update',     true),
          (2, 10, 'Nova atribuição',       'Você recebeu uma ocorrência para vistoria.',         'assignment',        false)
     ) AS t(u, n, title, msg, type, is_read);