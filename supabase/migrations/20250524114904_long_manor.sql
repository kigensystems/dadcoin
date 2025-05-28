/*
  # Reset global pool value

  1. Changes
    - Reset the global pool value back to 500,000
*/

UPDATE global_pool
SET value = 500000
WHERE id = 1;