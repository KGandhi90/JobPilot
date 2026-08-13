import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  let analytics = { total_calls: 0, successful_calls: 0, failed_calls: 0, calls: [] };
  
  try {
    const filePath = path.join(process.cwd(), '../backend/analytics.json');
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      analytics = JSON.parse(data);
    }
  } catch (error) {
    console.error("Failed to read analytics.json:", error);
  }

  return NextResponse.json(analytics);
}
