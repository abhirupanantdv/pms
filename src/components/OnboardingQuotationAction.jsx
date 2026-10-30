import { useEffect, useRef, useState } from 'react';
import { getAuthHeaders } from '../config';

export default function OnboardingQuotationAction({ name, approved, baseUrl, onNavigateToQuotation }) {
  const [state, setState] = useState(null);
  const [busy, setBusy] = useState(false);
  const [existingQuotation, setExistingQuotation] = useState(null);
  const locked = useRef(false);
  const current = state?.name === name ? state : { quotation: '', error: '', message: '' };

  useEffect(() => {
    if (!state) return;
    const timer = setTimeout(() => setState(null), 3500);
    return () => clearTimeout(timer);
  }, [state]);

  // Check if a Quotation has already been created for this Onboarding case
  useEffect(() => {
    let active = true;
    if (!name || !baseUrl) return;

    const checkExistingQuotation = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/method/property_management.property_managmenet_system.doctype.tenant_onboarding.tenant_onboarding.quotation_status?tenant_onboarding=${encodeURIComponent(name)}`, {
          credentials: 'include',
          headers: getAuthHeaders({ 'Content-Type': 'application/json' })
        });
        if (res.ok) {
          const json = await res.json().catch(() => ({}));
          if (active && json.message?.quotation) {
            setExistingQuotation(json.message.quotation);
            return;
          }
        }
      } catch {}

      try {
        const qRes = await fetch(`${baseUrl}/api/resource/Quotation?filters=${encodeURIComponent(JSON.stringify([['custom_tenant_onboarding', '=', name]]))}&fields=["name"]&limit_page_length=1`, {
          credentials: 'include',
          headers: getAuthHeaders({ 'Content-Type': 'application/json' })
        });
        if (qRes.ok) {
          const qJson = await qRes.json().catch(() => ({}));
          if (active && qJson.data?.[0]?.name) {
            setExistingQuotation(qJson.data[0].name);
          }
        }
      } catch {}
    };

    checkExistingQuotation();
    return () => { active = false; };
  }, [name, baseUrl]);

  // Central redirect handler to switch to Quotation view
  const handleRedirectToQuotation = (qId) => {
    if (!qId) return;

    // 1. Dispatch PMS custom event to notify App.jsx and Quotation.jsx
    window.dispatchEvent(new CustomEvent('pms:navigate-quotation', { detail: { quotationId: qId } }));

    // 2. Call parent callback to close modal and switch active view
    if (typeof onNavigateToQuotation === 'function') {
      onNavigateToQuotation(qId);
      return;
    }

    // 3. If running inside ERPNext Frappe desk, navigate route
    if (typeof frappe !== 'undefined' && typeof frappe.set_route === 'function') {
      frappe.set_route('Form', 'Quotation', qId);
      return;
    }

    // 4. Fallback URL redirect if running in standard browser desk
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/app')) {
      window.location.href = `/app/quotation/${encodeURIComponent(qId)}`;
      return;
    }

    const cleanBase = (baseUrl || '').replace(/\/$/, '');
    const targetUrl = cleanBase ? `${cleanBase}/app/quotation/${encodeURIComponent(qId)}` : `/app/quotation/${encodeURIComponent(qId)}`;
    setTimeout(() => {
      // If tab hasn't transitioned, fallback open
      if (!document.querySelector('.quotation-table-container')) {
        window.location.href = targetUrl;
      }
    }, 300);
  };

  const create = async () => {
    if (locked.current || !approved || !name || !baseUrl) return;

    // If quotation already exists, immediately redirect to that Quotation!
    if (existingQuotation) {
      setBusy(true);
      setState({
        name,
        quotation: existingQuotation,
        ready: true,
        error: '',
        message: 'Quotation already created. Redirecting...'
      });
      handleRedirectToQuotation(existingQuotation);
      setTimeout(() => setBusy(false), 800);
      return;
    }

    locked.current = true;
    setBusy(true);
    setState(null);

    try {
      const response = await fetch(`${baseUrl}/api/method/property_management.property_managmenet_system.doctype.tenant_onboarding.tenant_onboarding.create_quotation`, {
        method: 'POST',
        credentials: 'include',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ tenant_onboarding: name })
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.message?.quotation) {
        const qId = data.message.quotation;
        setExistingQuotation(qId);
        setState({
          name,
          quotation: qId,
          ready: true,
          error: '',
          message: data.message.created ? 'Quotation created successfully. Redirecting...' : 'Quotation already created. Redirecting...'
        });
        handleRedirectToQuotation(qId);
        return;
      }

      // Check fallback in case quotation was created or already existed
      try {
        const qRes = await fetch(`${baseUrl}/api/resource/Quotation?filters=${encodeURIComponent(JSON.stringify([['custom_tenant_onboarding', '=', name]]))}&fields=["name"]&limit_page_length=1`, {
          credentials: 'include',
          headers: getAuthHeaders({ 'Content-Type': 'application/json' })
        });
        if (qRes.ok) {
          const qJson = await qRes.json().catch(() => ({}));
          if (qJson.data?.[0]?.name) {
            const foundId = qJson.data[0].name;
            setExistingQuotation(foundId);
            setState({
              name,
              quotation: foundId,
              ready: true,
              error: '',
              message: 'Quotation found. Redirecting...'
            });
            handleRedirectToQuotation(foundId);
            return;
          }
        }
      } catch {}

      let message = response.status === 404 ? 'Quotation creation API is unavailable. Deploy the backend update.' : 'Quotation could not be created. Please try again.';
      try {
        const messages = JSON.parse(data._server_messages || '[]');
        const first = typeof messages[0] === 'string' ? JSON.parse(messages[0]) : messages[0];
        if (typeof first?.message === 'string') message = first.message.replace(/<[^>]*>/g, '');
      } catch {}
      throw new Error(message);
    } catch (error) {
      setState({ name, quotation: '', error: error.message, message: '' });
    } finally {
      locked.current = false;
      setBusy(false);
    }
  };

  if (!approved) return null;

  const buttonStyle = {
    backgroundColor: '#0a6c66',
    border: '1px solid #0a6c66',
    borderRadius: '20px',
    color: '#ffffff',
    padding: '6px 14px',
    fontSize: '11px',
    fontWeight: 700,
    cursor: busy ? 'wait' : 'pointer',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    height: '28px',
    boxShadow: '0 2px 6px rgba(10, 108, 102, 0.25)',
    transition: 'all 0.2s ease'
  };

  const quotationUrl = `/assets/pms/app/quotation/${encodeURIComponent(current.quotation || existingQuotation || '')}`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, fontSize: 12 }}>
      <button
        id="tob-create-quotation-btn"
        type="button"
        disabled={busy || !baseUrl}
        onClick={create}
        style={buttonStyle}
        aria-busy={busy}
        title={existingQuotation ? `Quotation already created (${existingQuotation}). Click to view.` : 'Create Quotation'}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#085450';
          e.currentTarget.style.borderColor = '#085450';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#0a6c66';
          e.currentTarget.style.borderColor = '#0a6c66';
        }}
      >
        <span>{busy ? 'Redirecting...' : 'Create Quotation'}</span>
      </button>

      {(current.quotation || current.error) && (
        <div
          role={current.error ? 'alert' : 'status'}
          style={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 10000,
            maxWidth: 'min(420px, calc(100vw - 48px))',
            padding: '14px 18px',
            borderRadius: 10,
            background: current.error ? '#fef2f2' : '#f0fdf4',
            color: current.error ? '#b91c1c' : '#166534',
            border: '1px solid #cbd5e1',
            boxShadow: '0 8px 24px rgba(0,0,0,.15)',
            fontSize: 13
          }}
        >
          {current.error || current.message}
          {current.quotation && (
            <a
              href={quotationUrl}
              onClick={(e) => {
                e.preventDefault();
                handleRedirectToQuotation(current.quotation);
              }}
              style={{ color: '#0a6c66', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer', marginLeft: 4 }}
            >
              {current.quotation}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
