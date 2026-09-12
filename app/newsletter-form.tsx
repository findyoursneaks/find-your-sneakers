'use client';
import { FormEvent, useState } from 'react';

export default function NewsletterForm(){
  const [status,setStatus]=useState<'idle'|'loading'|'success'|'error'>('idle');
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault(); setStatus('loading');
    const form=new FormData(e.currentTarget);
    const res=await fetch('/api/newsletter',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:form.get('email')})});
    setStatus(res.ok?'success':'error');
    if(res.ok) e.currentTarget.reset();
  }
  return <form onSubmit={submit}><input name="email" type="email" required placeholder="Your email address" aria-label="Email address"/><button disabled={status==='loading'}>{status==='loading'?'Saving...':'Notify me'}</button>{status==='success'&&<small className="form-status">You're on the list.</small>}{status==='error'&&<small className="form-status">Could not subscribe. Try again.</small>}</form>
}
