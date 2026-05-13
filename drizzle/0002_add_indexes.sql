-- Migration: Add performance indexes
-- Prioritized based on actual query patterns in the application

-- 1. Soft-delete filter — used in EVERY query
CREATE INDEX IF NOT EXISTS idx_members_deleted_at ON "members" ("deleted_at");

-- 2. Slug lookup — used for public profile pages & tree node clicks
CREATE INDEX IF NOT EXISTS idx_members_slug ON "members" ("slug");

-- 3. Generation filter & sort — used in directory filtering and tree ordering
CREATE INDEX IF NOT EXISTS idx_members_generation ON "members" ("generation");

-- 4. Relationship lookups — heavily used for tree edges & member detail queries
CREATE INDEX IF NOT EXISTS idx_relationships_member_id ON "relationships" ("member_id");
CREATE INDEX IF NOT EXISTS idx_relationships_related_member_id ON "relationships" ("related_member_id");

-- 5. Composite index for common relationship query pattern
--    "member_id + relation_type" used in getMemberWithRelations
CREATE INDEX IF NOT EXISTS idx_relationships_member_type ON "relationships" ("member_id", "relation_type");

-- 6. Composite index for reverse relationship lookups (children queries)
--    "related_member_id + relation_type" used for finding children/parents
CREATE INDEX IF NOT EXISTS idx_relationships_related_type ON "relationships" ("related_member_id", "relation_type");
