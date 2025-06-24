import { SplindeTree } from './components/splinde-tree';

async function getData() {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.vercel.app'
    : 'http://localhost:3000';
    
  const res = await fetch(`${baseUrl}/api/data`, {
    cache: 'no-store' // Always fetch fresh data
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  
  return res.json();
}

export default async function Home() {
  const data = await getData();

  return (
    <main className="min-h-screen bg-background transition-colors">
      <SplindeTree initialData={data} />
    </main>
  );
}
