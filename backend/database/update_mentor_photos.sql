-- Actualizar fotos de mentores con nombres correctos

-- Jeremias (id=2) debe usar Jeremias.jpeg
UPDATE public.mentors
SET image_url = 'Jeremias.jpeg'
WHERE id = 2;

-- Joel Pasapera Pinto (id=4) debe usar Joel.jpeg  
UPDATE public.mentors
SET image_url = 'Joel.jpeg'
WHERE id = 4;

-- Verificar actualización
SELECT id, name, image_url FROM public.mentors ORDER BY id;
