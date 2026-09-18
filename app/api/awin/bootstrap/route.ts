import { NextResponse } from 'next/server';

const publisherId='3088395';
const advertiserId=96701;

async function awinGet(path:string, token:string){
  const joiner=path.includes('?')?'&':'?';
  const res=await fetch(`https://api.awin.com${path}${joiner}accessToken=${encodeURIComponent(token)}`,{cache:'no-store'});
  const text=await res.text();
  let data:any; try{data=JSON.parse(text)}catch{data=text}
  return {ok:res.ok,status:res.status,data};
}

async function linkBatch(token:string){
  const body={requests:[
    {advertiserId,destinationUrl:'https://moosehillstore.com/',parameters:{clickref:'solewar_moosehill_home'}},
    {advertiserId,destinationUrl:'https://moosehillstore.com/products/mens-convertible-hiking-pants-quick-dry-lightweight-zip-off-breathable-cargo-pants',parameters:{clickref:'solewar_m015'}},
    {advertiserId,destinationUrl:'https://moosehillstore.com/products/womens-hiking-pants-convertible-zip-off-quick-dry-pants-for-cargo-camping-travel-outdoor-fishing-safari',parameters:{clickref:'solewar_w024'}},
    {advertiserId,destinationUrl:'https://moosehillstore.com/products/men-s-cargo-hiking-pants-waterproof-lightweight-quick-dry-utility-7-pockets-for-travel-fishing-work-tactical',parameters:{clickref:'solewar_m034'}}
  ]};
  let res=await fetch(`https://api.awin.com/publishers/${publisherId}/linkbuilder/generate-batch`,{
    method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify(body),cache:'no-store'
  });
  if(res.status===401||res.status===403){
    res=await fetch(`https://api.awin.com/publishers/${publisherId}/linkbuilder/generate-batch?accessToken=${encodeURIComponent(token)}`,{
      method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),cache:'no-store'
    });
  }
  const text=await res.text(); let data:any; try{data=JSON.parse(text)}catch{data=text}
  return {ok:res.ok,status:res.status,data};
}

export async function GET(){
  const token=process.env.AWIN_API_TOKEN;
  if(!token) return NextResponse.json({ok:false,error:'AWIN_API_TOKEN missing'},{status:500});
  const [programmes,groups,links]=await Promise.all([
    awinGet(`/publishers/${publisherId}/programmes?relationship=joined`,token),
    awinGet(`/publishers/${publisherId}/commissiongroups?advertiserId=${advertiserId}`,token),
    linkBatch(token)
  ]);
  const joined=Array.isArray(programmes.data)?programmes.data.find((p:any)=>Number(p.id||p.advertiserId)===advertiserId):null;
  return NextResponse.json({ok:true,advertiserId,publisherId,joined,commissionGroups:groups,links});
}
