-- ============================================================
-- ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
-- ============================================================

ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "universities" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "study_programs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "career_targets" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "courses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "student_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "student_grades" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "career_weights" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "career_scores" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ai_recommendations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "job_recommendations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "university_admins" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "activity_logs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "notifications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "system_settings" ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- HELPER FUNCTIONS FOR ROLE CHECKS FROM JWT METADATA
-- ============================================================

CREATE OR REPLACE FUNCTION auth.jwt_role()
RETURNS text AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::json->>'role', '')::text;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION auth.user_id()
RETURNS uuid AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')::uuid;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- USERS TABLE
-- Users can read their own profile, admins can read all
CREATE POLICY "Users can read own data" ON "users"
  FOR SELECT USING (auth.user_id() = auth_id OR auth.jwt_role() = 'admin');

CREATE POLICY "Users can update own data" ON "users"
  FOR UPDATE USING (auth.user_id() = auth_id OR auth.jwt_role() = 'admin');

-- UNIVERSITIES TABLE
-- Read-only for authenticated users, full access for admins
CREATE POLICY "Anyone authenticated can view universities" ON "universities"
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access on universities" ON "universities"
  FOR ALL USING (auth.jwt_role() = 'admin');

-- STUDY PROGRAMS TABLE
CREATE POLICY "Anyone authenticated can view study programs" ON "study_programs"
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access on study programs" ON "study_programs"
  FOR ALL USING (auth.jwt_role() = 'admin');

-- CAREER TARGETS TABLE
CREATE POLICY "Anyone authenticated can view career targets" ON "career_targets"
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access on career targets" ON "career_targets"
  FOR ALL USING (auth.jwt_role() = 'admin');

-- COURSES TABLE
CREATE POLICY "Anyone authenticated can view courses" ON "courses"
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access on courses" ON "courses"
  FOR ALL USING (auth.jwt_role() = 'admin');

-- CAREER WEIGHTS TABLE
CREATE POLICY "Anyone authenticated can view career weights" ON "career_weights"
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access on career weights" ON "career_weights"
  FOR ALL USING (auth.jwt_role() = 'admin');

-- STUDENT PROFILES TABLE
-- Students can read/write their own profile, university admins and system admins can view
CREATE POLICY "Students can view/edit own profile" ON "student_profiles"
  FOR ALL USING (
    userId IN (SELECT id FROM "users" WHERE auth_id = auth.user_id())
    OR auth.jwt_role() = 'admin'
  );

CREATE POLICY "University admins can view profiles" ON "student_profiles"
  FOR SELECT USING (auth.jwt_role() = 'university');

-- STUDENT GRADES TABLE
-- Students can read/write their own grades, university admins can read/write for their university
CREATE POLICY "Students can view/edit own grades" ON "student_grades"
  FOR ALL USING (
    studentProfileId IN (
      SELECT id FROM "student_profiles"
      WHERE userId IN (SELECT id FROM "users" WHERE auth_id = auth.user_id())
    )
    OR auth.jwt_role() = 'admin'
  );

CREATE POLICY "University admins can view/edit grades" ON "student_grades"
  FOR ALL USING (auth.jwt_role() = 'university');

-- CAREER SCORES TABLE
CREATE POLICY "Students can view own career scores" ON "career_scores"
  FOR SELECT USING (
    studentProfileId IN (
      SELECT id FROM "student_profiles"
      WHERE userId IN (SELECT id FROM "users" WHERE auth_id = auth.user_id())
    )
    OR auth.jwt_role() = 'admin'
  );

CREATE POLICY "University admins can view career scores" ON "career_scores"
  FOR SELECT USING (auth.jwt_role() = 'university');

-- AI RECOMMENDATIONS TABLE
CREATE POLICY "Students can view own AI recommendations" ON "ai_recommendations"
  FOR SELECT USING (
    studentProfileId IN (
      SELECT id FROM "student_profiles"
      WHERE userId IN (SELECT id FROM "users" WHERE auth_id = auth.user_id())
    )
    OR auth.jwt_role() = 'admin'
  );

CREATE POLICY "University admins can view AI recommendations" ON "ai_recommendations"
  FOR SELECT USING (auth.jwt_role() = 'university');

-- JOB RECOMMENDATIONS TABLE
CREATE POLICY "Students can view own job recommendations" ON "job_recommendations"
  FOR SELECT USING (
    studentProfileId IN (
      SELECT id FROM "student_profiles"
      WHERE userId IN (SELECT id FROM "users" WHERE auth_id = auth.user_id())
    )
    OR auth.jwt_role() = 'admin'
  );

-- UNIVERSITY ADMINS TABLE
CREATE POLICY "University admins can view/update own data" ON "university_admins"
  FOR ALL USING (
    userId IN (SELECT id FROM "users" WHERE auth_id = auth.user_id())
    OR auth.jwt_role() = 'admin'
  );

-- ACTIVITY LOGS TABLE
-- Read-only for admins, append-only for authenticated users
CREATE POLICY "Authenticated users can insert activity logs" ON "activity_logs"
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can view activity logs" ON "activity_logs"
  FOR SELECT USING (auth.jwt_role() = 'admin');

-- NOTIFICATIONS TABLE
-- Users can view/update (mark read) their own notifications
CREATE POLICY "Users can manage own notifications" ON "notifications"
  FOR ALL USING (
    userId IN (SELECT id FROM "users" WHERE auth_id = auth.user_id())
    OR auth.jwt_role() = 'admin'
  );

-- SYSTEM SETTINGS TABLE
-- Read-only for authenticated, write for admin
CREATE POLICY "Anyone authenticated can view system settings" ON "system_settings"
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage system settings" ON "system_settings"
  FOR ALL USING (auth.jwt_role() = 'admin');
