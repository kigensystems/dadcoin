/*
  # Add jackpot constraints

  1. Changes
    - Add check constraint to ensure jackpot value stays between 500,000 and 10,000,000
    - Add trigger to enforce minimum value of 500,000
*/

ALTER TABLE jackpot
ADD CONSTRAINT jackpot_value_range 
CHECK (value >= 500000 AND value <= 10000000);

CREATE OR REPLACE FUNCTION enforce_min_jackpot()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.value < 500000 THEN
    NEW.value := 500000;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_min_jackpot_trigger
BEFORE INSERT OR UPDATE ON jackpot
FOR EACH ROW
EXECUTE FUNCTION enforce_min_jackpot();