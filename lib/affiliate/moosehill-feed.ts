import { gunzipSync } from 'node:zlib';

export type MoosehillFeedProduct = {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  price: number | null;
  currency: string;
  availability: string;
  brand: string;
};

function parseCsv(input:string){
  const rows:string[][]=[]; let row:string[]=[]; let field=''; let quoted=false;
  for(let i=0;i<input.length;i++){
    const ch=input[i];
    if(quoted){
      if(ch==='"' && input[i+1]==='"'){field+='"';i++;}
      else if(ch==='"') quoted=false;
      else field+=ch;
    }else{
      if(ch==='"') quoted=true;
      else if(ch===','){row.push(field);field='';}
      else if(ch==='\n'){row.push(field.replace(/\r$/,''));rows.push(row);row=[];field='';}
      else field+=ch;
    }
  }
  if(field.length||row.length){row.push(field);rows.push(row);}
  return rows;
}

function money(value:string){
  const m=(value||'').replace(',','.').match(/\d+(?:\.\d+)?/);
  return m?Number(m[0]):null;
}

export async function loadMoosehillFeed(limit=48):Promise<MoosehillFeedProduct[]>{
  const url=process.env.AWIN_MOOSEHILL_FEED_URL;
  if(!url) return [];
  const res=await fetch(url,{next:{revalidate:1800}});
  if(!res.ok) throw new Error(`Moosehill feed ${res.status}`);
  const zipped=Buffer.from(await res.arrayBuffer());
  const text=gunzipSync(zipped).toString('utf8');
  const rows=parseCsv(text);
  if(rows.length<2) return [];
  const headers=rows[0].map(h=>h.trim().toLowerCase());
  const idx=(...names:string[])=>names.map(n=>headers.indexOf(n)).find(i=>i>=0)??-1;
  const get=(row:string[],...names:string[])=>{const i=idx(...names);return i>=0?(row[i]||'').trim():'';};

  const out:MoosehillFeedProduct[]=[];
  for(const row of rows.slice(1)){
    const title=get(row,'title','product_name','name');
    const link=get(row,'aw_deep_link','deep_link','tracking_url','link');
    if(!title||!link) continue;
    const priceText=get(row,'sale_price','price','store_price','search_price');
    out.push({
      id:get(row,'id','aw_product_id','merchant_product_id','product_id')||String(out.length+1),
      title,
      description:get(row,'description','product_short_description'),
      image:get(row,'image_link','merchant_image_url','image_url','large_image'),
      link,
      price:money(priceText),
      currency:get(row,'currency')||(priceText.match(/[A-Z]{3}/)?.[0]||'USD'),
      availability:get(row,'availability','in_stock'),
      brand:get(row,'brand','brand_name')||'Moosehill',
    });
    if(out.length>=limit) break;
  }
  return out;
}
