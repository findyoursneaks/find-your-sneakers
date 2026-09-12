import { NextResponse } from 'next/server';
import { getOffer, trackClick } from '../../../lib/data';

export async function GET(request: Request,{params}:{params:Promise<{offerId:string}>}){
  const {offerId}=await params;
  const offer=await getOffer(offerId);
  if(!offer) return NextResponse.redirect(new URL('/search',request.url));
  if(!offer.retailers?.affiliate_enabled) return NextResponse.redirect(new URL('/search',request.url));
  try{ await trackClick(offerId,request.headers.get('referer')); }catch{}
  const target=offer.affiliate_url||offer.product_url;
  return NextResponse.redirect(target);
}
