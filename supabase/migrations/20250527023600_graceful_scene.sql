/*
  # Add total claimed amount function
  
  1. New Functions
    - `get_total_claimed_amount`: Calculates the total sum of all claims
  
  2. Security
    - Function is accessible to authenticated users
*/

CREATE OR REPLACE FUNCTION get_total_claimed_amount()
RETURNS numeric
LANGUAGE sql
SECURITY definer
SET search_path = public
AS $$
  SELECT COALESCE(SUM(amount), 0)
  FROM claim_history;
$$;

-- Grant access to authenticated users
GRANT EXECUTE ON FUNCTION get_total_claimed_amount TO authenticated;