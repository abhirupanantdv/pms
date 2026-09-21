import { useState } from 'react';
import { ChevronRight, ChevronDown, CheckCircle2, FileText, Eye, Trash2, Paperclip } from 'lucide-react';

export default function OnboardingSignedDocuments({ value, baseUrl, upload, save, preview }) {
  const [expanded, setExpanded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const url = value && (/^(https?:|data:|blob:)/i.test(value) ? value : `${(baseUrl || '').replace(/\/$/, '')}/${value.replace(/^\//, '')}`);
  const name = value ? value.split('/').pop().split('?')[0] : '';
  const button = { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, padding: '5px 10px', borderRadius: 6, border: '1px solid #cbd5e1', background: '#fff', cursor: busy ? 'wait' : 'pointer' };
  const change = async file => {
    setBusy(true);
    setError('');
    try {
      const next = file ? await upload(file) : '';
      if (file && !next) throw new Error('The file could not be uploaded.');
      await save(next);
    } catch (err) {
      setError(err.message || 'Unable to save the signed document.');
    } finally { setBusy(false); }
  };
  return <div style={{ border: '1px solid var(--border-color)', borderRadius: 8 }}>
    <button type="button" aria-expanded={expanded} onClick={() => setExpanded(!expanded)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'transparent', border: 0, color: 'var(--text-primary)', fontSize: 12, fontWeight: 700, cursor: 'pointer', textAlign: 'left' }}>
      {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}Signed Documents
      <span style={{ fontSize: 10, background: value ? '#dcfce7' : '#f1f5f9', color: value ? '#15803d' : '#94a3b8', padding: '2px 6px', borderRadius: 4 }}>{value ? 'Uploaded' : 'Upload'}</span>
    </button>
    {expanded && <div style={{ padding: '0 12px 12px' }}>
      <div style={{ border: value ? '1px solid #86efac' : '1px dashed #cbd5e1', borderRadius: 8, background: value ? '#f0fdf4' : '#f8fafc', padding: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: value ? '#166534' : '#334155', marginBottom: 10 }}>{value ? <CheckCircle2 size={13} /> : <FileText size={13} />}Upload Signed Document</div>
        {value ? <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, border: '1px solid #dcfce7', borderRadius: 6, background: '#fff', flexWrap: 'wrap' }}>
          <button type="button" onClick={() => preview(url)} style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left' }}>
            {/\.(png|jpe?g|gif|webp)(\?|$)/i.test(value) ? <img src={url} alt="Signed document thumbnail" style={{ width: 32, height: 32, objectFit: 'cover' }} /> : <FileText size={28} color="#64748b" />}
            <span><span style={{ display: 'block', fontSize: 11, color: '#334155' }}>{name}</span><span style={{ fontSize: 10, color: '#16a34a' }}>Click to view full preview</span></span>
          </button>
          <button type="button" onClick={() => preview(url)} style={button}><Eye size={12} />Preview</button>
          <button type="button" disabled={busy} onClick={() => change(null)} style={{ ...button, color: '#dc2626', borderColor: '#fecaca', background: '#fef2f2' }}><Trash2 size={12} />{busy ? 'Saving...' : 'Remove'}</button>
        </div> : <label style={button}><Paperclip size={13} />{busy ? 'Uploading...' : 'Choose File'}<input type="file" accept=".pdf,.png,.jpg,.jpeg,.webp" disabled={busy} onChange={event => { const file = event.target.files?.[0]; if (file) change(file); event.target.value = ''; }} style={{ display: 'none' }} /></label>}
      </div>
      {error && <div role="alert" style={{ fontSize: 12, color: '#dc2626', marginTop: 8 }}>{error}</div>}
    </div>}
  </div>;
}
