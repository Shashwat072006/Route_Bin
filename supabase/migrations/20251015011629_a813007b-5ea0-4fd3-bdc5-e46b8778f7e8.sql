-- Update existing bins to Chennai locations
UPDATE public.bins SET 
  location = 'Marina Beach',
  latitude = 13.0499,
  longitude = 80.2824
WHERE location = 'Downtown Plaza';

UPDATE public.bins SET 
  location = 'T Nagar Market',
  latitude = 13.0418,
  longitude = 80.2341
WHERE location = 'Central Park North';

UPDATE public.bins SET 
  location = 'Anna Nagar',
  latitude = 13.0878,
  longitude = 80.2085
WHERE location = 'Times Square';

UPDATE public.bins SET 
  location = 'Mylapore Temple',
  latitude = 13.0339,
  longitude = 80.2677
WHERE location = 'Brooklyn Bridge';

UPDATE public.bins SET 
  location = 'Adyar Bus Depot',
  latitude = 13.0067,
  longitude = 80.2571
WHERE location = 'East Village Market';

UPDATE public.bins SET 
  location = 'Vadapalani Metro',
  latitude = 13.0524,
  longitude = 80.2120
WHERE location = 'Queens Plaza';