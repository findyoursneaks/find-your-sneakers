import { NextResponse } from 'next/server';
import { addNewsletterSubscriber } from '../../../lib/data';

export async function POST(request: Request){
  try{
    const body=await request.json();
    const email=String(body?.email||'').trim().toLowerCase();
    if(!email || !email.includes('@') || email.length>320) return NextResponse.json({error:'Invalid email'},{status:400});
    await addNewsletterSubscriber(email);
    return NextResponse.json({ok:true});
  }catch(error){
    const message=error instanceof Error?error.message:'Unknown error';
    if(message.includes('409') || message.toLowerCase().includes('duplicate')) return NextResponse.json({ok:true});
    return NextResponse.json({error:'Could not subscribe'},{status:500});
  }
}
