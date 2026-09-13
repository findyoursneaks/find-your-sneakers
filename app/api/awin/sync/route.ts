import { NextResponse } from 'next/server';
import { downloadAwinEnhancedFeed, parseAwinJsonlFeed } from '../../../../lib/affiliate/awin';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://iwbrmjchqcpvcvvrgfvh.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_XB79v_WDUxiI-0LH2NixeQ_H0Rt70O1';

function chunk<T>(items:T[],size:number){
  const out:T[][]=[];
  for(let i=0;i<items.length;i+=size) out.push(items.slice(i,i+size));
  return out;
}

export async function POST(request: Request){
  const secret=process.env.SOLEWAR_SYNC_SECRET;
  const awinToken=process.env.AWIN_API_TOKEN;
  const publisherId=process.env.AWIN_PUBLISHER_ID;

  if(!secret || !awinToken || !publisherId){
    return NextResponse.json({error:'Server integration is not fully configured.'},{status:503});
  }

  const provided=request.headers.get('x-solewar-sync-secret');
  if(provided!==secret){
    return NextResponse.json({error:'Unauthorized'},{status:401});
  }

  let body:{advertiserId?:string;retailerName?:string;retailerWebsite?:string;countryCode?:string;locale?:string};
  try{ body=await request.json(); }catch{ return NextResponse.json({error:'Invalid JSON body'},{status:400}); }

  const advertiserId=String(body.advertiserId||'').trim();
  const retailerName=String(body.retailerName||'').trim();
  const retailerWebsite=String(body.retailerWebsite||'').trim();
  const countryCode=String(body.countryCode||'EU').trim().toUpperCase();
  const locale=String(body.locale||'en_GB').trim();

  if(!advertiserId || !retailerName || !/^https?:\/\//i.test(retailerWebsite)){
    return NextResponse.json({error:'advertiserId, retailerName and a valid retailerWebsite are required.'},{status:400});
  }

  try{
    const raw=await downloadAwinEnhancedFeed({publisherId,advertiserId,locale,token:awinToken});
    const offers=parseAwinJsonlFeed(raw,{name:retailerName,websiteUrl:retailerWebsite,countryCode});
    if(!offers.length) return NextResponse.json({synced:0,parsed:0,message:'No valid offers found in feed.'});

    let synced=0;
    for(const batch of chunk(offers,250)){
      const response=await fetch(`${SUPABASE_URL}/rest/v1/rpc/sync_affiliate_offers`,{
        method:'POST',
        headers:{apikey:SUPABASE_KEY,'Content-Type':'application/json'},
        body:JSON.stringify({p_secret:secret,p_items:batch}),
        cache:'no-store',
      });
      if(!response.ok) throw new Error(`Supabase sync failed (${response.status}): ${await response.text()}`);
      const result=await response.json() as {synced?:number};
      synced+=Number(result.synced||0);
    }

    return NextResponse.json({synced,parsed:offers.length,advertiserId,retailerName});
  }catch(error){
    console.error('Awin sync error',error);
    return NextResponse.json({error:error instanceof Error?error.message:'Sync failed'},{status:500});
  }
}
