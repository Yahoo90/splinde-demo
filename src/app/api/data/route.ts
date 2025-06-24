import { NextResponse } from 'next/server';
import { demoData } from '@/lib/demoData';

export async function GET() {
  return NextResponse.json(demoData);
}
