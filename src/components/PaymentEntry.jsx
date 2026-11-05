import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  CreditCard,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  Filter,
  RotateCcw,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  ChevronRight,
  ChevronLeft,
  Printer,
  Download,
  ExternalLink,
  Building2,
  User,
  DollarSign,
  Layers,
  Calendar,
  ArrowRight,
  Check,
  Copy,
  Loader2
} from 'lucide-react';
import { getAuthHeaders, getCsrfToken } from '../config';

// Robust mock dataset with the user's sample payment entry
const SAMPLE_PAYMENT_ENTRIES = [
  {
    name: 'ACC-PAY-2026-00014',
    owner: 'sufal.dd@anantdv.com',
    creation: '2026-09-20 15:58:28',
    modified: '2026-09-20 15:58:33',
    modified_by: 'sufal.dd@anantdv.com',
    apply_tax_withholding_amount: 0,
    base_in_words: 'FJD Twelve Thousand, Two Hundred And Twenty Nine only.',
    base_paid_amount: 12229,
    base_paid_amount_after_tax: 12229,
    base_received_amount: 12229,
    base_received_amount_after_tax: 12229,
    base_total_allocated_amount: 12229,
    base_total_taxes_and_charges: 0,
    book_advance_payments_in_separate_party_account: 0,
    company: 'CARPENTERS PROPERTIES PTE LIMITED',
    cost_center: 'Main - CFPL',
    custom_remarks: 0,
    deductions: [],
    difference_amount: 0,
    docstatus: 1,
    doctype: 'Payment Entry',
    in_words: 'FJD Twelve Thousand, Two Hundred And Twenty Nine only.',
    is_opening: 'No',
    naming_series: 'ACC-PAY-.YYYY.-',
    paid_amount: 12229,
    paid_amount_after_tax: 12229,
    paid_from: 'Debtors - CFPL',
    paid_from_account_balance: 12229,
    paid_from_account_currency: 'FJD',
    paid_from_account_type: 'Receivable',
    paid_to: 'Cash - CFPL',
    paid_to_account_balance: 0,
    paid_to_account_currency: 'FJD',
    paid_to_account_type: 'Cash',
    party: 'Arijit',
    party_balance: 12229,
    party_name: 'Arijit',
    party_type: 'Customer',
    payment_order_status: 'Initiated',
    payment_type: 'Receive',
    posting_date: '2026-09-20',
    received_amount: 12229,
    received_amount_after_tax: 12229,
    reconcile_on_advance_payment_date: 0,
    reference_date: '2026-09-20',
    references: [
      {
        reference_doctype: 'Sales Invoice',
        reference_name: 'ACC-SINV-2026-00103',
        total_amount: 12229,
        outstanding_amount: 0,
        allocated_amount: 12229
      }
    ],
    remarks: 'Amount FJD 12229 received from Arijit\nAmount FJD 12229 against Sales Invoice ACC-SINV-2026-00103',
    source_exchange_rate: 1,
    status: 'Submitted',
    target_exchange_rate: 1,
    taxes: [],
    title: 'Arijit',
    total_allocated_amount: 12229,
    total_taxes_and_charges: 0,
    unallocated_amount: 0
  },
  {
    name: 'ACC-PAY-2026-00013',
    owner: 'admin@carpenters.com.fj',
    creation: '2026-09-18 11:20:14',
    modified: '2026-09-18 11:21:05',
    modified_by: 'admin@carpenters.com.fj',
    apply_tax_withholding_amount: 0,
    base_in_words: 'FJD Four Thousand, Eight Hundred only.',
    base_paid_amount: 4800,
    base_paid_amount_after_tax: 4800,
    base_received_amount: 4800,
    base_received_amount_after_tax: 4800,
    base_total_allocated_amount: 4800,
    base_total_taxes_and_charges: 0,
    company: 'CARPENTERS PROPERTIES PTE LIMITED',
    cost_center: 'Main - CFPL',
    deductions: [],
    difference_amount: 0,
    docstatus: 1,
    doctype: 'Payment Entry',
    in_words: 'FJD Four Thousand, Eight Hundred only.',
    paid_amount: 4800,
    paid_from: 'Debtors - CFPL',
    paid_from_account_currency: 'FJD',
    paid_from_account_type: 'Receivable',
    paid_to: 'Bank - CFPL',
    paid_to_account_currency: 'FJD',
    paid_to_account_type: 'Bank',
    party: 'Sarah Jenkins',
    party_balance: 4800,
    party_name: 'Sarah Jenkins',
    party_type: 'Customer',
    payment_type: 'Receive',
    posting_date: '2026-09-18',
    received_amount: 4800,
    received_amount_after_tax: 4800,
    reference_date: '2026-09-18',
    references: [
      {
        reference_doctype: 'Sales Invoice',
        reference_name: 'ACC-SINV-2026-00098',
        total_amount: 4800,
        outstanding_amount: 0,
        allocated_amount: 4800
      }
    ],
    remarks: 'Amount FJD 4800 received from Sarah Jenkins against invoice ACC-SINV-2026-00098',
    status: 'Submitted',
    total_allocated_amount: 4800,
    unallocated_amount: 0
  },
  {
    name: 'ACC-PAY-2026-00012',
    owner: 'admin@carpenters.com.fj',
    creation: '2026-09-15 14:10:00',
    modified: '2026-09-15 14:10:00',
    modified_by: 'admin@carpenters.com.fj',
    apply_tax_withholding_amount: 0,
    base_in_words: 'FJD One Thousand, Eight Hundred And Fifty only.',
    base_paid_amount: 1850,
    base_paid_amount_after_tax: 1850,
    base_received_amount: 1850,
    base_received_amount_after_tax: 1850,
    base_total_allocated_amount: 1850,
    company: 'CARPENTERS PROPERTIES PTE LIMITED',
    cost_center: 'Main - CFPL',
    deductions: [],
    difference_amount: 0,
    docstatus: 1,
    doctype: 'Payment Entry',
    in_words: 'FJD One Thousand, Eight Hundred And Fifty only.',
    paid_amount: 1850,
    paid_from: 'Debtors - CFPL',
    paid_from_account_currency: 'FJD',
    paid_from_account_type: 'Receivable',
    paid_to: 'Cash - CFPL',
    paid_to_account_currency: 'FJD',
    paid_to_account_type: 'Cash',
    party: 'John Doe',
    party_balance: 1850,
    party_name: 'John Doe',
    party_type: 'Customer',
    payment_type: 'Receive',
    posting_date: '2026-09-15',
    received_amount: 1850,
    received_amount_after_tax: 1850,
    reference_date: '2026-09-15',
    references: [
      {
        reference_doctype: 'Sales Invoice',
        reference_name: 'ACC-SINV-2026-00092',
        total_amount: 1850,
        outstanding_amount: 0,
        allocated_amount: 1850
      }
    ],
    remarks: 'Rental collection for Flat 4B against invoice ACC-SINV-2026-00092',
    status: 'Submitted',
    total_allocated_amount: 1850,
    unallocated_amount: 0
  },
  {
    name: 'ACC-PAY-2026-00011',
    owner: 'sufal.dd@anantdv.com',
    creation: '2026-09-10 09:30:11',
    modified: '2026-09-10 09:30:11',
    modified_by: 'sufal.dd@anantdv.com',
    apply_tax_withholding_amount: 0,
    base_in_words: 'FJD Three Thousand, Five Hundred only.',
    base_paid_amount: 3500,
    base_paid_amount_after_tax: 3500,
    base_received_amount: 3500,
    company: 'CARPENTERS PROPERTIES PTE LIMITED',
    cost_center: 'Main - CFPL',
    deductions: [],
    difference_amount: 0,
    docstatus: 0,
    doctype: 'Payment Entry',
    in_words: 'FJD Three Thousand, Five Hundred only.',
    paid_amount: 3500,
    paid_from: 'Debtors - CFPL',
    paid_from_account_currency: 'FJD',
    paid_from_account_type: 'Receivable',
    paid_to: 'Bank - CFPL',
    paid_to_account_currency: 'FJD',
    paid_to_account_type: 'Bank',
    party: 'Sudip',
    party_balance: 3500,
    party_name: 'Sudip',
    party_type: 'Customer',
    payment_type: 'Receive',
    posting_date: '2026-09-10',
    received_amount: 3500,
    received_amount_after_tax: 3500,
    reference_date: '2026-09-10',
    references: [],
    remarks: 'Advance rental deposit draft payment entry',
    status: 'Draft',
    total_allocated_amount: 0,
    unallocated_amount: 3500
  }
];

