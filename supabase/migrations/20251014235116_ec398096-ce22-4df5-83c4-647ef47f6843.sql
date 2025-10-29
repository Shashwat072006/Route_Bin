-- Create bins table for waste management
CREATE TABLE public.bins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  fill_level INTEGER NOT NULL DEFAULT 0 CHECK (fill_level >= 0 AND fill_level <= 100),
  status TEXT NOT NULL DEFAULT 'operational' CHECK (status IN ('operational', 'maintenance', 'full', 'offline')),
  capacity INTEGER NOT NULL DEFAULT 100,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_collection TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bins ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a monitoring system)
CREATE POLICY "Anyone can view bins"
ON public.bins
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert bins"
ON public.bins
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update bins"
ON public.bins
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete bins"
ON public.bins
FOR DELETE
USING (true);

-- Create function to update last_updated timestamp
CREATE OR REPLACE FUNCTION public.update_bins_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_bins_timestamp_trigger
BEFORE UPDATE ON public.bins
FOR EACH ROW
EXECUTE FUNCTION public.update_bins_timestamp();

-- Enable realtime for bins table
ALTER TABLE public.bins REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bins;

-- Insert sample bins with locations around a city center
INSERT INTO public.bins (location, latitude, longitude, fill_level, status, last_collection) VALUES
  ('Downtown Plaza', 40.7580, -73.9855, 35, 'operational', now() - interval '2 hours'),
  ('Central Park North', 40.7829, -73.9654, 67, 'operational', now() - interval '5 hours'),
  ('Times Square', 40.7580, -73.9855, 89, 'full', now() - interval '8 hours'),
  ('Brooklyn Bridge', 40.7061, -73.9969, 45, 'operational', now() - interval '3 hours'),
  ('East Village Market', 40.7265, -73.9815, 72, 'operational', now() - interval '6 hours'),
  ('Queens Plaza', 40.7505, -73.9370, 23, 'operational', now() - interval '1 hour');