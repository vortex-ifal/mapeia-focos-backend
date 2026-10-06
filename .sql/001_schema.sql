-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE user_role           AS ENUM ('citizen', 'agent', 'manager');
CREATE TYPE occurrence_status   AS ENUM ('pending','validated','discarded','assigned','inspected','resolved');
CREATE TYPE location_source     AS ENUM ('gps', 'manual');
CREATE TYPE media_type          AS ENUM ('photo', 'video');
CREATE TYPE triage_decision     AS ENUM ('validated', 'discarded');
CREATE TYPE inspection_result   AS ENUM ('focus_eliminated','larvicide_applied','property_closed','resident_refused','abandoned_property');
CREATE TYPE notification_type   AS ENUM ('status_update','assignment','inspection_result','reminder');

-- ============================================
-- USERS
-- ============================================
CREATE TABLE users (
                       id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       name           VARCHAR(150) NOT NULL,
                       cpf            VARCHAR(11)  UNIQUE,
                       email          VARCHAR(255) NOT NULL UNIQUE,
                       password_hash  VARCHAR(255) NOT NULL,
                       role           user_role    NOT NULL DEFAULT 'citizen',
                       is_active      BOOLEAN      NOT NULL DEFAULT TRUE,
                       created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
                       updated_at     TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- ============================================
-- LOCATIONS
-- ============================================
CREATE TABLE locations (
                           id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                           latitude      NUMERIC(9,6) NOT NULL CHECK (latitude  BETWEEN -90  AND 90),
                           longitude     NUMERIC(9,6) NOT NULL CHECK (longitude BETWEEN -180 AND 180),
                           address       VARCHAR(255),
                           neighborhood  VARCHAR(120),
                           city          VARCHAR(120),
                           state         CHAR(2),
                           source        location_source NOT NULL DEFAULT 'gps',
                           created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- PROPERTIES (uso futuro - RF17)
-- ============================================
CREATE TABLE properties (
                            id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                            address       VARCHAR(255) NOT NULL,
                            neighborhood  VARCHAR(120),
                            city          VARCHAR(120),
                            state         CHAR(2),
                            complement    VARCHAR(255),
                            latitude      NUMERIC(9,6) CHECK (latitude  BETWEEN -90  AND 90),
                            longitude     NUMERIC(9,6) CHECK (longitude BETWEEN -180 AND 180),
                            created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
                            updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- OCCURRENCES  (FK de usuário NULLABLE = registro anônimo)
-- ============================================
CREATE TABLE occurrences (
                             id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                             description          TEXT NOT NULL,
                             status               occurrence_status NOT NULL DEFAULT 'pending',
                             is_anonymous         BOOLEAN NOT NULL DEFAULT TRUE,
                             reported_by_user_id  UUID REFERENCES users(id)      ON DELETE SET NULL,
                             location_id          UUID NOT NULL UNIQUE
                                 REFERENCES locations(id)       ON DELETE RESTRICT,
                             property_id          UUID REFERENCES properties(id) ON DELETE SET NULL,
                             created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
                             updated_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- anônima => não pode ter usuário vinculado
                             CONSTRAINT chk_anonymous_no_user
                                 CHECK (NOT is_anonymous OR reported_by_user_id IS NULL)
);

-- ============================================
-- MEDIA
-- ============================================
CREATE TABLE media (
                       id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       occurrence_id    UUID NOT NULL REFERENCES occurrences(id) ON DELETE CASCADE,
                       url              TEXT NOT NULL,
                       type             media_type NOT NULL DEFAULT 'photo',
                       mime_type        VARCHAR(100),
                       file_size_bytes  BIGINT CHECK (file_size_bytes >= 0),
                       is_public        BOOLEAN NOT NULL DEFAULT FALSE,
                       uploaded_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TRIAGE (0..1 por ocorrência)
-- ============================================
CREATE TABLE triage (
                        id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        occurrence_id  UUID NOT NULL UNIQUE REFERENCES occurrences(id) ON DELETE CASCADE,
                        manager_id     UUID NOT NULL REFERENCES users(id),
                        decision       triage_decision NOT NULL,
                        notes          TEXT,
                        decided_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- ASSIGNMENTS
-- ============================================
CREATE TABLE assignments (
                             id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                             occurrence_id             UUID NOT NULL REFERENCES occurrences(id) ON DELETE CASCADE,
                             agent_id                  UUID NOT NULL REFERENCES users(id),
                             assigned_by_manager_id    UUID NOT NULL REFERENCES users(id),
                             assigned_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
                             notes                     TEXT
);

-- ============================================
-- INSPECTIONS
-- ============================================
CREATE TABLE inspections (
                             id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                             occurrence_id   UUID NOT NULL REFERENCES occurrences(id) ON DELETE CASCADE,
                             agent_id        UUID NOT NULL REFERENCES users(id),
                             result          inspection_result NOT NULL,
                             notes           TEXT,
                             pending_return  BOOLEAN NOT NULL DEFAULT FALSE,
                             inspected_at    TIMESTAMPTZ NOT NULL,
                             created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- STATUS_HISTORY
-- ============================================
CREATE TABLE status_history (
                                id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                occurrence_id       UUID NOT NULL REFERENCES occurrences(id) ON DELETE CASCADE,
                                changed_by_user_id  UUID REFERENCES users(id) ON DELETE SET NULL,  -- NULL = sistema/anônimo
                                previous_status     occurrence_status,                              -- NULL na criação
                                new_status          occurrence_status NOT NULL,
                                reason              TEXT,
                                changed_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- NOTIFICATIONS
-- ============================================
CREATE TABLE notifications (
                               id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                               recipient_user_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                               occurrence_id      UUID REFERENCES occurrences(id) ON DELETE CASCADE,
                               title              VARCHAR(150) NOT NULL,
                               message            TEXT NOT NULL,
                               type               notification_type NOT NULL,
                               is_read            BOOLEAN NOT NULL DEFAULT FALSE,
                               sent_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
                               read_at            TIMESTAMPTZ
);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX idx_occurrences_status       ON occurrences (status);
CREATE INDEX idx_occurrences_created_at   ON occurrences (created_at DESC);
CREATE INDEX idx_occurrences_user         ON occurrences (reported_by_user_id);
CREATE INDEX idx_occurrences_property     ON occurrences (property_id);
CREATE INDEX idx_locations_coord          ON locations (latitude, longitude);
CREATE INDEX idx_media_occurrence         ON media (occurrence_id);
CREATE INDEX idx_assignments_occurrence   ON assignments (occurrence_id);
CREATE INDEX idx_assignments_agent        ON assignments (agent_id);
CREATE INDEX idx_inspections_occurrence   ON inspections (occurrence_id);
CREATE INDEX idx_status_history_occ       ON status_history (occurrence_id, changed_at DESC);
CREATE INDEX idx_notifications_recipient  ON notifications (recipient_user_id, is_read);

-- ============================================
-- TRIGGER updated_at
-- ============================================
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at       BEFORE UPDATE ON users       FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_occurrences_updated_at BEFORE UPDATE ON occurrences FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_properties_updated_at  BEFORE UPDATE ON properties  FOR EACH ROW EXECUTE FUNCTION set_updated_at();