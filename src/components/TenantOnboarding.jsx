import React, { useState, useEffect, useRef } from 'react';
import {
  UserCheck,
  Search,
  Plus,
  X,
  FileText,
  Key,
  DollarSign,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Clock,
  Building,
  Mail,
  Phone,
  Trash2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Eye,
  Paperclip,
  Loader2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Edit,
  RefreshCw,
  Info
} from 'lucide-react';

const documentTypes = [
  { key: 'inc', label: 'True Certified copies of Incorporation' },
  { key: 'moa', label: 'Memorandum of Associations Company' },
  { key: 'name_cert', label: 'Business name registration certificate.' },
  { key: 'directors_rep', label: 'Directors Reports' },
  { key: 'tin_letter', label: 'Tin Letter' },
  { key: 'bus_reg_cert', label: 'Business Registration Certificate' },
  { key: 'birth_cert', label: 'Birth Certificate' },
  { key: 'passport_photo', label: 'Passport photo of Directors' },
  { key: 'tin_comp_indiv', label: 'Tin Letter Company and Individual' },
  { key: 'photo_id', label: 'Photo ID Card' }
];

const COUNTRY_CODES = [
  { code: 'FJ', name: 'Fiji', flag: '🇫🇯', prefix: '+679' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', prefix: '+61' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', prefix: '+64' },
  { code: 'US', name: 'United States', flag: '🇺🇸', prefix: '+1' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', prefix: '+44' },
  { code: 'IN', name: 'India', flag: '🇮🇳', prefix: '+91' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', prefix: '+65' }
];

const parsePhoneNumber = (fullNumber) => {
  if (!fullNumber) return { prefix: '+679', local: '' };

  let normalized = fullNumber.toString().trim();
  const sortedCodes = [...COUNTRY_CODES].sort((a, b) => b.prefix.length - a.prefix.length);

  let detectedPrefix = '+679';
  let stripping = true;
  while (stripping) {
    stripping = false;
    for (const c of sortedCodes) {
      if (normalized.startsWith(c.prefix)) {
        detectedPrefix = c.prefix;
        normalized = normalized.slice(c.prefix.length).trim();
        if (normalized.startsWith('-')) {
          normalized = normalized.slice(1).trim();
        }
        stripping = true;
        break;
      }
    }
  }

  const local = normalized.replace(/\D/g, '');
  return { prefix: detectedPrefix, local };
};

const PhoneInputWithDropdown = ({ value, onChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  const parsed = parsePhoneNumber(value);
  const currentCode = COUNTRY_CODES.find(c => c.prefix === parsed.prefix) || COUNTRY_CODES[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCodes = COUNTRY_CODES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.prefix.includes(search)
  );

  return (
    <div style={{ position: 'relative', display: 'flex', width: '100%', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-secondary)', height: '38px', alignItems: 'center' }} ref={dropdownRef}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 10px', height: '100%', cursor: disabled ? 'default' : 'pointer', background: 'var(--bg-primary)', borderTopLeftRadius: '7px', borderBottomLeftRadius: '7px', borderRight: '1px solid var(--border-color)', userSelect: 'none' }}
      >
        <span style={{ fontSize: '16px' }}>{currentCode.flag}</span>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{currentCode.prefix}</span>
        <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', flex: 1, height: '100%' }}>
        <input
          type="tel"
          placeholder="e.g. 999 1234"
          value={parsed.local}
          disabled={disabled}
          onChange={(e) => {
            const newLocal = e.target.value.replace(/\D/g, '');
            // Sends the format as '+91-1234567890' exactly as Frappe Phone expects
            onChange(`${currentCode.prefix}-${newLocal}`);
          }}
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            color: 'var(--text-primary)',
            fontSize: '13px',
            padding: '0 12px',
            outline: 'none',
            width: '100%',
            height: '100%'
          }}
        />
      </div>

      {isOpen && (
        <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '4px', width: '260px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 100, padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 10px', background: 'var(--bg-secondary)', borderRadius: '6px' }}>
            <Search size={14} style={{ color: 'var(--text-muted)' }} />
            <input
              autoFocus
              type="text"
              placeholder="Search for countries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', width: '100%', color: 'var(--text-primary)' }}
            />
          </div>
          <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {filteredCodes.map(c => (
              <div
                key={c.prefix}
                onClick={() => {
                  onChange(`${c.prefix}-${parsed.local}`);
                  setIsOpen(false);
                  setSearch('');
                }}
                style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', borderRadius: '4px' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: '16px' }}>{c.flag}</span>
                <span style={{ fontSize: '13px', color: 'var(--text-primary)', flex: 1 }}>{c.name}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>({c.prefix})</span>
              </div>
            ))}
            {filteredCodes.length === 0 && (
              <div style={{ padding: '10px', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>No countries found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const extractErrorMessage = async (res) => {
  let message = "An error occurred with the request.";
  try {
    const errJson = await res.json();
    let serverMsgs = '';
    if (errJson._server_messages) {
      try {
        const parsedMsgs = JSON.parse(errJson._server_messages);
        serverMsgs = parsedMsgs.map(m => {
          try {
            const item = JSON.parse(m);
            return item.message;
          } catch {
            return m.message || m;
          }
        }).join('\n');
      } catch {
        serverMsgs = errJson._server_messages;
      }
    }
    message = errJson.exception || serverMsgs || errJson.message || message;
  } catch (e) {
    console.warn("Failed parsing error json:", e);
  }
  return message;
};

const isFieldRequired = (field, formValues = {}) => {
  if (!field) return false;
  const selectedType = formValues?.type || '';

  // If conditionally hidden based on Type, it is not required
  if (field.fieldname === 'date_of_birth' && selectedType !== 'Individual') {
    return false;
  }
  if (field.fieldname === 'date_of_incorporation' && selectedType !== 'Company') {
    return false;
  }

  const isInternal = !!formValues?.is_internal_customer;
  const fieldLabelLower = (field.label || '').toLowerCase();
  const fieldNameLower = (field.fieldname || '').toLowerCase();
  if (!isInternal) {
    if (fieldLabelLower.includes('represents company') || fieldNameLower.includes('represents_company')) {
      return false;
    }
    if (fieldLabelLower.includes('allowed to transact with') || fieldNameLower.includes('allowed_to_transact_with') || fieldNameLower.includes('allowed_to_transact')) {
      return false;
    }
  }

  if (selectedType === 'Company') {
    if (field.fieldname === 'company_name' || field.fieldname === 'company_vat_id' || field.fieldname === 'company_tin_id' || field.fieldname === 'tax_id') {
      return true;
    }
  }

  if (selectedType === 'Individual') {
    if (field.fieldname === 'company_name' || field.fieldname === 'company_tin_id' || field.fieldname === 'company_vat_id' || field.fieldname === 'tax_id' || field.fieldname === 'date_of_incorporation') {
      return false;
    }
    if (field.fieldname === 'date_of_birth') {
      return true;
    }
  }

  return field.reqd === 1 || field.reqd === '1' || field.reqd === true;
};

const isPhoneField = (field) => {
  if (!field) return false;
  const fieldtype = field.fieldtype;
  return fieldtype === 'Phone' ||
    (fieldtype === 'Data' && (
      field.fieldname.toLowerCase().includes('phone') ||
      field.fieldname.toLowerCase().includes('mobile') ||
      field.fieldname.toLowerCase().includes('contact_number')
    ));
};

const validatePhoneValue = (phoneVal, label) => {
  if (!phoneVal) return true;
  const parsed = parsePhoneNumber(phoneVal);
  const prefix = parsed.prefix;
  const cleanedLocal = parsed.local.replace(/\D/g, '');

  if (!cleanedLocal) return true;

  if (prefix === '+679') {
    if (cleanedLocal.length !== 7) {
      alert(`${label}: Fiji phone number must be exactly 7 digits.`);
      return false;
    }
    if (!/^[2356789]/.test(cleanedLocal)) {
      alert(`${label}: Fiji phone number must start with 2, 3, 5, 6, 7, 8, or 9.`);
      return false;
    }
  }
  if (prefix === '+61') {
    if (cleanedLocal.length !== 9) {
      alert(`${label}: Australia phone number must be exactly 9 digits.`);
      return false;
    }
  }
  if (prefix === '+64') {
    if (cleanedLocal.length < 8 || cleanedLocal.length > 9) {
      alert(`${label}: New Zealand phone number must be 8 or 9 digits.`);
      return false;
    }
  }
  if (prefix === '+91') {
    if (cleanedLocal.length !== 10) {
      alert(`${label}: India phone number must be exactly 10 digits.`);
      return false;
    }
    if (!/^[6789]/.test(cleanedLocal)) {
      alert(`${label}: India mobile number must start with 6, 7, 8, or 9.`);
      return false;
    }
  }
  if (prefix === '+1') {
    if (cleanedLocal.length !== 10) {
      alert(`${label}: US phone number must be exactly 10 digits.`);
      return false;
    }
    if (!/^[23456789]/.test(cleanedLocal)) {
      alert(`${label}: US area code cannot start with 0 or 1.`);
      return false;
    }
  }
  if (prefix === '+65') {
    if (cleanedLocal.length !== 8) {
      alert(`${label}: Singapore phone number must be exactly 8 digits.`);
      return false;
    }
    if (!/^[3689]/.test(cleanedLocal)) {
      alert(`${label}: Singapore phone number must start with 3, 6, 8, or 9.`);
      return false;
    }
  }
  return true;
};

const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getYesterdayDateString = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const isPastOnlyDateFieldName = (fieldname, label) => {
  const fnLower = (fieldname || '').toLowerCase();
  const lblLower = (label || '').toLowerCase();
  return fnLower === 'date_of_birth' || 
         fnLower === 'date_of_incorporation' ||
         lblLower.includes('date of birth') || 
         lblLower.includes('date of incorporation') ||
         lblLower.includes('incorporation date');
};

const validatePastOnlyDateField = (val, label, fieldname) => {
  if (!val) return true;
  const fnLower = (fieldname || '').toLowerCase();
  const lblLower = (label || '').toLowerCase();
  
  const isDob = fnLower === 'date_of_birth' || lblLower.includes('date of birth');
  const isDoinc = fnLower === 'date_of_incorporation' || lblLower.includes('date of incorporation') || lblLower.includes('incorporation date');

  if (isDob || isDoinc) {
    const todayStr = getTodayDateString();
    if (val >= todayStr) {
      const fieldTitle = isDob ? 'Date of Birth' : 'Date of Incorporation';
      alert(`${label ? label + ': ' : ''}${fieldTitle} cannot be today or a future date.`);
      return false;
    }
  }
  return true;
};

const isFutureOrTodayDateFieldName = (fieldname, label) => {
  const fnLower = (fieldname || '').toLowerCase();
  const lblLower = (label || '').toLowerCase();
  return fnLower === 'lease_commencement_date' || 
         fnLower === 'vacant_possession_date' ||
         lblLower.includes('lease commencement') || 
         lblLower.includes('vacant possession');
};

const validateFutureOrTodayDateField = (val, label, fieldname) => {
  if (!val) return true;
  const fnLower = (fieldname || '').toLowerCase();
  const lblLower = (label || '').toLowerCase();
  
  const isLeaseComm = fnLower === 'lease_commencement_date' || lblLower.includes('lease commencement');
  const isVacantPoss = fnLower === 'vacant_possession_date' || lblLower.includes('vacant possession');

  if (isLeaseComm || isVacantPoss) {
    const todayStr = getTodayDateString();
    if (val < todayStr) {
      const fieldTitle = isLeaseComm ? 'Lease Commencement Date' : 'Vacant Possession Date';
      alert(`${label ? label + ': ' : ''}${fieldTitle} should not be a past date.`);
      return false;
    }
  }
  return true;
};

const DynamicFormField = ({ field, value, onChange, linkOptionsCache, fetchLinkOptions, getDocTypeFields, erpnextConfig, getCsrfToken, formValues = {}, isNew = false }) => {
  const fieldtype = field.fieldtype;
  let label = field.label || field.fieldname;
  if (label === 'Required Space' || label === 'Required Space (sq mtr)' || label === 'Space Required') {
    label = 'Required Space(Sq Ft)';
  }
  if (label === 'Rental Budget' || label === 'Rental Budget ($)' || label === 'Budget') {
    label = 'Rental Budget(FJD)';
  }
  const isRequired = isFieldRequired(field, formValues);
  const isReadOnly = !!field.read_only;

  const getPlaceholder = (label, fieldname) => {
    const lblLower = (label || '').toLowerCase();
    const nameLower = (fieldname || '').toLowerCase();

    if (lblLower.includes('contact name')) return 'e.g. John Doe';
    if (lblLower.includes('company name')) return 'e.g. Acme Corporation';
    if (lblLower.includes('company tin') || lblLower.includes('vat') || nameLower.includes('vat') || nameLower.includes('tin')) return 'e.g. 12-3456789';
    if (lblLower.includes('email')) return 'e.g. john.doe@example.com';
    if (lblLower.includes('address line 1')) return 'e.g. 123 Main St';
    if (lblLower.includes('address line 2')) return 'e.g. Suite 400';
    if (lblLower.includes('locality')) return 'e.g. Suva';
    if (lblLower.includes('state')) return 'e.g. Central';
    if (lblLower.includes('proposed business')) return 'e.g. Retail Shop';
    if (lblLower.includes('space') || nameLower.includes('space')) return 'e.g. 150';
    if (lblLower.includes('budget') || nameLower.includes('budget')) return 'e.g. 5000';
    if (lblLower.includes('land and building') || nameLower.includes('land_and_building')) return 'e.g. Tower A';

    return `e.g. ${label || fieldname}`;
  };

  const [childFields, setChildFields] = useState([]);
  const [loadingChild, setLoadingChild] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [localExpanded, setLocalExpanded] = useState({});

  // Fetch Link options dynamically
  useEffect(() => {
    if (fieldtype === 'Link' && field.options) {
      fetchLinkOptions(field.options);
    }
  }, [fieldtype, field.options]);

  // Default values initialization for Select and Link fields
  useEffect(() => {
    if ((fieldtype === 'Select' || fieldtype === 'Link') && field.default && (value === undefined || value === null || value === '')) {
      if (field.fieldname !== 'type') {
        onChange(field.default);
      }
    }
  }, [fieldtype, field.default, value, onChange]);

  // Fetch child table schema dynamically if type is Table
  useEffect(() => {
    if (fieldtype === 'Table' && field.options && getDocTypeFields) {
      setLoadingChild(true);
      getDocTypeFields(field.options).then(fields => {
        if (Array.isArray(fields)) {
          setChildFields(fields.filter(f => f.hidden !== 1));
        }
        setLoadingChild(false);
      }).catch(err => {
        console.warn("Failed to load child fields for " + field.options, err);
        setLoadingChild(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldtype, field.options]);

  // Style for label
  const labelStyle = {
    display: 'block',
    fontSize: '12.5px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: 0,
    textAlign: 'left'
  };

  // Standard input style
  const inputStyle = {
    width: '100%',
    height: '38px',
    padding: '8px 12px',
    fontSize: '13px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    background: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    outline: 'none'
  };

  // Select input style
  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer'
  };

  // Textarea input style
  const textareaStyle = {
    ...inputStyle,
    height: 'auto',
    padding: '8px 12px',
    resize: 'vertical'
  };

  const fieldContainerStyle = {
    display: 'grid',
    gridTemplateColumns: '130px 1fr',
    alignItems: 'center',
    gap: '12px',
    width: '100%'
  };

  const fieldContainerStartStyle = {
    ...fieldContainerStyle,
    alignItems: 'start',
    gridColumn: 'span 2'
  };

  const isPhone = fieldtype === 'Phone' ||
    (fieldtype === 'Data' && (
      field.fieldname.toLowerCase().includes('phone') ||
      field.fieldname.toLowerCase().includes('mobile') ||
      field.fieldname.toLowerCase().includes('contact_number')
    ));

  if (isPhone) {
    return (
      <div style={fieldContainerStyle}>
        <label style={labelStyle}>
          {label} {isRequired && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
        <PhoneInputWithDropdown
          value={value || ''}
          onChange={onChange}
          disabled={isReadOnly}
        />
      </div>
    );
  }

  // Render based on field type
  switch (fieldtype) {
    case 'Section Break':
      return (
        <div style={{ width: '100%', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '12px', gridColumn: '1 / -1' }}>
          <h4 style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--brand-color)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
            {label}
          </h4>
        </div>
      );

    case 'Column Break':
      return null;

    case 'Heading':
      return (
        <div style={{ width: '100%', paddingTop: '8px', gridColumn: '1 / -1' }}>
          <h5 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
            {label}
          </h5>
        </div>
      );

    case 'Color':
      return (
        <div style={fieldContainerStyle}>
          <label style={labelStyle}>
            {label} {isRequired && <span style={{ color: '#ef4444' }}>*</span>}
          </label>
          <input
            type="color"
            value={value || '#000000'}
            onChange={(e) => onChange(e.target.value)}
            disabled={isReadOnly}
            style={{ ...inputStyle, padding: '2px 8px', height: '40px', cursor: 'pointer' }}
          />
        </div>
      );

    case 'Datetime':
      return (
        <div style={fieldContainerStyle}>
          <label style={labelStyle}>
            {label} {isRequired && <span style={{ color: '#ef4444' }}>*</span>}
          </label>
          <input
            type="datetime-local"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={isReadOnly}
            style={inputStyle}
          />
        </div>
      );

    case 'Time':
      return (
        <div style={fieldContainerStyle}>
          <label style={labelStyle}>
            {label} {isRequired && <span style={{ color: '#ef4444' }}>*</span>}
          </label>
          <input
            type="time"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={isReadOnly}
            style={inputStyle}
          />
        </div>
      );

    case 'Read Only':
      return (
        <div style={fieldContainerStyle}>
          <label style={labelStyle}>{label}</label>
          <input
            type="text"
            value={value || ''}
            disabled
            style={{ ...inputStyle, background: 'var(--bg-tertiary)', color: 'var(--text-muted)', cursor: 'not-allowed' }}
          />
        </div>
      );

    case 'Signature':
      return (
        <div style={fieldContainerStyle}>
          <label style={labelStyle}>
            {label} {isRequired && <span style={{ color: '#ef4444' }}>*</span>}
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Signature / Draw (URL or data URI)"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              disabled={isReadOnly}
              style={{ ...inputStyle, flex: 1 }}
            />
            <button
              type="button"
              disabled={isReadOnly}
              style={{
                padding: '10px 16px',
                fontSize: '12px',
                fontWeight: 600,
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-primary)',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
              onClick={() => {
                const val = prompt(`Enter signature text or link for ${label}:`);
                if (val !== null) onChange(val);
              }}
            >
              Sign Document
            </button>
          </div>
        </div>
      );

    case 'Check':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', height: '100%', minHeight: '38px' }}>
          <input
            type="checkbox"
            id={field.fieldname}
            checked={!!value}
            onChange={(e) => onChange(e.target.checked ? 1 : 0)}
            disabled={isReadOnly}
            style={{
              width: '18px',
              height: '18px',
              accentColor: 'var(--brand-color)',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          />
          <label htmlFor={field.fieldname} style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer', userSelect: 'none', margin: 0 }}>
            {label} {isRequired && <span style={{ color: '#ef4444' }}>*</span>}
          </label>
        </div>
      );

    case 'Select':
      return (
        <div style={fieldContainerStyle}>
          <label style={labelStyle}>
            {label} {isRequired && <span style={{ color: '#ef4444' }}>*</span>}
          </label>
          <select
            value={value !== undefined && value !== null && value !== '' ? value : (field.fieldname === 'type' ? '' : (field.default || ''))}
            onChange={(e) => onChange(e.target.value)}
            disabled={isReadOnly}
            style={selectStyle}
          >
            <option value="">-- Select {label} --</option>
            {field.options && field.options.split('\n').filter(Boolean).map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      );

    case 'Link':
      const linkedOptions = linkOptionsCache[field.options] || [];
      return (
        <div style={fieldContainerStyle}>
          <label style={labelStyle}>
            {label} {isRequired && <span style={{ color: '#ef4444' }}>*</span>}
          </label>
          <select
            value={value !== undefined && value !== null && value !== '' ? value : (field.fieldname === 'type' ? '' : (field.default || ''))}
            onChange={(e) => onChange(e.target.value)}
            disabled={isReadOnly}
            style={selectStyle}
          >
            <option value="">-- Select {label} (Link) --</option>
            {linkedOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      );

    case 'Date':
      const isPastOnly = isPastOnlyDateFieldName(field.fieldname, label);
      const isFutureOrToday = isFutureOrTodayDateFieldName(field.fieldname, label);
      return (
        <div style={fieldContainerStyle}>
          <label style={labelStyle}>
            {label} {isRequired && <span style={{ color: '#ef4444' }}>*</span>}
          </label>
          <input
            type="date"
            max={isPastOnly ? getYesterdayDateString() : undefined}
            min={isFutureOrToday ? getTodayDateString() : undefined}
            value={value || ''}
            onChange={(e) => {
              const newVal = e.target.value;
              if (isPastOnly && newVal && newVal >= getTodayDateString()) {
                const title = (field.fieldname === 'date_of_birth' || label.toLowerCase().includes('date of birth')) ? 'Date of Birth' : 'Date of Incorporation';
                alert(`${title} cannot be today or a future date.`);
                onChange('');
                return;
              }
              if (isFutureOrToday && newVal && newVal < getTodayDateString()) {
                const title = (field.fieldname === 'lease_commencement_date' || label.toLowerCase().includes('lease commencement')) ? 'Lease Commencement Date' : 'Vacant Possession Date';
                alert(`${title} should not be a past date.`, 'error');
                onChange('');
                return;
              }
              onChange(newVal);
            }}
            disabled={isReadOnly}
            style={inputStyle}
          />
        </div>
      );

    case 'Small Text':
    case 'Text':
    case 'Long Text':
    case 'Code':
      return (
        <div style={fieldContainerStartStyle}>
          <label style={{ ...labelStyle, marginTop: '8px' }}>
            {label} {isRequired && <span style={{ color: '#ef4444' }}>*</span>}
          </label>
          <textarea
            rows={3}
            placeholder={getPlaceholder(label, field.fieldname)}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={isReadOnly}
            style={textareaStyle}
          />
        </div>
      );

    case 'Int':
    case 'Float':
    case 'Currency':
    case 'Percent':
      return (
        <div style={fieldContainerStyle}>
          <label style={labelStyle}>
            {label} {isRequired && <span style={{ color: '#ef4444' }}>*</span>}
          </label>
          <input
            type="number"
            step={fieldtype === 'Int' ? '1' : 'any'}
            min={(
              field.fieldname === 'required_space' ||
              field.fieldname === 'budget' ||
              field.fieldname === 'lease_period' ||
              field.fieldname === 'rental_charges' ||
              field.fieldname === 'service_promotional_charges' ||
              field.fieldname === 'security_deposit_booking_fee' ||
              field.fieldname === 'fitout_period'
            ) ? (fieldtype === 'Int' ? "1" : "0.01") : undefined}
            placeholder={getPlaceholder(label, field.fieldname).includes(label) ? '0' : getPlaceholder(label, field.fieldname)}
            value={value === undefined || value === null ? '' : value}
            onChange={(e) => {
              if (e.target.value === '') {
                onChange('');
              } else {
                const val = Number(e.target.value);
                onChange(fieldtype === 'Int' ? Math.floor(val) : val);
              }
            }}
            disabled={isReadOnly}
            style={inputStyle}
          />
        </div>
      );

    case 'Password':
      return (
        <div style={fieldContainerStyle}>
          <label style={labelStyle}>
            {label} {isRequired && <span style={{ color: '#ef4444' }}>*</span>}
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={isReadOnly}
            style={inputStyle}
          />
        </div>
      );

    case 'Attach':
    case 'Attach Image':
      return (
        <div style={fieldContainerStyle}>
          <label style={labelStyle}>
            {label} {isRequired && <span style={{ color: '#ef4444' }}>*</span>}
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '0 16px',
                height: '38px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-secondary)',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: uploading || isReadOnly ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              {uploading ? <Loader2 size={14} className="spin" /> : <Paperclip size={14} />}
              <span>{uploading ? 'Uploading...' : 'Choose File'}</span>
              <input
                type="file"
                disabled={uploading || isReadOnly}
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file || !erpnextConfig?.url) return;

                  setUploading(true);
                  const formData = new FormData();
                  formData.append('file', file);
                  formData.append('is_private', '0');

                  try {
                    const res = await fetch(`${erpnextConfig.url}/api/method/upload_file`, {
                      method: 'POST',
                      credentials: 'include',
                      headers: {
                        'X-Frappe-CSRF-Token': getCsrfToken ? getCsrfToken() : ''
                      },
                      body: formData
                    });
                    if (res.ok) {
                      const json = await res.json();
                      const fileUrl = json.message?.file_url || json.file_url;
                      if (fileUrl) {
                        onChange(fileUrl);
                      } else {
                        alert("Upload succeeded but file URL not returned.");
                      }
                    } else {
                      alert("File upload failed.");
                    }
                  } catch (err) {
                    console.error("Error uploading file:", err);
                    alert("Error uploading file.");
                  } finally {
                    setUploading(false);
                  }
                }}
                style={{ display: 'none' }}
              />
            </label>

            {value ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                <CheckCircle size={14} style={{ color: '#10b981' }} />
                <span style={{ fontSize: '12px', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {String(value).split('/').pop()}
                </span>
                <button
                  type="button"
                  onClick={() => onChange('')}
                  disabled={isReadOnly}
                  style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px', fontWeight: 600, padding: 0 }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No file chosen</span>
            )}
          </div>
        </div>
      );

    case 'Table':
      if (field.fieldname === 'company_search_documents') {
        const docList = Array.isArray(value) ? value : [];

        const docTypeField = childFields.find(cf => cf.fieldname === 'document_type');
        const fetchedLabels = docTypeField?.options
          ? docTypeField.options.split('\n').filter(Boolean).map(opt => opt.trim())
          : [];

        const labelsToUse = fetchedLabels.length > 0 ? fetchedLabels : [
          'True Certified Copies of Incorporation',
          'Memorandum of Associations Company',
          'Business Name Registration Certificate',
          'Directors Reports',
          'Tin Letter',
          'Business Registration Certificate',
          'Birth Certificate',
          'Passport photo of Directors',
          'Tin Letter Company and Individual',
          'Photo ID Card'
        ];

        const standardTypes = labelsToUse.map((label, idx) => ({
          key: `doc_${idx}`,
          label: label
        }));

        // Map standard items
        const standardDocsMapped = standardTypes.map(st => {
          const found = docList.find(d =>
            d.document_type?.toLowerCase().trim() === st.label.toLowerCase().trim()
          );
          return {
            key: st.key,
            label: st.label,
            docObj: found,
            isStandard: true
          };
        });

        // Map custom items
        const standardLabelsLower = new Set(standardTypes.map(st => st.label.toLowerCase().trim()));
        const customDocsMapped = docList
          .filter(d => d.document_type && !standardLabelsLower.has(d.document_type.toLowerCase().trim()))
          .map((d, index) => ({
            key: `custom_${index}`,
            label: d.document_type,
            docObj: d,
            isStandard: false
          }));

        const combinedDocs = [...standardDocsMapped, ...customDocsMapped];

        const handleUpdateItemDoc = (label, url) => {
          const existingIdx = docList.findIndex(d => d.document_type?.toLowerCase().trim() === label.toLowerCase().trim());
          if (existingIdx !== -1) {
            const updated = docList.map((d, idx) => {
              if (idx === existingIdx) {
                return { ...d, document: url };
              }
              return d;
            });
            onChange(updated);
          } else {
            const newRow = { document_type: label, document: url, verified: 0 };
            onChange([...docList, newRow]);
          }
        };

        const handleToggleItemVerified = (label, verifiedVal) => {
          const existingIdx = docList.findIndex(d => d.document_type?.toLowerCase().trim() === label.toLowerCase().trim());
          if (existingIdx !== -1) {
            const updated = docList.map((d, idx) => {
              if (idx === existingIdx) {
                return { ...d, verified: verifiedVal ? 1 : 0 };
              }
              return d;
            });
            onChange(updated);
          } else {
            const newRow = { document_type: label, document: '', verified: verifiedVal ? 1 : 0 };
            onChange([...docList, newRow]);
          }
        };

        return (
          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
            {!isNew && (
              <h4 style={{ margin: '0 0 4px 0', fontSize: '13px', color: 'var(--brand-color, #2563eb)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>
                Company Search Audit Checklist
              </h4>
            )}
            {combinedDocs.map((item) => {
              const fileUrl = item.docObj?.document || '';
              const isVerified = !!item.docObj?.verified;
              const isExpanded = !!localExpanded[item.key];

              let statusText = 'Upload';
              let statusColor = 'var(--text-muted, #94a3b8)';
              let statusBg = 'rgba(156, 163, 175, 0.1)';
              if (fileUrl) {
                if (isVerified) {
                  statusText = 'Verified';
                  statusColor = '#10b981';
                  statusBg = 'rgba(16, 185, 129, 0.1)';
                } else {
                  statusText = 'Needs Verification';
                  statusColor = '#d97706';
                  statusBg = 'rgba(217, 119, 6, 0.1)';
                }
              }

              return (
                <div
                  key={item.key}
                  style={{
                    background: 'var(--bg-primary, #ffffff)',
                    border: '1px solid var(--border-color, #e2e8f0)',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                    overflow: 'hidden'
                  }}
                >
                  {/* Header Row - Click to collapse/expand */}
                  <div
                    onClick={() => setLocalExpanded(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                    style={{
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      background: isExpanded ? 'var(--bg-secondary, #f8fafc)' : 'transparent',
                      transition: 'background 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                      {isExpanded ? <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} /> : <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />}
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary, #0f172a)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.label}
                      </span>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: statusBg,
                        color: statusColor,
                        marginLeft: '8px'
                      }}>
                        {statusText}
                      </span>
                    </div>

                    {/* Verify toggle checkbox */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label
                        onClick={(e) => e.stopPropagation()} // Prevent expand toggle when clicking checkbox
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: fileUrl ? 'pointer' : 'not-allowed',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          opacity: fileUrl ? 1 : 0.4,
                          color: 'var(--text-secondary, #475569)'
                        }}
                      >
                        <input
                          type="checkbox"
                          disabled={!fileUrl}
                          checked={isVerified}
                          onChange={(e) => handleToggleItemVerified(item.label, e.target.checked)}
                          style={{ accentColor: 'var(--brand-color, #2563eb)' }}
                        />
                        <span>Verify Draft</span>
                      </label>
                    </div>
                  </div>

                  {/* Expanded Content Panel */}
                  {isExpanded && (
                    <div style={{
                      padding: '16px',
                      borderTop: '1px solid var(--border-color, #e2e8f0)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      background: 'var(--bg-secondary, #f8fafc)'
                    }}>
                      {fileUrl ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              const fullUrl = fileUrl.startsWith('http') ? fileUrl : `${erpnextConfig.url}${fileUrl}`;
                              window.open(fullUrl, '_blank');
                            }}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--brand-color, #2563eb)',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: 0,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <Eye size={13} style={{ flexShrink: 0 }} />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              Preview: {fileUrl.split('/').pop()}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleUpdateItemDoc(item.label, '')}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '4px 8px',
                              borderRadius: '4px',
                              border: '1px solid var(--border-color, #e2e8f0)',
                              marginLeft: 'auto',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <label style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            border: '1px solid var(--border-color, #cbd5e1)',
                            background: 'var(--bg-primary, #ffffff)',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: uploading || isReadOnly ? 'not-allowed' : 'pointer',
                            width: 'fit-content',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            transition: 'all 0.2s'
                          }}>
                            {uploading ? <Loader2 size={14} className="spin" /> : <Paperclip size={14} />}
                            <span>{uploading ? 'Uploading...' : 'Attach Document'}</span>
                            <input
                              type="file"
                              disabled={uploading || isReadOnly}
                              onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file || !erpnextConfig?.url) return;

                                setUploading(true);
                                const formData = new FormData();
                                formData.append('file', file);
                                formData.append('is_private', '0');

                                try {
                                  const res = await fetch(`${erpnextConfig.url}/api/method/upload_file`, {
                                    method: 'POST',
                                    credentials: 'include',
                                    headers: {
                                      'X-Frappe-CSRF-Token': getCsrfToken ? getCsrfToken() : ''
                                    },
                                    body: formData
                                  });
                                  if (res.ok) {
                                    const json = await res.json();
                                    const fileUrl = json.message?.file_url || json.file_url;
                                    if (fileUrl) {
                                      handleUpdateItemDoc(item.label, fileUrl);
                                    } else {
                                      alert("Upload succeeded but file URL not returned.");
                                    }
                                  } else {
                                    alert("File upload failed.");
                                  }
                                } catch (err) {
                                  console.error("Error uploading file:", err);
                                  alert("Error uploading file.");
                                } finally {
                                  setUploading(false);
                                }
                              }}
                              style={{ display: 'none' }}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      }

      const rows = Array.isArray(value) ? value : [];
      return (
        <div style={{ gridColumn: 'span 2', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', background: 'var(--bg-primary)', marginTop: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-color)' }}>
              📋 {label} ({field.options})
            </span>
            <button
              type="button"
              onClick={() => {
                const newRow = {};
                childFields.forEach(cf => {
                  if (cf.fieldname) newRow[cf.fieldname] = cf.default || '';
                });
                onChange([...rows, newRow]);
              }}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 600,
                borderRadius: '8px',
                background: 'var(--bg-accent-alpha, rgba(37, 99, 235, 0.08))',
                color: 'var(--brand-color)',
                border: '1.5px solid var(--brand-color)',
                cursor: 'pointer'
              }}
            >
              + Add Row
            </button>
          </div>

          {loadingChild ? (
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '12px' }}>Loading child table structure...</div>
          ) : rows.length === 0 ? (
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '20px', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>
              No rows added yet. Click "+ Add Row" to add item records.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {rows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '16px 12px 12px 12px',
                    background: 'var(--bg-secondary)',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      const updated = rows.filter((_, idx) => idx !== rowIndex);
                      onChange(updated);
                    }}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'transparent',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 600
                    }}
                  >
                    Remove
                  </button>

                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '8px', flexWrap: 'wrap', paddingRight: '60px' }}>
                    {childFields.map(cf => {
                      const val = row[cf.fieldname];
                      const setVal = (newVal) => {
                        const updated = rows.map((r, idx) => {
                          if (idx === rowIndex) {
                            return { ...r, [cf.fieldname]: newVal };
                          }
                          return r;
                        });
                        onChange(updated);
                      };

                      return (
                        <div
                          key={cf.fieldname}
                          style={{
                            flex: cf.fieldtype === 'Check' ? '0 0 auto' : '1',
                            minWidth: cf.fieldtype === 'Check' ? 'auto' : '160px',
                            alignSelf: cf.fieldtype === 'Check' ? 'flex-end' : 'auto',
                            marginBottom: cf.fieldtype === 'Check' ? '8px' : '0'
                          }}
                        >
                          <DynamicFormField
                            field={cf}
                            value={val}
                            onChange={setVal}
                            linkOptionsCache={linkOptionsCache}
                            fetchLinkOptions={fetchLinkOptions}
                            getDocTypeFields={getDocTypeFields}
                            erpnextConfig={erpnextConfig}
                            getCsrfToken={getCsrfToken}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );

    default: // Data, Autocomplete, Read Only, etc.
      return (
        <div style={fieldContainerStyle}>
          <label style={labelStyle}>
            {label} {isRequired && <span style={{ color: '#ef4444' }}>*</span>}
          </label>
          <input
            type="text"
            placeholder={getPlaceholder(label, field.fieldname)}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={isReadOnly}
            style={inputStyle}
          />
        </div>
      );
  }
};

export default function TenantOnboarding({ erpnextConfig, getCsrfToken }) {
  const [onboardings, setOnboardings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCase, setSelectedCase] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [caseDocuments, setCaseDocuments] = useState({});
  const [workflowState, setWorkflowState] = useState(null);
  const [loadingWorkflow, setLoadingWorkflow] = useState(false);

  // Edit mode states for Business Proposal and Booking Form
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [editProposedBusinessType, setEditProposedBusinessType] = useState('');
  const [editRequiredSpace, setEditRequiredSpace] = useState('');
  const [editBudget, setEditBudget] = useState('');
  const [editLeasePeriod, setEditLeasePeriod] = useState('');
  const [editShopSpaceLocation, setEditShopSpaceLocation] = useState('');
  const [editRentalCharges, setEditRentalCharges] = useState('');
  const [editServicePromoCharges, setEditServicePromoCharges] = useState('');
  const [editSecurityDepositFee, setEditSecurityDepositFee] = useState('');
  const [editFitoutPeriod, setEditFitoutPeriod] = useState('');
  const [editUsageOfDemisedPremises, setEditUsageOfDemisedPremises] = useState('');
  const [editBusinessStatus, setEditBusinessStatus] = useState('New');
  const [editProductServiceRange, setEditProductServiceRange] = useState('');
  const [editFitoutApprovalTimeframe, setEditFitoutApprovalTimeframe] = useState('');
  const [editContactName, setEditContactName] = useState('');
  const [editEmailId, setEditEmailId] = useState('');
  const [editContactPrefix, setEditContactPrefix] = useState('+679');
  const [editContactLocal, setEditContactLocal] = useState('');
  const [editLeaseCommencementDate, setEditLeaseCommencementDate] = useState('');
  const [editVacantPossessionDate, setEditVacantPossessionDate] = useState('');
  const [editPlansForApproval, setEditPlansForApproval] = useState('');
  const [editCompanyName, setEditCompanyName] = useState('');
  const [editMenuAndBusinessPictures, setEditMenuAndBusinessPictures] = useState('');

  // New basic details edit fields
  const [editType, setEditType] = useState('Company');
  const [editCompanyVatId, setEditCompanyVatId] = useState('');
  const [editIsInternalCustomer, setEditIsInternalCustomer] = useState(false);
  const [editDateOfBirth, setEditDateOfBirth] = useState('');
  const [editAddressLine1, setEditAddressLine1] = useState('');
  const [editAddressLine2, setEditAddressLine2] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editState, setEditState] = useState('');
  const [editCountry, setEditCountry] = useState('Fiji');

  const [updatingDetails, setUpdatingDetails] = useState(false);
  const [checklistDrafts, setChecklistDrafts] = useState({});

  const [alertModal, setAlertModal] = useState({ show: false, title: '', message: '', type: 'info' });
  const showAlert = (message, type = 'info', title = '') => {
    const defaultTitle = type === 'error' ? 'Attention Required' : (type === 'success' ? 'Success' : 'Notification');
    setAlertModal({
      show: true,
      title: title || defaultTitle,
      message: message,
      type: type
    });
  };

  const alert = (message, type = 'info') => {
    let detectedType = type;
    if (type === 'info') {
      const lower = String(message).toLowerCase();
      if (lower.includes('fail') || lower.includes('error') || lower.includes('invalid') || lower.includes('cannot') || lower.includes('must') || lower.includes('should') || lower.includes('required') || lower.includes('empty')) {
        detectedType = 'error';
      } else if (lower.includes('success') || lower.includes('succeeded') || lower.includes('successfully')) {
        detectedType = 'success';
      }
    }
    showAlert(message, detectedType);
  };

  const [confirmModal, setConfirmModal] = useState({ show: false, message: '', resolve: null });
  const confirm = (message) => {
    return new Promise((resolve) => {
      setConfirmModal({
        show: true,
        message,
        resolve
      });
    });
  };

  useEffect(() => {
    setChecklistDrafts({});
  }, [selectedCase?.name]);

  // Reset page to 1 when search query or filter changes
  // Fetch detailed information (including child table documents) for visible items in the current page
  useEffect(() => {
    if (!erpnextConfig?.url || onboardings.length === 0) return;

    // Determine currently visible items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const filteredCases = onboardings.filter(c => {
      const matchesSearch = (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.proposed_business_type || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.shop_space_location || '').toLowerCase().includes(searchQuery.toLowerCase());

      if (statusFilter === 'All') return matchesSearch;
      return matchesSearch && c.business_status === statusFilter;
    });

    const visibleItems = filteredCases.slice(indexOfFirstItem, indexOfLastItem);
    const itemsToFetch = visibleItems.filter(item => !caseDocuments[item.name]);

    if (itemsToFetch.length === 0) return;

    const fetchDetailsForItems = async () => {
      try {
        await Promise.all(itemsToFetch.map(async (item) => {
          const res = await fetch(`${erpnextConfig.url}/api/resource/Tenant Onboarding/${encodeURIComponent(item.name)}`, {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
          });
          if (res.ok) {
            const json = await res.json();
            const detail = json.data || json;
            if (detail) {
              const docList = detail.company_search_documents || [];
              setCaseDocuments(prev => ({
                ...prev,
                [detail.name]: docList
              }));
              if (selectedCase && selectedCase.name === detail.name) {
                setSelectedCase(prev => ({
                  ...prev,
                  ...detail,
                  documents: docList,
                  company_search_documents: docList
                }));
              }
            }
          }
        }));
      } catch (err) {
        console.warn("Failed bulk page loading of detailed onboarding records:", err);
      }
    };

    fetchDetailsForItems();
  }, [currentPage, onboardings, searchQuery, statusFilter, erpnextConfig]);

  // Reset page to 1 when search query or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Checklist tab state for right panel (only proposal, booking, search remain)
  const [activeDetailTab, setActiveDetailTab] = useState('proposal');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState('proposal');
  const [submitting, setSubmitting] = useState(false);

  // Document Lightbox preview states
  const [previewDocUrl, setPreviewDocUrl] = useState(null);
  const [previewDocTitle, setPreviewDocTitle] = useState('');

  // Lookup verification status for active preview doc
  const previewDocs = selectedCase ? (caseDocuments[selectedCase.name] || selectedCase.documents || []) : [];
  const currentPreviewErpDoc = previewDocs.find(d =>
    d.document_type?.toLowerCase().trim() === previewDocTitle?.toLowerCase().trim()
  );
  const previewDraftEntry = selectedCase ? checklistDrafts[previewDocTitle] : undefined;

  const isPreviewDocVerified = previewDraftEntry !== undefined
    ? !!previewDraftEntry.verified
    : !!currentPreviewErpDoc?.verified;

  const isPreviewCompanySearchDoc = previewDocTitle &&
    previewDocTitle !== 'Menu & Business Pictures' &&
    previewDocTitle !== 'Plans Submitted for Approval';

  // Expand/collapse states for Company Search documents
  const [expandedDocs, setExpandedDocs] = useState({});
  const [modalExpandedDocs, setModalExpandedDocs] = useState({});

  const toggleDocExpand = (docKey) => {
    setExpandedDocs(prev => ({
      ...prev,
      [docKey]: !prev[docKey]
    }));
  };

  const toggleModalDocExpand = (docKey) => {
    setModalExpandedDocs(prev => ({
      ...prev,
      [docKey]: !prev[docKey]
    }));
  };

  const [firstLoadDone, setFirstLoadDone] = useState(false);

  const handleSelectCase = async (item) => {
    setSelectedCase(item);
    setActiveDetailTab('proposal');
    setIsEditingDetails(false);
    setWorkflowState(null);
    fetchWorkflowActions(item.name);

    // Sync edit states
    setEditType(item.type || 'Company');
    setEditCompanyName(item.company_name || '');
    setEditCompanyVatId(item.company_vat_id || '');
    setEditContactName(item.contact_name || '');
    setEditEmailId(item.email_id || '');
    const phoneParsed = parsePhoneNumber(item.contact_number || '');
    setEditContactPrefix(phoneParsed.prefix || '+679');
    setEditContactLocal(phoneParsed.local || '');

    if (!erpnextConfig?.url) return;
    try {
      const res = await fetch(`${erpnextConfig.url}/api/resource/Tenant Onboarding/${encodeURIComponent(item.name)}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const json = await res.json();
        const detail = json.data || json;
        console.log("Selected Tenant Onboarding Details:", detail);
        if (detail) {
          setEditType(detail.type || 'Company');
          setEditCompanyName(detail.company_name || '');
          setEditCompanyVatId(detail.company_vat_id || '');
          setEditContactName(detail.contact_name || '');
          setEditEmailId(detail.email_id || '');
          const phoneParsedDetail = parsePhoneNumber(detail.contact_number || '');
          setEditContactPrefix(phoneParsedDetail.prefix || '+679');
          setEditContactLocal(phoneParsedDetail.local || '');

          const docList = detail.company_search_documents || [];

          setCaseDocuments(prev => ({
            ...prev,
            [detail.name]: docList
          }));

          setSelectedCase(prev => {
            if (prev && prev.name === detail.name) {
              return {
                ...prev,
                ...detail,
                documents: docList,
                company_search_documents: docList
              };
            }
            return prev;
          });

          setOnboardings(prev => prev.map(c => {
            if (c.name === detail.name) {
              return {
                ...c,
                ...detail,
                documents: docList,
                company_search_documents: docList
              };
            }
            return c;
          }));
        }
      }
    } catch (err) {
      console.warn("Failed to fetch detailed onboarding record:", err);
    }
  };

  const fetchWorkflowActions = async (onboardingName) => {
    if (!erpnextConfig?.url || !onboardingName) return;
    setLoadingWorkflow(true);
    try {
      const res = await fetch(`${erpnextConfig.url}/api/method/get_tenant_onboarding_workflow_actions`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': getCsrfToken ? getCsrfToken() : ''
        },
        body: JSON.stringify({
          tenant_onboarding: onboardingName
        })
      });
      if (res.ok) {
        const json = await res.json();
        console.log("Workflow actions response:", json);
        setWorkflowState(json.message || null);
      } else {
        console.warn("Failed to fetch workflow actions:", res.status);
        setWorkflowState(null);
      }
    } catch (err) {
      console.error("Error fetching workflow actions:", err);
      setWorkflowState(null);
    } finally {
      setLoadingWorkflow(false);
    }
  };

  const handleWorkflowAction = async (actionName, nextState) => {
    if (!selectedCase || !erpnextConfig?.url) return;
    if (!(await confirm(`Are you sure you want to "${actionName}"?`))) return;

    setLoadingWorkflow(true);
    try {
      const res = await fetch(`${erpnextConfig.url}/api/method/update_tenant_onboarding_workflow`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': getCsrfToken ? getCsrfToken() : ''
        },
        body: JSON.stringify({
          tenant_onboarding: selectedCase.name,
          action: actionName
        })
      });

      if (res.ok) {
        const json = await res.json();
        const error = json?.message?.error;
        if (!error) {
          alert(`Action "${actionName}" applied successfully!`);
          // Refresh details and master list
          await handleSelectCase(selectedCase);
          await fetchWorkflowActions(selectedCase.name);
          await fetchOnboardings();
        } else {
          alert(`Failed to apply action: ${error}`);
        }
      } else {
        const errorMsg = await extractErrorMessage(res);
        alert(`Failed to apply action: ${errorMsg}`);
      }
    } catch (err) {
      console.error("Error applying workflow action:", err);
      alert(`Error applying workflow action: ${err.message}`);
    } finally {
      setLoadingWorkflow(false);
    }
  };

  const getActionButtonStyle = (actionName) => {
    const name = (actionName || '').toLowerCase();
    if (name.includes('reject') || name.includes('cancel') || name.includes('deny')) {
      return {
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        boxShadow: '0 4px 10px rgba(239, 68, 68, 0.2)'
      };
    }
    if (name.includes('approve') || name.includes('accept') || name.includes('complete') || name.includes('convert')) {
      return {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)'
      };
    }
    return {
      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      boxShadow: '0 4px 10px rgba(37, 99, 235, 0.2)'
    };
  };

  const getStateBadgeStyle = (stateName) => {
    const name = (stateName || '').toLowerCase();
    if (name.includes('approve') || name.includes('complete') || name.includes('success')) {
      return {
        bg: 'rgba(16, 185, 129, 0.08)',
        border: '1.5px solid rgba(16, 185, 129, 0.2)',
        color: '#10b981',
        dot: '#10b981'
      };
    }
    if (name.includes('pending') || name.includes('approval') || name.includes('review')) {
      return {
        bg: 'rgba(245, 158, 11, 0.08)',
        border: '1.5px solid rgba(245, 158, 11, 0.2)',
        color: '#f59e0b',
        dot: '#f59e0b'
      };
    }
    if (name.includes('reject') || name.includes('cancel') || name.includes('deny')) {
      return {
        bg: 'rgba(239, 68, 68, 0.08)',
        border: '1.5px solid rgba(239, 68, 68, 0.2)',
        color: '#ef4444',
        dot: '#ef4444'
      };
    }
    return {
      bg: 'rgba(59, 130, 246, 0.08)',
      border: '1.5px solid rgba(59, 130, 246, 0.2)',
      color: '#3b82f6',
      dot: '#3b82f6'
    };
  };



  // Local checklist storage key
  const LOCAL_CHECKLISTS_KEY = 'pms_tenant_onboarding_checklists';
  const [localChecklists, setLocalChecklists] = useState(() => {
    const saved = localStorage.getItem(LOCAL_CHECKLISTS_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  // Save local checklists to storage
  useEffect(() => {
    localStorage.setItem(LOCAL_CHECKLISTS_KEY, JSON.stringify(localChecklists));
  }, [localChecklists]);

  // Form states - Basic Details & Districts list
  const [contactName, setContactName] = useState('');
  const [emailId, setEmailId] = useState('');
  const [contactPrefix, setContactPrefix] = useState('+679');
  const [contactLocal, setContactLocal] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [districts, setDistricts] = useState([]);
  const [countries, setCountries] = useState([]);

  // Dynamic Metadata-Driven Form fields states
  const [doctypeFields, setDoctypeFields] = useState([]);
  const [useDynamicForm, setUseDynamicForm] = useState(true);
  const [dynamicFormValues, setDynamicFormValues] = useState({});
  const [linkOptionsCache, setLinkOptionsCache] = useState({});
  const [activeDynamicTabIdx, setActiveDynamicTabIdx] = useState(0);
  const [childSchemasCache, setChildSchemasCache] = useState({});

  const getDynamicDocumentTypes = () => {
    const fields = childSchemasCache["Company Search Documents"];
    if (Array.isArray(fields)) {
      const docTypeField = fields.find(f => f.fieldname === 'document_type');
      if (docTypeField?.options) {
        return docTypeField.options.split('\n').filter(Boolean).map((opt, idx) => ({
          key: `doc_${idx}`,
          label: opt.trim()
        }));
      }
    }
    return [
      { key: 'inc', label: 'True Certified Copies of Incorporation' },
      { key: 'moa', label: 'Memorandum of Associations Company' },
      { key: 'name_cert', label: 'Business Name Registration Certificate' },
      { key: 'directors_rep', label: 'Directors Reports' },
      { key: 'tin_letter', label: 'Tin Letter' },
      { key: 'bus_reg_cert', label: 'Business Registration Certificate' },
      { key: 'birth_cert', label: 'Birth Certificate' },
      { key: 'passport_photo', label: 'Passport photo of Directors' },
      { key: 'tin_comp_indiv', label: 'Tin Letter Company and Individual' },
      { key: 'photo_id', label: 'Photo ID Card' }
    ];
  };

  const currentDocumentTypes = getDynamicDocumentTypes();

  const fetchLinkOptions = async (linkDoctype) => {
    if (!linkDoctype || !erpnextConfig?.url || linkOptionsCache[linkDoctype]) return;
    try {
      const res = await fetch(`${erpnextConfig.url}/api/resource/${encodeURIComponent(linkDoctype)}?fields=%5B%22name%22%5D&limit_page_length=1000`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const json = await res.json();
        const list = json.data || json;
        if (Array.isArray(list)) {
          const optionsList = list.map(item => item.name || item.title || item.id);
          setLinkOptionsCache(prev => ({
            ...prev,
            [linkDoctype]: optionsList
          }));
        }
      }
    } catch (err) {
      console.warn(`Failed to fetch link options for DocType ${linkDoctype}:`, err);
    }
  };

  // New basic details fields
  const [type, setType] = useState('Company');
  const [companyVatId, setCompanyVatId] = useState('');
  const [isInternalCustomer, setIsInternalCustomer] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('Fiji');

  // Form states - Business Proposal
  const [proposedBusinessType, setProposedBusinessType] = useState('');
  const [requiredSpace, setRequiredSpace] = useState('');
  const [businessStatus, setBusinessStatus] = useState('New');
  const [budget, setBudget] = useState('');
  const [menuAndBusinessPictures, setMenuAndBusinessPictures] = useState('');
  const [rangeLineItems, setRangeLineItems] = useState('');
  const [fitoutTimeframe, setFitoutTimeframe] = useState('');

  // Form states - Booking Form
  const [shopSpaceLocation, setShopSpaceLocation] = useState('');
  const [usageOfDemisedPremises, setUsageOfDemisedPremises] = useState('');
  const [bookingNatureBusiness, setBookingNatureBusiness] = useState('');
  const [bookingMerchandiseTypes, setBookingMerchandiseTypes] = useState('');
  const [leasePeriod, setLeasePeriod] = useState('');
  const [rentalCharges, setRentalCharges] = useState('');
  const [servicePromoCharges, setServicePromoCharges] = useState('');
  const [securityDepositFee, setSecurityDepositFee] = useState('');
  const [leaseCommencement, setLeaseCommencement] = useState('');
  const [vacantPossessionDate, setVacantPossessionDate] = useState('');
  const [plansForApproval, setPlansForApproval] = useState('');
  const [fitoutPeriod, setFitoutPeriod] = useState('');
  const [facilitiesRequired, setFacilitiesRequired] = useState('');

  // Form states - Company Search documents during creation
  const [formCompanySearchDocs, setFormCompanySearchDocs] = useState({
    inc: { doc: '', verified: false },
    moa: { doc: '', verified: false },
    name_cert: { doc: '', verified: false },
    directors_rep: { doc: '', verified: false },
    tin_letter: { doc: '', verified: false },
    bus_reg_cert: { doc: '', verified: false },
    birth_cert: { doc: '', verified: false },
    passport_photo: { doc: '', verified: false },
    tin_comp_indiv: { doc: '', verified: false },
    photo_id: { doc: '', verified: false }
  });

  const [uploadingFile, setUploadingFile] = useState(false);

  // Fetch Onboardings and Document Child tables from ERPNext
  const fetchOnboardings = async () => {
    if (!erpnextConfig?.url) return;
    setLoading(true);
    try {
      // 1. Fetch Company Search Documents child table
      let docsMap = {};
      try {
        const docRes = await fetch(`${erpnextConfig.url}/api/resource/Company Search Documents?fields=%5B%22name%22%2C%22parent%22%2C%22document%22%2C%22document_type%22%2C%22verified%22%5D&filters=%5B%5B%22parenttype%22%2C%22%3D%22%2C%22Tenant%20Onboarding%22%5D%5D&limit_page_length=10000`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        if (docRes.ok) {
          const dJson = await docRes.json();
          const dList = dJson.data || dJson;
          if (Array.isArray(dList)) {
            dList.forEach(d => {
              if (d.parent) {
                if (!docsMap[d.parent]) {
                  docsMap[d.parent] = [];
                }
                docsMap[d.parent].push(d);
              }
            });
          }
        }
      } catch (dErr) {
        console.warn('Failed to fetch Company Search Documents:', dErr);
      }

      // 2. Fetch Parent Tenant Onboardings
      const res = await fetch(`${erpnextConfig.url}/api/resource/Tenant Onboarding?fields=%5B%22name%22%2C%22proposed_business_type%22%2C%22budget%22%2C%22required_space%22%2C%22shop_space_location%22%2C%22lease_period%22%2C%22usage_of_demised_premises%22%2C%22business_status%22%2C%22owner%22%2C%22creation%22%2C%22menu_and_business_pictures%22%2C%22fitout_period%22%2C%22rental_charges%22%2C%22security_deposit_booking_fee%22%2C%22service_promotional_charges%22%2C%22product_service_range%22%2C%22fitout_approval_timeframe%22%2C%22contact_name%22%2C%22email_id%22%2C%22contact_number%22%2C%22company_name%22%2C%22lease_commencement_date%22%2C%22vacant_possession_date%22%2C%22plans_for_approval%22%2C%22workflow_state%22%2C%22docstatus%22%5D&limit_page_length=1000&order_by=creation%20desc`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        const list = data.data || data;
        if (Array.isArray(list)) {
          const mapped = list.map(item => ({
            ...item,
            documents: caseDocuments[item.name] || docsMap[item.name] || []
          }));
          setOnboardings(mapped);

          // Re-sync selected case if active without losing cache documents
          if (selectedCase) {
            const fresh = mapped.find(c => c.name === selectedCase.name);
            if (fresh) {
              setSelectedCase(prev => ({
                ...prev,
                ...fresh,
                documents: caseDocuments[prev.name] || prev.documents || []
              }));
            }
          }
        }
      }
    } catch (err) {
      console.warn('ERPNext Tenant Onboarding fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDistricts = async () => {
    if (!erpnextConfig?.url) return;
    try {
      const res = await fetch(`${erpnextConfig.url}/api/resource/District?fields=%5B%22name%22%5D&limit_page_length=1000`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const json = await res.json();
        const list = json.data || json;
        if (Array.isArray(list)) {
          setDistricts(list.map(d => d.name));
        }
      }
    } catch (err) {
      console.warn("Failed to fetch districts:", err);
    }
  };

  const fetchCountries = async () => {
    if (!erpnextConfig?.url) return;
    try {
      const res = await fetch(`${erpnextConfig.url}/api/resource/Country?fields=%5B%22name%22%5D&limit_page_length=1000`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const json = await res.json();
        const list = json.data || json;
        if (Array.isArray(list)) {
          setCountries(list.map(c => c.name));
        }
      }
    } catch (err) {
      console.warn("Failed to fetch countries:", err);
    }
  };

  const getDocTypeFields = async (doctype) => {
    try {
      const baseUrl = erpnextConfig?.url || '';
      const url = `${baseUrl}/api/method/frappe.desk.form.load.getdoctype?doctype=${encodeURIComponent(doctype)}`;
      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          "X-Frappe-CSRF-Token": erpnextConfig?.csrfToken || window.csrf_token || ""
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch DocType fields (${response.status})`);
      }

      const data = await response.json();
      console.log("DocType Fields Response for " + doctype + ":", data);

      const docs = data.message?.docs || data.docs || [];
      const fields = docs?.[0]?.fields || [];
      setChildSchemasCache(prev => ({
        ...prev,
        [doctype]: fields
      }));
      return fields;
    } catch (error) {
      console.error(
        "Failed to fetch DocType fields:",
        error.message
      );
      return [];
    }
  };



  const fetchWorkflowDoctype = async () => {
    if (!erpnextConfig?.url) return;
    try {
      const res = await fetch(`${erpnextConfig.url}/api/resource/Workflow?limit_page_length=100`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const json = await res.json();
        console.log("Workflow Doctype List Response:", json);
      }

      const detailRes = await fetch(`${erpnextConfig.url}/api/resource/Workflow?fields=%5B%22name%22%2C%22document_type%22%2C%22is_active%22%5D&limit_page_length=100`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (detailRes.ok) {
        const detailJson = await detailRes.json();
        console.log("Workflow Doctype Detail Response:", detailJson);
      }
    } catch (err) {
      console.warn("Failed to fetch Workflow Doctype:", err);
    }
  };

  useEffect(() => {
    fetchOnboardings();
    fetchDistricts();
    fetchCountries();
    fetchWorkflowDoctype();
    getDocTypeFields("Company Search Documents").catch(err => console.warn(err));
    getDocTypeFields("Tenant Onboarding").then(fields => {
      if (Array.isArray(fields) && fields.length > 0) {
        setDoctypeFields(fields);
        const defaults = {};
        fields.forEach(field => {
          if (field.default !== undefined && field.default !== null) {
            if (field.fieldname === 'type') {
              defaults[field.fieldname] = '';
            } else {
              defaults[field.fieldname] = field.default;
            }
          }
        });
        defaults['is_internal_customer'] = 0;
        setDynamicFormValues(defaults);
      }
    });
  }, [erpnextConfig]);

  // Handle saving (attaching, updating, verifying or deleting) a document directly in ERPNext's child table
  const saveDocumentToERPNext = async (docLabel, fileUrl, verifiedVal) => {
    if (!selectedCase || !erpnextConfig?.url) return;

    let currentDocs = [...(caseDocuments[selectedCase.name] || selectedCase.documents || selectedCase.company_search_documents || [])];
    const idx = currentDocs.findIndex(d =>
      d.document_type?.toLowerCase().trim() === docLabel.toLowerCase().trim()
    );

    if (idx >= 0) {
      if (!fileUrl && !verifiedVal) {
        currentDocs.splice(idx, 1);
      } else {
        currentDocs[idx] = {
          ...currentDocs[idx],
          document: fileUrl || '',
          verified: verifiedVal ? 1 : 0
        };
      }
    } else {
      if (fileUrl || verifiedVal) {
        currentDocs.push({
          doctype: 'Company Search Documents',
          document_type: docLabel,
          document: fileUrl || '',
          verified: verifiedVal ? 1 : 0
        });
      }
    }

    const payloadDocs = currentDocs.map(d => ({
      name: d.name,
      doctype: 'Company Search Documents',
      document_type: d.document_type,
      document: d.document || '',
      verified: d.verified ? 1 : 0
    }));

    try {
      const res = await fetch(`${erpnextConfig.url}/api/resource/Tenant Onboarding/${encodeURIComponent(selectedCase.name)}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': getCsrfToken ? getCsrfToken() : ''
        },
        body: JSON.stringify({
          company_search_documents: payloadDocs
        })
      });

      if (res.ok) {
        const json = await res.json();
        const detail = json.data || json;
        if (detail) {
          const docList = detail.company_search_documents || [];

          setCaseDocuments(prev => ({
            ...prev,
            [detail.name]: docList
          }));

          setSelectedCase(prev => {
            if (prev && prev.name === detail.name) {
              return {
                ...prev,
                ...detail,
                documents: docList,
                company_search_documents: docList
              };
            }
            return prev;
          });
        }
        await fetchOnboardings();
      } else {
        const errJson = await res.json();
        alert(errJson?.exception || "Failed to save document in ERPNext.");
      }
    } catch (err) {
      console.error("Error saving document to ERPNext:", err);
      alert("Error saving document to ERPNext.");
    }
  };

  const handleSaveChecklist = async () => {
    if (!selectedCase || !erpnextConfig?.url) return;
    setUpdatingDetails(true);

    let currentDocs = [...(caseDocuments[selectedCase.name] || selectedCase.documents || selectedCase.company_search_documents || [])];

    // Merge drafts into currentDocs
    Object.entries(checklistDrafts).forEach(([docLabel, draftVal]) => {
      const idx = currentDocs.findIndex(d =>
        d.document_type?.toLowerCase().trim() === docLabel.toLowerCase().trim()
      );
      if (idx >= 0) {
        if (!draftVal.doc && !draftVal.verified) {
          // Remove if both doc and verified are cleared
          currentDocs.splice(idx, 1);
        } else {
          currentDocs[idx] = {
            ...currentDocs[idx],
            document: draftVal.doc || '',
            verified: draftVal.verified ? 1 : 0
          };
        }
      } else {
        if (draftVal.doc || draftVal.verified) {
          currentDocs.push({
            doctype: 'Company Search Documents',
            document_type: docLabel,
            document: draftVal.doc || '',
            verified: draftVal.verified ? 1 : 0
          });
        }
      }
    });

    const payloadDocs = currentDocs.map(d => ({
      name: d.name,
      doctype: 'Company Search Documents',
      document_type: d.document_type,
      document: d.document || '',
      verified: d.verified ? 1 : 0
    }));

    try {
      const res = await fetch(`${erpnextConfig.url}/api/resource/Tenant Onboarding/${encodeURIComponent(selectedCase.name)}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': getCsrfToken ? getCsrfToken() : ''
        },
        body: JSON.stringify({
          company_search_documents: payloadDocs
        })
      });

      if (res.ok) {
        const json = await res.json();
        const detail = json.data || json;
        if (detail) {
          const docList = detail.company_search_documents || [];
          setCaseDocuments(prev => ({
            ...prev,
            [detail.name]: docList
          }));
          setSelectedCase(prev => {
            if (prev && prev.name === detail.name) {
              return {
                ...prev,
                ...detail,
                documents: docList,
                company_search_documents: docList
              };
            }
            return prev;
          });
        }
        setChecklistDrafts({});
        await fetchOnboardings();
        alert("Checklist verifications and document attachments updated successfully.");
      } else {
        const errJson = await res.json();
        alert(errJson?.exception || "Failed to save checklist to ERPNext.");
      }
    } catch (err) {
      console.error("Error saving checklist to ERPNext:", err);
      alert("Error saving checklist to ERPNext.");
    } finally {
      setUpdatingDetails(false);
    }
  };

  const handleUpdateCoreDetails = async () => {
    if (!selectedCase || !erpnextConfig?.url) return;

    // Validate required dynamic fields
    const visibleFields = doctypeFields.filter(f => f.hidden !== 1 && f.fieldname !== 'naming_series' && f.fieldname !== 'amended_from' && f.fieldname !== 'workflow_state');
    for (const field of visibleFields) {
      const val = dynamicFormValues[field.fieldname];
      if (isFieldRequired(field, dynamicFormValues)) {
        if (val === undefined || val === null || String(val).trim() === '') {
          alert(`${field.label || field.fieldname} is required.`);
          return;
        }
      }

      if ([
        'required_space',
        'budget',
        'lease_period',
        'rental_charges',
        'service_promotional_charges',
        'security_deposit_booking_fee',
        'fitout_period'
      ].includes(field.fieldname) && val !== undefined && val !== null && String(val).trim() !== '') {
        const num = parseFloat(val);
        if (isNaN(num) || num <= 0) {
          alert(`${field.label || field.fieldname} should not be 0 or negative value.`, 'error');
          return;
        }
        if ((field.fieldname === 'lease_period' || field.fieldtype === 'Int') && !Number.isInteger(num)) {
          alert(`${field.label || field.fieldname} must be a whole number (integer).`, 'error');
          return;
        }
      }

      if (isPhoneField(field) && val) {
        const isValid = validatePhoneValue(val, field.label || field.fieldname);
        if (!isValid) return;
      }

      if (isPastOnlyDateFieldName(field.fieldname, field.label) && val) {
        const isValid = validatePastOnlyDateField(val, field.label || field.fieldname, field.fieldname);
        if (!isValid) return;
      }

      if (isFutureOrTodayDateFieldName(field.fieldname, field.label) && val) {
        const isValid = validateFutureOrTodayDateField(val, field.label || field.fieldname, field.fieldname);
        if (!isValid) return;
      }

      // If table field is present, validate its rows
      if (field.fieldtype === 'Table') {
        const rows = dynamicFormValues[field.fieldname];
        if (Array.isArray(rows)) {
          const childFieldsSchema = childSchemasCache[field.options];
          if (childFieldsSchema) {
            const requiredChildFields = childFieldsSchema.filter(cf => isFieldRequired(cf) && cf.hidden !== 1);
            for (let rIdx = 0; rIdx < rows.length; rIdx++) {
              const row = rows[rIdx];
              // 1. Standard required child fields check
              for (const cf of requiredChildFields) {
                const rowVal = row[cf.fieldname];
                if (rowVal === undefined || rowVal === null || String(rowVal).trim() === '') {
                  alert(`Row ${rIdx + 1}: ${cf.label || cf.fieldname} is required inside ${field.label || field.fieldname}.`);
                  return;
                }
              }
              // 2. Custom check: if document file is uploaded, document_type is mandatory
              if (row.document && String(row.document).trim() !== '') {
                if (!row.document_type || String(row.document_type).trim() === '') {
                  alert(`Row ${rIdx + 1}: Document Type is mandatory when a file is uploaded.`);
                  return;
                }
              }
              // 3. Child table phone number & date validation
              for (const cf of childFieldsSchema) {
                const rowVal = row[cf.fieldname];
                if (isPhoneField(cf) && rowVal) {
                  const isValid = validatePhoneValue(rowVal, `Row ${rIdx + 1}: ${cf.label || cf.fieldname}`);
                  if (!isValid) return;
                }
                if (isPastOnlyDateFieldName(cf.fieldname, cf.label) && rowVal) {
                  const isValid = validatePastOnlyDateField(rowVal, `Row ${rIdx + 1}: ${cf.label || cf.fieldname}`, cf.fieldname);
                  if (!isValid) return;
                }
              }
            }
          }
        }
      }
    }

    setUpdatingDetails(true);

    const cleanedValues = { ...dynamicFormValues };
    const selectedType = cleanedValues.type || '';
    if (selectedType !== 'Individual') {
      cleanedValues.date_of_birth = null;
    }
    if (selectedType !== 'Company') {
      cleanedValues.date_of_incorporation = null;
    }

    const isInternal = !!cleanedValues.is_internal_customer;
    if (!isInternal) {
      cleanedValues.represents_company = null;
      cleanedValues.allowed_to_transact_with = null;
      cleanedValues.allowed_to_transact = null;
    }

    const payload = {
      ...cleanedValues
    };

    console.log("Core details update payload:", payload);

    try {
      const res = await fetch(`${erpnextConfig.url}/api/resource/Tenant Onboarding/${encodeURIComponent(selectedCase.name)}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': getCsrfToken ? getCsrfToken() : ''
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const json = await res.json();
        console.log("Core details update response:", json);
        console.log("Successfully submitted Tenant Onboarding payload:", payload);
        const detail = json.data || json;
        if (detail) {
          setSelectedCase(prev => {
            if (prev && prev.name === detail.name) {
              return {
                ...prev,
                ...detail,
                documents: caseDocuments[detail.name] || prev.documents || []
              };
            }
            return prev;
          });

          setOnboardings(prev => prev.map(c => {
            if (c.name === detail.name) {
              return {
                ...c,
                ...detail,
                documents: caseDocuments[detail.name] || c.documents || []
              };
            }
            return c;
          }));
        }
        setIsEditingDetails(false);
        alert("Changes saved successfully!", "success");
      } else {
        const errorMsg = await extractErrorMessage(res);
        console.error("Tenant Onboarding error:", errorMsg);
        alert(errorMsg);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while updating details.");
    } finally {
      setUpdatingDetails(false);
    }
  };

  // Handle file uploads to ERPNext
  const handleFileUpload = async (e, setUrlCallback) => {
    const file = e.target.files[0];
    if (!file || !erpnextConfig?.url) return;

    setUploadingFile(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('is_private', '0');

    try {
      const res = await fetch(`${erpnextConfig.url}/api/method/upload_file`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-Frappe-CSRF-Token': getCsrfToken ? getCsrfToken() : ''
        },
        body: formData
      });
      if (res.ok) {
        const json = await res.json();
        const fileUrl = json.message?.file_url || json.file_url;
        if (fileUrl) {
          setUrlCallback(fileUrl);
        } else {
          alert("Upload succeeded but file URL not returned.");
        }
      } else {
        alert("File upload failed.");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Error uploading file.");
    } finally {
      setUploadingFile(false);
    }
  };

  // Update local checklist details
  const updateLocalChecklistField = (caseId, field, value) => {
    setLocalChecklists(prev => {
      const caseData = prev[caseId] || {};
      return {
        ...prev,
        [caseId]: {
          ...caseData,
          [field]: value
        }
      };
    });
  };

  const resetFormFields = () => {
    setActiveDynamicTabIdx(0);
    const defaults = {};
    doctypeFields.forEach(field => {
      if (field.default !== undefined && field.default !== null) {
        defaults[field.fieldname] = field.default;
      }
    });
    defaults['is_internal_customer'] = 0;
    setDynamicFormValues(defaults);
    setContactName('');
    setEmailId('');
    setContactPrefix('+679');
    setContactLocal('');
    setCompanyName('');
    setType('Company');
    setCompanyVatId('');
    setIsInternalCustomer(false);
    setDateOfBirth('');
    setAddressLine1('');
    setAddressLine2('');
    setCity('');
    setState('');
    setCountry('Fiji');
    setProposedBusinessType('');
    setRequiredSpace('');
    setBudget('');
    setLeasePeriod('');
    setShopSpaceLocation('');
    setUsageOfDemisedPremises('');
    setBusinessStatus('New');
    setMenuAndBusinessPictures('');
    setRangeLineItems('');
    setFitoutTimeframe('');
    setBookingNatureBusiness('');
    setBookingMerchandiseTypes('');
    setRentalCharges('');
    setServicePromoCharges('');
    setSecurityDepositFee('');
    setLeaseCommencement('');
    setVacantPossessionDate('');
    setPlansForApproval('');
    setFitoutPeriod('');
    setFacilitiesRequired('');
    setFormCompanySearchDocs({
      inc: { doc: '', verified: false },
      moa: { doc: '', verified: false },
      name_cert: { doc: '', verified: false },
      directors_rep: { doc: '', verified: false },
      tin_letter: { doc: '', verified: false },
      bus_reg_cert: { doc: '', verified: false },
      birth_cert: { doc: '', verified: false },
      passport_photo: { doc: '', verified: false },
      tin_comp_indiv: { doc: '', verified: false },
      photo_id: { doc: '', verified: false }
    });
    setModalExpandedDocs({});
  };

  // Handle Starting Onboarding process (POST request to ERPNext)
  const handleStartOnboarding = async (e) => {
    e.preventDefault();
    if (!erpnextConfig?.url) return;
    if (!useDynamicForm && !proposedBusinessType) return;

    // Phone number validation based on country prefix to avoid server validation crash
    if (!useDynamicForm && contactLocal.trim()) {
      const cleanedLocal = contactLocal.replace(/\D/g, '');
      if (contactPrefix === '+679') {
        if (cleanedLocal.length !== 7) {
          alert("Fiji phone number must be exactly 7 digits.");
          return;
        }
        if (!/^[2356789]/.test(cleanedLocal)) {
          alert("Fiji phone number must start with 2, 3, 5, 6, 7, 8, or 9.");
          return;
        }
      }
      if (contactPrefix === '+61') {
        if (cleanedLocal.length !== 9) {
          alert("Australia phone number must be exactly 9 digits.");
          return;
        }
      }
      if (contactPrefix === '+64') {
        if (cleanedLocal.length < 8 || cleanedLocal.length > 9) {
          alert("New Zealand phone number must be 8 or 9 digits.");
          return;
        }
      }
      if (contactPrefix === '+91') {
        if (cleanedLocal.length !== 10) {
          alert("India phone number must be exactly 10 digits.");
          return;
        }
        if (!/^[6789]/.test(cleanedLocal)) {
          alert("India mobile number must start with 6, 7, 8, or 9.");
          return;
        }
      }
      if (contactPrefix === '+1') {
        if (cleanedLocal.length !== 10) {
          alert("US phone number must be exactly 10 digits.");
          return;
        }
        if (!/^[23456789]/.test(cleanedLocal)) {
          alert("US area code cannot start with 0 or 1.");
          return;
        }
      }
      if (contactPrefix === '+65') {
        if (cleanedLocal.length !== 8) {
          alert("Singapore phone number must be exactly 8 digits.");
          return;
        }
        if (!/^[3689]/.test(cleanedLocal)) {
          alert("Singapore phone number must start with 3, 6, 8, or 9.");
          return;
        }
      }
    }

    setSubmitting(true);
    try {
      // Build child table documents payload
      const childDocs = [];
      currentDocumentTypes.forEach(docType => {
        const val = formCompanySearchDocs[docType.key];
        if (val && val.doc) {
          childDocs.push({
            doctype: 'Company Search Documents',
            document: val.doc,
            document_type: docType.label,
            verified: val.verified ? 1 : 0
          });
        }
      });

      let payload;
      if (useDynamicForm) {
        // Validate required dynamic fields
        const visibleFields = doctypeFields.filter(f => f.hidden !== 1 && f.fieldname !== 'naming_series' && f.fieldname !== 'amended_from' && f.fieldname !== 'workflow_state');
        for (const field of visibleFields) {
          const val = dynamicFormValues[field.fieldname];
          if (isFieldRequired(field, dynamicFormValues)) {
            if (val === undefined || val === null || String(val).trim() === '') {
              alert(`${field.label || field.fieldname} is required.`);
              setSubmitting(false);
              return;
            }
          }

          if ([
            'required_space',
            'budget',
            'lease_period',
            'rental_charges',
            'service_promotional_charges',
            'security_deposit_booking_fee',
            'fitout_period'
          ].includes(field.fieldname) && val !== undefined && val !== null && String(val).trim() !== '') {
            const num = parseFloat(val);
            if (isNaN(num) || num <= 0) {
              alert(`${field.label || field.fieldname} should not be 0 or negative value.`, 'error');
              setSubmitting(false);
              return;
            }
            if ((field.fieldname === 'lease_period' || field.fieldtype === 'Int') && !Number.isInteger(num)) {
              alert(`${field.label || field.fieldname} must be a whole number (integer).`, 'error');
              setSubmitting(false);
              return;
            }
          }

          if (isPhoneField(field) && val) {
            const isValid = validatePhoneValue(val, field.label || field.fieldname);
            if (!isValid) {
              setSubmitting(false);
              return;
            }
          }

          if (isPastOnlyDateFieldName(field.fieldname, field.label) && val) {
            const isValid = validatePastOnlyDateField(val, field.label || field.fieldname, field.fieldname);
            if (!isValid) {
              setSubmitting(false);
              return;
            }
          }

          if (isFutureOrTodayDateFieldName(field.fieldname, field.label) && val) {
            const isValid = validateFutureOrTodayDateField(val, field.label || field.fieldname, field.fieldname);
            if (!isValid) {
              setSubmitting(false);
              return;
            }
          }

          // If table field is present, validate its rows
          if (field.fieldtype === 'Table') {
            const rows = dynamicFormValues[field.fieldname];
            if (Array.isArray(rows)) {
              const childFieldsSchema = childSchemasCache[field.options];
              if (childFieldsSchema) {
                const requiredChildFields = childFieldsSchema.filter(cf => isFieldRequired(cf) && cf.hidden !== 1);
                for (let rIdx = 0; rIdx < rows.length; rIdx++) {
                  const row = rows[rIdx];
                  // 1. Standard required child fields check
                  for (const cf of requiredChildFields) {
                    const rowVal = row[cf.fieldname];
                    if (rowVal === undefined || rowVal === null || String(rowVal).trim() === '') {
                      alert(`Row ${rIdx + 1}: ${cf.label || cf.fieldname} is required inside ${field.label || field.fieldname}.`);
                      setSubmitting(false);
                      return;
                    }
                  }
                  // 2. Custom check: if document file is uploaded, document_type is mandatory
                  if (row.document && String(row.document).trim() !== '') {
                    if (!row.document_type || String(row.document_type).trim() === '') {
                      alert(`Row ${rIdx + 1}: Document Type is mandatory when a file is uploaded.`);
                      setSubmitting(false);
                      return;
                    }
                  }
                  // 3. Child table phone number & date validation
                  for (const cf of childFieldsSchema) {
                    const rowVal = row[cf.fieldname];
                    if (isPhoneField(cf) && rowVal) {
                      const isValid = validatePhoneValue(rowVal, `Row ${rIdx + 1}: ${cf.label || cf.fieldname}`);
                      if (!isValid) {
                        setSubmitting(false);
                        return;
                      }
                    }
                    if (isPastOnlyDateFieldName(cf.fieldname, cf.label) && rowVal) {
                      const isValid = validatePastOnlyDateField(rowVal, `Row ${rIdx + 1}: ${cf.label || cf.fieldname}`, cf.fieldname);
                      if (!isValid) {
                        setSubmitting(false);
                        return;
                      }
                    }
                  }
                }
              }
            }
          }
        }

        const cleanedValues = { ...dynamicFormValues };
        const selectedType = cleanedValues.type || '';
        if (selectedType !== 'Individual') {
          delete cleanedValues.date_of_birth;
        }
        if (selectedType !== 'Company') {
          delete cleanedValues.date_of_incorporation;
        }

        const isInternal = !!cleanedValues.is_internal_customer;
        if (!isInternal) {
          delete cleanedValues.represents_company;
          delete cleanedValues.allowed_to_transact_with;
          delete cleanedValues.allowed_to_transact;
        }

        payload = {
          doctype: 'Tenant Onboarding',
          company_search_documents: childDocs,
          ...cleanedValues
        };
      } else {
        payload = {
          proposed_business_type: proposedBusinessType,
          required_space: requiredSpace ? parseFloat(requiredSpace) : 0,
          budget: budget ? parseFloat(budget) : 0,
          lease_period: leasePeriod ? parseInt(leasePeriod) : 0,
          shop_space_location: shopSpaceLocation,
          usage_of_demised_premises: usageOfDemisedPremises,
          business_status: businessStatus,
          menu_and_business_pictures: menuAndBusinessPictures,
          fitout_period: fitoutPeriod ? parseInt(fitoutPeriod) : 0,
          rental_charges: rentalCharges ? parseFloat(rentalCharges) : 0,
          security_deposit_booking_fee: securityDepositFee ? parseFloat(securityDepositFee) : 0,
          service_promotional_charges: servicePromoCharges ? parseFloat(servicePromoCharges) : 0,
          product_service_range: rangeLineItems,
          contact_name: contactName,
          email_id: emailId,
          contact_number: contactLocal.trim() ? `${contactPrefix}-${contactLocal.trim()}` : "",
          company_name: companyName,
          lease_commencement_date: leaseCommencement || null,
          vacant_possession_date: vacantPossessionDate || null,
          plans_for_approval: plansForApproval,
          company_search_documents: childDocs,
          type: type,
          company_vat_id: companyVatId,
          is_internal_customer: isInternalCustomer ? 1 : 0,
          date_of_birth: dateOfBirth || null,
          address_line_1: addressLine1,
          address_line_2: addressLine2,
          city: city,
          state: state,
          country: country
        };
      }

      const res = await fetch(`${erpnextConfig.url}/api/resource/Tenant Onboarding`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': getCsrfToken ? getCsrfToken() : ''
        },
        body: JSON.stringify(payload)
      });
      console.log("Onboarding create payload:", payload);
      if (res.ok) {
        const json = await res.json();
        console.log("Onboarding create response:", json);
        const freshDoc = json.data || json;
        const newDocName = freshDoc.name;

        // Initialize local fields in checklists
        if (newDocName) {
          setLocalChecklists(prev => ({
            ...prev,
            [newDocName]: {
              fitout_timeframe: fitoutTimeframe,
              booking_nature_of_business: bookingNatureBusiness,
              booking_merchandise_types: bookingMerchandiseTypes,
              booking_facilities_required: facilitiesRequired,

              // Standard checklist items initializations
              company_search_inc_verified: formCompanySearchDocs.inc.verified,
              company_search_inc_doc: formCompanySearchDocs.inc.doc,
              company_search_moa_verified: formCompanySearchDocs.moa.verified,
              company_search_moa_doc: formCompanySearchDocs.moa.doc,
              company_search_name_cert_verified: formCompanySearchDocs.name_cert.verified,
              company_search_name_cert_doc: formCompanySearchDocs.name_cert.doc,
              company_search_directors_rep_verified: formCompanySearchDocs.directors_rep.verified,
              company_search_directors_rep_doc: formCompanySearchDocs.directors_rep.doc,
              company_search_tin_letter_verified: formCompanySearchDocs.tin_letter.verified,
              company_search_tin_letter_doc: formCompanySearchDocs.tin_letter.doc,
              company_search_bus_reg_cert_verified: formCompanySearchDocs.bus_reg_cert.verified,
              company_search_bus_reg_cert_doc: formCompanySearchDocs.bus_reg_cert.doc,
              company_search_birth_cert_verified: formCompanySearchDocs.birth_cert.verified,
              company_search_birth_cert_doc: formCompanySearchDocs.birth_cert.doc,
              company_search_passport_photo_verified: formCompanySearchDocs.passport_photo.verified,
              company_search_passport_photo_doc: formCompanySearchDocs.passport_photo.doc,
              company_search_tin_comp_indiv_verified: formCompanySearchDocs.tin_comp_indiv.verified,
              company_search_tin_comp_indiv_doc: formCompanySearchDocs.tin_comp_indiv.doc,
              company_search_photo_id_verified: formCompanySearchDocs.photo_id.verified,
              company_search_photo_id_doc: formCompanySearchDocs.photo_id.doc
            }
          }));
        }

        setShowModal(false);
        resetFormFields();

        await fetchOnboardings();
        if (newDocName) {
          handleSelectCase({ name: newDocName });
        }
      } else {
        const errorMsg = await extractErrorMessage(res);
        console.error("Tenant Onboarding error:", errorMsg);
        alert(errorMsg);
      }
    } catch (err) {
      console.error("Failed creating onboarding case:", err);
      alert(err.message || "An error occurred while creating Tenant Onboarding.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConvertCustomerClick = async () => {
    if (!selectedCase) return;

    const verifiedMap = {};
    const itemDocs = caseDocuments[selectedCase.name] || selectedCase.documents || [];
    itemDocs.forEach(d => {
      if (d.document_type) {
        verifiedMap[d.document_type.toLowerCase().trim()] = !!d.verified;
      }
    });

    const verificationDocsList = [
      'true certified copies of incorporation',
      'memorandum of associations company',
      'business name registration certificate.',
      'directors reports',
      'tin letter',
      'business registration certificate',
      'birth certificate',
      'passport photo of directors',
      'tin letter company and individual',
      'photo id card'
    ];

    const allVerified = verificationDocsList.every(k => verifiedMap[k]);

    let message = "";
    if (allVerified) {
      message = `All documents are verified. Do you want to convert ${selectedCase.company_name || selectedCase.name} into Tenant?`;
    } else {
      message = `Some documents are not verified. Do you still want to convert ${selectedCase.company_name || selectedCase.name} into Tenant?`;
    }

    if (await confirm(message)) {
      await handleConvertToCustomer(selectedCase.name);
    }
  };

  const handleConvertToCustomer = async (caseName) => {
    if (!erpnextConfig?.url || !caseName) return;

    setLoading(true);
    try {
      const res = await fetch(`${erpnextConfig.url}/api/method/approve_reject_doc`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': getCsrfToken ? getCsrfToken() : ''
        },
        body: JSON.stringify({
          doctype_name: "Tenant Onboarding",
          docname: caseName,
          state_code: 1
        })
      });

      if (res.ok) {
        alert("Tenant Onboarding successfully submitted and converted into Tenant!");
        setSelectedCase(prev => prev && prev.name === caseName ? { ...prev, docstatus: 1 } : prev);
        await fetchOnboardings();
      } else {
        let rawMsg = "Failed to submit Tenant Onboarding and convert into Tenant.";
        try {
          const errData = await res.json();
          if (errData._server_messages) {
            try {
              const msgs = JSON.parse(errData._server_messages);
              const firstMsgObj = JSON.parse(msgs[0]);
              rawMsg = firstMsgObj.message || rawMsg;
            } catch (inner) {
              rawMsg = errData._server_messages;
            }
          } else if (errData.exception) {
            rawMsg = errData.exception;
          }
        } catch (jErr) { }
        alert(rawMsg);
      }
    } catch (err) {
      console.error("Failed submitting Tenant Onboarding:", err);
      alert("An error occurred while converting to Tenant.");
    } finally {
      setLoading(false);
    }
  };

  // Filter cases
  const filteredCases = onboardings.filter(c => {
    const matchesSearch = (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.proposed_business_type || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.shop_space_location || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (statusFilter === 'All') return matchesSearch;
    return matchesSearch && c.business_status === statusFilter;
  });

  // Helper to calculate total completion progress based on 3 sections of checklist
  const getOverallCompletionProgress = (caseId, item) => {
    const localData = localChecklists[caseId] || {};

    // Map of verified states by lowercase trimmed label
    const verifiedMap = {};
    const itemDocs = caseDocuments[caseId] || item.documents || [];
    itemDocs.forEach(d => {
      if (d.document_type) {
        verifiedMap[d.document_type.toLowerCase().trim()] = !!d.verified;
      }
    });

    const companySearchChecks = currentDocumentTypes.map(docType =>
      !!verifiedMap[docType.label.toLowerCase().trim()]
    );

    // Progress checks based ONLY on proposal, booking, and company search
    const checks = [
      // Proposal & booking core details check
      !!item.menu_and_business_pictures,
      // Company search checks (fetched directly from ERPNext child table)
      ...companySearchChecks,
      // Booking Form plan check
      !!item.plans_for_approval || !!localData.booking_plans_for_approval
    ];

    const completed = checks.filter(Boolean).length;
    return Math.round((completed / checks.length) * 100);
  };

  const isFormValid = useDynamicForm ? (() => {
    if (doctypeFields.length === 0) return false;
    const visibleFields = doctypeFields.filter(f => f.hidden !== 1 && f.fieldname !== 'naming_series' && f.fieldname !== 'amended_from' && f.fieldname !== 'workflow_state');
    for (const field of visibleFields) {
      const val = dynamicFormValues[field.fieldname];
      if (isFieldRequired(field, dynamicFormValues)) {
        if (val === undefined || val === null || String(val).trim() === '') {
          return false;
        }
      }

      // If table field is present, validate its rows
      if (field.fieldtype === 'Table') {
        const rows = val;
        // If the table itself is required, it must have at least one row
        if (isFieldRequired(field, dynamicFormValues) && (!Array.isArray(rows) || rows.length === 0)) {
          return false;
        }
        if (Array.isArray(rows) && rows.length > 0) {
          const childFieldsSchema = childSchemasCache[field.options];
          if (childFieldsSchema) {
            const requiredChildFields = childFieldsSchema.filter(cf => isFieldRequired(cf) && cf.hidden !== 1);
            for (const row of rows) {
              for (const cf of requiredChildFields) {
                const rowVal = row[cf.fieldname];
                if (rowVal === undefined || rowVal === null || String(rowVal).trim() === '') {
                  return false;
                }
              }
              // Custom requirement: if document file is uploaded, document_type is mandatory
              if (row.document && String(row.document).trim() !== '') {
                if (!row.document_type || String(row.document_type).trim() === '') {
                  return false;
                }
              }
            }
          }
        }
      }
    }
    return true;
  })() : (
    contactName.trim() !== '' &&
    emailId.trim() !== '' &&
    proposedBusinessType.trim() !== '' &&
    businessStatus.trim() !== '' &&
    (type !== 'Company' || (companyName.trim() !== '' && companyVatId.trim() !== ''))
  );

  return (
    <div style={{ display: 'flex', background: 'var(--bg-secondary)', minHeight: '100vh', width: '100%' }}>

      {/* Master List (Left Pane) */}
      <div style={{
        flex: 1,
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        borderRight: '1px solid var(--border-color)',
        maxWidth: '100%',
        height: '100vh',
        overflowY: 'auto'
      }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>Tenant Onboarding Portal</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Onboarding workflow, booking verification, and company search audits.</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={fetchOnboardings}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'var(--bg-primary, #fff)',
                color: 'var(--text-primary, #0f172a)',
                border: '1px solid var(--border-color)',
                padding: '10px 18px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-primary)'}
            >
              <RefreshCw size={14} className={loading ? 'spin' : ''} />
              <span>Reload</span>
            </button>
            <button
              onClick={() => { resetFormFields(); setShowModal(true); setActiveFormTab('basic'); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'var(--brand-color, #2563eb)',
                color: '#fff',
                padding: '10px 18px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
              }}
            >
              <Plus size={16} />
              <span>New Onboarding</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px 14px', flex: 1, maxWidth: '300px' }}>
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search onboarding files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-primary)', fontSize: '13px', width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['All', 'New', 'Existing'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: statusFilter === status ? 'var(--brand-color, #2563eb)' : 'var(--bg-primary)',
                  color: statusFilter === status ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* List of Onboardings */}
        {loading && onboardings.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>Syncing with ERPNext...</div>
        ) : filteredCases.length === 0 ? (
          <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No onboarding records found.
          </div>
        ) : (() => {
          const indexOfLastItem = currentPage * itemsPerPage;
          const indexOfFirstItem = indexOfLastItem - itemsPerPage;
          const currentItems = filteredCases.slice(indexOfFirstItem, indexOfLastItem);
          const totalPages = Math.ceil(filteredCases.length / itemsPerPage);

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {currentItems.map((c) => {
                  const pct = getOverallCompletionProgress(c.name, c);
                  const isActive = selectedCase?.name === c.name;
                  return (
                    <div
                      key={c.name}
                      onClick={() => handleSelectCase(c)}
                      style={{
                        background: 'var(--bg-primary)',
                        border: `1px solid ${isActive ? 'var(--brand-color)' : 'var(--border-color)'}`,
                        borderRadius: '12px',
                        padding: '16px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        transition: 'all 0.2s ease',
                        boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.06)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{c.name}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {new Date(c.creation).toLocaleDateString()}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          {c.workflow_state && (
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              padding: '3px 8px',
                              borderRadius: '12px',
                              background: 'rgba(37, 99, 235, 0.08)',
                              color: 'var(--brand-color, #2563eb)'
                            }}>
                              {c.workflow_state}
                            </span>
                          )}
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '12px',
                            background: c.business_status === 'Completed' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(234, 179, 8, 0.12)',
                            color: c.business_status === 'Completed' ? '#10b981' : '#d97706'
                          }}>
                            {c.business_status}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', fontSize: '12.5px' }}>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>Business Type: </span>
                          <strong style={{ color: 'var(--text-primary)' }}>{c.proposed_business_type || '—'}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>Required Space(Sq Ft): </span>
                          <strong style={{ color: 'var(--text-primary)' }}>{c.required_space ? `${c.required_space} Sq Ft` : '—'}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>Location: </span>
                          <strong style={{ color: 'var(--text-primary)' }}>{c.shop_space_location || '—'}</strong>
                        </div>
                      </div>

                      {/* Completion stats */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                        <ClipboardList size={14} />
                        <span>Checklist Progress: <strong>{pct}% completed</strong></span>
                        <div style={{ flex: 1, height: '5px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? '#10b981' : 'var(--brand-color)', transition: 'width 0.3s ease' }} />
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Pagination controls at the bottom of the list */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  <div>
                    Showing <strong>{indexOfFirstItem + 1}</strong> to <strong>{Math.min(indexOfLastItem, filteredCases.length)}</strong> of <strong>{filteredCases.length}</strong>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      style={{
                        padding: '6px 12px',
                        fontSize: '11.5px',
                        opacity: currentPage === 1 ? 0.5 : 1,
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        borderRadius: '6px',
                        fontWeight: 600
                      }}
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        type="button"
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        style={{
                          padding: '6px 12px',
                          fontSize: '11.5px',
                          border: '1px solid var(--border-color)',
                          background: currentPage === i + 1 ? 'var(--brand-color, #2563eb)' : 'var(--bg-secondary)',
                          color: currentPage === i + 1 ? '#fff' : 'var(--text-primary)',
                          borderRadius: '6px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      style={{
                        padding: '6px 12px',
                        fontSize: '11.5px',
                        opacity: currentPage === totalPages ? 0.5 : 1,
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        borderRadius: '6px',
                        fontWeight: 600
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

      </div>

      {/* Backdrop with Blur Effect */}
      {selectedCase && (
        <div
          onClick={() => setSelectedCase(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.3)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            zIndex: 998,
            animation: 'fadeIn 0.2s ease-out'
          }}
        />
      )}

      {/* Details Drawer (Right Pane) */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: selectedCase ? 0 : '-800px',
        width: '800px',
        maxWidth: '100%',
        height: '100vh',
        background: 'var(--bg-primary)',
        boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.15)',
        zIndex: 999,
        transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {selectedCase && (() => {
          const caseLocal = localChecklists[selectedCase.name] || {};
          return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

              {/* Header with Wavy Pattern and Flow Layout */}
              <div style={{
                padding: '24px 24px 16px 24px',
                borderBottom: '1px solid var(--border-color)',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 300'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23f0fdf4' stop-opacity='0.95'/%3E%3Cstop offset='60%25' stop-color='%23f8fafc' stop-opacity='0.7'/%3E%3Cstop offset='100%25' stop-color='%23ffffff' stop-opacity='1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23g)'/%3E%3Cpath d='M-100 150 C 150 50, 250 250, 500 150 S 650 50, 900 150' stroke='rgba(16, 185, 129, 0.09)' fill='none' stroke-width='4.5'/%3E%3Cpath d='M-50 200 C 200 100, 300 300, 550 200 S 700 100, 950 200' stroke='rgba(16, 185, 129, 0.05)' fill='none' stroke-width='2.5'/%3E%3C/svg%3E")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>

                {/* Row 1: ID Badge, Current Workflow State & Exit Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '15px',
                      fontWeight: 800,
                      padding: '6px 16px',
                      borderRadius: '20px',
                      background: 'var(--brand-color, #065f46)',
                      color: '#ffffff',
                      boxShadow: '0 2px 6px rgba(6, 95, 70, 0.25)',
                      fontFamily: 'monospace',
                      letterSpacing: '0.5px'
                    }}>
                      ID:{selectedCase.name}
                    </span>

                    {/* Current State Badge */}
                    {(() => {
                      const currentState = workflowState?.current_state || selectedCase.workflow_state || 'Drafted';
                      const badge = getStateBadgeStyle(currentState);
                      return (
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '3px 10px',
                          borderRadius: '20px',
                          background: badge.bg,
                          border: badge.border,
                          color: badge.color,
                          fontSize: '10px',
                          fontWeight: 700,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                        }}>
                          <span style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            background: badge.dot,
                            boxShadow: `0 0 6px ${badge.dot}`
                          }} />
                          <span>{currentState}</span>
                        </div>
                      );
                    })()}
                  </div>

                  <button
                    onClick={() => setSelectedCase(null)}
                    style={{
                      background: 'rgba(15, 23, 42, 0.05)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      color: '#0f172a',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(15, 23, 42, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(15, 23, 42, 0.05)'}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Row 2: Title & Action Buttons (Parallel) */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '12px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Compliance Audit</h2>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {activeDetailTab !== 'documents' && (
                      <button
                        onClick={() => {
                          if (isEditingDetails) {
                            setIsEditingDetails(false);
                          } else {
                            setDynamicFormValues({ ...selectedCase });
                            setActiveDynamicTabIdx(0);
                            setIsEditingDetails(true);
                          }
                        }}
                        style={{
                          background: isEditingDetails ? 'rgba(239, 68, 68, 0.08)' : 'rgba(37, 99, 235, 0.08)',
                          border: 'none',
                          borderRadius: '20px',
                          color: isEditingDetails ? '#ef4444' : 'var(--brand-color)',
                          padding: '6px 12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11px',
                          fontWeight: 700
                        }}
                      >
                        {isEditingDetails ? <X size={12} /> : <Edit size={12} />}
                        <span>{isEditingDetails ? 'Cancel' : 'Edit Details'}</span>
                      </button>
                    )}

                    {/* Next State / Action Trigger */}
                    {!isEditingDetails && workflowState?.next_actions?.filter(act => {
                      const current = (workflowState?.current_state || selectedCase.workflow_state || '').toLowerCase();
                      const action = (act.action || '').toLowerCase();
                      if (current === 'approved' && action.includes('approve')) return false;
                      if (current === 'cancelled' && action.includes('cancel')) return false;
                      if (current === 'rejected' && action.includes('reject')) return false;
                      return true;
                    }).map((act, idx) => {
                      if (!act.allowed) return null;
                      const actionStyle = getActionButtonStyle(act.action);
                      return (
                        <button
                          key={idx}
                          disabled={loadingWorkflow}
                          onClick={() => handleWorkflowAction(act.action, act.next_state)}
                          style={{
                            background: actionStyle.background,
                            border: 'none',
                            borderRadius: '20px',
                            color: '#fff',
                            padding: '6px 14px',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: loadingWorkflow ? 'not-allowed' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: actionStyle.boxShadow,
                            transition: 'all 0.2s ease',
                            height: '28px'
                          }}
                        >
                          <span>{act.action === 'Convert to Customer' ? 'Convert to Tenant' : act.action}</span>
                        </button>
                      );
                    })}

                    {selectedCase.docstatus === 1 && (
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '6px 12px',
                        borderRadius: '20px',
                        background: 'rgba(16, 185, 129, 0.08)',
                        color: '#10b981',
                        border: '1.5px solid rgba(16, 185, 129, 0.2)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <ShieldCheck size={12} />
                        <span>Converted to Tenant</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Stage wise Navigation Tabs */}
                {!isEditingDetails && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{
                      display: 'flex',
                      gap: '6px',
                      background: '#e2e8f0',
                      padding: '6px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      flex: 1
                    }}>
                      {[
                        { id: 'basic', label: 'Basic Details' },
                        { id: 'proposal', label: 'Business Proposal' },
                        { id: 'booking', label: 'Booking Details' },
                        { id: 'documents', label: 'Documents ' }
                      ].map((tab) => {
                        const isActive = activeDetailTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveDetailTab(tab.id)}
                            style={{
                              flex: 1,
                              padding: '8px 10px',
                              fontSize: '12px',
                              fontWeight: isActive ? 700 : 500,
                              borderRadius: '6px',
                              border: isActive ? '1px solid #cbd5e1' : '1px solid transparent',
                              background: isActive ? '#ffffff' : 'transparent',
                              color: isActive ? 'var(--brand-color, #065f46)' : '#475569',
                              cursor: 'pointer',
                              transition: 'all 0.25s ease',
                              boxShadow: isActive ? '0 2px 6px rgba(0, 0, 0, 0.08)' : 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Circular Status Indicator */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'rgba(22, 163, 74, 0.08)',
                        border: '1.5px solid #16a34a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#16a34a'
                      }}>
                        <CheckCircle2 size={16} />
                      </div>
                    </div>
                  </div>
                )}

              </div>



              {/* TAB CONTENT */}
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px', flex: 1, overflowY: 'hidden', minHeight: 0 }}>
                {isEditingDetails ? (() => {
                  const dynamicSections = [];
                  let currentSec = { title: 'Basic Info', fields: [] };

                  doctypeFields
                    .filter(f => f.hidden !== 1 && f.fieldname !== 'naming_series' && f.fieldname !== 'amended_from' && f.fieldname !== 'workflow_state')
                    .forEach(f => {
                      if (f.fieldtype === 'Section Break') {
                        if (currentSec.fields.length > 0) {
                          dynamicSections.push(currentSec);
                        }
                        currentSec = { title: f.label || 'Details', fields: [] };
                      } else if (f.fieldtype !== 'Column Break') {
                        currentSec.fields.push(f);
                      }
                    });
                  if (currentSec.fields.length > 0) {
                    dynamicSections.push(currentSec);
                  }

                  const activeSections = dynamicSections.length > 0 ? dynamicSections : [{ title: 'Form', fields: doctypeFields }];
                  const safeTabIdx = Math.min(activeDynamicTabIdx, activeSections.length - 1);

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, minHeight: 0 }}>
                      {/* Dynamic Tabs Headers */}
                      <div style={{ display: 'flex', gap: '6px', background: '#e2e8f0', padding: '6px', borderRadius: '8px', overflowX: 'auto', border: '1px solid #cbd5e1' }}>
                        {activeSections.map((sec, idx) => {
                          const isActive = safeTabIdx === idx;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setActiveDynamicTabIdx(idx)}
                              style={{
                                padding: '8px 16px',
                                fontSize: '12px',
                                fontWeight: isActive ? 700 : 500,
                                borderRadius: '6px',
                                border: isActive ? '1px solid #cbd5e1' : '1px solid transparent',
                                background: isActive ? '#ffffff' : 'transparent',
                                color: isActive ? 'var(--brand-color, #065f46)' : '#475569',
                                boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.25s ease'
                              }}
                            >
                              {sec.title}
                            </button>
                          );
                        })}
                      </div>

                      {/* Scrollable Fields & Checklist Container */}
                      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '6px', display: 'flex', flexDirection: 'column', gap: '16px', minHeight: 0 }}>
                         {/* Dynamic Fields for the Active Section */}
                          {(() => {
                            const fields = activeSections[safeTabIdx]?.fields.filter(field => {
                              if (field.fieldname === 'company_search_documents') return false;
                              const selectedType = dynamicFormValues['type'] || '';
                              if (field.fieldname === 'date_of_birth' && selectedType !== 'Individual') {
                                return false;
                              }
                              if (field.fieldname === 'date_of_incorporation' && selectedType !== 'Company') {
                                return false;
                              }
                              const isInternal = !!dynamicFormValues['is_internal_customer'];
                              const fieldLabelLower = (field.label || '').toLowerCase();
                              const fieldNameLower = (field.fieldname || '').toLowerCase();
                              if (!isInternal) {
                                if (fieldLabelLower.includes('represents company') || fieldNameLower.includes('represents_company')) {
                                  return false;
                                }
                                if (fieldLabelLower.includes('allowed to transact with') || fieldNameLower.includes('allowed_to_transact_with') || fieldNameLower.includes('allowed_to_transact')) {
                                  return false;
                                }
                              }
                              return true;
                            }) || [];

                            const addressFieldNames = ['address_line_1', 'address_line_2', 'city', 'state', 'country'];
                            const hasAddress = fields.some(f => addressFieldNames.includes(f.fieldname));
                            const hasGeneral = fields.some(f => !addressFieldNames.includes(f.fieldname));

                            if (hasAddress && hasGeneral) {
                              const generalFields = fields.filter(f => !addressFieldNames.includes(f.fieldname));
                              const addressFields = fields.filter(f => addressFieldNames.includes(f.fieldname));

                              return (
                                <>
                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    {generalFields.map(field => (
                                      <DynamicFormField
                                        key={field.fieldname}
                                        field={field}
                                        value={dynamicFormValues[field.fieldname] === undefined ? (field.default || '') : dynamicFormValues[field.fieldname]}
                                        onChange={(newVal) => setDynamicFormValues(prev => ({ ...prev, [field.fieldname]: newVal }))}
                                        linkOptionsCache={linkOptionsCache}
                                        fetchLinkOptions={fetchLinkOptions}
                                        getDocTypeFields={getDocTypeFields}
                                        erpnextConfig={erpnextConfig}
                                        getCsrfToken={getCsrfToken}
                                        formValues={dynamicFormValues}
                                      />
                                    ))}
                                  </div>

                                  <div style={{
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    color: 'var(--brand-color, #065f46)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.75px',
                                    marginTop: '8px',
                                    paddingBottom: '6px',
                                    borderBottom: '1.5px solid var(--border-color)'
                                  }}>
                                    Address Info
                                  </div>

                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    {addressFields.map(field => (
                                      <DynamicFormField
                                        key={field.fieldname}
                                        field={field}
                                        value={dynamicFormValues[field.fieldname] === undefined ? (field.default || '') : dynamicFormValues[field.fieldname]}
                                        onChange={(newVal) => setDynamicFormValues(prev => ({ ...prev, [field.fieldname]: newVal }))}
                                        linkOptionsCache={linkOptionsCache}
                                        fetchLinkOptions={fetchLinkOptions}
                                        getDocTypeFields={getDocTypeFields}
                                        erpnextConfig={erpnextConfig}
                                        getCsrfToken={getCsrfToken}
                                        formValues={dynamicFormValues}
                                      />
                                    ))}
                                  </div>
                                </>
                              );
                            }

                            return (
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                {fields.map(field => (
                                  <DynamicFormField
                                    key={field.fieldname}
                                    field={field}
                                    value={dynamicFormValues[field.fieldname] === undefined ? (field.default || '') : dynamicFormValues[field.fieldname]}
                                    onChange={(newVal) => setDynamicFormValues(prev => ({ ...prev, [field.fieldname]: newVal }))}
                                    linkOptionsCache={linkOptionsCache}
                                    fetchLinkOptions={fetchLinkOptions}
                                    getDocTypeFields={getDocTypeFields}
                                    erpnextConfig={erpnextConfig}
                                    getCsrfToken={getCsrfToken}
                                    formValues={dynamicFormValues}
                                  />
                                ))}
                              </div>
                            );
                          })()}

                        {/* Unified Checklist UI for Company Search tab inside dynamic edit panel */}
                        {activeSections[safeTabIdx]?.fields.some(f => f.fieldname === 'company_search_documents') && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              {(() => {
                                const docs = caseDocuments[selectedCase.name] || selectedCase.documents || selectedCase.company_search_documents || [];

                                // Map standard static checklist items
                                const standardDocs = currentDocumentTypes.map(doc => {
                                  const erpDoc = docs.find(d =>
                                    d.document_type?.toLowerCase().trim() === doc.label.toLowerCase().trim()
                                  );
                                  return {
                                    key: doc.key,
                                    label: doc.label,
                                    erpDoc: erpDoc,
                                    isStandard: true
                                  };
                                });

                                // Map custom dynamic checklist items
                                const standardLabelsLower = new Set(currentDocumentTypes.map(d => d.label.toLowerCase().trim()));
                                const customDocs = docs
                                  .filter(d => d.document_type && !standardLabelsLower.has(d.document_type.toLowerCase().trim()))
                                  .map((d, index) => ({
                                    key: `custom_${index}_${d.name || d.document_type}`,
                                    label: d.document_type,
                                    erpDoc: d,
                                    isStandard: false
                                  }));

                                const combinedDocsList = [...standardDocs, ...customDocs];

                                return combinedDocsList.map((docItem) => {
                                  const erpDoc = docItem.erpDoc;
                                  const fileUrl = erpDoc?.document || '';
                                  const isVerified = !!erpDoc?.verified;
                                  const isExpanded = !!expandedDocs[docItem.key];

                                  const draftEntry = checklistDrafts[docItem.label];
                                  const fileUrlDraft = draftEntry !== undefined ? draftEntry.doc : fileUrl;
                                  const isVerifiedDraft = draftEntry !== undefined ? draftEntry.verified : isVerified;

                                  let statusText = 'Upload';
                                  let statusColor = 'var(--text-muted)';
                                  let statusBg = 'rgba(156, 163, 175, 0.1)';
                                  if (fileUrlDraft) {
                                    if (isVerifiedDraft) {
                                      statusText = 'Verified';
                                      statusColor = '#10b981';
                                      statusBg = 'rgba(16, 185, 129, 0.1)';
                                    } else {
                                      statusText = 'Needs Verification';
                                      statusColor = '#d97706';
                                      statusBg = 'rgba(217, 119, 6, 0.1)';
                                    }
                                  }

                                  return (
                                    <div
                                      key={docItem.key}
                                      style={{
                                        background: 'var(--bg-primary)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'all 0.2s ease',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                        overflow: 'hidden'
                                      }}
                                    >
                                      {/* Header Row - Click to collapse/expand */}
                                      <div
                                        onClick={() => toggleDocExpand(docItem.key)}
                                        style={{
                                          padding: '12px 16px',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                          cursor: 'pointer',
                                          background: isExpanded ? 'var(--bg-secondary)' : 'transparent',
                                          transition: 'background 0.2s ease'
                                        }}
                                      >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                                          {isExpanded ? <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} /> : <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />}
                                          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {docItem.label}
                                          </span>
                                          <span style={{
                                            fontSize: '10px',
                                            fontWeight: 700,
                                            padding: '2px 6px',
                                            borderRadius: '4px',
                                            background: statusBg,
                                            color: statusColor,
                                            marginLeft: '8px'
                                          }}>
                                            {statusText}
                                          </span>
                                        </div>

                                        {/* Verify toggle stays on header for quick access */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

                                          {fileUrlDraft && (
                                            <button
                                              type="button"
                                              onClick={async (e) => {
                                                e.stopPropagation();
                                                const targetVerified = !isVerifiedDraft;
                                                await saveDocumentToERPNext(docItem.label, fileUrlDraft, targetVerified);
                                                setChecklistDrafts(prev => {
                                                  const next = { ...prev };
                                                  delete next[docItem.label];
                                                  return next;
                                                });
                                              }}
                                              style={{
                                                background: 'transparent',
                                                border: 'none',
                                                color: 'var(--brand-color)',
                                                cursor: 'pointer',
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                border: '1px solid var(--border-color)',
                                                transition: 'all 0.2s'
                                              }}
                                              onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'var(--bg-secondary)';
                                              }}
                                              onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'transparent';
                                              }}
                                            >
                                              {isVerifiedDraft ? <ShieldAlert size={12} style={{ color: '#d97706' }} /> : <ShieldCheck size={12} />}
                                              <span>{isVerifiedDraft ? 'Unverify' : 'Verify'}</span>
                                            </button>
                                          )}
                                        </div>
                                      </div>

                                      {/* Expanded Content Panel */}
                                      {isExpanded && (
                                        <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg-secondary)' }}>
                                          <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'space-between', gap: '12px' }}>
                                            {/* File details and attachments */}
                                            {fileUrlDraft ? (
                                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                                                <button
                                                  onClick={() => {
                                                    const fullUrl = fileUrlDraft.startsWith('http') ? fileUrlDraft : `${erpnextConfig.url}${fileUrlDraft}`;
                                                    setPreviewDocUrl(fullUrl);
                                                    setPreviewDocTitle(docItem.label);
                                                  }}
                                                  style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: 'var(--brand-color)',
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    padding: 0,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                  }}
                                                >
                                                  <Eye size={13} style={{ flexShrink: 0 }} />
                                                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    Preview: {fileUrlDraft.split('/').pop()}
                                                  </span>
                                                </button>

                                                <button
                                                  onClick={() => {
                                                    setChecklistDrafts(prev => ({
                                                      ...prev,
                                                      [docItem.label]: {
                                                        ...(prev[docItem.label] || { doc: fileUrl, verified: isVerified }),
                                                        doc: '',
                                                        verified: false
                                                      }
                                                    }));
                                                  }}
                                                  style={{
                                                    background: 'rgba(239, 68, 68, 0.08)',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    color: '#ef4444',
                                                    padding: '6px 10px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginLeft: 'auto'
                                                  }}
                                                  title="Remove File"
                                                >
                                                  <Trash2 size={13} />
                                                  <span style={{ fontSize: '11px', fontWeight: 600, marginLeft: '4px' }}>Remove</span>
                                                </button>
                                              </div>
                                            ) : (
                                              <label style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '8px 16px',
                                                border: '1px solid var(--border-color)',
                                                background: 'var(--bg-primary)',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                fontWeight: 600,
                                                cursor: uploadingFile ? 'not-allowed' : 'pointer',
                                                transition: 'all 0.15s ease'
                                              }}>
                                                <Paperclip size={14} />
                                                <span>Attach Document</span>
                                                <input
                                                  type="file"
                                                  disabled={uploadingFile}
                                                  onChange={(e) => handleFileUpload(e, (url) => {
                                                    setChecklistDrafts(prev => ({
                                                      ...prev,
                                                      [docItem.label]: {
                                                        ...(prev[docItem.label] || { doc: fileUrl, verified: isVerified }),
                                                        doc: url
                                                      }
                                                    }));
                                                  })}
                                                  style={{ display: 'none' }}
                                                />
                                              </label>
                                            )}
                                          </div>

                                          {/* Tiny Preview Box */}
                                          {fileUrlDraft && /\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrlDraft) && (
                                            <div
                                              onClick={() => {
                                                const fullUrl = fileUrlDraft.startsWith('http') ? fileUrlDraft : `${erpnextConfig.url}${fileUrlDraft}`;
                                                setPreviewDocUrl(fullUrl);
                                                setPreviewDocTitle(docItem.label);
                                              }}
                                              style={{ width: '100%', height: '100px', background: '#000', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-color)', cursor: 'pointer' }}
                                            >
                                              <img
                                                src={fileUrlDraft.startsWith('http') ? fileUrlDraft : `${erpnextConfig.url}${fileUrlDraft}`}
                                                alt={docItem.label}
                                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                crossOrigin="use-credentials"
                                              />
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                });
                              })()}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: '10px', marginTop: '16px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                        <button
                          type="button"
                          onClick={() => setIsEditingDetails(false)}
                          disabled={updatingDetails}
                          style={{
                            padding: '7px 16px',
                            fontSize: '12px',
                            fontWeight: 600,
                            border: '1px solid var(--border-color)',
                            borderRadius: '6px',
                            background: 'var(--bg-primary)',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            minWidth: '90px'
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleUpdateCoreDetails}
                          disabled={updatingDetails}
                          style={{
                            padding: '7px 16px',
                            fontSize: '12px',
                            fontWeight: 600,
                            border: 'none',
                            borderRadius: '6px',
                            background: updatingDetails ? 'var(--text-muted, #64748b)' : 'var(--brand-color, #065f46)',
                            color: '#fff',
                            cursor: updatingDetails ? 'not-allowed' : 'pointer',
                            minWidth: '110px',
                            boxShadow: '0 2px 4px rgba(6, 95, 70, 0.15)'
                          }}
                        >
                          {updatingDetails ? 'Updating...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  );
                })() : (
                  <>
                    {/* Basic Details */}
                    {activeDetailTab === 'basic' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, overflowY: 'auto', paddingRight: '6px' }}>
                        <h4 style={{ margin: 0, fontSize: '13px', color: 'var(--brand-color)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Basic Onboarding Details</h4>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          {/* Tenant Type */}
                          <div style={{ border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tenant Type</span>
                            {isEditingDetails ? (
                              <select
                                value={editType}
                                onChange={(e) => setEditType(e.target.value)}
                                style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, marginTop: '2px', outline: 'none', cursor: 'pointer' }}
                              >
                                <option value="Company">Company</option>
                                <option value="Individual">Individual</option>
                              </select>
                            ) : (
                              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedCase.type || 'Company'}</div>
                            )}
                          </div>

                          {(() => {
                            const currentType = isEditingDetails ? editType : (selectedCase.type || 'Company');

                            const rCompanyNameField = (
                              <div key="company_name" style={{ border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{currentType === 'Company' ? 'Company Name *' : 'Company Name'}</span>
                                {isEditingDetails ? (
                                  <input
                                    type="text"
                                    value={editCompanyName}
                                    onChange={(e) => setEditCompanyName(e.target.value)}
                                    placeholder="e.g. Acme Corp"
                                    style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, marginTop: '2px', outline: 'none' }}
                                  />
                                ) : (
                                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedCase.company_name || '—'}</div>
                                )}
                              </div>
                            );

                            const rCompanyTinField = (
                              <div key="company_tin" style={{ border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{currentType === 'Company' ? 'Company TIN ID *' : 'Company TIN ID'}</span>
                                {isEditingDetails ? (
                                  <input
                                    type="text"
                                    value={editCompanyVatId}
                                    onChange={(e) => setEditCompanyVatId(e.target.value)}
                                    placeholder="VAT ID"
                                    style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, marginTop: '2px', outline: 'none' }}
                                  />
                                ) : (
                                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedCase.company_vat_id || '—'}</div>
                                )}
                              </div>
                            );

                            const rContactNameField = (
                              <div key="contact_name" style={{ border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Contact Person</span>
                                {isEditingDetails ? (
                                  <input
                                    type="text"
                                    value={editContactName}
                                    onChange={(e) => setEditContactName(e.target.value)}
                                    placeholder="e.g. John Doe"
                                    style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, marginTop: '2px', outline: 'none' }}
                                  />
                                ) : (
                                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedCase.contact_name || '—'}</div>
                                )}
                              </div>
                            );

                            const rEmailIdField = (
                              <div key="email_id" style={{ border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Email ID</span>
                                {isEditingDetails ? (
                                  <input
                                    type="email"
                                    value={editEmailId}
                                    onChange={(e) => setEditEmailId(e.target.value)}
                                    placeholder="e.g. john@example.com"
                                    style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, marginTop: '2px', outline: 'none' }}
                                  />
                                ) : (
                                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedCase.email_id || '—'}</div>
                                )}
                              </div>
                            );

                            const rContactNumberField = isEditingDetails ? (
                              <div key="contact_number" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '4px' }}>Contact Number</span>
                                <PhoneInputWithDropdown
                                  value={editContactLocal ? `${editContactPrefix}-${editContactLocal}` : ""}
                                  onChange={(newVal) => {
                                    const parsed = parsePhoneNumber(newVal);
                                    setEditContactPrefix(parsed.prefix);
                                    setEditContactLocal(parsed.local);
                                  }}
                                />
                              </div>
                            ) : (
                              <div key="contact_number" style={{ border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Contact Number</span>
                                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  {(() => {
                                    const parsed = parsePhoneNumber(selectedCase.contact_number);
                                    const matched = COUNTRY_CODES.find(c => c.prefix === parsed.prefix);
                                    return (
                                      <>
                                        <span style={{ fontSize: '15px', lineHeight: 1 }}>{matched?.flag || '🇫🇯'}</span>
                                        <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{parsed.prefix}</span>
                                        <span>{parsed.local || '—'}</span>
                                      </>
                                    );
                                  })()}
                                </div>
                              </div>
                            );

                            return currentType === 'Company' ? (
                              <>
                                {rCompanyNameField}
                                {rCompanyTinField}
                                {rContactNameField}
                                {rEmailIdField}
                                {rContactNumberField}
                              </>
                            ) : (
                              <>
                                {rContactNameField}
                                {rEmailIdField}
                                {rContactNumberField}
                                {rCompanyNameField}
                                {rCompanyTinField}
                              </>
                            );
                          })()}

                          <div style={{ border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gridColumn: 'span 2' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Is Internal Tenant?</span>
                            {isEditingDetails ? (
                              <input
                                type="checkbox"
                                checked={editIsInternalCustomer}
                                onChange={(e) => setEditIsInternalCustomer(e.target.checked)}
                                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                              />
                            ) : (
                              <div style={{ fontSize: '13px', fontWeight: 700, color: selectedCase.is_internal_customer ? '#16a34a' : 'var(--text-muted)' }}>
                                {selectedCase.is_internal_customer ? 'Yes' : 'No'}
                              </div>
                            )}
                          </div>

                          {selectedCase.type === 'Individual' && (
                            <div style={{ border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Date of Birth</span>
                              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedCase.date_of_birth || '—'}</div>
                            </div>
                          )}
                        </div>

                        <div style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          color: 'var(--brand-color, #065f46)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.75px',
                          marginTop: '8px',
                          paddingBottom: '6px',
                          borderBottom: '1.5px solid var(--border-color)'
                        }}>
                          Address Info
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div style={{ border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Address Line 1</span>
                            {isEditingDetails ? (
                              <input
                                type="text"
                                value={editAddressLine1}
                                onChange={(e) => setEditAddressLine1(e.target.value)}
                                placeholder="Line 1"
                                style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, marginTop: '2px', outline: 'none' }}
                              />
                            ) : (
                              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedCase.address_line_1 || '—'}</div>
                            )}
                          </div>

                          <div style={{ border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Address Line 2</span>
                            {isEditingDetails ? (
                              <input
                                type="text"
                                value={editAddressLine2}
                                onChange={(e) => setEditAddressLine2(e.target.value)}
                                placeholder="Line 2"
                                style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, marginTop: '2px', outline: 'none' }}
                              />
                            ) : (
                              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedCase.address_line_2 || '—'}</div>
                            )}
                          </div>

                          <div style={{ border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>City</span>
                            {isEditingDetails ? (
                              <input
                                type="text"
                                value={editCity}
                                onChange={(e) => setEditCity(e.target.value)}
                                placeholder="City"
                                style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, marginTop: '2px', outline: 'none' }}
                              />
                            ) : (
                              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedCase.city || '—'}</div>
                            )}
                          </div>

                          <div style={{ border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>State</span>
                            {isEditingDetails ? (
                              <input
                                type="text"
                                value={editState}
                                onChange={(e) => setEditState(e.target.value)}
                                placeholder="State"
                                style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, marginTop: '2px', outline: 'none' }}
                              />
                            ) : (
                              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedCase.state || '—'}</div>
                            )}
                          </div>

                          <div style={{ border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Country</span>
                            {isEditingDetails ? (
                              <select
                                value={editCountry}
                                onChange={(e) => setEditCountry(e.target.value)}
                                style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, marginTop: '2px', outline: 'none', cursor: 'pointer' }}
                              >
                                <option value="">-- Choose Country --</option>
                                {countries.map(c => (
                                  <option key={c} value={c}>{c}</option>
                                ))}
                              </select>
                            ) : (
                              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedCase.country || '—'}</div>
                            )}
                          </div>
                        </div>

                        {isEditingDetails && (
                          <button
                            disabled={updatingDetails}
                            onClick={handleUpdateCoreDetails}
                            style={{
                              background: updatingDetails ? 'var(--text-muted, #64748b)' : 'var(--brand-color, #2563eb)',
                              color: '#fff',
                              padding: '10px 16px',
                              borderRadius: '8px',
                              border: 'none',
                              fontWeight: 700,
                              fontSize: '13px',
                              cursor: updatingDetails ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              marginTop: '8px',
                              boxShadow: updatingDetails ? 'none' : '0 4px 12px rgba(37, 99, 235, 0.25)',
                              opacity: updatingDetails ? 0.6 : 1
                            }}
                          >
                            {updatingDetails ? 'Updating...' : 'Save Changes'}
                          </button>
                        )}
                      </div>
                    )}

                    {/* Stage 1: Business Proposal */}
                    {activeDetailTab === 'proposal' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, overflowY: 'auto', paddingRight: '6px' }}>
                        <h4 style={{ margin: 0, fontSize: '13px', color: 'var(--brand-color)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Business Proposal Fields</h4>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div style={{ border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Business Type</span>
                            {isEditingDetails ? (
                              <select
                                value={editProposedBusinessType}
                                onChange={(e) => setEditProposedBusinessType(e.target.value)}
                                style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, marginTop: '2px', outline: 'none' }}
                              >
                                <option value="Restaurant">Restaurant</option>
                                <option value="Cafe">Cafe</option>
                                <option value="Supermarket">Supermarket</option>
                                <option value="Retail Store">Retail Store</option>
                                <option value="Pharmacy">Pharmacy</option>
                                <option value="Salon / Spa">Salon / Spa</option>
                                <option value="Gym / Fitness">Gym / Fitness</option>
                                <option value="Cinema / Entertainment">Cinema / Entertainment</option>
                                <option value="Bar">Bar</option>
                                <option value="Office / Coworking">Office / Coworking</option>
                                <option value="Kiosk">Kiosk</option>
                              </select>
                            ) : (
                              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedCase.proposed_business_type || '—'}</div>
                            )}
                          </div>
                          <div style={{ border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Required Space(Sq Ft)</span>
                            {isEditingDetails ? (
                              <input
                                type="number"
                                value={editRequiredSpace}
                                onChange={(e) => setEditRequiredSpace(e.target.value)}
                                style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, marginTop: '2px', outline: 'none' }}
                              />
                            ) : (
                              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedCase.required_space ? `${selectedCase.required_space} Sq Ft` : '—'}</div>
                            )}
                          </div>
                          <div style={{ border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Business Status</span>
                            {isEditingDetails ? (
                              <select
                                value={editBusinessStatus}
                                onChange={(e) => setEditBusinessStatus(e.target.value)}
                                style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, marginTop: '2px', outline: 'none' }}
                              >
                                <option value="New">New</option>
                                <option value="Existing">Existing</option>
                              </select>
                            ) : (
                              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedCase.business_status || '—'}</div>
                            )}
                          </div>
                          <div style={{ border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Rental Budget(FJD)</span>
                            {isEditingDetails ? (
                              <input
                                type="number"
                                value={editBudget}
                                onChange={(e) => setEditBudget(e.target.value)}
                                style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, marginTop: '2px', outline: 'none' }}
                              />
                            ) : (
                              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedCase.budget ? `FJD ${selectedCase.budget.toLocaleString()}` : '—'}</div>
                            )}
                          </div>
                        </div>

                        <div style={{ border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Range & Line of Items (Other Business)</span>
                          {isEditingDetails ? (
                            <input
                              type="text"
                              value={editProductServiceRange}
                              onChange={(e) => setEditProductServiceRange(e.target.value)}
                              placeholder="Specify product catalog/ranges..."
                              style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, marginTop: '2px', outline: 'none' }}
                            />
                          ) : (
                            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedCase.product_service_range || '—'}</div>
                          )}
                        </div>

                        <div style={{ border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Fit-out Work Timeframe & Approvals</span>
                          {isEditingDetails ? (
                            <input
                              type="text"
                              value={editFitoutApprovalTimeframe}
                              onChange={(e) => setEditFitoutApprovalTimeframe(e.target.value)}
                              placeholder="Specify timeframe (e.g. 45 days)"
                              style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, marginTop: '2px', outline: 'none' }}
                            />
                          ) : (
                            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedCase.fitout_approval_timeframe || '—'}</div>
                          )}
                        </div>

                        {/* Menu & Business Pictures Attachment */}
                        {isEditingDetails ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Menu & Business Pictures Attachment</span>
                            {editMenuAndBusinessPictures ? (
                              <div style={{ width: '100%', height: '180px', background: '#000', borderRadius: '8px', overflow: 'hidden', position: 'relative', border: '1px solid var(--border-color)' }}>
                                <img
                                  src={editMenuAndBusinessPictures.startsWith('http') ? editMenuAndBusinessPictures : `${erpnextConfig.url}${editMenuAndBusinessPictures}`}
                                  alt="Menu and Business Pictures"
                                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                  crossOrigin="use-credentials"
                                />
                                <div style={{ position: 'absolute', left: '8px', bottom: '8px', background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '4px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 600, cursor: 'pointer' }}
                                  onClick={() => {
                                    const fullUrl = editMenuAndBusinessPictures.startsWith('http') ? editMenuAndBusinessPictures : `${erpnextConfig.url}${editMenuAndBusinessPictures}`;
                                    setPreviewDocUrl(fullUrl);
                                    setPreviewDocTitle('Menu & Business Pictures');
                                  }}
                                >
                                  <Eye size={10} />
                                  <span>Preview</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditMenuAndBusinessPictures('');
                                  }}
                                  style={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    zIndex: 10,
                                    background: 'rgba(239, 68, 68, 0.9)',
                                    color: '#fff',
                                    borderRadius: '50%',
                                    width: '28px',
                                    height: '28px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                    transition: 'background 0.2s'
                                  }}
                                  title="Delete Image"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            ) : (
                              <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                padding: '16px',
                                border: '1px dashed var(--border-color)',
                                background: 'var(--bg-secondary)',
                                borderRadius: '8px',
                                cursor: uploadingFile ? 'not-allowed' : 'pointer',
                                fontSize: '13px',
                                fontWeight: 600,
                                color: 'var(--text-secondary)',
                                transition: 'all 0.2s'
                              }}>
                                {uploadingFile ? <Loader2 size={16} className="spin" /> : <Paperclip size={16} />}
                                <span>{uploadingFile ? 'Uploading...' : 'Attach Menu & Business Pictures'}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  disabled={uploadingFile}
                                  onChange={(e) => handleFileUpload(e, setEditMenuAndBusinessPictures)}
                                  style={{ display: 'none' }}
                                />
                              </label>
                            )}
                          </div>
                        ) : (
                          selectedCase.menu_and_business_pictures && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Menu & Business Pictures Attachment</span>
                              <div
                                onClick={() => {
                                  const fullUrl = selectedCase.menu_and_business_pictures.startsWith('http')
                                    ? selectedCase.menu_and_business_pictures
                                    : `${erpnextConfig.url}${selectedCase.menu_and_business_pictures}`;
                                  setPreviewDocUrl(fullUrl);
                                  setPreviewDocTitle('Menu & Business Pictures');
                                }}
                                style={{ width: '100%', height: '180px', background: '#000', borderRadius: '8px', overflow: 'hidden', position: 'relative', border: '1px solid var(--border-color)', cursor: 'pointer' }}
                              >
                                <img
                                  src={selectedCase.menu_and_business_pictures.startsWith('http') ? selectedCase.menu_and_business_pictures : `${erpnextConfig.url}${selectedCase.menu_and_business_pictures}`}
                                  alt="Menu and Business Pictures"
                                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                  crossOrigin="use-credentials"
                                />
                                <div style={{ position: 'absolute', right: '8px', bottom: '8px', background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '4px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 600 }}>
                                  <Eye size={10} />
                                  <span>Click to Preview</span>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                        {isEditingDetails && (
                          <button
                            disabled={updatingDetails}
                            onClick={handleUpdateCoreDetails}
                            style={{
                              background: updatingDetails ? 'var(--text-muted, #64748b)' : 'var(--brand-color, #2563eb)',
                              color: '#fff',
                              padding: '10px 16px',
                              borderRadius: '8px',
                              border: 'none',
                              fontWeight: 700,
                              fontSize: '13px',
                              cursor: updatingDetails ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              marginTop: '8px',
                              boxShadow: updatingDetails ? 'none' : '0 4px 12px rgba(37, 99, 235, 0.25)',
                              opacity: updatingDetails ? 0.6 : 1
                            }}
                          >
                            {updatingDetails ? 'Updating...' : 'Save Changes'}
                          </button>
                        )}
                      </div>
                    )}

                    {/* Stage 2: Booking Form */}
                    {activeDetailTab === 'booking' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, overflowY: 'auto', paddingRight: '6px' }}>
                        <h4 style={{ margin: 0, fontSize: '13px', color: 'var(--brand-color)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Booking Form Terms & Conditions</h4>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div style={{ border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Shop Space & Location</span>
                            {isEditingDetails ? (
                              <select
                                value={editShopSpaceLocation}
                                onChange={(e) => setEditShopSpaceLocation(e.target.value)}
                                style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, marginTop: '2px', outline: 'none' }}
                              >
                                <option value="">Select Location</option>
                                {districts.map(d => (
                                  <option key={d} value={d}>{d}</option>
                                ))}
                              </select>
                            ) : (
                              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedCase.shop_space_location || '—'}</div>
                            )}
                          </div>
                          <div style={{ border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Lease Period(Year)</span>
                            {isEditingDetails ? (
                              <input
                                type="number"
                                value={editLeasePeriod}
                                onChange={(e) => setEditLeasePeriod(e.target.value)}
                                style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, marginTop: '2px', outline: 'none' }}
                              />
                            ) : (
                              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedCase.lease_period ? `${selectedCase.lease_period} years` : '—'}</div>
                            )}
                          </div>
                          <div style={{ border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Rental Charges ($)</span>
                            {isEditingDetails ? (
                              <input
                                type="number"
                                value={editRentalCharges}
                                onChange={(e) => setEditRentalCharges(e.target.value)}
                                style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, marginTop: '2px', outline: 'none' }}
                              />
                            ) : (
                              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedCase.rental_charges ? `$${selectedCase.rental_charges.toLocaleString()}` : '—'}</div>
                            )}
                          </div>
                          <div style={{ border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Promo / Service Charges ($)</span>
                            {isEditingDetails ? (
                              <input
                                type="number"
                                value={editServicePromoCharges}
                                onChange={(e) => setEditServicePromoCharges(e.target.value)}
                                style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, marginTop: '2px', outline: 'none' }}
                              />
                            ) : (
                              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedCase.service_promotional_charges ? `$${selectedCase.service_promotional_charges.toLocaleString()}` : '—'}</div>
                            )}
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div style={{ border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Security Deposit / Booking Fee</span>
                            {isEditingDetails ? (
                              <input
                                type="number"
                                value={editSecurityDepositFee}
                                onChange={(e) => setEditSecurityDepositFee(e.target.value)}
                                style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, marginTop: '2px', outline: 'none' }}
                              />
                            ) : (
                              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedCase.security_deposit_booking_fee ? `$${selectedCase.security_deposit_booking_fee.toLocaleString()}` : '—'}</div>
                            )}
                          </div>
                          <div style={{ border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Fit-out Period (Days)</span>
                            {isEditingDetails ? (
                              <input
                                type="number"
                                value={editFitoutPeriod}
                                onChange={(e) => setEditFitoutPeriod(e.target.value)}
                                style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, marginTop: '2px', outline: 'none' }}
                              />
                            ) : (
                              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedCase.fitout_period ? `${selectedCase.fitout_period} days` : '—'}</div>
                            )}
                          </div>
                        </div>

                        <div style={{ border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Usage of Demise Premises</span>
                          {isEditingDetails ? (
                            <input
                              type="text"
                              value={editUsageOfDemisedPremises}
                              onChange={(e) => setEditUsageOfDemisedPremises(e.target.value)}
                              style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, marginTop: '2px', outline: 'none' }}
                            />
                          ) : (
                            <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedCase.usage_of_demised_premises || '—'}</div>
                          )}
                        </div>

                        <div style={{ border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Nature of Business</span>
                          <input
                            type="text"
                            value={caseLocal.booking_nature_of_business || ''}
                            onChange={(e) => updateLocalChecklistField(selectedCase.name, 'booking_nature_of_business', e.target.value)}
                            placeholder="e.g. Retail Clothing Boutique"
                            style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, marginTop: '2px', outline: 'none' }}
                          />
                        </div>

                        <div style={{ border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Types of Merchandise</span>
                          <input
                            type="text"
                            value={caseLocal.booking_merchandise_types || ''}
                            onChange={(e) => updateLocalChecklistField(selectedCase.name, 'booking_merchandise_types', e.target.value)}
                            placeholder="e.g. Menswear, accessories"
                            style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, marginTop: '2px', outline: 'none' }}
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div style={{ border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Commencement of Lease</span>
                            {isEditingDetails ? (
                              <input
                                type="date"
                                value={editLeaseCommencementDate}
                                onChange={(e) => setEditLeaseCommencementDate(e.target.value)}
                                style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '12.5px', fontWeight: 600, marginTop: '2px', outline: 'none' }}
                              />
                            ) : (
                              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedCase.lease_commencement_date || '—'}</div>
                            )}
                          </div>
                          <div style={{ border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Vacant Possession Date</span>
                            {isEditingDetails ? (
                              <input
                                type="date"
                                value={editVacantPossessionDate}
                                onChange={(e) => setEditVacantPossessionDate(e.target.value)}
                                style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '12.5px', fontWeight: 600, marginTop: '2px', outline: 'none' }}
                              />
                            ) : (
                              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{selectedCase.vacant_possession_date || '—'}</div>
                            )}
                          </div>
                        </div>

                        {/* Plans Submitted for Approval Attach field */}
                        <div style={{ border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Plans Submitted for Approval</span>

                          {isEditingDetails ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-secondary)', fontSize: '11.5px', fontWeight: 600, cursor: uploadingFile ? 'not-allowed' : 'pointer' }}>
                                {uploadingFile ? <Loader2 size={12} className="spin" /> : <Paperclip size={12} />}
                                <span>{uploadingFile ? 'Uploading...' : 'Attach Plan'}</span>
                                <input
                                  type="file"
                                  disabled={uploadingFile}
                                  onChange={(e) => handleFileUpload(e, setEditPlansForApproval)}
                                  style={{ display: 'none' }}
                                />
                              </label>
                              {editPlansForApproval ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#10b981', fontWeight: 600 }}>
                                  <CheckCircle size={12} />
                                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }} title={editPlansForApproval.split('/').pop()}>
                                    {editPlansForApproval.split('/').pop()}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setEditPlansForApproval('')}
                                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px' }}
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              ) : (
                                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>No file attached</span>
                              )}
                            </div>
                          ) : (
                            <div>
                              {selectedCase.plans_for_approval ? (
                                <div
                                  onClick={() => {
                                    const fullUrl = selectedCase.plans_for_approval.startsWith('http')
                                      ? selectedCase.plans_for_approval
                                      : `${erpnextConfig.url}${selectedCase.plans_for_approval}`;
                                    setPreviewDocUrl(fullUrl);
                                    setPreviewDocTitle('Plans Submitted for Approval');
                                  }}
                                  style={{ width: '100%', height: '140px', background: '#000', borderRadius: '8px', overflow: 'hidden', position: 'relative', border: '1px solid var(--border-color)', cursor: 'pointer', marginTop: '6px' }}
                                >
                                  {/\.(jpg|jpeg|png|gif|webp)$/i.test(selectedCase.plans_for_approval) ? (
                                    <img
                                      src={selectedCase.plans_for_approval.startsWith('http') ? selectedCase.plans_for_approval : `${erpnextConfig.url}${selectedCase.plans_for_approval}`}
                                      alt="Plans Submitted for Approval"
                                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                      crossOrigin="use-credentials"
                                    />
                                  ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#fff', gap: '8px' }}>
                                      <FileText size={24} style={{ color: 'var(--text-muted)' }} />
                                      <span style={{ fontSize: '11.5px', fontWeight: 600 }}>{selectedCase.plans_for_approval.split('/').pop()}</span>
                                    </div>
                                  )}
                                  <div style={{ position: 'absolute', right: '8px', bottom: '8px', background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '4px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 600 }}>
                                    <Eye size={10} />
                                    <span>Click to Preview</span>
                                  </div>
                                </div>
                              ) : (
                                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', marginTop: '2px' }}>Not Attached</div>
                              )}
                            </div>
                          )}
                        </div>

                        <div style={{ border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Facilities Required by Tenant</span>
                          <textarea
                            rows={2}
                            value={caseLocal.booking_facilities_required || ''}
                            onChange={(e) => updateLocalChecklistField(selectedCase.name, 'booking_facilities_required', e.target.value)}
                            placeholder="Describe plumbing, power requirements..."
                            style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '12.5px', fontWeight: 600, marginTop: '2px', outline: 'none', resize: 'none' }}
                          />
                        </div>

                        {isEditingDetails && (
                          <button
                            disabled={updatingDetails}
                            onClick={handleUpdateCoreDetails}
                            style={{
                              background: updatingDetails ? 'var(--text-muted, #64748b)' : 'var(--brand-color, #2563eb)',
                              color: '#fff',
                              padding: '10px 16px',
                              borderRadius: '8px',
                              border: 'none',
                              fontWeight: 700,
                              fontSize: '13px',
                              cursor: updatingDetails ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              marginTop: '8px',
                              boxShadow: updatingDetails ? 'none' : '0 4px 12px rgba(37, 99, 235, 0.25)',
                              opacity: updatingDetails ? 0.6 : 1
                            }}
                          >
                            {updatingDetails ? 'Updating...' : 'Save Changes'}
                          </button>
                        )}
                      </div>
                    )}

                    {/* Stage 3: Company Search Documents */}
                    {activeDetailTab === 'documents' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, minHeight: 0 }}>
                        <h4 style={{ margin: 0, fontSize: '13px', color: 'var(--brand-color)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>Company Search Audit Checklist</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto', paddingRight: '6px' }}>
                          {(() => {
                            const docs = caseDocuments[selectedCase.name] || selectedCase.documents || selectedCase.company_search_documents || [];

                            // Map standard static checklist items
                            const standardDocs = currentDocumentTypes.map(doc => {
                              const erpDoc = docs.find(d =>
                                d.document_type?.toLowerCase().trim() === doc.label.toLowerCase().trim()
                              );
                              return {
                                key: doc.key,
                                label: doc.label,
                                erpDoc: erpDoc,
                                isStandard: true
                              };
                            });

                            // Map custom dynamic checklist items
                            const standardLabelsLower = new Set(currentDocumentTypes.map(d => d.label.toLowerCase().trim()));
                            const customDocs = docs
                              .filter(d => d.document_type && !standardLabelsLower.has(d.document_type.toLowerCase().trim()))
                              .map((d, index) => ({
                                key: `custom_${index}_${d.name || d.document_type}`,
                                label: d.document_type,
                                erpDoc: d,
                                isStandard: false
                              }));

                            const combinedDocsList = [...standardDocs, ...customDocs];

                            return combinedDocsList.map((docItem) => {
                              const erpDoc = docItem.erpDoc;
                              const fileUrl = erpDoc?.document || '';
                              const isVerified = !!erpDoc?.verified;
                              const isExpanded = !!expandedDocs[docItem.key];

                              const draftEntry = checklistDrafts[docItem.label];
                              const fileUrlDraft = draftEntry !== undefined ? draftEntry.doc : fileUrl;
                              const isVerifiedDraft = draftEntry !== undefined ? draftEntry.verified : isVerified;

                              let statusText = 'Upload';
                              let statusColor = 'var(--text-muted)';
                              let statusBg = 'rgba(156, 163, 175, 0.1)';
                              if (fileUrlDraft) {
                                if (isVerifiedDraft) {
                                  statusText = 'Verified';
                                  statusColor = '#10b981';
                                  statusBg = 'rgba(16, 185, 129, 0.1)';
                                } else {
                                  statusText = 'Needs Verification';
                                  statusColor = '#d97706';
                                  statusBg = 'rgba(217, 119, 6, 0.1)';
                                }
                              }

                              return (
                                <div
                                  key={docItem.key}
                                  style={{
                                    background: 'var(--bg-primary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                    overflow: 'hidden'
                                  }}
                                >
                                  {/* Header Row - Click to collapse/expand */}
                                  <div
                                    onClick={() => toggleDocExpand(docItem.key)}
                                    style={{
                                      padding: '12px 16px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      cursor: 'pointer',
                                      background: isExpanded ? 'var(--bg-secondary)' : 'transparent',
                                      transition: 'background 0.2s ease'
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                                      {isExpanded ? <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} /> : <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />}
                                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {docItem.label}
                                      </span>
                                      <span style={{
                                        fontSize: '10px',
                                        fontWeight: 700,
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        background: statusBg,
                                        color: statusColor,
                                        marginLeft: '8px'
                                      }}>
                                        {statusText}
                                      </span>
                                    </div>

                                    {/* Verify toggle stays on header for quick access */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      {fileUrlDraft && (
                                        <button
                                          type="button"
                                          onClick={async (e) => {
                                            e.stopPropagation();
                                            const targetVerified = !isVerifiedDraft;
                                            await saveDocumentToERPNext(docItem.label, fileUrlDraft, targetVerified);
                                            setChecklistDrafts(prev => {
                                              const next = { ...prev };
                                              delete next[docItem.label];
                                              return next;
                                            });
                                          }}
                                          style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'var(--brand-color)',
                                            cursor: 'pointer',
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            border: '1px solid var(--border-color)',
                                            transition: 'all 0.2s'
                                          }}
                                          onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'var(--bg-secondary)';
                                          }}
                                          onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent';
                                          }}
                                        >
                                          {isVerifiedDraft ? <ShieldAlert size={12} style={{ color: '#d97706' }} /> : <ShieldCheck size={12} />}
                                          <span>{isVerifiedDraft ? 'Unverify' : 'Verify'}</span>
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  {/* Expanded Content Panel */}
                                  {isExpanded && (
                                    <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg-secondary)' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'space-between', gap: '12px' }}>
                                        {/* File details and attachments */}
                                        {fileUrlDraft ? (
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                                            <button
                                              onClick={() => {
                                                const fullUrl = fileUrlDraft.startsWith('http') ? fileUrlDraft : `${erpnextConfig.url}${fileUrlDraft}`;
                                                setPreviewDocUrl(fullUrl);
                                                setPreviewDocTitle(docItem.label);
                                              }}
                                              style={{
                                                background: 'transparent',
                                                border: 'none',
                                                color: 'var(--brand-color)',
                                                fontSize: '12px',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                padding: 0,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                              }}
                                            >
                                              <Eye size={13} style={{ flexShrink: 0 }} />
                                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                Preview: {fileUrlDraft.split('/').pop()}
                                              </span>
                                            </button>

                                            <button
                                              onClick={() => {
                                                setChecklistDrafts(prev => ({
                                                  ...prev,
                                                  [docItem.label]: {
                                                    ...(prev[docItem.label] || { doc: fileUrl, verified: isVerified }),
                                                    doc: '',
                                                    verified: false
                                                  }
                                                }));
                                              }}
                                              style={{
                                                background: 'rgba(239, 68, 68, 0.08)',
                                                border: 'none',
                                                borderRadius: '6px',
                                                color: '#ef4444',
                                                padding: '6px 10px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginLeft: 'auto'
                                              }}
                                              title="Remove File"
                                            >
                                              <Trash2 size={13} />
                                              <span style={{ fontSize: '11px', fontWeight: 600, marginLeft: '4px' }}>Remove</span>
                                            </button>
                                          </div>
                                        ) : (
                                          <label style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '8px 16px',
                                            border: '1px solid var(--border-color)',
                                            background: 'var(--bg-primary)',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            cursor: uploadingFile ? 'not-allowed' : 'pointer',
                                            transition: 'all 0.15s ease'
                                          }}>
                                            <Paperclip size={14} />
                                            <span>Attach Document</span>
                                            <input
                                              type="file"
                                              disabled={uploadingFile}
                                              onChange={(e) => handleFileUpload(e, (url) => {
                                                setChecklistDrafts(prev => ({
                                                  ...prev,
                                                  [docItem.label]: {
                                                    ...(prev[docItem.label] || { doc: fileUrl, verified: isVerified }),
                                                    doc: url
                                                  }
                                                }));
                                              })}
                                              style={{ display: 'none' }}
                                            />
                                          </label>
                                        )}
                                      </div>

                                      {/* Tiny Preview Box */}
                                      {fileUrlDraft && /\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrlDraft) && (
                                        <div
                                          onClick={() => {
                                            const fullUrl = fileUrlDraft.startsWith('http') ? fileUrlDraft : `${erpnextConfig.url}${fileUrlDraft}`;
                                            setPreviewDocUrl(fullUrl);
                                            setPreviewDocTitle(docItem.label);
                                          }}
                                          style={{ width: '100%', height: '100px', background: '#000', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-color)', cursor: 'pointer' }}
                                        >
                                          <img
                                            src={fileUrlDraft.startsWith('http') ? fileUrlDraft : `${erpnextConfig.url}${fileUrlDraft}`}
                                            alt={docItem.label}
                                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                            crossOrigin="use-credentials"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            });
                          })()}
                        </div>

                        {/* Save Multiple Verifications Button */}
                        {Object.keys(checklistDrafts).length > 0 && (
                          <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                            <button
                              onClick={handleSaveChecklist}
                              disabled={updatingDetails}
                              style={{
                                flex: 1,
                                padding: '10px 16px',
                                fontSize: '13px',
                                fontWeight: 700,
                                borderRadius: '8px',
                                background: 'var(--brand-color, #065f46)',
                                color: '#fff',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                boxShadow: '0 4px 12px rgba(6, 95, 70, 0.15)',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {updatingDetails ? <Loader2 size={16} className="spin" /> : <CheckCircle size={16} />}
                              <span>Save Audit Checklist ({Object.keys(checklistDrafts).length})</span>
                            </button>
                            <button
                              onClick={() => setChecklistDrafts({})}
                              disabled={updatingDetails}
                              style={{
                                padding: '10px 16px',
                                fontSize: '13px',
                                fontWeight: 700,
                                borderRadius: '8px',
                                background: 'transparent',
                                color: 'var(--text-secondary)',
                                border: '1px solid var(--border-color)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

            </div>
          );
        })()}
      </div>

      {/* Start Onboarding Modal */}
      {showModal && (() => {
        // Group doctypeFields by Section Break
        const dynamicSections = [];
        let currentSec = { title: 'Basic Info', fields: [] };

        doctypeFields
          .filter(f => f.hidden !== 1 && f.fieldname !== 'naming_series' && f.fieldname !== 'amended_from' && f.fieldname !== 'workflow_state')
          .forEach(f => {
            if (f.fieldtype === 'Section Break') {
              if (currentSec.fields.length > 0 || currentSec.title !== 'Basic Info') {
                dynamicSections.push(currentSec);
              }
              currentSec = { title: f.label || 'Details', fields: [] };
            } else if (f.fieldtype !== 'Column Break') {
              currentSec.fields.push(f);
            }
          });
        if (currentSec.fields.length > 0) {
          dynamicSections.push(currentSec);
        }

        const activeSections = dynamicSections.length > 0 ? dynamicSections : [{ title: 'Form', fields: doctypeFields }];
        const safeTabIdx = Math.min(activeDynamicTabIdx, activeSections.length - 1);

        return (
          <div className="onboarding-modal-overlay">
            <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '12px', width: '100%', maxWidth: '1050px', padding: '24px', position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Start New Onboarding</h2>
                <button
                  onClick={() => { setShowModal(false); resetFormFields(); }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
                >
                  <X size={20} />
                </button>
              </div>



              <form onSubmit={handleStartOnboarding} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
                {useDynamicForm && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {/* Dynamic Tabs Headers */}
                    <div style={{ display: 'flex', gap: '6px', background: '#e2e8f0', padding: '6px', borderRadius: '8px', overflowX: 'auto', border: '1px solid #cbd5e1' }}>
                      {activeSections.map((sec, idx) => {
                        const isActive = safeTabIdx === idx;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveDynamicTabIdx(idx)}
                            style={{
                              padding: '8px 16px',
                              fontSize: '12px',
                              fontWeight: isActive ? 700 : 500,
                              borderRadius: '6px',
                              border: isActive ? '1px solid #cbd5e1' : '1px solid transparent',
                              background: isActive ? '#ffffff' : 'transparent',
                              color: isActive ? 'var(--brand-color, #065f46)' : '#475569',
                              boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                              transition: 'all 0.25s ease'
                            }}
                          >
                            {sec.title}
                          </button>
                        );
                      })}
                    </div>

                    {/* Dynamic Fields for the Active Section */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', height: '380px', overflowY: 'auto', paddingRight: '6px' }}>
                      {activeSections[safeTabIdx]?.fields
                        .filter(field => {
                          const selectedType = dynamicFormValues['type'] || '';
                          if (field.fieldname === 'date_of_birth' && selectedType !== 'Individual') {
                            return false;
                          }
                          if (field.fieldname === 'date_of_incorporation' && selectedType !== 'Company') {
                            return false;
                          }
                          const isInternal = !!dynamicFormValues['is_internal_customer'];
                          const fieldLabelLower = (field.label || '').toLowerCase();
                          const fieldNameLower = (field.fieldname || '').toLowerCase();
                          if (!isInternal) {
                            if (fieldLabelLower.includes('represents company') || fieldNameLower.includes('represents_company')) {
                              return false;
                            }
                            if (fieldLabelLower.includes('allowed to transact with') || fieldNameLower.includes('allowed_to_transact_with') || fieldNameLower.includes('allowed_to_transact')) {
                              return false;
                            }
                          }
                          return true;
                        })
                        .map(field => (
                          <DynamicFormField
                            key={field.fieldname}
                            field={field}
                            value={dynamicFormValues[field.fieldname] === undefined ? (field.default || '') : dynamicFormValues[field.fieldname]}
                            onChange={(newVal) => setDynamicFormValues(prev => ({ ...prev, [field.fieldname]: newVal }))}
                            linkOptionsCache={linkOptionsCache}
                            fetchLinkOptions={fetchLinkOptions}
                            getDocTypeFields={getDocTypeFields}
                            erpnextConfig={erpnextConfig}
                            getCsrfToken={getCsrfToken}
                            formValues={dynamicFormValues}
                            isNew={true}
                          />
                        ))}
                    </div>
                  </div>
                )}
                {false && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '52vh', overflowY: 'auto', paddingRight: '6px' }}>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

                      {/* Left Column */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>Type</label>
                          <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            style={{ width: '100%', padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}
                          >
                            <option value="Company">Company</option>
                            <option value="Individual">Individual</option>
                          </select>
                        </div>

                        {(() => {
                          const companyNameField = (
                            <div key="company_name">
                              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>{type === 'Company' ? 'Company Name *' : 'Company Name'}</label>
                              <input
                                type="text"
                                placeholder="Company Name"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                style={{ width: '100%', padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
                              />
                            </div>
                          );

                          const companyTinField = (
                            <div key="company_tin">
                              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>{type === 'Company' ? 'Company TIN ID *' : 'Company TIN ID'}</label>
                              <input
                                type="text"
                                placeholder="Company TIN ID"
                                value={companyVatId}
                                onChange={(e) => setCompanyVatId(e.target.value)}
                                style={{ width: '100%', padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
                              />
                            </div>
                          );

                          const contactNameField = (
                            <div key="contact_name">
                              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>Contact Name *</label>
                              <input
                                type="text"
                                placeholder="Contact Name"
                                value={contactName}
                                onChange={(e) => setContactName(e.target.value)}
                                style={{ width: '100%', padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
                              />
                            </div>
                          );

                          const emailIdField = (
                            <div key="email_id">
                              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>Email ID *</label>
                              <input
                                type="email"
                                placeholder="e.g. email@example.com"
                                value={emailId}
                                onChange={(e) => setEmailId(e.target.value)}
                                style={{ width: '100%', padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
                              />
                            </div>
                          );

                          const contactNumberField = (
                            <div key="contact_number">
                              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>Contact Number</label>
                              <PhoneInputWithDropdown
                                value={contactLocal ? `${contactPrefix}-${contactLocal}` : ""}
                                onChange={(newVal) => {
                                  const parsed = parsePhoneNumber(newVal);
                                  setContactPrefix(parsed.prefix);
                                  setContactLocal(parsed.local);
                                }}
                              />
                            </div>
                          );

                          return type === 'Company' ? (
                            <>
                              {companyNameField}
                              {companyTinField}
                              {contactNameField}
                              {emailIdField}
                              {contactNumberField}
                            </>
                          ) : (
                            <>
                              {contactNameField}
                              {emailIdField}
                              {contactNumberField}
                              {companyNameField}
                              {companyTinField}
                            </>
                          );
                        })()}
                      </div>

                      {/* Right Column */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minHeight: '38px', marginTop: '22px' }}>
                        <input
                          type="checkbox"
                          id="isInternalCustomer"
                          checked={isInternalCustomer}
                          onChange={(e) => setIsInternalCustomer(e.target.checked)}
                          style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                        <label htmlFor="isInternalCustomer" style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}>Is Internal Customer?</label>
                      </div> */}

                        <div>
                          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>Date of Birth</label>
                          <input
                            type="date"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            style={{ width: '100%', padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>Address Line 1</label>
                          <input
                            type="text"
                            placeholder="Address Line 1"
                            value={addressLine1}
                            onChange={(e) => setAddressLine1(e.target.value)}
                            style={{ width: '100%', padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>Address Line 2</label>
                          <input
                            type="text"
                            placeholder="Address Line 2"
                            value={addressLine2}
                            onChange={(e) => setAddressLine2(e.target.value)}
                            style={{ width: '100%', padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>City</label>
                          <input
                            type="text"
                            placeholder="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            style={{ width: '100%', padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>State</label>
                          <input
                            type="text"
                            placeholder="State"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            style={{ width: '100%', padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>Country</label>
                          <select
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            style={{ width: '100%', padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}
                          >
                            <option value="">-- Choose Country --</option>
                            {countries.map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                    </div>

                  </div>
                )}

                {activeFormTab === 'proposal' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '52vh', overflowY: 'auto', paddingRight: '6px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>Proposed Business Type *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Restaurant, Office"
                        value={proposedBusinessType}
                        onChange={(e) => setProposedBusinessType(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>Required Space(Sq Ft)</label>
                        <input
                          type="number"
                          placeholder="e.g. 120"
                          value={requiredSpace}
                          onChange={(e) => setRequiredSpace(e.target.value)}
                          style={{ width: '100%', padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>Rental Budget(FJD)</label>
                        <input
                          type="number"
                          placeholder="e.g. 1900000"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          style={{ width: '100%', padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>Business Background Status *</label>
                        <select
                          required
                          value={businessStatus}
                          onChange={(e) => setBusinessStatus(e.target.value)}
                          style={{ width: '100%', padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
                        >
                          <option value="New">New</option>
                          <option value="Existing">Existing</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>Fitout Timeframe</label>
                        <input
                          type="text"
                          placeholder="e.g. 45 days"
                          value={fitoutTimeframe}
                          onChange={(e) => setFitoutTimeframe(e.target.value)}
                          style={{ width: '100%', padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>Range & Line of Items (Other Business)</label>
                      <input
                        type="text"
                        placeholder="e.g. Clothing catalog details"
                        value={rangeLineItems}
                        onChange={(e) => setRangeLineItems(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
                      />
                    </div>

                    {/* Menu / Pics attachment */}
                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>Menu & Business Pictures (Attach)</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, cursor: uploadingFile ? 'not-allowed' : 'pointer' }}>
                          {uploadingFile ? <Loader2 size={14} className="spin" /> : <Paperclip size={14} />}
                          <span>{uploadingFile ? 'Uploading...' : 'Attach File'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingFile}
                            onChange={(e) => handleFileUpload(e, setMenuAndBusinessPictures)}
                            style={{ display: 'none' }}
                          />
                        </label>
                        {menuAndBusinessPictures && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#10b981', fontWeight: 600 }}>
                              <CheckCircle size={14} />
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
                                {menuAndBusinessPictures.split('/').pop()}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setMenuAndBusinessPictures('')}
                              style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                              title="Delete Image"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                )}

                {activeFormTab === 'booking' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '52vh', overflowY: 'auto', paddingRight: '6px' }}>

                    {/* Location & Duration */}
                    <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <h4 style={{ margin: 0, fontSize: '11.5px', color: 'var(--brand-color)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>Location & Duration</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>Shop Space & Location</label>
                          <select
                            value={shopSpaceLocation}
                            onChange={(e) => setShopSpaceLocation(e.target.value)}
                            style={{ width: '100%', padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
                          >
                            <option value="">Select Location</option>
                            {districts.map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>Lease Period (years)</label>
                          <input
                            type="number"
                            placeholder="e.g. 3"
                            value={leasePeriod}
                            onChange={(e) => setLeasePeriod(e.target.value)}
                            style={{ width: '100%', padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Financial Terms */}
                    <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <h4 style={{ margin: 0, fontSize: '11.5px', color: 'var(--brand-color)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>Financial Terms</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>Rental Charges ($)</label>
                          <input
                            type="number"
                            placeholder="e.g. 5000"
                            value={rentalCharges}
                            onChange={(e) => setRentalCharges(e.target.value)}
                            style={{ width: '100%', padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>Service / Promo Charges ($)</label>
                          <input
                            type="number"
                            placeholder="e.g. 1000"
                            value={servicePromoCharges}
                            onChange={(e) => setServicePromoCharges(e.target.value)}
                            style={{ width: '100%', padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>Security Deposit Fee ($)</label>
                          <input
                            type="number"
                            placeholder="e.g. 15000"
                            value={securityDepositFee}
                            onChange={(e) => setSecurityDepositFee(e.target.value)}
                            style={{ width: '100%', padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>Fitout Period (Days)</label>
                          <input
                            type="number"
                            placeholder="e.g. 30"
                            value={fitoutPeriod}
                            onChange={(e) => setFitoutPeriod(e.target.value)}
                            style={{ width: '100%', padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Timeline & Possession */}
                    <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <h4 style={{ margin: 0, fontSize: '11.5px', color: 'var(--brand-color)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>Timeline & Possession</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>Lease Commencement</label>
                          <input
                            type="date"
                            value={leaseCommencement}
                            onChange={(e) => setLeaseCommencement(e.target.value)}
                            style={{ width: '100%', padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>Vacant Possession Date</label>
                          <input
                            type="date"
                            value={vacantPossessionDate}
                            onChange={(e) => setVacantPossessionDate(e.target.value)}
                            style={{ width: '100%', padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Usage & Operations */}
                    <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <h4 style={{ margin: 0, fontSize: '11.5px', color: 'var(--brand-color)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>Usage & Operations</h4>
                      <div>
                        <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>Usage of Demised Premises</label>
                        <input
                          type="text"
                          placeholder="e.g. Cafe usage details"
                          value={usageOfDemisedPremises}
                          onChange={(e) => setUsageOfDemisedPremises(e.target.value)}
                          style={{ width: '100%', padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>Nature of Business</label>
                        <input
                          type="text"
                          placeholder="e.g. Restaurant"
                          value={bookingNatureBusiness}
                          onChange={(e) => setBookingNatureBusiness(e.target.value)}
                          style={{ width: '100%', padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>Types of Merchandise</label>
                        <input
                          type="text"
                          placeholder="e.g. Food, beverages"
                          value={bookingMerchandiseTypes}
                          onChange={(e) => setBookingMerchandiseTypes(e.target.value)}
                          style={{ width: '100%', padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>Plans Submitted for Approval</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, cursor: uploadingFile ? 'not-allowed' : 'pointer' }}>
                            {uploadingFile ? <Loader2 size={14} className="spin" /> : <Paperclip size={14} />}
                            <span>{uploadingFile ? 'Uploading...' : 'Attach Plan'}</span>
                            <input
                              type="file"
                              disabled={uploadingFile}
                              onChange={(e) => handleFileUpload(e, setPlansForApproval)}
                              style={{ display: 'none' }}
                            />
                          </label>
                          {plansForApproval && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#10b981', fontWeight: 600 }}>
                              <CheckCircle size={14} />
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                                {plansForApproval.split('/').pop()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>Facilities Required by Tenant</label>
                        <textarea
                          rows={2}
                          placeholder="e.g. 3-phase electricity, grease trap..."
                          value={facilitiesRequired}
                          onChange={(e) => setFacilitiesRequired(e.target.value)}
                          style={{ width: '100%', padding: '10px 14px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none', resize: 'none' }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {activeFormTab === 'search' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '56vh', overflowY: 'auto', paddingRight: '4px' }}>
                    {currentDocumentTypes.map((doc) => {
                      const docObj = formCompanySearchDocs[doc.key] || { doc: '', verified: false };
                      const isExpanded = !!modalExpandedDocs[doc.key];

                      const handleUpdateDoc = (docUrl) => {
                        setFormCompanySearchDocs(prev => ({
                          ...prev,
                          [doc.key]: { ...prev[doc.key], doc: docUrl }
                        }));
                      };

                      const handleToggleVerified = (verifiedVal) => {
                        setFormCompanySearchDocs(prev => ({
                          ...prev,
                          [doc.key]: { ...prev[doc.key], verified: verifiedVal }
                        }));
                      };

                      let statusText = 'Upload';
                      let statusColor = 'var(--text-muted, #94a3b8)';
                      let statusBg = 'rgba(156, 163, 175, 0.1)';
                      if (docObj.doc) {
                        if (docObj.verified) {
                          statusText = 'Verified';
                          statusColor = '#10b981';
                          statusBg = 'rgba(16, 185, 129, 0.1)';
                        } else {
                          statusText = 'Needs Verification';
                          statusColor = '#d97706';
                          statusBg = 'rgba(217, 119, 6, 0.1)';
                        }
                      }

                      return (
                        <div
                          key={doc.key}
                          style={{
                            background: 'var(--bg-primary, #ffffff)',
                            border: '1px solid var(--border-color, #e2e8f0)',
                            borderRadius: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                            overflow: 'hidden'
                          }}
                        >
                          {/* Header Row - Click to collapse/expand */}
                          <div
                            onClick={() => toggleModalDocExpand(doc.key)}
                            style={{
                              padding: '12px 16px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              cursor: 'pointer',
                              background: isExpanded ? 'var(--bg-secondary, #f8fafc)' : 'transparent',
                              transition: 'background 0.2s ease'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                              {isExpanded ? <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} /> : <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />}
                              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary, #0f172a)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {doc.label}
                              </span>
                              <span style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                padding: '2px 6px',
                                borderRadius: '4px',
                                background: statusBg,
                                color: statusColor,
                                marginLeft: '8px'
                              }}>
                                {statusText}
                              </span>
                            </div>

                            {/* Verify toggle checkbox */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <label
                                onClick={(e) => e.stopPropagation()} // Prevent expand toggle when clicking checkbox
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  cursor: docObj.doc ? 'pointer' : 'not-allowed',
                                  fontSize: '11.5px',
                                  fontWeight: 600,
                                  opacity: docObj.doc ? 1 : 0.4,
                                  color: 'var(--text-secondary, #475569)'
                                }}
                              >
                                <input
                                  type="checkbox"
                                  disabled={!docObj.doc}
                                  checked={docObj.verified}
                                  onChange={(e) => handleToggleVerified(e.target.checked)}
                                  style={{ accentColor: 'var(--brand-color, #2563eb)' }}
                                />
                                <span>Verify Draft</span>
                              </label>
                            </div>
                          </div>

                          {/* Expanded Content Panel */}
                          {isExpanded && (
                            <div style={{
                              padding: '16px',
                              borderTop: '1px solid var(--border-color, #e2e8f0)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '12px',
                              background: 'var(--bg-secondary, #f8fafc)'
                            }}>
                              {docObj.doc ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const fullUrl = docObj.doc.startsWith('http') ? docObj.doc : `${erpnextConfig.url}${docObj.doc}`;
                                      setPreviewDocUrl(fullUrl);
                                      setPreviewDocTitle(doc.label);
                                    }}
                                    style={{
                                      background: 'transparent',
                                      border: 'none',
                                      color: 'var(--brand-color, #2563eb)',
                                      fontSize: '12px',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      padding: 0,
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap'
                                    }}
                                  >
                                    <Eye size={13} style={{ flexShrink: 0 }} />
                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                      Preview: {docObj.doc.split('/').pop()}
                                    </span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleUpdateDoc('')}
                                    style={{
                                      background: 'transparent',
                                      border: 'none',
                                      color: '#ef4444',
                                      cursor: 'pointer',
                                      fontSize: '11px',
                                      fontWeight: 700,
                                      padding: '4px 8px',
                                      borderRadius: '4px',
                                      border: '1px solid var(--border-color, #e2e8f0)',
                                      marginLeft: 'auto',
                                      transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                  >
                                    Remove
                                  </button>
                                </div>
                              ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  <label style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    padding: '8px 16px',
                                    border: '1px solid var(--border-color, #cbd5e1)',
                                    background: 'var(--bg-primary, #ffffff)',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    cursor: uploadingFile ? 'not-allowed' : 'pointer',
                                    width: 'fit-content',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                    transition: 'all 0.2s'
                                  }}>
                                    <Paperclip size={14} />
                                    <span>{uploadingFile ? 'Uploading...' : 'Attach Document'}</span>
                                    <input
                                      type="file"
                                      disabled={uploadingFile}
                                      onChange={(e) => handleFileUpload(e, handleUpdateDoc)}
                                      style={{ display: 'none' }}
                                    />
                                  </label>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Submit buttons */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '16px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); resetFormFields(); }}
                    disabled={submitting}
                    style={{
                      padding: '7px 16px',
                      fontSize: '12px',
                      fontWeight: 600,
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      minWidth: '90px'
                    }}
                  >
                    Cancel
                  </button>

                  {safeTabIdx < activeSections.length - 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const currentFields = activeSections[safeTabIdx]?.fields || [];
                        const missing = currentFields.filter(f => isFieldRequired(f, dynamicFormValues) && (dynamicFormValues[f.fieldname] === undefined || dynamicFormValues[f.fieldname] === null || String(dynamicFormValues[f.fieldname]).trim() === ''));
                        if (missing.length > 0) {
                          alert(`Please fill in the following mandatory fields first: ${missing.map(f => f.label || f.fieldname).join(', ')}`, 'error');
                          return;
                        }

                        // Validate numeric and date fields in the current tab
                        for (const field of currentFields) {
                          const val = dynamicFormValues[field.fieldname];
                          if ([
                            'required_space',
                            'budget',
                            'lease_period',
                            'rental_charges',
                            'service_promotional_charges',
                            'security_deposit_booking_fee',
                            'fitout_period'
                          ].includes(field.fieldname) && val !== undefined && val !== null && String(val).trim() !== '') {
                            const num = parseFloat(val);
                            if (isNaN(num) || num <= 0) {
                              alert(`${field.label || field.fieldname} should not be 0 or negative value.`, 'error');
                              return;
                            }
                            if ((field.fieldname === 'lease_period' || field.fieldtype === 'Int') && !Number.isInteger(num)) {
                              alert(`${field.label || field.fieldname} must be a whole number (integer).`, 'error');
                              return;
                            }
                          }

                          if (isFutureOrTodayDateFieldName(field.fieldname, field.label) && val) {
                            const isValid = validateFutureOrTodayDateField(val, field.label || field.fieldname, field.fieldname);
                            if (!isValid) return;
                          }
                        }

                        setActiveDynamicTabIdx(safeTabIdx + 1);
                      }}
                      style={{
                        padding: '7px 16px',
                        fontSize: '12px',
                        fontWeight: 700,
                        border: '1.5px solid var(--brand-color, #2563eb)',
                        borderRadius: '6px',
                        background: 'var(--bg-accent-alpha, rgba(37, 99, 235, 0.08))',
                        color: 'var(--brand-color, #2563eb)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        minWidth: '110px',
                        boxShadow: '0 2px 6px rgba(37, 99, 235, 0.05)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span>Save & Next</span>
                      <ArrowRight size={14} />
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={submitting || uploadingFile || !isFormValid}
                    style={{
                      padding: '7px 16px',
                      fontSize: '12px',
                      fontWeight: 600,
                      border: 'none',
                      borderRadius: '6px',
                      background: (submitting || uploadingFile || !isFormValid) ? 'var(--border-color, #d1d5db)' : 'var(--brand-color, #2563eb)',
                      color: (submitting || uploadingFile || !isFormValid) ? 'var(--text-muted, #9ca3af)' : '#fff',
                      cursor: (submitting || uploadingFile || !isFormValid) ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      minWidth: '90px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {submitting ? 'Creating...' : 'Submit'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        );
      })()}



      {/* Lightbox / Document Preview Modal */}
      {previewDocUrl && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(2px)',
            padding: '24px'
          }}
          onClick={() => setPreviewDocUrl(null)}
        >
          <div
            style={{
              background: 'var(--bg-primary)',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '800px',
              height: '80vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid var(--border-color)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Document Preview</span>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{previewDocTitle}</h3>
              </div>
              <button
                onClick={() => setPreviewDocUrl(null)}
                style={{ background: 'var(--bg-secondary)', border: 'none', borderRadius: '50%', color: 'var(--text-primary)', cursor: 'pointer', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ flex: 1, background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto', position: 'relative' }}>
              {/\.(jpg|jpeg|png|gif|webp)$/i.test(previewDocUrl) ? (
                <img
                  src={previewDocUrl}
                  alt={previewDocTitle}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              ) : (
                <iframe
                  src={previewDocUrl}
                  title={previewDocTitle}
                  style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }}
                />
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 24px', borderTop: '1px solid var(--border-color)', gap: '12px' }}>
              {isPreviewCompanySearchDoc && (
                <button
                  type="button"
                  onClick={async () => {
                    const relativePath = previewDocUrl.replace(erpnextConfig.url, '');
                    await saveDocumentToERPNext(previewDocTitle, relativePath, !isPreviewDocVerified);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 16px',
                    background: isPreviewDocVerified ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-secondary)',
                    color: isPreviewDocVerified ? '#10b981' : 'var(--text-primary)',
                    border: `1px solid ${isPreviewDocVerified ? '#10b981' : 'var(--border-color)'}`,
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isPreviewDocVerified ? <CheckCircle size={14} /> : <ShieldCheck size={14} />}
                  <span>{isPreviewDocVerified ? 'Verified' : 'Verify Document'}</span>
                </button>
              )}
              <a
                href={previewDocUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 16px',
                  background: 'var(--brand-color, #2563eb)',
                  color: '#fff',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                <ExternalLink size={14} />
                <span>Open in New Tab</span>
              </a>
              <button
                onClick={() => setPreviewDocUrl(null)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  background: 'var(--bg-primary)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {alertModal.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{
            background: 'var(--bg-primary, #ffffff)',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            width: '100%',
            maxWidth: '400px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            border: '1px solid var(--border-color, #e2e8f0)',
            transform: 'scale(1)',
            transition: 'transform 0.2s ease-out'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: alertModal.type === 'error' ? '#fee2e2' : (alertModal.type === 'success' ? '#d1fae5' : '#fef3c7'),
                color: alertModal.type === 'error' ? '#ef4444' : (alertModal.type === 'success' ? '#10b981' : '#f59e0b')
              }}>
                {alertModal.type === 'error' ? <AlertCircle size={20} /> : (alertModal.type === 'success' ? <CheckCircle size={20} /> : <Info size={20} />)}
              </div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>
                {alertModal.title}
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-secondary, #475569)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
              {alertModal.message}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
              <button
                onClick={() => setAlertModal(prev => ({ ...prev, show: false }))}
                style={{
                  padding: '8px 20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  borderRadius: '8px',
                  border: 'none',
                  background: alertModal.type === 'error' ? '#ef4444' : (alertModal.type === 'success' ? '#10b981' : 'var(--brand-color, #2563eb)'),
                  color: '#ffffff',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmModal.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{
            background: 'var(--bg-primary, #ffffff)',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            width: '100%',
            maxWidth: '400px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            border: '1px solid var(--border-color, #e2e8f0)',
            transform: 'scale(1)',
            transition: 'transform 0.2s ease-out'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fef3c7',
                color: '#f59e0b'
              }}>
                <Info size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>
                Confirm
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-secondary, #475569)', lineHeight: 1.5 }}>
              {confirmModal.message}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
              <button
                onClick={() => {
                  confirmModal.resolve(false);
                  setConfirmModal(prev => ({ ...prev, show: false }));
                }}
                style={{
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  borderRadius: '8px',
                  border: '1px solid var(--border-color, #e2e8f0)',
                  background: 'var(--bg-primary, #ffffff)',
                  color: 'var(--text-secondary, #475569)',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmModal.resolve(true);
                  setConfirmModal(prev => ({ ...prev, show: false }));
                }}
                style={{
                  padding: '8px 20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  borderRadius: '8px',
                  border: 'none',
                  background: 'var(--brand-color, #2563eb)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
