-- Cupos limitados para marketing de guerrilla (promos con cupos)
-- NULL = ilimitado · número = cupos restantes · 0 = agotado
ALTER TABLE plans ADD COLUMN IF NOT EXISTS slots_left integer;
COMMENT ON COLUMN plans.slots_left IS 'Cupos restantes. NULL = ilimitado; 0 = agotado.';

-- Resta atómica de 1 cupo y marca sold_out al llegar a 0.
-- Devuelve los cupos restantes (o NULL si era ilimitado / plan no encontrado).
CREATE OR REPLACE FUNCTION decrement_plan_slot(p_plan_name text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  remaining integer;
BEGIN
  UPDATE plans
     SET slots_left = GREATEST(slots_left - 1, 0),
         status = CASE WHEN slots_left - 1 <= 0 THEN 'sold_out' ELSE status END
   WHERE lower(name) = lower(p_plan_name)
     AND slots_left IS NOT NULL
  RETURNING slots_left INTO remaining;
  RETURN remaining;
END;
$$;
