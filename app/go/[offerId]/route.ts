import { NextResponse } from 'next/server';
import { getOffer, trackClick } from '../../../lib/data';
import { isLiveOffer, offerDestination } from '../../../lib/offers';

export async function GET(request: Request,{params}:{params:Promise<{offerId:string}>}){
  const {offerId}=await params;
  if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(offerId)) return NextResponse.redirect(new URL('/search',request.url));
  const offer=await getOffer(offerId);
  if(!offer) return NextResponse.redirect(new URL('/search',request.url));
  const target=offerDestination(offer);
  if(!isLiveOffer(offer) || !target) return NextResponse.redirect(new URL('/search',request.url));
  try{ await trackClick(offerId,request.headers.get('referer')); }catch{}
  return NextResponse.redirect(target);
}
