import { useEffect, useRef, useState } from 'react';
import { getAuthHeaders } from '../config';

export default function OnboardingQuotationAction({ name, onboardingDoc, approved, baseUrl, onNavigateToQuotation }) {
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

  // Helper to ensure custom_tenant_onboarding is set in Quotation DocType
  const ensureQuotationLinked = async (qId) => {
    if (!qId || !name || !baseUrl) return;

    // 1. Update via standard REST PUT
    try {
      await fetch(`${baseUrl}/api/resource/Quotation/${encodeURIComponent(qId)}`, {
        method: 'PUT',
        credentials: 'include',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ custom_tenant_onboarding: name })
      });
    } catch (err) {
      console.warn('Could not set custom_tenant_onboarding on Quotation via PUT:', err);
    }

    // 2. Also update via frappe.client.set_value to ensure direct DB write
    try {
      await fetch(`${baseUrl}/api/method/frappe.client.set_value`, {
        method: 'POST',
        credentials: 'include',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          doctype: 'Quotation',
          name: qId,
          fieldname: 'custom_tenant_onboarding',
          value: name
        })
      });
    } catch (err) {
      console.warn('Could not set custom_tenant_onboarding via set_value:', err);
    }
  };

  // Check if a Quotation has already been created for this Onboarding case
  useEffect(() => {
    let active = true;
    if (!name || !baseUrl) return;

    const checkExistingQuotation = async () => {
      // 1. Check via property_management quotation_status endpoint
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

      // 2. Check via pms quotation_status endpoint
      try {
        const resPms = await fetch(`${baseUrl}/api/method/pms.onboarding_quotation.quotation_status?tenant_onboarding=${encodeURIComponent(name)}`, {
          credentials: 'include',
          headers: getAuthHeaders({ 'Content-Type': 'application/json' })
        });
        if (resPms.ok) {
          const json = await resPms.json().catch(() => ({}));
          if (active && json.message?.quotation) {
            setExistingQuotation(json.message.quotation);
            return;
          }
        }
      } catch {}

      // 3. Check directly via Quotation resource filtered by custom_tenant_onboarding
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
    window.dispatchEvent(new CustomEvent('pms:navigate-quotation', { detail: { quotationId: qId, onboardingId: name } }));

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

    // If quotation already exists, ensure custom_tenant_onboarding is set and redirect!
    if (existingQuotation) {
      setBusy(true);
      await ensureQuotationLinked(existingQuotation);
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
      let createdQId = null;
      let isNewlyCreated = false;

      // Method 1: Primary backend method
      try {
        const response = await fetch(`${baseUrl}/api/method/property_management.property_managmenet_system.doctype.tenant_onboarding.tenant_onboarding.create_quotation`, {
          method: 'POST',
          credentials: 'include',
          headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({ tenant_onboarding: name, custom_tenant_onboarding: name })
        });
        if (response.ok) {
          const data = await response.json().catch(() => ({}));
          if (data.message?.quotation) {
            createdQId = data.message.quotation;
            isNewlyCreated = !!data.message.created;
          }
        }
      } catch (e) {
        console.warn('Property Management create_quotation call failed:', e);
      }

      // Method 2: Secondary PMS backend method if Method 1 did not return a quotation
      if (!createdQId) {
        try {
          const responsePms = await fetch(`${baseUrl}/api/method/pms.onboarding_quotation.create_quotation`, {
            method: 'POST',
            credentials: 'include',
            headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ tenant_onboarding: name, custom_tenant_onboarding: name })
          });
          if (responsePms.ok) {
            const dataPms = await responsePms.json().catch(() => ({}));
            if (dataPms.message?.quotation) {
              createdQId = dataPms.message.quotation;
              isNewlyCreated = !!dataPms.message.created;
            }
          }
        } catch (e) {
          console.warn('PMS create_quotation call failed:', e);
        }
      }

      // Method 3: Check fallback in case quotation was created or already existed
      if (!createdQId) {
        try {
          const qRes = await fetch(`${baseUrl}/api/resource/Quotation?filters=${encodeURIComponent(JSON.stringify([['custom_tenant_onboarding', '=', name]]))}&fields=["name"]&limit_page_length=1`, {
            credentials: 'include',
            headers: getAuthHeaders({ 'Content-Type': 'application/json' })
          });
          if (qRes.ok) {
            const qJson = await qRes.json().catch(() => ({}));
            if (qJson.data?.[0]?.name) {
              createdQId = qJson.data[0].name;
            }
          }
        } catch {}
      }

      // Method 4: Fallback direct Quotation resource creation with custom_tenant_onboarding set
      if (!createdQId && onboardingDoc) {
        const custName = onboardingDoc.customer || onboardingDoc.customer_name || onboardingDoc.company_name || onboardingDoc.contact_name;
        if (custName) {
          const todayStr = new Date().toISOString().split('T')[0];
          const validTillDate = new Date();
          validTillDate.setDate(validTillDate.getDate() + 7);
          const validTillStr = validTillDate.toISOString().split('T')[0];

          const unitRows = Array.isArray(onboardingDoc.onboarding_unit) ? onboardingDoc.onboarding_unit : [];
          const items = unitRows.map(u => ({
            item_code: u.item_code || u.unit || u.item,
            item_name: u.item_name || u.unit_name || u.item_code || u.unit || 'Unit',
            qty: Number(u.qty) || 1,
            rate: Number(u.rate !== undefined && u.rate !== '' && u.rate !== null ? u.rate : (u.offered_rate || 0)) || 0,
            amount: Number(u.amount) || ((Number(u.qty) || 1) * (Number(u.rate) || 0))
          })).filter(it => it.item_code);

          const fallbackPayload = {
            doctype: "Quotation",
            order_type: "Sales",
            quotation_to: "Customer",
            party_name: custName,
            customer_name: custName,
            custom_tenant_onboarding: name,
            transaction_date: todayStr,
            valid_till: validTillStr,
            status: "Draft",
            company: onboardingDoc.company || "CARPENTERS PROPERTIES PTE LIMITED",
            ...(items.length > 0 ? { items } : {})
          };

          try {
            const restRes = await fetch(`${baseUrl}/api/resource/Quotation`, {
              method: 'POST',
              credentials: 'include',
              headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
              body: JSON.stringify(fallbackPayload)
            });
            if (restRes.ok) {
              const restJson = await restRes.json().catch(() => ({}));
              createdQId = restJson.data?.name || restJson.name;
              isNewlyCreated = true;
            }
          } catch (rErr) {
            console.warn('Direct REST fallback quotation creation error:', rErr);
          }
        }
      }

      if (createdQId) {
        // Explicitly set and ensure custom_tenant_onboarding in Quotation doctype
        await ensureQuotationLinked(createdQId);
        setExistingQuotation(createdQId);
        setState({
          name,
          quotation: createdQId,
          ready: true,
          error: '',
          message: isNewlyCreated ? 'Quotation created successfully. Redirecting...' : 'Quotation already created. Redirecting...'
        });
        handleRedirectToQuotation(createdQId);
        return;
      }

      throw new Error('Quotation could not be created. Please verify customer and unit details.');
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
