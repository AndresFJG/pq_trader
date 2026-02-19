import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Llamar al backend Express en Railway
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://pqtrader-backend.up.railway.app';
    
    const response = await fetch(`${backendUrl}/api/mentors`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Backend returned error:', response.status);
      return NextResponse.json(
        { success: false, error: 'Error al obtener mentores del backend' }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // El backend ya devuelve formattedMentors en data.data
    if (data.success && data.data) {
      return NextResponse.json(data.data);
    }

    return NextResponse.json([]);
  } catch (err: unknown) {
    console.error('Exception calling backend:', err);
    return NextResponse.json(
      { success: false, error: 'Error al conectar con el backend' }, 
      { status: 500 }
    );
  }
}
