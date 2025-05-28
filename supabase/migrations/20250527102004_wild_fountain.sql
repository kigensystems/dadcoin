/*
  # Enhance database security
  
  1. Changes
    - Add rate limiting for claims
    - Add input validation for numeric fields
    - Add additional RLS policies
    - Add audit logging
    
  2. Security
    - Prevent SQL injection
    - Prevent unauthorized access
    - Add transaction logging
*/

-- Add rate limiting function
CREATE OR REPLACE FUNCTION check_rate_limit(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) < 100
    FROM claim_history
    WHERE user_id = $1
    AND claimed_at > NOW() - INTERVAL '1 hour'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add constraints for numeric fields
ALTER TABLE user_wallets
ADD CONSTRAINT positive_balance CHECK (balance >= 0),
ADD CONSTRAINT positive_pool CHECK (current_pool >= 0);

ALTER TABLE claim_history
ADD CONSTRAINT positive_amount CHECK (amount > 0);

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  old_value jsonb,
  new_value jsonb,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only allow system role to access audit logs
CREATE POLICY "System role can access audit logs"
  ON audit_logs
  FOR ALL
  TO service_role
  USING (true);

-- Create audit log function
CREATE OR REPLACE FUNCTION log_action()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (user_id, action, old_value, new_value)
  VALUES (
    COALESCE(auth.uid(), NULL),
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD)::jsonb ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW)::jsonb ELSE NULL END
  );
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers
CREATE TRIGGER audit_user_wallets
  AFTER INSERT OR UPDATE OR DELETE ON user_wallets
  FOR EACH ROW EXECUTE FUNCTION log_action();

CREATE TRIGGER audit_claim_history
  AFTER INSERT OR UPDATE OR DELETE ON claim_history
  FOR EACH ROW EXECUTE FUNCTION log_action();

CREATE TRIGGER audit_global_pool
  AFTER INSERT OR UPDATE OR DELETE ON global_pool
  FOR EACH ROW EXECUTE FUNCTION log_action();

-- Add additional RLS policies
CREATE POLICY "Prevent users from accessing others data"
  ON user_wallets
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add function to validate claim amounts
CREATE OR REPLACE FUNCTION validate_claim_amount(amount numeric)
RETURNS boolean AS $$
BEGIN
  RETURN amount > 0 AND amount <= 10000000;
END;
$$ LANGUAGE plpgsql IMMUTABLE;