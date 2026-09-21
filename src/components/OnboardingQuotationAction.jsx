import { useEffect, useRef, useState } from 'react';
import { getAuthHeaders } from '../config';

export default function OnboardingQuotationAction({ name, approved, baseUrl }) {
  const [state, setState] = useState(null);
  const [busy, setBusy] = useState(false);
  const locked = useRef(false);
  const current = state?.name === name ? state : { quotation: '', error: '', message: '' };
  useEffect(() => {
    if (!state) return;
    const timer = setTimeout(() => setState(null), 3000);
    return () => clearTimeout(timer);
  }, [state]);

  const create = async () => {
    if (locked.current || !approved || !name || !baseUrl) return;
    locked.current = true;
    setBusy(true);
    setState(null);
    try {
      const response = await fetch(`${baseUrl}/api/method/property_management.property_managmenet_system.doctype.tenant_onboarding.tenant_onboarding.create_quotation`, {
        method: 'POST', credentials: 'include', headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ tenant_onboarding: name })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.message?.quotation) {
        let message = response.status === 404 ? 'Quotation creation API is unavailable. Deploy the backend update.' : 'Quotation could not be created. Please try again.';
        try {
          const messages = JSON.parse(data._server_messages || '[]');
          const first = typeof messages[0] === 'string' ? JSON.parse(messages[0]) : messages[0];
          if (typeof first?.message === 'string') message = first.message.replace(/<[^>]*>/g, '');
        } catch { /* Retain the fallback for non-standard responses. */ }
        throw new Error(message);
      }
      setState({ name, quotation: data.message.quotation, ready: true, error: '', message: data.message.created ? 'Quotation created successfully: ' : 'Quotation already exists: ' });
    } catch (error) {
      setState({ name, quotation: '', error: error.message, message: '' });
    } finally { locked.current = false; setBusy(false); }
  };
  if (!approved) return null;
  const buttonStyle = { background: '#0a6c66', color: '#fff', border: 0, borderRadius: 20, padding: '6px 14px', fontSize: 11, fontWeight: 700, cursor: busy ? 'wait' : 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' };
  const quotationUrl = `${(baseUrl || '').replace(/\/$/, '')}/app/quotation/${encodeURIComponent(current.quotation)}`;
  return <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, fontSize: 12 }}>
    <button type="button" disabled={busy || !baseUrl} onClick={create} style={buttonStyle} aria-busy={busy}>Create Quotation</button>
    {(current.quotation || current.error) && <div role={current.error ? 'alert' : 'status'} style={{ position: 'fixed', top: 24, right: 24, zIndex: 10000, maxWidth: 'min(420px, calc(100vw - 48px))', padding: '14px 18px', borderRadius: 10, background: current.error ? '#fef2f2' : '#f0fdf4', color: current.error ? '#b91c1c' : '#166534', border: '1px solid #cbd5e1', boxShadow: '0 8px 24px rgba(0,0,0,.15)', fontSize: 13 }}>
      {current.error || current.message}
      {current.quotation && <a href={quotationUrl} style={{ color: '#0a6c66', fontWeight: 700, textDecoration: 'underline' }}>{current.quotation}</a>}
    </div>}
  </div>;
}
