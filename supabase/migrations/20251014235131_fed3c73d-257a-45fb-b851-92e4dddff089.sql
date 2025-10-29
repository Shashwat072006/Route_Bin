-- Fix function search path security warning
DROP TRIGGER IF EXISTS update_bins_timestamp_trigger ON public.bins;
DROP FUNCTION IF EXISTS public.update_bins_timestamp() CASCADE;

CREATE OR REPLACE FUNCTION public.update_bins_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public, pg_temp;

-- Recreate the trigger
CREATE TRIGGER update_bins_timestamp_trigger
BEFORE UPDATE ON public.bins
FOR EACH ROW
EXECUTE FUNCTION public.update_bins_timestamp();