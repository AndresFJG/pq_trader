
// Aquí deberías hacer la consulta a la base de datos para obtener los mentores
// Ejemplo (pseudo-código):
// export const getMentors = async (language: string) => {
//   const response = await fetch('/api/mentors?lang=' + language);
//   return await response.json();
// }

export const getMentors = async (): Promise<any[]> => {
  const res = await fetch('/api/mentors', { cache: 'no-store' });
  if (!res.ok) throw new Error('No se pudieron obtener los mentores');
  return res.json();
};

export const getMentorById = async (id: string) => {
  const mentors = await getMentors();
  return mentors.find((m: any) => m.id === id);
};
