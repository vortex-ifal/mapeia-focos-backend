INSERT INTO "occurrence_events" ("key", "description")
VALUES
  ('occurrence_archived', 'Ocorrência arquivada pela gestão'),
  ('occurrence_restored', 'Ocorrência restaurada pela gestão')
ON CONFLICT ("key") DO NOTHING;