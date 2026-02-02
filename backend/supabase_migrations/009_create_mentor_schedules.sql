-- Create mentor schedules table for managing availability
CREATE TABLE IF NOT EXISTS mentor_schedules (
  id BIGSERIAL PRIMARY KEY,
  mentor_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Schedule details
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_sessions_per_day INTEGER DEFAULT 5,
  session_duration_minutes INTEGER DEFAULT 60,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  break_start TIME,
  break_end TIME,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT valid_time CHECK (start_time < end_time)
);

-- Create mentor unavailability table for blackout dates
CREATE TABLE IF NOT EXISTS mentor_unavailability (
  id BIGSERIAL PRIMARY KEY,
  mentor_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Unavailable period
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason VARCHAR(255),
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT valid_period CHECK (start_date <= end_date)
);

-- Update mentorships table to include time slot info
ALTER TABLE IF EXISTS mentorships 
ADD COLUMN IF NOT EXISTS time_slot_start TIME,
ADD COLUMN IF NOT EXISTS time_slot_end TIME;

-- Create indices for better performance
CREATE INDEX IF NOT EXISTS idx_mentor_schedules_mentor_id ON mentor_schedules(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentor_schedules_day ON mentor_schedules(day_of_week);
CREATE INDEX IF NOT EXISTS idx_mentor_unavailability_mentor_id ON mentor_unavailability(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentor_unavailability_dates ON mentor_unavailability(start_date, end_date);

-- RLS Policies for mentor_schedules
ALTER TABLE mentor_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mentors can view their own schedules"
  ON mentor_schedules FOR SELECT
  USING (auth.uid()::text::INTEGER = mentor_id OR 
         EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text::INTEGER AND role = 'admin'));

CREATE POLICY "Mentors can update their own schedules"
  ON mentor_schedules FOR UPDATE
  USING (auth.uid()::text::INTEGER = mentor_id);

CREATE POLICY "Mentors can insert their own schedules"
  ON mentor_schedules FOR INSERT
  WITH CHECK (auth.uid()::text::INTEGER = mentor_id);

-- RLS Policies for mentor_unavailability
ALTER TABLE mentor_unavailability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mentors can view their own unavailability"
  ON mentor_unavailability FOR SELECT
  USING (auth.uid()::text::INTEGER = mentor_id OR 
         EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text::INTEGER AND role = 'admin'));

CREATE POLICY "Mentors can manage their own unavailability"
  ON mentor_unavailability FOR ALL
  USING (auth.uid()::text::INTEGER = mentor_id);