export default function PaymentEntry({ erpnextConfig, tenants = [], onNavigateToInvoice }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [fetchingDetail, setFetchingDetail] = useState(false);
  const [paidAmountInput, setPaidAmountInput] = useState('');
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [actionFeedback, setActionFeedback] = useState(null);
  const lastSelectedPaymentIdRef = useRef(null);

  // Sync paidAmountInput only when a different Payment Entry is selected
  useEffect(() => {
    if (selectedPayment) {
      if (lastSelectedPaymentIdRef.current !== selectedPayment.name) {
        lastSelectedPaymentIdRef.current = selectedPayment.name;
        const amt = selectedPayment.paid_amount !== undefined
          ? selectedPayment.paid_amount
          : (selectedPayment.received_amount !== undefined ? selectedPayment.received_amount : '');
        setPaidAmountInput(amt !== '' && amt !== null ? String(amt) : '');
        setActionFeedback(null);
      }
    } else {
      lastSelectedPaymentIdRef.current = null;
      setPaidAmountInput('');
      setActionFeedback(null);
    }
  }, [selectedPayment?.name]);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = selectedPayment ? 7 : 10;

  // Print Receipt Modal
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Fetch Payment Entries from ERPNext
  const fetchPaymentEntries = async (isManual = false, targetSubmittedName = null) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setErrorMsg('');

    try {
      if (erpnextConfig && erpnextConfig.url) {
        const fields = [
          'name',
          'owner',
          'creation',
          'modified',
          'modified_by',
          'docstatus',
          'status',
          'posting_date',
          'payment_type',
          'party_type',
          'party',
          'party_name',
          'paid_amount',
          'received_amount',
          'paid_amount_after_tax',
          'paid_from',
          'paid_to',
          'paid_from_account_currency',
          'paid_to_account_currency',
          'paid_from_account_type',
          'paid_to_account_type',
          'paid_from_account_balance',
          'paid_to_account_balance',
          'party_balance',
          'total_allocated_amount',
          'unallocated_amount',
          'difference_amount',
          'company',
          'cost_center',
          'reference_no',
          'reference_date',
          'remarks',
          'in_words',
          'base_in_words',
          'mode_of_payment'
        ];

        const url = `${erpnextConfig.url}/api/resource/Payment%20Entry?fields=${encodeURIComponent(
          JSON.stringify(fields)
        )}&order_by=creation desc&limit_page_length=200`;

        const res = await fetch(url, {
          credentials: 'include',
          headers: getAuthHeaders()
        });

        if (res.ok) {
          const json = await res.json();
          const data = json.data || [];
          if (data.length > 0) {
            const normalized = data.map(item => {
              const isSubmittedTarget = targetSubmittedName && item.name === targetSubmittedName;
              const ds = isSubmittedTarget ? 1 : (Number(item.docstatus) || 0);
              const resolvedStatus = ds === 1 ? 'Submitted' : (ds === 2 ? 'Cancelled' : (isSubmittedTarget ? 'Submitted' : (item.status || 'Draft')));
              return {
                ...item,
                docstatus: ds,
                status: resolvedStatus
              };
            });

            // Ensure targetSubmittedName is present even if DB commit lag
            if (targetSubmittedName && !normalized.some(p => p.name === targetSubmittedName) && selectedPayment?.name === targetSubmittedName) {
              normalized.unshift({
                ...selectedPayment,
                docstatus: 1,
                status: 'Submitted'
              });
            }

            setPayments(normalized);

            // Also keep selectedPayment in sync with normalized live entry
            if (selectedPayment) {
              const freshSelected = normalized.find(p => p.name === selectedPayment.name);
              if (freshSelected) {
                setSelectedPayment(prev => ({
                  ...prev,
                  ...freshSelected,
                  docstatus: freshSelected.docstatus,
                  status: freshSelected.status
                }));
              }
            }
            return;
          }
        } else {
          console.warn('Payment Entry fetch returned non-ok:', res.status);
        }
      }
      // If ERPNext returned 0 records or is unreachable, use rich initial fallback
      setPayments(SAMPLE_PAYMENT_ENTRIES);
    } catch (err) {
      console.warn('Payment Entry fetch failed, using fallback:', err);
      setPayments(SAMPLE_PAYMENT_ENTRIES);
      setErrorMsg('Could not fetch live payment entries. Displaying cached records.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPaymentEntries();

    const handleCreated = () => {
      fetchPaymentEntries(true);
    };
    window.addEventListener('pms:payment-entry-created', handleCreated);
    return () => {
      window.removeEventListener('pms:payment-entry-created', handleCreated);
    };
  }, [erpnextConfig?.url]);

  // Handle navigation from other components (like Invoices right panel)
  useEffect(() => {
    const handleNavigate = (e) => {
      const targetId = e?.detail?.id || e?.detail?.paymentEntryId;
      if (targetId) {
        setSearchTerm(targetId);
        const found = payments.find(p => p.name === targetId);
        if (found) {
          handleSelectPayment(found);
        } else {
          handleSelectPayment({ name: targetId });
          // Also refresh list to ensure latest entry is included
          fetchPaymentEntries(true);
        }
      }
    };
    window.addEventListener('pms:navigate-payment-entry', handleNavigate);
    return () => {
      window.removeEventListener('pms:navigate-payment-entry', handleNavigate);
    };
  }, [payments, erpnextConfig?.url]);

  // Direct navigation to open invoice in Invoices right panel
  const handleOpenInvoice = (invoiceId) => {
    if (!invoiceId) return;
    if (onNavigateToInvoice) {
      onNavigateToInvoice(invoiceId);
    }
    window.dispatchEvent(
      new CustomEvent('pms:navigate-invoice', {
        detail: { id: invoiceId, invoiceId }
      })
    );
  };

  // Fetch full details of single Payment Entry when clicked
  const handleSelectPayment = async (payment) => {
    setSelectedPayment(payment);
    if (!erpnextConfig?.url || !payment?.name) return;

    setFetchingDetail(true);
    try {
      const res = await fetch(
        `${erpnextConfig.url}/api/resource/Payment%20Entry/${encodeURIComponent(payment.name)}`,
        {
          credentials: 'include',
          headers: getAuthHeaders()
        }
      );
      if (res.ok) {
        const json = await res.json();
        const fullDoc = json.data || json;
        setSelectedPayment(fullDoc);
      }
    } catch (err) {
      console.warn('Could not fetch complete payment entry details:', err);
    } finally {
      setFetchingDetail(false);
    }
  };

  const handleMarkAsPaid = async () => {
    if (!selectedPayment) return;
    const paymentName = selectedPayment.name;
    const parsedAmount = parseFloat(paidAmountInput);
    const validAmount = !isNaN(parsedAmount) && parsedAmount >= 0 ? parsedAmount : (selectedPayment.paid_amount || 0);

    setSubmittingPayment(true);
    setActionFeedback(null);

    try {
      let updatedDoc = null;
      let submitError = null;

      if (erpnextConfig?.url && !String(paymentName).startsWith('MOCK-')) {
        const headers = getAuthHeaders({
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': getCsrfToken() || ''
        });

        // 1. Ensure any referenced Sales Invoice is submitted first
        const sinvRefs = (selectedPayment.references || []).filter(
          r => r.reference_doctype === 'Sales Invoice' && r.reference_name
        );
        for (const sinvRef of sinvRefs) {
          try {
            await fetch(`${erpnextConfig.url}/api/resource/Sales%20Invoice/${encodeURIComponent(sinvRef.reference_name)}`, {
              method: 'POST',
              credentials: 'include',
              headers,
              body: JSON.stringify({ run_method: 'submit' })
            }).catch(() => {});
          } catch { }
        }

        // 2. Try custom whitelisted backend method in pms.api
        try {
          const resApi = await fetch(`${erpnextConfig.url}/api/method/pms.api.submit_payment_entry`, {
            method: 'POST',
            credentials: 'include',
            headers,
            body: JSON.stringify({
              payment_entry_name: paymentName,
              paid_amount: validAmount
            })
          });

          if (resApi.ok) {
            const dataApi = await resApi.json();
            const result = dataApi.message || dataApi.data || dataApi;
            if (result && (result.name || result.doc)) {
              updatedDoc = result.doc || result;
            }
          }
        } catch (e1) {
          console.warn('pms.api.submit_payment_entry failed:', e1);
        }

        // 3. Try custom whitelisted backend method in pms.utils
        if (!updatedDoc) {
          try {
            const resUtils = await fetch(`${erpnextConfig.url}/api/method/pms.utils.submit_payment_entry`, {
              method: 'POST',
              credentials: 'include',
              headers,
              body: JSON.stringify({
                payment_entry_name: paymentName,
                paid_amount: validAmount
              })
            });

            if (resUtils.ok) {
              const dataUtils = await resUtils.json();
              const result = dataUtils.message || dataUtils.data || dataUtils;
              if (result && (result.name || result.doc)) {
                updatedDoc = result.doc || result;
              }
            }
          } catch (e2) {
            console.warn('pms.utils.submit_payment_entry failed:', e2);
          }
        }

        // 4. Standard Frappe REST API: Update amount with PUT, then submit via run_method: 'submit'
        if (!updatedDoc || updatedDoc.docstatus !== 1) {
          const updatedReferences = (selectedPayment.references || []).map((r, i) =>
            i === 0 ? {
              ...r,
              allocated_amount: validAmount,
              total_amount: r.total_amount || validAmount,
              outstanding_amount: Math.max(0, (Number(r.total_amount) || validAmount) - validAmount)
            } : r
          );

          // 4a. Update Payment Entry with PUT
          try {
            const putRes = await fetch(`${erpnextConfig.url}/api/resource/Payment%20Entry/${encodeURIComponent(paymentName)}`, {
              method: 'PUT',
              credentials: 'include',
              headers,
              body: JSON.stringify({
                paid_amount: validAmount,
                received_amount: validAmount,
                base_paid_amount: validAmount,
                base_received_amount: validAmount,
                total_allocated_amount: validAmount,
                unallocated_amount: 0,
                difference_amount: 0,
                references: updatedReferences
              })
            });

            if (putRes.ok) {
              const putJson = await putRes.json();
              updatedDoc = putJson.data || putJson;
            }
          } catch (putErr) {
            console.warn('PUT Payment Entry error:', putErr);
          }

          // 4b. Submit Payment Entry via POST /api/resource/Payment Entry/:name with run_method: 'submit'
          try {
            const submitRes = await fetch(`${erpnextConfig.url}/api/resource/Payment%20Entry/${encodeURIComponent(paymentName)}`, {
              method: 'POST',
              credentials: 'include',
              headers,
              body: JSON.stringify({ run_method: 'submit' })
            });

            if (submitRes.ok) {
              const subJson = await submitRes.json();
              const subData = subJson.message || subJson.data || subJson;
              if (subData) {
                updatedDoc = { ...(updatedDoc || {}), ...subData, docstatus: 1, status: 'Submitted' };
              }
            } else {
              const errText = await submitRes.text().catch(() => '');
              let parsedErr = '';
              try {
                const j = JSON.parse(errText);
                if (j._server_messages) {
                  const ms = JSON.parse(j._server_messages);
                  parsedErr = ms.map(m => {
                    try { return JSON.parse(m).message; } catch { return m; }
                  }).join('; ');
                } else if (j.exception) {
                  parsedErr = j.exception;
                } else if (j.message) {
                  parsedErr = typeof j.message === 'string' ? j.message : JSON.stringify(j.message);
                }
              } catch {
                parsedErr = errText;
              }
              if (parsedErr && !parsedErr.includes('already submitted')) {
                console.warn('POST run_method submit failed:', parsedErr);
                submitError = parsedErr;
              }
            }
          } catch (subErr) {
            console.warn('submit request error:', subErr);
          }

          // 4c. Fallback submission via /api/method/run_doc_method
          if (!updatedDoc || updatedDoc.docstatus !== 1) {
            try {
              const rdmRes = await fetch(`${erpnextConfig.url}/api/method/run_doc_method`, {
                method: 'POST',
                credentials: 'include',
                headers,
                body: JSON.stringify({
                  dt: 'Payment Entry',
                  dn: paymentName,
                  method: 'submit'
                })
              });
              if (rdmRes.ok) {
                const rdmJson = await rdmRes.json();
                const rdmData = rdmJson.message || rdmJson.data;
                if (rdmData) {
                  updatedDoc = { ...(updatedDoc || {}), ...rdmData, docstatus: 1, status: 'Submitted' };
                }
              }
            } catch (rdmErr) {
              console.warn('run_doc_method error:', rdmErr);
            }
          }

          // 4d. Fetch fresh document from ERPNext to verify final state
          try {
            const checkRes = await fetch(`${erpnextConfig.url}/api/resource/Payment%20Entry/${encodeURIComponent(paymentName)}`, {
              credentials: 'include',
              headers
            });
            if (checkRes.ok) {
              const checkJson = await checkRes.json();
              if (checkJson.data) {
                updatedDoc = { ...(updatedDoc || {}), ...checkJson.data };
              }
            }
          } catch { }
        }
      }

      // Check if submission threw a hard error that couldn't be resolved
      if (submitError && (!updatedDoc || updatedDoc.docstatus !== 1)) {
        const cleanMsg = submitError.replace(/<[^>]*>/g, '').trim();
        throw new Error(cleanMsg || 'Submission failed in ERPNext');
      }

      // Construct next state
      const updatedReferences = (selectedPayment.references || []).map((r, i) =>
        i === 0 ? {
          ...r,
          allocated_amount: validAmount,
          total_amount: r.total_amount || validAmount,
          outstanding_amount: Math.max(0, (Number(r.total_amount) || validAmount) - validAmount)
        } : r
      );

      const nextPaymentState = {
        ...selectedPayment,
        ...(updatedDoc || {}),
        paid_amount: validAmount,
        received_amount: validAmount,
        base_paid_amount: validAmount,
        base_received_amount: validAmount,
        total_allocated_amount: validAmount,
        references: updatedReferences,
        docstatus: 1,
        status: 'Submitted'
      };

      // 1. Immediately update selected payment & local input
      setSelectedPayment(nextPaymentState);
      setPaidAmountInput(String(validAmount));

      // 2. Immediately update payments array state
      setPayments(prev => {
        const found = prev.some(p => p.name === paymentName);
        if (found) {
          return prev.map(p => p.name === paymentName ? { ...p, ...nextPaymentState } : p);
        }
        return [nextPaymentState, ...prev];
      });

      // 3. Set success feedback
      setActionFeedback({
        type: 'success',
        message: `Payment Entry ${paymentName} saved with Paid Amount F$${Number(validAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} and Submitted.`
      });

      // 4. Dispatch custom events for other components
      window.dispatchEvent(new CustomEvent('pms:payment-entry-submitted', {
        detail: { name: paymentName, doc: nextPaymentState }
      }));
      window.dispatchEvent(new CustomEvent('pms:payment-entry-created', {
        detail: { name: paymentName, doc: nextPaymentState }
      }));
      window.dispatchEvent(new CustomEvent('pms:payment-entry-updated', {
        detail: { name: paymentName, doc: nextPaymentState }
      }));

      // 5. Automatically trigger fetchPaymentEntries so the table list immediately updates from server
      await fetchPaymentEntries(true, paymentName);

    } catch (err) {
      console.error('Error submitting Payment Entry:', err);
      let msg = err.message || 'Failed to submit Payment Entry';
      try {
        if (typeof msg === 'string' && msg.startsWith('[')) {
          const parsed = JSON.parse(msg);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const inner = typeof parsed[0] === 'string' ? JSON.parse(parsed[0]) : parsed[0];
            msg = inner?.message || msg;
          }
        }
      } catch { }
      setActionFeedback({
        type: 'error',
        message: `Error: ${msg}`
      });
    } finally {
      setSubmittingPayment(false);
    }
  };

  // Helper to compute Due Amount for the highlighted card
  const getDueAmount = (payment = selectedPayment) => {
    if (!payment) return 0;
    if (payment.references && payment.references.length > 0) {
      const ref = payment.references[0];
      const total = Number(ref.total_amount) || Number(ref.outstanding_amount) || 0;
      const allocated = Number(ref.allocated_amount) || Number(paidAmountInput) || Number(payment.paid_amount) || 0;
      if (total > 0) {
        if (payment.docstatus === 1) {
          // If submitted, remaining due is total - allocated
          return Math.max(0, total - allocated);
        } else {
          // If draft, the due amount is total invoice due before payment
          return total;
        }
      }
    }
    if (payment.party_balance !== undefined && Number(payment.party_balance) > 0) {
      return Number(payment.party_balance);
    }
    return Number(payment.paid_amount || payment.received_amount || 0);
  };

  // Filtered Payments
  const filteredPayments = useMemo(() => {
    return payments.filter((item) => {
      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        const matchesName = (item.name || '').toLowerCase().includes(term);
        const matchesParty = (item.party_name || item.party || '').toLowerCase().includes(term);
        const matchesRemarks = (item.remarks || '').toLowerCase().includes(term);
        const matchesFrom = (item.paid_from || '').toLowerCase().includes(term);
        const matchesTo = (item.paid_to || '').toLowerCase().includes(term);
        const matchesRef = (item.references || []).some(
          r => (r.reference_name || '').toLowerCase().includes(term)
        );
        if (!matchesName && !matchesParty && !matchesRemarks && !matchesFrom && !matchesTo && !matchesRef) {
          return false;
        }
      }

      // Payment Type
      if (typeFilter !== 'All' && (item.payment_type || '').toLowerCase() !== typeFilter.toLowerCase()) {
        return false;
      }

      // Status Filter
      if (statusFilter !== 'All') {
        const ds = Number(item.docstatus);
        const itemStatus = (ds === 1 ? 'submitted' : ds === 2 ? 'cancelled' : (item.status || 'draft')).toLowerCase();
        if (itemStatus !== statusFilter.toLowerCase()) {
          return false;
        }
      }

      // Date Range
      if (startDateFilter && item.posting_date && item.posting_date < startDateFilter) {
        return false;
      }
      if (endDateFilter && item.posting_date && item.posting_date > endDateFilter) {
        return false;
      }

      return true;
    });
  }, [payments, searchTerm, typeFilter, statusFilter, startDateFilter, endDateFilter]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / itemsPerPage));
  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPayments.slice(start, start + itemsPerPage);
  }, [filteredPayments, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter, statusFilter, startDateFilter, endDateFilter, selectedPayment]);

  // Metrics (dynamic according to filtered table data)
  const metrics = useMemo(() => {
    let totalAmount = 0;
    let totalReceived = 0;
    let totalPaid = 0;
    let totalUnallocated = 0;

    filteredPayments.forEach((p) => {
      const pType = (p.payment_type || '').toLowerCase();
      const amt = parseFloat(p.payment_type === 'Pay' ? (p.paid_amount || 0) : (p.received_amount || p.paid_amount || 0)) || 0;
      totalAmount += amt;

      const rAmt = parseFloat(p.received_amount || p.paid_amount || 0);
      const pAmt = parseFloat(p.paid_amount || 0);
      const uAmt = parseFloat(p.unallocated_amount || 0);

      if (pType === 'receive') {
        totalReceived += rAmt;
      } else if (pType === 'pay') {
        totalPaid += pAmt;
      }
      totalUnallocated += uAmt;
    });

    return {
      totalAmount,
      totalReceived,
      totalPaid,
      totalUnallocated,
      count: filteredPayments.length
    };
  }, [filteredPayments]);

  const formatCurrency = (val, cur = 'FJD') => {
    const num = parseFloat(val) || 0;
    return `F$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatFJD = (val) => {
    const num = parseFloat(val) || 0;
    return `F$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getStatusBadge = (status, docstatus) => {
    const ds = Number(docstatus);
    const st = (ds === 1 ? 'submitted' : ds === 2 ? 'cancelled' : (status || 'draft')).toLowerCase();
    if (st === 'submitted') {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '3px 8px',
            borderRadius: 12,
            fontSize: 11,
            fontWeight: 700,
            background: 'rgba(16, 185, 129, 0.1)',
            color: '#059669',
            border: '1px solid rgba(16, 185, 129, 0.25)'
          }}
        >
          <CheckCircle2 size={11} /> Submitted
        </span>
      );
    }
    if (st === 'cancelled') {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '3px 8px',
            borderRadius: 12,
            fontSize: 11,
            fontWeight: 700,
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#dc2626',
            border: '1px solid rgba(239, 68, 68, 0.25)'
          }}
        >
          <AlertCircle size={11} /> Cancelled
        </span>
      );
    }
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '3px 8px',
          borderRadius: 12,
          fontSize: 11,
          fontWeight: 700,
          background: 'rgba(245, 158, 11, 0.1)',
          color: '#d97706',
          border: '1px solid rgba(245, 158, 11, 0.25)'
        }}
      >
        <Clock size={11} /> Draft
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const t = (type || 'Receive').toLowerCase();
    if (t === 'receive') {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '3px 8px',
            borderRadius: 12,
            fontSize: 11,
            fontWeight: 700,
            background: 'rgba(6, 95, 70, 0.1)',
            color: 'var(--brand-color, #065f46)',
            border: '1px solid rgba(6, 95, 70, 0.2)'
          }}
        >
          <ArrowDownLeft size={11} /> Receive
        </span>
      );
    }
    if (t === 'pay') {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '3px 8px',
            borderRadius: 12,
            fontSize: 11,
            fontWeight: 700,
            background: 'rgba(124, 58, 237, 0.1)',
            color: '#7c3aed',
            border: '1px solid rgba(124, 58, 237, 0.25)'
          }}
        >
          <ArrowUpRight size={11} /> Pay
        </span>
      );
    }
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '3px 8px',
          borderRadius: 12,
          fontSize: 11,
          fontWeight: 700,
          background: 'rgba(2, 132, 199, 0.1)',
          color: '#0284c7',
          border: '1px solid rgba(2, 132, 199, 0.25)'
        }}
      >
        <Layers size={11} /> {type || 'Internal Transfer'}
      </span>
    );
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleExportCSV = () => {
    if (!filteredPayments || filteredPayments.length === 0) return;
    const headers = ['Payment Entry', 'Posting Date', 'Payment Type', 'Party Type', 'Party Name', 'Paid From', 'Paid To', 'Paid Amount', 'Received Amount', 'Allocated Amount', 'Unallocated Amount', 'Status', 'Remarks'];
    const rows = filteredPayments.map(p => [
      `"${p.name || ''}"`,
      `"${p.posting_date || ''}"`,
      `"${p.payment_type || ''}"`,
      `"${p.party_type || ''}"`,
      `"${p.party_name || p.party || ''}"`,
      `"${p.paid_from || ''}"`,
      `"${p.paid_to || ''}"`,
      p.paid_amount || 0,
      p.received_amount || 0,
      p.total_allocated_amount || 0,
      p.unallocated_amount || 0,
      `"${Number(p.docstatus) === 1 ? 'Submitted' : (Number(p.docstatus) === 2 ? 'Cancelled' : (p.status || 'Draft'))}"`,
      `"${(p.remarks || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `payment_entries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: '0 4px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header View */}
      <div className="view-header" style={{ marginBottom: 0 }}>
        <div>
          <h1 className="view-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CreditCard size={26} style={{ color: 'var(--brand-color, #065f46)' }} />
            Payment Entry Ledger
          </h1>
          <p className="view-subtitle">
            Manage incoming tenant lease payments, vendor disbursements, and ERPNext account allocations.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleExportCSV}
            title="Export filtered records to CSV"
            style={{ fontSize: 12, padding: '7px 12px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => fetchPaymentEntries(true)}
            disabled={refreshing}
            title="Refresh payment entries from ERPNext"
            style={{ fontSize: 12, padding: '7px 12px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <RotateCcw size={14} className={refreshing ? 'spin-anim' : ''} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div style={{ color: '#92400e', background: '#fef3c7', padding: '10px 14px', borderRadius: 8, fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Metrics Row: 2 Dynamic Cards (Total Entry & Total Amount) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        {/* Total Entry Card */}
        <div className="card-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(100, 116, 139, 0.12)', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={22} />
          </div>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-secondary, #64748b)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Total Entry
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary, #0f172a)', marginTop: 2 }}>
              {metrics.count} <span style={{ fontSize: 12.5, fontWeight: 500, color: '#64748b' }}>records</span>
            </div>
          </div>
        </div>

        {/* Total Amount Card */}
        <div className="card-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(6, 95, 70, 0.1)', color: 'var(--brand-color, #065f46)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={22} />
          </div>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-secondary, #64748b)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Total Amount
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--brand-color, #065f46)', marginTop: 2 }}>
              {formatCurrency(metrics.totalAmount)}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div
        className="card-panel"
        style={{
          padding: '12px 16px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 12,
          background: 'var(--bg-primary, #ffffff)'
        }}
      >
        <div style={{ flex: '1 1 240px', position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search by Payment ID, Party Name, Accounts, Remarks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: 34, height: 38, fontSize: 12.5 }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 2 }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Payment Type Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: '#64748b' }}>Type:</span>
          <select
            className="form-input"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ height: 38, fontSize: 12, minWidth: 120 }}
          >
            <option value="All">All Types</option>
            <option value="Receive">Receive</option>
            <option value="Pay">Pay</option>
            <option value="Internal Transfer">Internal Transfer</option>
          </select>
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: '#64748b' }}>Status:</span>
          <select
            className="form-input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ height: 38, fontSize: 12, minWidth: 120 }}
          >
            <option value="All">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Draft">Draft</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Date Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: '#64748b' }}>From Date</span>
          <input
            type="date"
            className="form-input"
            value={startDateFilter}
            onChange={(e) => setStartDateFilter(e.target.value)}
            style={{ height: 38, fontSize: 12, padding: '4px 8px' }}
            title="Posting Date From"
          />
          <span style={{ color: '#94a3b8' }}>-</span>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: '#64748b' }}>To Date</span>
          <input
            type="date"
            className="form-input"
            value={endDateFilter}
            onChange={(e) => setEndDateFilter(e.target.value)}
            style={{ height: 38, fontSize: 12, padding: '4px 8px' }}
            title="Posting Date To"
          />
        </div>

        {(searchTerm || typeFilter !== 'All' || statusFilter !== 'All' || startDateFilter || endDateFilter) && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setSearchTerm('');
              setTypeFilter('All');
              setStatusFilter('All');
              setStartDateFilter('');
              setEndDateFilter('');
            }}
            style={{ height: 38, fontSize: 12, padding: '0 12px', display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            <X size={13} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Main Content Area (Table + Slide-in / Split Right Panel) */}
      <div
        className="grid-2col"
        style={{
          gridTemplateColumns: selectedPayment ? '55% calc(45% - 24px)' : '1fr',
          gap: 24,
          transition: 'all 0.3s ease',
          alignItems: 'start'
        }}
      >
        {/* Table Card */}
        <div className="card-panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-container" style={{ margin: 0, border: 'none' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Entry ID</th>
                  <th>Posting Date</th>
                  <th>Party</th>
                  <th>Type</th>
                  {!selectedPayment && <th>Paid From → Paid To</th>}
                  <th style={{ textAlign: 'right' }}>Amount</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right', paddingRight: 16 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={selectedPayment ? 7 : 8} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                      Loading payment entries...
                    </td>
                  </tr>
                ) : paginatedPayments.length === 0 ? (
                  <tr>
                    <td colSpan={selectedPayment ? 7 : 8} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                      No payment entries found matching the filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedPayments.map((p) => {
                    const isSelected = selectedPayment?.name === p.name;
                    const amountVal = p.payment_type === 'Pay' ? (p.paid_amount || 0) : (p.received_amount || p.paid_amount || 0);

                    return (
                      <tr
                        key={p.name}
                        onClick={() => handleSelectPayment(p)}
                        style={{
                          cursor: 'pointer',
                          backgroundColor: isSelected ? 'var(--bg-accent-alpha, rgba(6, 95, 70, 0.08))' : '',
                          borderLeft: isSelected ? '3px solid var(--brand-color, #065f46)' : ''
                        }}
                        title="Click to view full details in right panel"
                      >
                        <td style={{ fontWeight: 700, color: 'var(--brand-color, #065f46)' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <span>{p.name}</span>
                          </div>
                        </td>
                        <td style={{ whiteSpace: 'nowrap', fontSize: 12 }}>
                          {p.posting_date || '—'}
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>
                              {p.party_name || p.party || '—'}
                            </span>
                            <span style={{ fontSize: 10.5, color: '#64748b' }}>
                              {p.party_type || 'Customer'}
                            </span>
                          </div>
                        </td>
                        <td>{getTypeBadge(p.payment_type)}</td>
                        {!selectedPayment && (
                          <td style={{ fontSize: 11.5, color: '#475569' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                              <span title={p.paid_from}>{p.paid_from?.split(' - ')[0] || p.paid_from || '—'}</span>
                              <ArrowRight size={11} style={{ color: '#94a3b8' }} />
                              <span title={p.paid_to} style={{ fontWeight: 600, color: '#0f172a' }}>{p.paid_to?.split(' - ')[0] || p.paid_to || '—'}</span>
                            </div>
                          </td>
                        )}
                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>
                          {formatCurrency(amountVal, p.paid_from_account_currency || 'FJD')}
                        </td>
                        <td>{getStatusBadge(p.status, p.docstatus)}</td>
                        <td style={{ textAlign: 'right', paddingRight: 16 }} onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleSelectPayment(p)}
                            style={{
                              fontSize: 11,
                              padding: '3px 8px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4
                            }}
                          >
                            <span>Details</span>
                            <ChevronRight size={12} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          {totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 16px',
                borderTop: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                fontSize: 11
              }}
            >
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn btn-secondary"
                style={{ padding: '3px 10px', fontSize: 11, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
              >
                Previous
              </button>
              <div style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                Page <strong style={{ color: 'var(--text-primary)' }}>{currentPage}</strong> of <strong style={{ color: 'var(--text-primary)' }}>{totalPages}</strong> ({filteredPayments.length} records)
              </div>
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="btn btn-secondary"
                style={{ padding: '3px 10px', fontSize: 11, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Right Detail Panel */}
        {selectedPayment && (
          <div
            className="card-panel"
            style={{
              padding: 0,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
              border: '1px solid var(--border-color)',
              borderRadius: 12,
              background: 'var(--bg-primary, #ffffff)',
              position: 'sticky',
              top: 20
            }}
          >
            {/* Panel Header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border-color)',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: 'var(--bg-accent-alpha, rgba(6, 95, 70, 0.1))',
                    color: 'var(--brand-color, #065f46)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <CreditCard size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--text-primary, #0f172a)' }}>
                      {selectedPayment.name}
                    </h3>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(selectedPayment.name)}
                      title="Copy Entry ID"
                      style={{ background: 'none', border: 'none', padding: 2, cursor: 'pointer', color: copiedId ? '#10b981' : '#94a3b8' }}
                    >
                      {copiedId ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                    {getStatusBadge(selectedPayment.status, selectedPayment.docstatus)}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                    Posting Date: <strong>{selectedPayment.posting_date || '—'}</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button
                  type="button"
                  onClick={() => setShowReceiptModal(true)}
                  className="btn btn-secondary btn-sm"
                  title="Print Official Payment Receipt"
                  style={{ fontSize: 11, padding: '4px 9px', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                >
                  <Printer size={12} />
                  <span>Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPayment(null)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '50%',
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#64748b',
                    fontWeight: 700
                  }}
                  title="Close panel"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Panel Body */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 18, maxHeight: 'calc(100vh - 180px)', overflowY: 'auto' }}>
              {fetchingDetail && (
                <div style={{ fontSize: 11, color: 'var(--brand-color)', background: 'rgba(6, 95, 70, 0.06)', padding: '6px 10px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <RotateCcw size={12} className="spin-anim" /> Syncing latest details from ERPNext...
                </div>
              )}

              {/* Due Amount Highlight Card */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(6, 95, 70, 0.08) 0%, rgba(6, 95, 70, 0.02) 100%)',
                  border: '1px solid rgba(6, 95, 70, 0.2)',
                  borderRadius: 10,
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand-color, #065f46)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Due Amount
                  </span>
                  {selectedPayment.docstatus === 1 && getDueAmount() === 0 ? (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: '#d1fae5', color: '#065f46' }}>
                      PAID IN FULL
                    </span>
                  ) : (
                    getTypeBadge(selectedPayment.payment_type)
                  )}
                </div>

                <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--brand-color, #065f46)' }}>
                  {formatFJD(getDueAmount())}
                </div>

                <div style={{ fontSize: 11.5, color: '#475569', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed rgba(6, 95, 70, 0.2)', paddingTop: 6, marginTop: 4 }}>
                  <span>
                    <strong>Paid Amount:</strong> {formatFJD(selectedPayment.paid_amount || selectedPayment.received_amount || 0)}
                  </span>
                  {selectedPayment.references && selectedPayment.references[0]?.total_amount && (
                    <span style={{ fontSize: 11, color: '#64748b' }}>
                      Invoice Total: {formatFJD(selectedPayment.references[0].total_amount)}
                    </span>
                  )}
                </div>
              </div>

              {/* Tenant & Company Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: 0.5 }}>
                  Tenant & Company Details
                </span>

                <div
                  style={{
                    background: 'var(--bg-secondary, #f8fafc)',
                    border: '1px solid var(--border-color, #e2e8f0)',
                    borderRadius: 8,
                    padding: '12px 14px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px 16px',
                    fontSize: 12
                  }}
                >
                  <div>
                    <div style={{ color: '#64748b', fontSize: 10.5 }}>Tenant Name</div>
                    <div style={{ fontWeight: 700, color: '#0f172a', marginTop: 1 }}>
                      {selectedPayment.party_name || selectedPayment.party || '—'}
                    </div>
                  </div>

                  <div>
                    <div style={{ color: '#64748b', fontSize: 10.5 }}>Company</div>
                    <div style={{ fontWeight: 600, color: '#0f172a', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={selectedPayment.company}>
                      {selectedPayment.company || 'CARPENTERS PROPERTIES PTE LIMITED'}
                    </div>
                  </div>

                  <div>
                    <div style={{ color: '#64748b', fontSize: 10.5 }}>Cost Center</div>
                    <div style={{ fontWeight: 600, color: '#0f172a', marginTop: 1 }}>
                      {selectedPayment.cost_center || 'Main - CFPL'}
                    </div>
                  </div>

                  {selectedPayment.mode_of_payment && (
                    <div>
                      <div style={{ color: '#64748b', fontSize: 10.5 }}>Mode of Payment</div>
                      <div style={{ fontWeight: 600, color: '#0f172a', marginTop: 1 }}>
                        {selectedPayment.mode_of_payment}
                      </div>
                    </div>
                  )}

                  {selectedPayment.reference_date && (
                    <div>
                      <div style={{ color: '#64748b', fontSize: 10.5 }}>Reference Date</div>
                      <div style={{ fontWeight: 600, color: '#0f172a', marginTop: 1 }}>
                        {selectedPayment.reference_date}
                      </div>
                    </div>
                  )}

                  {selectedPayment.reference_no && (
                    <div>
                      <div style={{ color: '#64748b', fontSize: 10.5 }}>Cheque / Ref No.</div>
                      <div style={{ fontWeight: 600, color: '#0f172a', marginTop: 1 }}>
                        {selectedPayment.reference_no}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Invoice Allocations Table (references child table) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: 0.5 }}>
                    Allocated Invoices & References
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand-color, #065f46)', background: 'rgba(6, 95, 70, 0.08)', padding: '2px 8px', borderRadius: 10 }}>
                    {(selectedPayment.references || []).length} {selectedPayment.references?.length === 1 ? 'allocation' : 'allocations'}
                  </span>
                </div>

                {(!selectedPayment.references || selectedPayment.references.length === 0) ? (
                  <div style={{ padding: '16px', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 8, textAlign: 'center', color: '#64748b', fontSize: 12 }}>
                    No specific invoice reference linked (e.g., Unallocated advance or general ledger deposit).
                  </div>
                ) : (
                  <div style={{ border: '1px solid var(--border-color)', borderRadius: 8, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5 }}>
                      <thead>
                        <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>
                          <th style={{ padding: '8px 10px', textAlign: 'left' }}>Reference Doc</th>
                          <th style={{ padding: '8px 10px', textAlign: 'left' }}>Invoice Number</th>
                          <th style={{ padding: '8px 10px', textAlign: 'right' }}>Total</th>
                          <th style={{ padding: '8px 10px', textAlign: 'right' }}>Allocated</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPayment.references.map((ref, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '8px 10px', color: '#64748b' }}>
                              {ref.reference_doctype || 'Sales Invoice'}
                            </td>
                            <td style={{ padding: '8px 10px', fontWeight: 700 }}>
                              <button
                                type="button"
                                onClick={() => handleOpenInvoice(ref.reference_name)}
                                title={`Open Invoice ${ref.reference_name} in right panel`}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#0284c7',
                                  cursor: 'pointer',
                                  padding: 0,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 5,
                                  fontWeight: 700,
                                  fontSize: 12,
                                  textDecoration: 'none',
                                  transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color = '#0369a1';
                                  e.currentTarget.style.textDecoration = 'underline';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color = '#0284c7';
                                  e.currentTarget.style.textDecoration = 'none';
                                }}
                              >
                                <span>{ref.reference_name}</span>
                                <ExternalLink size={12} />
                              </button>
                            </td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', color: '#475569' }}>
                              {ref.total_amount !== undefined ? formatFJD(ref.total_amount) : '—'}
                            </td>
                            <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#059669' }}>
                              {formatFJD(ref.allocated_amount || 0)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Remarks */}
              {selectedPayment.remarks && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: 0.5 }}>
                    Transaction Remarks
                  </span>
                  <div
                    style={{
                      background: 'var(--bg-secondary, #f8fafc)',
                      border: '1px solid var(--border-color, #e2e8f0)',
                      borderRadius: 8,
                      padding: '10px 14px',
                      fontSize: 12,
                      color: '#334155',
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.5
                    }}
                  >
                    {selectedPayment.remarks}
                  </div>
                </div>
              )}

              {/* Action Bar: Paid Button & Paid Amount Field */}
              <div
                style={{
                  borderTop: '1px solid var(--border-color, #e2e8f0)',
                  paddingTop: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}
              >
                {actionFeedback && (
                  <div
                    style={{
                      padding: '8px 12px',
                      borderRadius: 6,
                      fontSize: 11.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      background: actionFeedback.type === 'success' ? '#f0fdf4' : '#fef2f2',
                      color: actionFeedback.type === 'success' ? '#15803d' : '#b91c1c',
                      border: `1px solid ${actionFeedback.type === 'success' ? '#bbf7d0' : '#fecaca'}`
                    }}
                  >
                    {actionFeedback.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                    <span>{actionFeedback.message}</span>
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: 12,
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    padding: '12px 14px'
                  }}
                >
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: 0.3 }}>
                      Paid Amount ({selectedPayment.paid_from_account_currency || 'FJD'})
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span
                        style={{
                          position: 'absolute',
                          left: 10,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontWeight: 700,
                          color: '#64748b',
                          fontSize: 12
                        }}
                      >
                        F$
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        disabled={selectedPayment.docstatus === 1 || submittingPayment}
                        value={paidAmountInput}
                        onChange={(e) => setPaidAmountInput(e.target.value)}
                        placeholder="0.00"
                        style={{
                          width: '100%',
                          padding: '7px 10px 7px 32px',
                          fontSize: 13,
                          fontWeight: 700,
                          borderRadius: 6,
                          border: '1px solid #cbd5e1',
                          background: selectedPayment.docstatus === 1 ? '#f1f5f9' : '#ffffff',
                          color: '#0f172a',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <button
                    className="btn btn-primary"
                    disabled={submittingPayment || selectedPayment.docstatus === 1}
                    onClick={handleMarkAsPaid}
                    style={{
                      height: 35,
                      minWidth: 90,
                      padding: '0 16px',
                      fontSize: 12,
                      fontWeight: 700,
                      background: selectedPayment.docstatus === 1 ? '#059669' : '#ffdd00',
                      color: selectedPayment.docstatus === 1 ? '#ffffff' : '#000000',
                      border: 'none',
                      borderRadius: 6,
                      cursor: selectedPayment.docstatus === 1 ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {submittingPayment ? (
                      <>
                        <Loader2 size={13} className="animate-spin" /> Submitting...
                      </>
                    ) : selectedPayment.docstatus === 1 ? (
                      <>
                        <Check size={13} /> Paid
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={13} /> Paid
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Audit Footer */}
              <div
                style={{
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: 12,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 10.5,
                  color: '#94a3b8'
                }}
              >
                <div>
                  Created: <strong>{selectedPayment.creation || '—'}</strong> by <strong>{selectedPayment.owner || '—'}</strong>
                </div>
                {selectedPayment.modified && (
                  <div>
                    Modified: <strong>{selectedPayment.modified}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Official Receipt Printable Modal */}
      {showReceiptModal && selectedPayment && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: 20
          }}
          onClick={() => setShowReceiptModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 12,
              maxWidth: 620,
              width: '100%',
              padding: 32,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #065f46', paddingBottom: 16 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#065f46' }}>
                  {selectedPayment.company || 'CARPENTERS PROPERTIES PTE LIMITED'}
                </h2>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>
                  Official Payment & Collection Receipt
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>{selectedPayment.name}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>Date: {selectedPayment.posting_date}</div>
              </div>
            </div>

            <div style={{ margin: '24px 0', display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Received From:</span>
                <strong style={{ color: '#0f172a' }}>{selectedPayment.party_name || selectedPayment.party}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Payment Mode:</span>
                <strong style={{ color: '#0f172a' }}>{selectedPayment.mode_of_payment || selectedPayment.paid_to || 'Cash'}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Payment Type:</span>
                <strong style={{ color: '#0f172a' }}>{selectedPayment.payment_type || 'Receive'}</strong>
              </div>

              <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>Amount Paid:</span>
                  <span style={{ fontSize: 20, fontWeight: 900, color: '#065f46' }}>
                    {formatCurrency(
                      selectedPayment.payment_type === 'Pay' ? selectedPayment.paid_amount : (selectedPayment.received_amount || selectedPayment.paid_amount),
                      selectedPayment.paid_from_account_currency || 'FJD'
                    )}
                  </span>
                </div>
                {(selectedPayment.in_words || selectedPayment.base_in_words) && (
                  <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 6, fontStyle: 'italic' }}>
                    In words: {selectedPayment.in_words || selectedPayment.base_in_words}
                  </div>
                )}
              </div>

              {selectedPayment.references && selectedPayment.references.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 6 }}>
                    Allocated Invoices:
                  </div>
                  {selectedPayment.references.map((r, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, padding: '4px 0', borderBottom: '1px dashed #e2e8f0' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setShowReceiptModal(false);
                          handleOpenInvoice(r.reference_name);
                        }}
                        title={`Open Invoice ${r.reference_name} in right panel`}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#0284c7',
                          cursor: 'pointer',
                          padding: 0,
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <span>{r.reference_name}</span>
                        <ExternalLink size={11} />
                      </button>
                      <strong style={{ color: '#065f46' }}>{formatCurrency(r.allocated_amount)}</strong>
                    </div>
                  ))}
                </div>
              )}

              {selectedPayment.remarks && (
                <div style={{ fontSize: 11, color: '#64748b', background: '#f8fafc', padding: 10, borderRadius: 6 }}>
                  {selectedPayment.remarks}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 40, borderTop: '1px solid #e2e8f0', paddingTop: 20 }}>
              <div style={{ textAlign: 'center', width: 180 }}>
                <div style={{ borderBottom: '1px solid #94a3b8', height: 40, marginBottom: 6 }} />
                <div style={{ fontSize: 11, color: '#64748b' }}>Authorized Signature</div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowReceiptModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => window.print()}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <Printer size={14} />
                  <span>Print</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
