import React, { useState, useEffect, useMemo } from 'react';
import { Send, CheckCircle2, MessageSquare, AlertCircle, BarChart2, ShieldAlert, Clock, User, Sparkles, Mic, MicOff, RefreshCw, X, HelpCircle, Check, Play, Pencil, Settings, Paperclip, Activity, FileText, Bell, Phone, Mail, Award, DollarSign, Maximize2, ChevronDown, Bold, Italic, Underline, Link, Trash2, CheckSquare } from 'lucide-react';
import { getAuthHeaders } from '../config';
import CreateScheduleModal from './CreateScheduleModal';

const MOCK_ISSUE_LISTS = {
  "Utilities & Infrastructure Issues List": [
    "Water supply interruptions",
    "Low water pressure",
    "Drainage and sewage blockage",
    "Power outages",
    "Faulty wiring",
    "Elevator/lift malfunction",
    "HVAC (heating/cooling) issues",
    "Internet/telecom infrastructure problems",
    "Gas pipeline issues"
  ],
  "Safety & Security Issues List": [
    "Broken door locks",
    "CCTV surveillance camera down",
    "Unauthorized intrusion alarm",
    "Emergency fire exit blockage",
    "Smoke detector warning beep",
    "Intercom device malfunctioning"
  ],
  "Cleaning & Janitorial Issues List": [
    "Garbage chute blocked",
    "Stairwell lighting broken",
    "Water leakage in public lobby",
    "Graffiti on entrance corridor",
    "Pest activity spotted"
  ]
};

export default function Support({ tickets, onAddMessage, onCreateIssue, tenants = [], properties = [], bookings = [], erpnextConfig, onConvertToMaintenance, onCreateSchedule }) {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'issue', 'tinni'
  const [dashboardRole, setDashboardRole] = useState('manager'); // 'tenant', 'technician', 'manager', 'admin'
  const [selectedTicketId, setSelectedTicketId] = useState(tickets[0]?.id || null);
  const [commTab, setCommTab] = useState('public'); // 'public', 'internal', 'emails', 'history'
  const [issueViewMode, setIssueViewMode] = useState('list'); // 'list', 'kanban'

  // Schedule Maintenance Modal States (stays on Support page)
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleTicket, setScheduleTicket] = useState(null);

  // Create Issue Modal Form States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [issueSubject, setIssueSubject] = useState('');
  const [issueCustomer, setIssueCustomer] = useState('');
  const [issueRaisedBy, setIssueRaisedBy] = useState('Administrator');
  const [issueStatus, setIssueStatus] = useState('Open');
  const [issuePriority, setIssuePriority] = useState('Medium');
  const [issueDescription, setIssueDescription] = useState('');
  const [issueCompany, setIssueCompany] = useState('CARPENTERS PROPERTIES PTE LIMITED');
  const [issueAgreementStatus, setIssueAgreementStatus] = useState('First Response Due');
  const [issueBudget, setIssueBudget] = useState(0);

  // Additional customer & contact fields matching ERPNext Issue doctype
  const [issueCustomerEmail, setIssueCustomerEmail] = useState('');
  const [issueCustomerPhone, setIssueCustomerPhone] = useState('');
  const [issueContact, setIssueContact] = useState('');

  // Custom Upgrades form fields
  const [issueSubcategory, setIssueSubcategory] = useState('');
  const [preferredVisitDate, setPreferredVisitDate] = useState('2026-06-18');
  const [isEmergency, setIsEmergency] = useState(false);

  // New Booking & Issue List fields states
  const [bookingOptions, setBookingOptions] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [selectedBookingNumber, setSelectedBookingNumber] = useState('BOOKING-00243');
  const [selectedIssueList, setSelectedIssueList] = useState('Utilities & Infrastructure Issues List');
  const [issueListRows, setIssueListRows] = useState([]);
  const [issuesListsData, setIssuesListsData] = useState([]);
  const [loadingIssuesLists, setLoadingIssuesLists] = useState(false);

  // Submit status & validation message states
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Internal comment and attachment states
  const [isInternal, setIsInternal] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);

  // Local state copy of tickets to allow changing status and closing/reopening in the UI
  const [localTickets, setLocalTickets] = useState(tickets || []);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [isListening, setIsListening] = useState(false);

  // New Email Modal (Image 1) States
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailSendCopy, setEmailSendCopy] = useState(false);
  const [emailAttachment, setEmailAttachment] = useState(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isModalMaximized, setIsModalMaximized] = useState(false);

  // Ticket Activity Timeline States (Image 2)
  const [ticketActivities, setTicketActivities] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(false);

  // Tinni AI Chat State
  const [tinniMessages, setTinniMessages] = useState([
    { sender: 'tinni', text: "Hello! I am Tinni, your Carpenters Estate AI Assistant. Ask me anything about lease standards, maintenance rosters, or billing rules!", timestamp: 'Just now' }
  ]);
  const [tinniInput, setTinniInput] = useState('');
  const [isTinniTyping, setIsTinniTyping] = useState(false);

  // Pagination states & calculations
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Fetch real Issue records directly from ERPNext Issue DocType
  const fetchIssuesFromERPNext = async () => {
    if (!erpnextConfig || !erpnextConfig.url) return;
    setLoadingTickets(true);
    try {
      let issuesData = null;

      // Strategy 1: fields=["*"] to retrieve all columns dynamically
      try {
        const res1 = await fetch(
          `${erpnextConfig.url}/api/resource/Issue?fields=%5B%22*%22%5D&limit_page_length=500&order_by=creation%20desc`,
          {
            credentials: 'include',
            headers: getAuthHeaders({ 'Content-Type': 'application/json' })
          }
        );
        if (res1.ok) {
          const json1 = await res1.json();
          if (Array.isArray(json1.data) && json1.data.length > 0) {
            issuesData = json1.data;
          }
        }
      } catch (e1) {
        console.warn('Support Issue fetch fields=["*"] failed:', e1);
      }

      // Strategy 2: Guaranteed standard Frappe Issue fields
      if (!issuesData) {
        try {
          const safeFields = encodeURIComponent(JSON.stringify([
            "name", "subject", "customer", "customer_name", "customer_name1",
            "customer_email", "customer_phone_number", "contact", "booking_number",
            "raised_by", "status", "priority", "issue_type", "main_issues", "description",
            "opening_date", "opening_time", "resolution_date", "company", "agreement_status", "budget",
            "creation", "modified"
          ]));
          const res2 = await fetch(
            `${erpnextConfig.url}/api/resource/Issue?fields=${safeFields}&limit_page_length=500&order_by=creation%20desc`,
            {
              credentials: 'include',
              headers: getAuthHeaders({ 'Content-Type': 'application/json' })
            }
          );
          if (res2.ok) {
            const json2 = await res2.json();
            if (Array.isArray(json2.data) && json2.data.length > 0) {
              issuesData = json2.data;
            }
          }
        } catch (e2) {
          console.warn('Support Issue fetch safe fields failed:', e2);
        }
      }

      // Strategy 3: Minimal fallback (no fields parameter)
      if (!issuesData) {
        try {
          const res3 = await fetch(
            `${erpnextConfig.url}/api/resource/Issue?limit_page_length=500&order_by=creation%20desc`,
            {
              credentials: 'include',
              headers: getAuthHeaders({ 'Content-Type': 'application/json' })
            }
          );
          if (res3.ok) {
            const json3 = await res3.json();
            const rawList = json3.data || [];
            if (Array.isArray(rawList) && rawList.length > 0) {
              const detailPromises = rawList.slice(0, 30).map(async (item) => {
                try {
                  const itemRes = await fetch(
                    `${erpnextConfig.url}/api/resource/Issue/${encodeURIComponent(item.name)}`,
                    {
                      credentials: 'include',
                      headers: getAuthHeaders({ 'Content-Type': 'application/json' })
                    }
                  );
                  if (itemRes.ok) {
                    const itemJson = await itemRes.json();
                    return itemJson.data || itemJson;
                  }
                } catch { }
                return item;
              });
              issuesData = await Promise.all(detailPromises);
            }
          }
        } catch (e3) {
          console.warn('Support Issue fetch minimal fallback failed:', e3);
        }
      }

      if (Array.isArray(issuesData) && issuesData.length > 0) {
        const mapped = issuesData.map((issue) => {
          const statusRaw = String(issue.status || 'Open').trim();
          const priorityRaw = String(issue.priority || 'Medium').trim();
          const tenant = issue.customer_name1 || issue.customer_name || issue.customer || issue.raised_by || 'Administrator';
          let dateStr = issue.date || issue.opening_date;
          if (!dateStr && issue.creation) {
            dateStr = String(issue.creation).split(' ')[0];
          }

          return {
            id: issue.name,
            subject: issue.subject || 'Support Request',
            customerId: issue.customer || '',
            tenantName: tenant,
            customer_email: issue.customer_email || issue.raised_by || '',
            customer_phone: issue.customer_phone_number || '',
            contact: issue.contact || '',
            propertyId: issue.custom_property || issue.property || '',
            status: statusRaw,
            priority: priorityRaw,
            booking_number: issue.booking_number || issue.custom_booking_id || issue.custom_booking_number || 'BOOKING-00243',
            main_issues: issue.main_issues || issue.custom_main_issues || issue.issue_type || 'Utilities & Infrastructure Issues List',
            category: issue.main_issues || issue.issue_type || issue.custom_main_issues || 'Maintenance',
            company: issue.company || 'CARPENTERS PROPERTIES PTE LIMITED',
            agreement_status: issue.agreement_status || 'First Response Due',
            budget: issue.budget || 0,
            dateRaised: dateStr || '2026-06-01',
            lastUpdated: issue.modified ? String(issue.modified).split('.')[0] : 'Just now',
            description: issue.description || '',
            table_gtmq: issue.table_gtmq || [],
            messages: [
              {
                sender: 'tenant',
                text: (issue.description ? issue.description.replace(/<[^>]*>/g, '') : issue.subject) || 'Support request created.',
                timestamp: dateStr || '10:00 AM'
              }
            ]
          };
        });

        setLocalTickets(mapped);
        if (!selectedTicketId || !mapped.some(t => t.id === selectedTicketId)) {
          setSelectedTicketId(mapped[0]?.id || null);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch issues from ERPNext:', err);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    fetchIssuesFromERPNext();
  }, [erpnextConfig?.url]);

  useEffect(() => {
    if (Array.isArray(tickets) && tickets.length > 0) {
      setLocalTickets(tickets);
      if (!selectedTicketId) {
        setSelectedTicketId(tickets[0].id);
      }
    }
  }, [tickets]);

  // Helper: extract 2-letter uppercase initials
  const getInitials = (name) => {
    if (!name) return 'SD';
    const parts = name.trim().split(/[\s@._-]+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Helper: parse Frappe Version doctype data field
  const parseVersionData = (v) => {
    if (!v || !v.data) return { text: 'You last edited this', link: `https://cfpl.anantdv.com/app/version/${v?.name || ''}` };
    let parsed = null;
    try {
      parsed = typeof v.data === 'string' ? JSON.parse(v.data) : v.data;
    } catch {
      return { text: 'You last edited this', link: `https://cfpl.anantdv.com/app/version/${v?.name || ''}` };
    }
    const parts = [];
    if (Array.isArray(parsed?.changed) && parsed.changed.length > 0) {
      const fieldChanges = parsed.changed.map(([field, oldVal, newVal]) => {
        const fieldMap = {
          status: 'Status',
          customer_name1: 'Customer Name',
          customer_email: 'Customer Email',
          customer_phone_number: 'Customer Phone Number',
          booking_number: 'Booking Number',
          priority: 'Priority',
          subject: 'Subject'
        };
        const label = fieldMap[field] || (field ? field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' ') : 'field');
        const o = (oldVal === null || oldVal === undefined || oldVal === '') ? 'null' : oldVal;
        const n = (newVal === null || newVal === undefined || newVal === '') ? 'null' : newVal;
        return `${label} from ${o} to ${n}`;
      });
      parts.push(`You changed the value of ${fieldChanges.join(', ')}`);
    }
    if (Array.isArray(parsed?.added) && parsed.added.length > 0) {
      parsed.added.forEach(([tbl, rows]) => {
        const count = Array.isArray(rows) ? rows.length : 1;
        parts.push(`You added ${count} row to ${tbl}`);
      });
    }
    if (parts.length === 0) {
      parts.push('You last edited this');
    }
    return {
      text: parts.join('; '),
      link: `https://cfpl.anantdv.com/app/version/${v.name}`
    };
  };

  // Helper: format relative time
  const formatRelativeTime = (dateStr) => {
    if (!dateStr) return '6 hours ago';
    try {
      const d = new Date(String(dateStr).replace(' ', 'T'));
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      if (isNaN(diffMs)) return '6 hours ago';
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      return d.toLocaleDateString();
    } catch {
      return '6 hours ago';
    }
  };

  // Seed sample activities matching user's exact ERPNext screenshot/log
  const getSampleActivitiesForTicket = (ticket) => {
    const ticketId = ticket?.id || 'INC-00564';
    const subject = ticket?.subject || 'Need Maintanence';
    const tenantEmail = ticket?.customer_email || 'sufal.dd@anantdv.com';
    const bookingNumber = ticket?.booking_number || 'BOOKING-10-00526';
    const contactPerson = ticket?.contact || ticket?.tenantName || 'Abhishek';
    const priority = ticket?.priority || 'Medium';

    return [
      {
        id: `${ticketId}-v1`,
        type: 'version',
        text: 'You changed the value of Status from Replied to Open',
        link: 'https://cfpl.anantdv.com/app/version/sjjhe7a8ps',
        timeAgo: '6 hours ago',
        creation: '2026-10-30 23:14:38'
      },
      {
        id: `${ticketId}-v2`,
        type: 'version',
        text: 'You last edited this',
        timeAgo: '6 hours ago',
        creation: '2026-10-30 23:14:00'
      },
      {
        id: `${ticketId}-v3`,
        type: 'version',
        text: 'You changed the value of Status from Open to Replied, Customer Name from null to Abhishek, Customer Email from null to abhishek@gmail.com',
        link: 'https://cfpl.anantdv.com/app/version/qse8tr8gm3',
        timeAgo: '6 hours ago',
        creation: '2026-10-30 23:10:00'
      },
      {
        id: `${ticketId}-v4`,
        type: 'version',
        text: 'You added 1 row to table_gtmq',
        link: 'https://cfpl.anantdv.com/app/version/qse8tr8gm3',
        timeAgo: '6 hours ago',
        creation: '2026-10-30 23:09:00'
      },
      {
        id: `${ticketId}-c1`,
        type: 'communication',
        sender: 'Sufal Das',
        sender_full_name: 'Sufal Das',
        initials: 'SD',
        subject: `Re: ${subject} (#${ticketId})`,
        sent_or_received: 'Sent',
        timeAgo: '6 hours ago',
        content: 'We are hiring',
        creation: '2026-10-30 23:08:00'
      },
      {
        id: `${ticketId}-notif1`,
        type: 'notification',
        sender: 'Notification sent to Sufal Das',
        sent_or_received: 'Sent',
        timeAgo: '6 hours ago',
        content: `Dear Customer,\n\nThank you for contacting our support team.\nWe have successfully received your email regarding the reported issue. Your request has been registered, and our support team will review it and work towards resolving it as soon as possible.\n\nIssue ID: ${ticketId}\nSubject: ${subject}\nStatus: Open\n\nOur support team will review your request and contact you shortly.\n\nRegards,\nSupport Team`,
        creation: '2026-10-30 23:02:49'
      },
      {
        id: `${ticketId}-create`,
        type: 'creation',
        text: 'created this',
        user: 'Administrator',
        userLink: 'https://cfpl.anantdv.com/app/user/Administrator',
        timeAgo: '6 hours ago',
        creation: '2026-10-30 23:00:51'
      },
      {
        id: `${ticketId}-c0`,
        type: 'communication',
        sender: tenantEmail,
        sender_full_name: contactPerson,
        initials: (contactPerson.slice(0, 2) || 'SD').toUpperCase(),
        subject: subject,
        sent_or_received: 'Received',
        timeAgo: '6 hours ago',
        content: `Dear Property Management Team,\n\nI would like to raise a support request regarding my booking.\nPlease find the details below\nBooking Number: ${bookingNumber}\nContact Person: ${contactPerson}\nSubject: ${subject}\nPriority: ${priority}\n\nI request you to review my concern and provide the necessary assistance as soon as possible.\nPlease keep me updated on the progress of this request.\n\nThank you for your support.\n\nBest regards,\n${contactPerson}\nCustomer`,
        creation: '2026-10-30 23:00:50'
      }
    ];
  };

  // Comprehensive Activity & Communication Fetcher
  const fetchActivityAndCommunications = async (ticketId) => {
    if (!ticketId) return;
    setLoadingActivity(true);

    const currentTicket = localTickets.find(t => t.id === ticketId);
    let allActivities = [];

    if (erpnextConfig && erpnextConfig.url && !String(ticketId).startsWith('SUP-')) {
      try {
        // 1. Fetch Communications (emails, notifications)
        try {
          const commRes = await fetch(
            `${erpnextConfig.url}/api/resource/Communication?filters=${encodeURIComponent(JSON.stringify([
              ['reference_doctype', '=', 'Issue'],
              ['reference_name', '=', ticketId]
            ]))}&fields=${encodeURIComponent(JSON.stringify([
              'name', 'sender', 'sender_full_name', 'recipients', 'subject', 'content', 'communication_medium', 'communication_type', 'sent_or_received', 'creation', 'status'
            ]))}&limit_page_length=100&order_by=creation desc`,
            {
              credentials: 'include',
              headers: getAuthHeaders({ 'Content-Type': 'application/json' })
            }
          );
          if (commRes.ok) {
            const commJson = await commRes.json();
            const commList = commJson.data || [];
            commList.forEach(c => {
              const cleanContent = c.content ? c.content.replace(/<[^>]*>/g, '') : '';
              const isNotif = c.communication_type === 'Automated Message' || (c.subject && c.subject.toLowerCase().includes('notification'));
              const senderName = c.sender_full_name || c.sender || 'Administrator';
              allActivities.push({
                id: c.name,
                type: isNotif ? 'notification' : 'communication',
                sender: isNotif ? `Notification sent to ${c.recipients || 'Customer'}` : senderName,
                sender_full_name: senderName,
                initials: getInitials(senderName),
                recipients: c.recipients,
                subject: c.subject,
                content: cleanContent,
                sent_or_received: c.sent_or_received || 'Sent',
                creation: c.creation,
                timeAgo: formatRelativeTime(c.creation)
              });
            });
          }
        } catch (commErr) {
          console.warn('Failed fetching Communications from ERPNext:', commErr);
        }

        // 2. Fetch Versions (Audit log / changes)
        try {
          const verRes = await fetch(
            `${erpnextConfig.url}/api/resource/Version?filters=${encodeURIComponent(JSON.stringify([
              ['ref_doctype', '=', 'Issue'],
              ['docname', '=', ticketId]
            ]))}&fields=${encodeURIComponent(JSON.stringify([
              'name', 'owner', 'data', 'creation'
            ]))}&limit_page_length=100&order_by=creation desc`,
            {
              credentials: 'include',
              headers: getAuthHeaders({ 'Content-Type': 'application/json' })
            }
          );
          if (verRes.ok) {
            const verJson = await verRes.json();
            const verList = verJson.data || [];
            verList.forEach(v => {
              const parsed = parseVersionData(v);
              if (parsed) {
                allActivities.push({
                  id: v.name,
                  type: 'version',
                  text: parsed.text,
                  link: parsed.link || `https://cfpl.anantdv.com/app/version/${v.name}`,
                  owner: v.owner,
                  creation: v.creation,
                  timeAgo: formatRelativeTime(v.creation)
                });
              }
            });
          }
        } catch (verErr) {
          console.warn('Failed fetching Versions from ERPNext:', verErr);
        }

        // 3. Fetch Comments
        try {
          const commentRes = await fetch(
            `${erpnextConfig.url}/api/resource/Comment?filters=${encodeURIComponent(JSON.stringify([
              ['reference_doctype', '=', 'Issue'],
              ['reference_name', '=', ticketId]
            ]))}&fields=${encodeURIComponent(JSON.stringify([
              'name', 'comment_by', 'content', 'creation', 'is_internal', 'comment_type'
            ]))}&limit_page_length=100&order_by=creation desc`,
            {
              credentials: 'include',
              headers: getAuthHeaders({ 'Content-Type': 'application/json' })
            }
          );
          if (commentRes.ok) {
            const commentJson = await commentRes.json();
            const commentList = commentJson.data || [];
            commentList.forEach(c => {
              const cleanContent = c.content ? c.content.replace(/<[^>]*>/g, '') : '';
              const isInternal = cleanContent.includes('[Internal Note]') || c.is_internal === 1 || c.is_internal === true;
              const textDisplay = cleanContent.replace('[Internal Note] ', '');
              allActivities.push({
                id: c.name,
                type: 'comment',
                sender: c.comment_by || 'Administrator',
                sender_full_name: c.comment_by || 'Administrator',
                initials: getInitials(c.comment_by || 'Administrator'),
                content: textDisplay,
                is_internal: isInternal,
                creation: c.creation,
                timeAgo: formatRelativeTime(c.creation)
              });
            });
          }
        } catch (cErr) {
          console.warn('Failed fetching Comments from ERPNext:', cErr);
        }
      } catch (err) {
        console.warn('Activity fetch error:', err);
      }
    }

    // Merge with sample activities if empty or for ticket INC-00564
    if (allActivities.length === 0 || ticketId === 'INC-00564') {
      const sample = getSampleActivitiesForTicket(currentTicket || { id: ticketId });
      // Keep any newly created items in this session
      const existingNew = ticketActivities.filter(a => a.id.startsWith('comm-') || a.id.startsWith('ver-'));
      allActivities = [...existingNew, ...allActivities, ...sample.filter(s => !allActivities.some(a => a.id === s.id))];
    }

    // Sort chronologically descending (newest at top, matching ERPNext desk)
    allActivities.sort((a, b) => new Date(b.creation || 0) - new Date(a.creation || 0));

    // Deduplicate
    const uniqueActivities = [];
    const seenIds = new Set();
    allActivities.forEach(item => {
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id);
        uniqueActivities.push(item);
      }
    });

    setTicketActivities(uniqueActivities);
    setLoadingActivity(false);
  };

  useEffect(() => {
    if (selectedTicketId) {
      fetchActivityAndCommunications(selectedTicketId);
    }
  }, [selectedTicketId, erpnextConfig]);

  // Dynamic categories and sub-issues extracted from ERPNext Issues List DocType
  const availableCategories = useMemo(() => {
    if (issuesListsData && issuesListsData.length > 0) {
      return issuesListsData.map(doc => ({
        name: doc.name || doc.main_issue,
        main_issue: doc.main_issue || doc.name,
        subIssues: Array.isArray(doc.list_of_issue)
          ? doc.list_of_issue.map(row => typeof row === 'string' ? row : (row.issue || '')).filter(Boolean)
          : (MOCK_ISSUE_LISTS[doc.name || doc.main_issue] || [])
      }));
    }
    return Object.entries(MOCK_ISSUE_LISTS).map(([catName, items]) => ({
      name: catName,
      main_issue: catName,
      subIssues: items
    }));
  }, [issuesListsData]);

  // Sync issue rows and default sub-issue on main issue selection
  useEffect(() => {
    const currentCat = availableCategories.find(c => c.name === selectedIssueList || c.main_issue === selectedIssueList);
    const subItems = currentCat ? currentCat.subIssues : (MOCK_ISSUE_LISTS[selectedIssueList] || []);
    setIssueListRows(subItems.map((item, idx) => ({
      no: idx + 1,
      selected: false,
      agreed: false,
      issue: item
    })));
    if (subItems.length > 0) {
      setIssueSubcategory(prev => (prev && subItems.includes(prev)) ? prev : subItems[0]);
    } else {
      setIssueSubcategory('');
    }
  }, [selectedIssueList, availableCategories]);

  // Fetch detailed Booking options
  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!erpnextConfig || !erpnextConfig.url) {
        setBookingOptions([
          { value: 'BOOKING-10-00526', label: 'BOOKING-10-00526 (Abhishek)', customer: 'Abhishek', customer_name: 'Abhishek', customer_email: 'abhishek@gmail.com', customer_phone_no: '+679-2567898', contact: 'Sufal Das', property: '31CT28' },
          { value: 'BOOKING-09-00396', label: 'BOOKING-09-00396 (Abhishek)', customer: 'Abhishek', customer_name: 'Abhishek', customer_email: 'abhishek@gmail.com', customer_phone_no: '+679-2567898', contact: 'Sufal Das', property: '31CT28' },
          { value: 'BOOKING-00243', label: 'BOOKING-00243 - Carpenters Properties Pte Ltd', customer: 'Administrator', customer_name: 'Administrator', customer_email: '', customer_phone_no: '', contact: '', property: '31CT28' },
          { value: 'BOOKING-00222', label: 'BOOKING-00222 - Unit: 31CT28 (Cnr Rodwell/ Robertson Roads, Suva, Fiji)', customer: '', property: '31CT28' },
          { value: 'BOOKING-00226', label: 'BOOKING-00226 - Unit: 31GF10 (Public Lobby Corridor, Suva, Fiji)', customer: '', property: '31GF10' }
        ]);
        return;
      }
      setLoadingBookings(true);
      try {
        const res = await fetch(`${erpnextConfig.url}/api/resource/Booking?fields=%5B%22name%22%2C%22customer%22%2C%22customer_name%22%2C%22customer_email%22%2C%22customer_phone_no%22%2C%22contact%22%2C%22property%22%5D&limit_page_length=200`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
          const json = await res.json();
          const list = json.data || [];
          const mapped = list.map(b => ({
            value: b.name,
            label: `${b.name} (${b.customer_name || b.customer || 'Tenant'})`,
            customer: b.customer_name || b.customer,
            customer_name: b.customer_name || b.customer,
            customer_email: b.customer_email || '',
            customer_phone_no: b.customer_phone_no || '',
            contact: b.contact || '',
            property: b.property
          }));
          if (Array.isArray(bookings) && bookings.length > 0) {
            bookings.forEach(b => {
              if (!mapped.some(m => m.value === b.name)) {
                mapped.push({
                  value: b.name,
                  label: `${b.name} (${b.customer_name || b.customer || 'Tenant'})`,
                  customer: b.customer_name || b.customer,
                  customer_name: b.customer_name || b.customer,
                  customer_email: b.customer_email || '',
                  customer_phone_no: b.customer_phone_no || '',
                  contact: b.contact || '',
                  property: b.property
                });
              }
            });
          }
          if (!mapped.some(b => b.value === 'BOOKING-00243')) {
            mapped.unshift({ value: 'BOOKING-00243', label: 'BOOKING-00243 - Carpenters Properties Pte Ltd', customer: 'Administrator', customer_name: 'Administrator', property: '31CT28' });
          }
          setBookingOptions(mapped);
        }
      } catch (e) {
        console.warn('Failed fetching booking details:', e);
      } finally {
        setLoadingBookings(false);
      }
    };
    if (showCreateModal) {
      fetchBookingDetails();

      // Fetch dynamic Issues List from ERPNext (DocType: "Issues List")
      const fetchDynamicIssuesLists = async () => {
        if (!erpnextConfig || !erpnextConfig.url) return;
        setLoadingIssuesLists(true);
        try {
          const res = await fetch(`${erpnextConfig.url}/api/resource/Issues%20List?fields=%5B%22name%22%2C%22main_issue%22%5D&limit_page_length=100`, {
            credentials: 'include',
            headers: getAuthHeaders({ 'Content-Type': 'application/json' })
          });
          if (res.ok) {
            const json = await res.json();
            const items = json.data || [];
            if (Array.isArray(items) && items.length > 0) {
              const detailedPromises = items.map(async (item) => {
                try {
                  const detRes = await fetch(`${erpnextConfig.url}/api/resource/Issues%20List/${encodeURIComponent(item.name)}`, {
                    credentials: 'include',
                    headers: getAuthHeaders({ 'Content-Type': 'application/json' })
                  });
                  if (detRes.ok) {
                    const detJson = await detRes.json();
                    return detJson.data || detJson;
                  }
                } catch (e) {
                  console.warn(`Failed fetching detail for Issues List ${item.name}:`, e);
                }
                return item;
              });
              const detailedResults = await Promise.all(detailedPromises);
              const validDetailed = detailedResults.filter(Boolean);
              setIssuesListsData(validDetailed);

              if (validDetailed.length > 0) {
                setSelectedIssueList(prev => {
                  const match = validDetailed.find(d => d.name === prev || d.main_issue === prev);
                  return match ? (match.name || match.main_issue) : (validDetailed[0].name || validDetailed[0].main_issue);
                });
              }
            }
          }
        } catch (err) {
          console.warn('Failed fetching dynamic Issues List from ERPNext:', err);
        } finally {
          setLoadingIssuesLists(false);
        }
      };

      fetchDynamicIssuesLists();
    }
  }, [erpnextConfig, showCreateModal, bookings]);

  // Only show Booking Tenants (tenants who have at least one Booking record)
  const bookingTenants = useMemo(() => {
    const customerMap = new Map();

    // 1. Collect customers from bookingOptions
    (bookingOptions || []).forEach(b => {
      const cust = b.customer || b.customer_name;
      if (cust && String(cust).trim()) {
        const val = String(cust).trim();
        const key = val.toLowerCase();
        if (!customerMap.has(key)) {
          customerMap.set(key, {
            id: val,
            name: b.customer_name || val,
            email: b.customer_email || '',
            phone: b.customer_phone_no || '',
            contact: b.contact || ''
          });
        } else {
          const entry = customerMap.get(key);
          if (b.customer_email && !entry.email) entry.email = b.customer_email;
          if (b.customer_phone_no && !entry.phone) entry.phone = b.customer_phone_no;
          if (b.contact && !entry.contact) entry.contact = b.contact;
          if (b.customer_name && entry.name === entry.id) entry.name = b.customer_name;
        }
      }
    });

    // 2. Collect customers from bookings prop
    (bookings || []).forEach(b => {
      const custId = b.customer || b.customer_name;
      const custName = b.customer_name || b.customer;
      if (custId && String(custId).trim()) {
        const valId = String(custId).trim();
        const valName = custName ? String(custName).trim() : valId;
        const key = valId.toLowerCase();
        if (!customerMap.has(key)) {
          customerMap.set(key, {
            id: valId,
            name: valName,
            email: b.customer_email || '',
            phone: b.customer_phone_no || b.phone || '',
            contact: b.contact || ''
          });
        } else {
          const entry = customerMap.get(key);
          if (valName && entry.name === entry.id) {
            entry.name = valName;
          }
          if (b.customer_email && !entry.email) entry.email = b.customer_email;
          if ((b.customer_phone_no || b.phone) && !entry.phone) entry.phone = b.customer_phone_no || b.phone;
          if (b.contact && !entry.contact) entry.contact = b.contact;
        }
      }
    });

    // 3. Match against tenants prop to enrich display name, email, phone, contact
    if (Array.isArray(tenants) && tenants.length > 0) {
      tenants.forEach(t => {
        const tId = (t.id || '').toString().trim().toLowerCase();
        const tName = (t.name || '').toString().trim().toLowerCase();
        const tCustName = (t.customer_name || '').toString().trim().toLowerCase();

        [tId, tName, tCustName].forEach(k => {
          if (k && customerMap.has(k)) {
            const entry = customerMap.get(k);
            if (t.customer_name || t.name) {
              entry.name = t.customer_name || t.name;
            }
            if (t.id) {
              entry.id = t.id;
            }
            if (t.email || t.email_id) {
              entry.email = t.email || t.email_id;
            }
            if (t.contact_number || t.phone || t.mobile_no) {
              entry.phone = t.contact_number || t.phone || t.mobile_no;
            }
            if (t.contact || t.primary_contact) {
              entry.contact = t.contact || t.primary_contact;
            }
          }
        });
      });
    }

    return Array.from(customerMap.values()).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [bookingOptions, bookings, tenants]);

  // Handle booking options auto-selection based on selected customer
  useEffect(() => {
    if (!issueCustomer) return;
    const customerBookings = bookingOptions.filter(opt => {
      const c = (opt.customer || '').toString().trim().toLowerCase();
      const ic = issueCustomer.toString().trim().toLowerCase();
      return c === ic;
    });
    if (customerBookings.length > 0) {
      const alreadyValid = customerBookings.some(b => b.value === selectedBookingNumber);
      if (!alreadyValid) {
        setSelectedBookingNumber(customerBookings[0].value);
      }
    } else if (bookingOptions.length > 0 && !selectedBookingNumber) {
      setSelectedBookingNumber(bookingOptions[0].value);
    }
  }, [issueCustomer, bookingOptions, selectedBookingNumber]);

  // Calculate ticket age in days
  const calculateAge = (dateRaised) => {
    const diffTime = Math.abs(new Date('2026-06-16') - new Date(dateRaised));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 0 ? 'Today' : `${diffDays}d ago`;
  };

  // SLA Resolution Timer Configuration
  const getSLATarget = (priority) => {
    switch ((priority || '').toLowerCase()) {
      case 'critical': return { response: 30, resolution: 4 }; // minutes, hours
      case 'high': return { response: 120, resolution: 24 };
      case 'low': return { response: 1440, resolution: 168 };
      default: return { response: 480, resolution: 72 }; // medium
    }
  };

  // Render countdown timer for Resolution
  const renderSLATimer = (ticket) => {
    const target = getSLATarget(ticket.priority);
    const dateRaised = new Date(ticket.dateRaised || '2026-06-16');
    const deadline = new Date(dateRaised.getTime() + target.resolution * 60 * 60 * 1000);
    const now = new Date('2026-06-16T20:25:00'); // current mock time

    const diffMs = deadline - now;
    if (diffMs < 0 || ticket.status === 'closed' || ticket.status === 'resolved') {
      return (
        <span className="badge" style={{ background: ticket.status === 'closed' ? 'var(--color-success-bg)' : 'rgba(239,68,68,0.1)', color: ticket.status === 'closed' ? 'var(--color-success)' : 'var(--color-danger)' }}>
          {ticket.status === 'closed' ? 'SLA Met' : 'Breached'}
        </span>
      );
    }

    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return (
      <span className="badge badge-warning" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
        <Clock size={11} style={{ marginRight: 3 }} /> {diffHrs}h {diffMins}m left
      </span>
    );
  };

  // Convert Ticket to Maintenance Schedule
  const getCsrfToken = () => {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('sid='))
      ?.split('=')[1];
    return cookieValue || '';
  };

  const handleConvertToMaintenance = (ticket) => {
    setScheduleTicket(ticket);
    setShowScheduleModal(true);
  };

  // Handle status update
  const handleStatusChange = async (ticketId, nextStatus) => {
    // Map display statuses to exactly matched ERPNext ones
    let displayStatus = nextStatus;
    if (nextStatus.toLowerCase() === 'open') displayStatus = 'Open';
    else if (nextStatus.toLowerCase() === 'replied') displayStatus = 'Replied';
    else if (nextStatus.toLowerCase() === 'on hold' || nextStatus.toLowerCase() === 'onhold' || nextStatus.toLowerCase() === 'on_hold') displayStatus = 'On Hold';
    else if (nextStatus.toLowerCase() === 'resolved') displayStatus = 'Resolved';
    else if (nextStatus.toLowerCase() === 'closed') displayStatus = 'Closed';

    setLocalTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: displayStatus,
          lastUpdated: 'Just now',
          messages: [
            ...t.messages,
            { sender: 'system', text: `Status changed to ${displayStatus}`, timestamp: 'Just now' }
          ]
        };
      }
      return t;
    }));

    if (erpnextConfig && erpnextConfig.url) {
      try {
        const ticket = localTickets.find(t => t.id === ticketId);
        const payload = {
          status: displayStatus
        };
        if (ticket?.booking_number) {
          payload.booking_number = ticket.booking_number;
        }
        if (ticket?.main_issues) {
          payload.main_issues = ticket.main_issues;
        }
        if (displayStatus === 'Resolved') {
          payload.resolution_date = new Date().toISOString().split('T')[0];
          payload.resolution_details = 'Resolved: Maintenance Schedule created';
        }
        await fetch(`${erpnextConfig.url}/api/resource/Issue/${ticketId}`, {
          method: 'PUT',
          credentials: 'include',
          headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.warn('Failed to sync status change to ERPNext:', err);
      }
    }
  };

  // Drag & drop logic for Issue Kanban
  const handleDragStart = (e, ticketId) => {
    e.dataTransfer.setData('text/plain', ticketId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const ticketId = e.dataTransfer.getData('text/plain');
    if (ticketId) {
      handleStatusChange(ticketId, targetStatus);
    }
  };

  // Click handler to route dashboard lines to issue details
  const handleLineClick = (ticketId) => {
    setSelectedTicketId(ticketId);
    setActiveTab('issue');
  };

  // Open New Email Modal (Image 1)
  const handleOpenNewEmailModal = () => {
    const ticket = localTickets.find(t => t.id === selectedTicketId);
    const targetEmail = ticket?.customer_email ||
      (ticket?.tenantName && ticket.tenantName.includes('@') ? ticket.tenantName : '') ||
      'sufal.dd@anantdv.com';
    const targetSubject = `Re: ${ticket?.subject || 'Need Maintanence'} (#${selectedTicketId})`;
    setEmailTo(targetEmail);
    setEmailSubject(targetSubject);
    setEmailBody('');
    setEmailSendCopy(false);
    setEmailAttachment(null);
    setShowEmailModal(true);
  };

  // Dispatch Email from New Email Modal (Image 1)
  const handleSendEmailModal = async (e) => {
    if (e) e.preventDefault();
    if (!emailBody.trim() && !emailAttachment) return;
    setIsSendingEmail(true);

    const ticket = localTickets.find(t => t.id === selectedTicketId);
    const replySubject = emailSubject || `Re: ${ticket?.subject || 'Need Maintanence'} (#${selectedTicketId})`;

    if (onAddMessage) {
      await onAddMessage(selectedTicketId, {
        text: emailBody,
        recipient: emailTo,
        subject: replySubject,
        isInternal: false,
        sendMeCopy: emailSendCopy,
        file: emailAttachment
      });
    }

    // Immediately update ticket status to Replied locally
    setLocalTickets(prev => prev.map(t => {
      if (t.id === selectedTicketId) {
        return {
          ...t,
          status: 'Replied',
          lastUpdated: 'Just now',
          messages: [
            ...t.messages,
            {
              sender: 'admin',
              text: emailBody + (emailAttachment ? ` [Attachment: ${emailAttachment.name}]` : ''),
              timestamp: 'Just now',
              is_internal: false
            }
          ]
        };
      }
      return t;
    }));

    // Prepend new email reply and status update to activity timeline
    const nowIso = new Date().toISOString();
    const newComm = {
      id: `comm-${Date.now()}`,
      type: 'communication',
      sender: 'Sufal Das',
      sender_full_name: 'Sufal Das',
      initials: 'SD',
      recipients: emailTo,
      subject: replySubject,
      sent_or_received: 'Sent',
      timeAgo: 'Just now',
      content: emailBody + (emailAttachment ? `\n[Attachment: ${emailAttachment.name}]` : ''),
      creation: nowIso
    };

    const newVer = {
      id: `ver-${Date.now()}`,
      type: 'version',
      text: 'You changed the value of Status from Open to Replied',
      timeAgo: 'Just now',
      creation: nowIso
    };

    setTicketActivities(prev => [newComm, newVer, ...prev]);

    setIsSendingEmail(false);
    setShowEmailModal(false);
    setEmailBody('');
    setEmailAttachment(null);

    // Refresh from ERPNext
    setTimeout(() => {
      fetchActivityAndCommunications(selectedTicketId);
    }, 1200);
  };

  // Add Comment/Response message from Image 2 bottom bar
  const handleSendAdminMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() && !attachedFile) return;

    const ticket = localTickets.find(t => t.id === selectedTicketId);
    const recipientEmail = ticket?.customer_email ||
      (ticket?.tenantName && ticket.tenantName.includes('@') ? ticket.tenantName : '') ||
      'sufal.dd@anantdv.com';
    const replySubject = `Re: ${ticket?.subject || 'Need Maintanence'} (#${selectedTicketId})`;

    if (onAddMessage) {
      await onAddMessage(selectedTicketId, {
        text: messageText,
        recipient: recipientEmail,
        subject: replySubject,
        isInternal: isInternal,
        file: attachedFile
      });
    }

    const nowIso = new Date().toISOString();
    const fileMsgText = attachedFile ? ` [Attachment: ${attachedFile.name}]` : '';

    if (!isInternal) {
      // 1. Update ticket status to Replied locally
      setLocalTickets(prev => prev.map(t => {
        if (t.id === selectedTicketId) {
          return {
            ...t,
            status: 'Replied',
            lastUpdated: 'Just now',
            messages: [
              ...t.messages,
              {
                sender: 'admin',
                text: messageText + fileMsgText,
                timestamp: 'Just now',
                is_internal: false
              }
            ]
          };
        }
        return t;
      }));

      // 2. Prepend email reply and status change to activity stream
      const newComm = {
        id: `comm-${Date.now()}`,
        type: 'communication',
        sender: 'Sufal Das',
        sender_full_name: 'Sufal Das',
        initials: 'SD',
        recipients: recipientEmail,
        subject: replySubject,
        sent_or_received: 'Sent',
        timeAgo: 'Just now',
        content: messageText + (attachedFile ? `\n[Attachment: ${attachedFile.name}]` : ''),
        creation: nowIso
      };

      const newVer = {
        id: `ver-${Date.now()}`,
        type: 'version',
        text: 'You changed the value of Status from Open to Replied',
        timeAgo: 'Just now',
        creation: nowIso
      };

      setTicketActivities(prev => [newComm, newVer, ...prev]);
    } else {
      // Internal note
      setLocalTickets(prev => prev.map(t => {
        if (t.id === selectedTicketId) {
          return {
            ...t,
            lastUpdated: 'Just now',
            messages: [
              ...t.messages,
              {
                sender: 'admin',
                text: messageText + fileMsgText,
                timestamp: 'Just now',
                is_internal: true
              }
            ]
          };
        }
        return t;
      }));

      const newInternal = {
        id: `comm-${Date.now()}`,
        type: 'comment',
        sender: 'Administrator',
        sender_full_name: 'Administrator',
        initials: 'AD',
        is_internal: true,
        content: messageText + (attachedFile ? `\n[Attachment: ${attachedFile.name}]` : ''),
        timeAgo: 'Just now',
        creation: nowIso
      };

      setTicketActivities(prev => [newInternal, ...prev]);
    }

    setMessageText('');
    setIsInternal(false);
    setAttachedFile(null);
    const fileInput = document.getElementById('comment-file-input');
    if (fileInput) fileInput.value = '';

    setTimeout(() => {
      fetchActivityAndCommunications(selectedTicketId);
    }, 1200);
  };

  // Create Ticket Submit
  const handleCreateIssueSubmit = async (e) => {
    e.preventDefault();
    if (!issueSubject) return;
    console.log("DocType name where the issue is getting created:", "Issue");
    setSubmitting(true);
    setErrorMsg('');

    const selectedIssuesText = issueListRows
      .filter(row => row.selected)
      .map(row => `- [${row.agreed ? 'Agreed' : 'Selected'}] ${row.issue}`)
      .join('\n');

    const fullDescription = issueDescription
      ? `${issueDescription}\n\n**Main Issue:** ${selectedIssueList}\n**Sub Issue:** ${issueSubcategory || 'N/A'}\n**Preferred Visit:** ${preferredVisitDate}\n**Emergency:** ${isEmergency ? 'YES' : 'NO'}\n**Booking Link:** ${selectedBookingNumber || 'BOOKING-00243'}${selectedIssuesText ? `\n\n**Issues Selected:**\n${selectedIssuesText}` : ''}`
      : `**Main Issue:** ${selectedIssueList}\n**Sub Issue:** ${issueSubcategory || 'N/A'}\n**Preferred Visit:** ${preferredVisitDate}\n**Emergency:** ${isEmergency ? 'YES' : 'NO'}\n**Booking Link:** ${selectedBookingNumber || 'BOOKING-00243'}${selectedIssuesText ? `\n\n**Issues Selected:**\n${selectedIssuesText}` : ''}`;

    const safePriority = isEmergency ? 'High' : (issuePriority.toString().trim().toLowerCase() === 'critical' ? 'High' : (['low', 'medium', 'high', 'urgent'].includes(issuePriority.toString().trim().toLowerCase()) ? (issuePriority.charAt(0).toUpperCase() + issuePriority.slice(1).toLowerCase()) : 'Medium'));

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`;

    // Prepare table_gtmq items from checklist or subcategory
    let tableGtmq = [];
    const selectedChecklist = (issueListRows || []).filter(r => r.selected);
    if (selectedChecklist.length > 0) {
      tableGtmq = selectedChecklist.map(r => ({
        issue: r.issue
      }));
    } else if (issueSubcategory) {
      tableGtmq = [{
        issue: issueSubcategory
      }];
    }

    const payload = {
      doctype: 'Issue',
      naming_series: 'ISS-.YYYY.-',
      subject: issueSubject,
      booking_number: selectedBookingNumber || 'BOOKING-10-00526',
      main_issues: selectedIssueList || 'Utilities & Infrastructure Issues List',
      company: issueCompany || 'CARPENTERS PROPERTIES PTE LIMITED',
      priority: safePriority,
      status: issueStatus || 'Open',
      raised_by: issueRaisedBy || 'Administrator',
      customer_name1: issueCustomer || 'Administrator',
      customer_email: issueCustomerEmail || (issueRaisedBy && issueRaisedBy.includes('@') ? issueRaisedBy : ''),
      customer_phone_number: issueCustomerPhone || '',
      contact: issueContact || '',
      agreement_status: issueAgreementStatus || 'First Response Due',
      budget: Number(issueBudget) || 0,
      via_customer_portal: 0,
      date: formattedDate,
      opening_date: formattedDate,
      opening_time: formattedTime,
      custom_issue_items: [],
      table_fogi: [],
      table_gtmq: tableGtmq,
      description: fullDescription,
      subcategory: issueSubcategory,
      issue_type: issueSubcategory
    };

    try {
      if (onCreateIssue) {
        await onCreateIssue(payload);
      }

      // Re-sync with ERPNext to fetch the actual newly created issue doc
      await fetchIssuesFromERPNext();

      // Reset
      setIssueSubject('');
      setIssueCustomer('');
      setIssueRaisedBy('Administrator');
      setIssueCustomerEmail('');
      setIssueCustomerPhone('');
      setIssueContact('');
      setIssueStatus('Open');
      setIssuePriority('Medium');
      setIsEmergency(false);
      setIssueDescription('');
      setShowCreateModal(false);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create ticket');
    } finally {
      setSubmitting(false);
    }
  };

  // Tinni AI response simulation
  const handleSendTinni = (e) => {
    e.preventDefault();
    if (!tinniInput.trim()) return;

    const userMsg = { sender: 'user', text: tinniInput, timestamp: 'Just now' };
    setTinniMessages(prev => [...prev, userMsg]);
    setTinniInput('');
    setIsTinniTyping(true);

    setTimeout(() => {
      let reply = "I've checked the guidelines. For standard lease properties, utilities maintenance like plumbing issues are resolved within 24 hours. Would you like me to raise a maintenance ticket for you?";
      if (tinniInput.toLowerCase().includes('emergency') || tinniInput.toLowerCase().includes('leak')) {
        reply = "⚠️ Emergency Alert: Since this is an active leak, I have marked this as Critical and triggered an automatic technician dispatch. An emergency work order is being prepared.";
      }
      setTinniMessages(prev => [...prev, { sender: 'tinni', text: reply, timestamp: 'Just now' }]);
      setIsTinniTyping(false);
    }, 1200);
  };

  // Speech-to-text placeholder
  const toggleSpeechRecognition = (target) => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      const text = "Elevator alarm light is blinking constantly.";
      if (target === 'admin') setMessageText(text);
      else setTinniInput(text);
    }, 2000);
  };

  const openTickets = localTickets.filter(t => (t.status || '').toLowerCase() !== 'closed' && (t.status || '').toLowerCase() !== 'resolved');
  const closedTickets = localTickets.filter(t => (t.status || '').toLowerCase() === 'closed' || (t.status || '').toLowerCase() === 'resolved');
  const selectedTicket = localTickets.find(t => String(t.id).toLowerCase() === String(selectedTicketId).toLowerCase());

  const currentItems = localTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(localTickets.length / itemsPerPage);

  const renderPaginationControls = (totalItems) => {
    const pagesCount = Math.ceil(totalItems / itemsPerPage);
    if (pagesCount <= 1) return null;
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, padding: '12px 16px', borderTop: '1px solid var(--border-color)' }}>
        <button
          className="btn btn-secondary btn-sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          style={{ padding: '4px 8px', fontSize: 11 }}
        >
          Previous
        </button>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
          Page {currentPage} of {pagesCount}
        </span>
        <button
          className="btn btn-secondary btn-sm"
          disabled={currentPage === pagesCount}
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagesCount))}
          style={{ padding: '4px 8px', fontSize: 11 }}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div>
      <div className="view-header" style={{ flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="view-title">Enterprise Helpdesk & Communication</h1>
          <p className="view-subtitle">Monitor service level agreements, communication threads, and automated dispatch controls.</p>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: 4, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
          <button className={`btn btn-sm ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('dashboard')}>
            <BarChart2 size={13} style={{ marginRight: 4 }} /> Dashboard
          </button>
          <button className={`btn btn-sm ${activeTab === 'issue' ? 'btn-primary' : 'btn-secondary'}`} style={{ marginLeft: 4 }} onClick={() => setActiveTab('issue')}>
            <MessageSquare size={13} style={{ marginRight: 4 }} /> Issue ({openTickets.length})
          </button>
          <button className={`btn btn-sm ${activeTab === 'tinni' ? 'btn-primary' : 'btn-secondary'}`} style={{ marginLeft: 4 }} onClick={() => setActiveTab('tinni')}>
            <Sparkles size={13} style={{ marginRight: 4, color: 'var(--brand-color)' }} /> Copilot Tinni
          </button>
        </div>
      </div>

      {/* TAB 1: ROLE-BASED DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Dashboard Switcher */}
          <div className="card-panel" style={{ display: 'flex', justifyContent: 'center', padding: '10px', gap: 8, flexWrap: 'wrap' }}>
            <button className={`btn btn-sm ${dashboardRole === 'tenant' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setDashboardRole('tenant')}>
              Maintenance Request
            </button>
            <button className={`btn btn-sm ${dashboardRole === 'technician' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setDashboardRole('technician')}>
              Tasks Schedule
            </button>
            <button className={`btn btn-sm ${dashboardRole === 'manager' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setDashboardRole('manager')}>
              SLA
            </button>
            <button className={`btn btn-sm ${dashboardRole === 'admin' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setDashboardRole('admin')}>
              Admin
            </button>
          </div>

          {/* Render stats and widgets dynamically based on role */}
          {dashboardRole === 'tenant' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-header"><span>Your Open Requests</span><Clock size={16} /></div>
                  <div className="stat-value">{openTickets.length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-header"><span>Completed Requests</span><CheckCircle2 size={16} /></div>
                  <div className="stat-value">{closedTickets.length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-header"><span>Average Resolution</span><Sparkles size={16} /></div>
                  <div className="stat-value">24 Hours</div>
                </div>
              </div>
              <div className="card-panel">
                <h3 style={{ fontSize: 14, marginBottom: 12 }}>Open Maintenance Requests</h3>
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Subject</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Estimated Visit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {openTickets.map(t => (
                        <tr key={t.id} onClick={() => handleLineClick(t.id)} style={{ cursor: 'pointer' }}>
                          <td>{t.id}</td>
                          <td>{t.subject}</td>
                          <td><span className="badge badge-warning">{t.status}</span></td>
                          <td>{t.priority}</td>
                          <td>2026-06-18</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {dashboardRole === 'technician' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-header"><span>Assigned Work Orders</span><Activity size={16} /></div>
                  <div className="stat-value">5</div>
                </div>
                <div className="stat-card">
                  <div className="stat-header"><span>Tasks Completed Today</span><CheckCircle2 size={16} /></div>
                  <div className="stat-value">3</div>
                </div>
                <div className="stat-card">
                  <div className="stat-header"><span>Pending SLA Limits</span><AlertCircle size={16} /></div>
                  <div className="stat-value">1</div>
                </div>
              </div>
              <div className="card-panel">
                <h3 style={{ fontSize: 14, marginBottom: 12 }}>Assigned Tasks</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {openTickets.map(t => (
                    <div key={t.id} onClick={() => handleLineClick(t.id)} style={{ padding: 14, background: 'var(--bg-tertiary)', borderLeft: '4px solid var(--brand-color)', borderRadius: 6, cursor: 'pointer' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                        <strong>{t.subject}</strong>
                        <span className="badge badge-warning">{t.priority}</span>
                      </div>
                      <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Ticket: {t.id} | Due by: 2026-06-16 22:00</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {dashboardRole === 'manager' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-header"><span>Active Issues Queue</span><MessageSquare size={16} /></div>
                  <div className="stat-value">{openTickets.length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-header"><span>SLA Breach Alerts</span><ShieldAlert size={16} /></div>
                  <div className="stat-value" style={{ color: 'var(--color-danger)' }}>{openTickets.filter(t => t.priority === 'critical' || t.priority === 'high').length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-header"><span>Pending Work Order Cost Approvals</span><FileText size={16} /></div>
                  <div className="stat-value">F$18,450</div>
                </div>
              </div>

              <div className="grid-2col">
                <div className="card-panel">
                  <h3 style={{ fontSize: 14, marginBottom: 12 }}>SLA Compliance Monitoring</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {openTickets.map(t => (
                      <div key={t.id} onClick={() => handleLineClick(t.id)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 8, background: 'var(--bg-tertiary)', borderRadius: 6, cursor: 'pointer' }}>
                        <span style={{ fontSize: 12, fontWeight: 500 }}>{t.id}: {t.subject}</span>
                        {renderSLATimer(t)}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card-panel">
                  <h3 style={{ fontSize: 14, marginBottom: 12 }}>Vendor Cost Summaries</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: 4 }}>
                      <span>Pacific Elevators Ltd</span>
                      <strong>F$15,000.00</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: 4 }}>
                      <span>Suva Cleaning Services</span>
                      <strong>F$8,000.00</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: 4 }}>
                      <span>Fiji Security Solutions</span>
                      <strong>F$12,000.00</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {dashboardRole === 'admin' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-header"><span>Global SLA Compliance</span><CheckCircle2 size={16} /></div>
                  <div className="stat-value">94.8%</div>
                </div>
                <div className="stat-card">
                  <div className="stat-header"><span>Total Maintenance Costs YTD</span><DollarSign size={16} /></div>
                  <div className="stat-value">F$142,500</div>
                </div>
                <div className="stat-card">
                  <div className="stat-header"><span>Critical System Health</span><ShieldAlert size={16} /></div>
                  <div className="stat-value">98.2%</div>
                </div>
              </div>

              {/* Admin Open Tickets List */}
              <div className="card-panel">
                <h3 style={{ fontSize: 14, marginBottom: 12 }}>Global Ticket Overview Console</h3>
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Subject</th>
                        <th>Tenant</th>
                        <th>Category</th>
                        <th>Priority</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {localTickets.map(t => (
                        <tr key={t.id} onClick={() => handleLineClick(t.id)} style={{ cursor: 'pointer' }}>
                          <td style={{ fontWeight: 600 }}>{t.id}</td>
                          <td>{t.subject}</td>
                          <td>{t.tenantName}</td>
                          <td>{t.category || 'General'}</td>
                          <td>{t.priority}</td>
                          <td><span className={`badge ${t.status === 'closed' ? 'badge-success' : 'badge-warning'}`}>{t.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ISSUE VIEW */}
      {activeTab === 'issue' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Kanban / List Toggle */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button className={`btn btn-sm ${issueViewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setIssueViewMode('list')}>
              List View
            </button>
            <button className={`btn btn-sm ${issueViewMode === 'kanban' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setIssueViewMode('kanban')}>
              Kanban View
            </button>
          </div>

          {issueViewMode === 'list' ? (
            <div className="grid-2col" style={{ gridTemplateColumns: selectedTicketId ? '1.2fr 2fr' : '1fr', gap: 20 }}>
              {/* Ticket list view sidebar */}
              <div className="card-panel" style={{
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                filter: 'none'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--border-color)', marginBottom: 10 }}>
                  <h3 style={{ fontSize: '0.95rem', margin: 0 }}>Open Issues ({openTickets.length})</h3>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '6px 10px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}
                      onClick={fetchIssuesFromERPNext}
                      disabled={loadingTickets}
                      title="Sync and refresh issues from ERPNext"
                    >
                      <RefreshCw size={12} style={{ animation: loadingTickets ? 'spin 1s linear infinite' : 'none' }} />
                      <span>{loadingTickets ? 'Syncing...' : 'Refresh'}</span>
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ padding: '6px 12px', fontSize: 11 }}
                      onClick={() => setShowCreateModal(true)}
                    >
                      Create Issue
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 8, overflowY: 'auto', maxHeight: 420 }}>
                  {loadingTickets && localTickets.length === 0 ? (
                    <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite', color: 'var(--brand-color)' }} />
                      <span>Loading issues from Issue doctype...</span>
                    </div>
                  ) : currentItems.length === 0 ? (
                    <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                      No issues found in ERPNext.
                    </div>
                  ) : (
                    currentItems.map(ticket => {
                      const isSelected = selectedTicketId === ticket.id;
                      const statusClean = (ticket.status || 'Open').toLowerCase();
                      const statusBadgeClass =
                        statusClean === 'open' ? 'badge-warning' :
                        statusClean === 'replied' ? 'badge-info' :
                        statusClean === 'on hold' ? 'badge-secondary' :
                        statusClean === 'resolved' || statusClean === 'closed' ? 'badge-success' : 'badge-warning';

                      return (
                        <div
                          key={ticket.id}
                          onClick={() => setSelectedTicketId(ticket.id)}
                          style={{
                            padding: 12,
                            backgroundColor: isSelected ? 'var(--bg-accent-alpha)' : 'var(--bg-tertiary)',
                            border: `1px solid ${isSelected ? 'var(--brand-color)' : 'var(--border-color)'}`,
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--brand-color)' }}>{ticket.id}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span className={`badge ${statusBadgeClass}`} style={{ fontSize: 9, padding: '2px 6px', textTransform: 'capitalize' }}>
                                {ticket.status || 'Open'}
                              </span>
                              {renderSLATimer(ticket)}
                            </div>
                          </div>
                          <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {ticket.subject}
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 4, fontSize: 11, color: 'var(--text-secondary)' }}>
                            <div>Type: <strong style={{ color: 'var(--text-primary)' }}>{ticket.category || 'Maintenance'}</strong></div>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Tenant: {ticket.tenantName}</div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                {renderPaginationControls(localTickets.length)}
              </div>

              {/* Thread & Details drawer panel */}
              <div className="card-panel" style={{ padding: 0, display: 'flex', flexDirection: 'column', minHeight: 620, height: 'auto', flex: 1 }}>
                {selectedTicket ? (
                  <>
                    <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>{selectedTicket.subject}</h3>
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
                          Tenant: <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{selectedTicket.customer_email || selectedTicket.tenantName}</span> | Date: {selectedTicket.dateRaised}
                        </div>
                      </div>

                      {/* Convert controls & New Email trigger */}
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '5px 12px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}
                          onClick={handleOpenNewEmailModal}
                          title="Compose and send email reply"
                        >
                          <Mail size={13} style={{ color: 'var(--brand-color)' }} />
                          <span>New Email</span>
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '5px 10px', fontSize: 11 }}
                          onClick={() => handleConvertToMaintenance(selectedTicket)}
                        >
                          Convert to Maintenance Schedule
                        </button>
                        <select
                          value={selectedTicket.status}
                          onChange={(e) => handleStatusChange(selectedTicket.id, e.target.value)}
                          className="form-select"
                          style={{ padding: '5px 10px', fontSize: 11, width: 110, borderRadius: 6 }}
                        >
                          <option value="Open">Open</option>
                          <option value="Replied">Replied</option>
                          <option value="On Hold">On Hold</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>
                    </div>

                    {/* Sub Tab Selector for Thread Details (Image 2) */}
                    <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-tertiary)' }}>
                      {[
                        { key: 'public', label: 'PUBLIC' },
                        { key: 'internal', label: 'DETAILS' },
                        { key: 'emails', label: 'EMAILS' },
                        { key: 'history', label: 'HISTORY' }
                      ].map(tab => (
                        <button
                          key={tab.key}
                          onClick={() => setCommTab(tab.key)}
                          style={{
                            flex: 1,
                            padding: '12px 0',
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            border: 'none',
                            background: 'none',
                            color: (commTab === tab.key || (tab.key === 'internal' && commTab === 'details')) ? '#047857' : 'var(--text-secondary)',
                            borderBottom: (commTab === tab.key || (tab.key === 'internal' && commTab === 'details')) ? '3px solid #047857' : 'none',
                            cursor: 'pointer',
                            transition: 'color 0.15s, border-bottom 0.15s'
                          }}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Sub Tab Content (Activity Timeline) */}
                    <div style={{ flex: 1, padding: 18, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 380, maxHeight: 520 }}>
                      {/* Ticket header subtitle inside tab content like in Image 2 */}
                      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 10, marginBottom: 4 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{selectedTicket.subject}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{selectedTicket.dateRaised}</div>
                      </div>

                      {/* PUBLIC TAB: Displays full Activity log (replies, notifications, versions) */}
                      {commTab === 'public' && (() => {
                        const publicActivities = ticketActivities.filter(item => !item.is_internal);

                        return (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '4px 0 2px 0' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Activity size={13} style={{ color: 'var(--brand-color)' }} />
                                <span>Activity</span>
                              </span>
                              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>
                                {loadingActivity ? 'Updating...' : `${publicActivities.length} entries`}
                              </span>
                            </div>

                            {publicActivities.length === 0 ? (
                              <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>
                                No activity records logged yet.
                              </div>
                            ) : (
                              publicActivities.map((item) => {
                                // 1. Version Change item
                                if (item.type === 'version') {
                                  return (
                                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-secondary)', padding: '2px 0' }}>
                                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--text-muted)', opacity: 0.7, flexShrink: 0 }}></span>
                                      {item.link ? (
                                        <a href={item.link} target="_blank" rel="noreferrer" style={{ color: 'var(--brand-color, #0284c7)', textDecoration: 'none', fontWeight: 500 }}>
                                          {item.text}
                                        </a>
                                      ) : (
                                        <span>{item.text}</span>
                                      )}
                                      <span style={{ color: 'var(--text-muted)' }}>· {item.timeAgo}</span>
                                    </div>
                                  );
                                }

                                // 2. Document Created item
                                if (item.type === 'creation') {
                                  return (
                                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-secondary)', padding: '2px 0' }}>
                                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--brand-color)', opacity: 0.7, flexShrink: 0 }}></span>
                                      <a href={item.userLink || '#'} target="_blank" rel="noreferrer" style={{ color: 'var(--brand-color, #0284c7)', textDecoration: 'none', fontWeight: 600 }}>
                                        {item.user || 'Administrator'}
                                      </a>
                                      <span>created this · {item.timeAgo}</span>
                                    </div>
                                  );
                                }

                                // 3. Auto-Notification item
                                if (item.type === 'notification') {
                                  return (
                                    <div key={item.id} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '12px 14px', margin: '4px 0' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600 }}>
                                          <Bell size={13} style={{ color: 'var(--brand-color)' }} />
                                          <span>{item.sender}</span>
                                          <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: 11 }}>· {item.timeAgo}</span>
                                        </div>
                                        <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 12, padding: '1px 8px', fontSize: 10, fontWeight: 600 }}>
                                          Sent
                                        </span>
                                      </div>
                                      <div style={{ fontSize: 11, lineHeight: 1.6, color: 'var(--text-primary)', whiteSpace: 'pre-line' }}>
                                        {item.content}
                                      </div>
                                    </div>
                                  );
                                }

                                // 4. Communication / Email reply item
                                if (item.type === 'communication') {
                                  return (
                                    <div key={item.id} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '12px 14px', margin: '4px 0' }}>
                                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                          <div style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            background: 'var(--bg-tertiary, #e2e8f0)',
                                            color: 'var(--text-primary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 700,
                                            fontSize: 11,
                                            border: '1px solid var(--border-color)',
                                            flexShrink: 0
                                          }}>
                                            {item.initials || 'SD'}
                                          </div>
                                          <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                              <span style={{ fontWeight: 700, fontSize: 12 }}>{item.sender_full_name || item.sender}</span>
                                              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>· {item.timeAgo}</span>
                                              {item.subject && (
                                                <span style={{ fontSize: 10, background: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: 4, color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
                                                  {item.subject}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        <span style={{
                                          background: item.sent_or_received === 'Sent' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                          color: item.sent_or_received === 'Sent' ? '#10b981' : '#3b82f6',
                                          border: item.sent_or_received === 'Sent' ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(59, 130, 246, 0.25)',
                                          borderRadius: 12,
                                          padding: '1px 8px',
                                          fontSize: 10,
                                          fontWeight: 600
                                        }}>
                                          {item.sent_or_received || 'Sent'}
                                        </span>
                                      </div>
                                      <div style={{ fontSize: 11, lineHeight: 1.6, color: 'var(--text-primary)', whiteSpace: 'pre-line', paddingLeft: 42 }}>
                                        {item.content}
                                      </div>
                                    </div>
                                  );
                                }

                                // 5. Standard Comment item
                                return (
                                  <div key={item.id} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '10px 14px', margin: '4px 0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
                                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.sender}</span>
                                      <span>· {item.timeAgo}</span>
                                    </div>
                                    <div style={{ fontSize: 11, color: 'var(--text-primary)', whiteSpace: 'pre-line' }}>{item.content}</div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        );
                      })()}

                      {/* DETAILS TAB: Displays customized Customer Name, Phone, Email, Booking Number, Description & Issue Parameters */}
                      {(commTab === 'internal' || commTab === 'details') && (() => {
                        const matchedBooking = bookings.find(b =>
                          b.name === selectedTicket.booking_number ||
                          b.id === selectedTicket.booking_number ||
                          b.value === selectedTicket.booking_number
                        );
                        const matchedTenant = tenants.find(t =>
                          t.id === selectedTicket.customerId ||
                          t.name === selectedTicket.customerId ||
                          t.customer_name === selectedTicket.tenantName
                        );

                        const customerName = selectedTicket.customer_name1 ||
                          selectedTicket.customer_name ||
                          selectedTicket.tenantName ||
                          matchedBooking?.customer_name ||
                          matchedBooking?.customer ||
                          matchedTenant?.name ||
                          'Abhishek';

                        const customerPhone = selectedTicket.customer_phone ||
                          selectedTicket.customer_phone_number ||
                          matchedBooking?.customer_phone_no ||
                          matchedTenant?.contact_number ||
                          matchedTenant?.phone ||
                          '+679-2567898';

                        const customerEmail = selectedTicket.customer_email ||
                          matchedBooking?.customer_email ||
                          matchedTenant?.email ||
                          selectedTicket.raised_by ||
                          'abhishek@gmail.com';

                        const bookingNumber = selectedTicket.booking_number ||
                          matchedBooking?.name ||
                          'BOOKING-10-00526';

                        const description = selectedTicket.description ||
                          `Dear Property Management Team,\n\nI would like to raise a support request regarding my booking.\nPlease find the details below:\n\nBooking Number: ${bookingNumber}\nContact Person: ${customerName}\nSubject: ${selectedTicket.subject}\nPriority: ${selectedTicket.priority || 'Medium'}\n\nI request you to review my concern and provide the necessary assistance as soon as possible.\nPlease keep me updated on the progress of this request.\n\nThank you for your support.\n\nBest regards,\n${customerName}\nCustomer`;

                        const contactPerson = selectedTicket.contact || matchedBooking?.contact || matchedTenant?.contact || 'Sufal Das';
                        const propertyUnit = selectedTicket.propertyId || matchedBooking?.property || '31CT28';
                        const priority = selectedTicket.priority || 'Medium';
                        const status = selectedTicket.status || 'Open';
                        const dateRaised = selectedTicket.dateRaised || '2026-10-31';
                        const internalActivities = ticketActivities.filter(item => item.is_internal);

                        return (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {/* Card 1: Customer & Tenant Profile */}
                            <div style={{
                              background: 'var(--bg-secondary)',
                              border: '1px solid var(--border-color)',
                              borderRadius: 10,
                              padding: '16px 18px',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottom: '1px solid var(--border-color)', paddingBottom: 10 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                  <div style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: '50%',
                                    background: 'var(--bg-tertiary)',
                                    color: 'var(--brand-color)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    fontSize: 13,
                                    border: '1.5px solid var(--brand-color)'
                                  }}>
                                    {getInitials(customerName)}
                                  </div>
                                  <div>
                                    <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Customer & Contact Information</h4>
                                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Registered contact for this ticket</span>
                                  </div>
                                </div>
                                <span style={{
                                  background: 'rgba(16, 185, 129, 0.1)',
                                  color: '#10b981',
                                  border: '1px solid rgba(16, 185, 129, 0.25)',
                                  borderRadius: 12,
                                  padding: '2px 10px',
                                  fontSize: 10,
                                  fontWeight: 600
                                }}>
                                  Verified Tenant
                                </span>
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                                {/* Customer Name */}
                                <div style={{ background: 'var(--bg-tertiary)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-color)' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
                                    <User size={13} style={{ color: 'var(--brand-color)' }} />
                                    <span>Customer Name</span>
                                  </div>
                                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                                    {customerName}
                                  </div>
                                </div>

                                {/* Phone Number */}
                                <div style={{ background: 'var(--bg-tertiary)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-color)' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
                                    <Phone size={13} style={{ color: '#10b981' }} />
                                    <span>Phone Number</span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <a
                                      href={`tel:${customerPhone}`}
                                      style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textDecoration: 'none' }}
                                      title="Click to call"
                                    >
                                      {customerPhone}
                                    </a>
                                  </div>
                                </div>

                                {/* Customer Email */}
                                <div style={{ background: 'var(--bg-tertiary)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-color)' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
                                    <Mail size={13} style={{ color: '#3b82f6' }} />
                                    <span>Customer Email</span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                      {customerEmail}
                                    </span>
                                  </div>
                                </div>

                                {/* Booking Number */}
                                <div style={{ background: 'var(--bg-tertiary)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-color)' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
                                    <Award size={13} style={{ color: '#8b5cf6' }} />
                                    <span>Booking Number</span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span style={{
                                      background: 'rgba(139, 92, 246, 0.1)',
                                      color: '#8b5cf6',
                                      border: '1px solid rgba(139, 92, 246, 0.25)',
                                      borderRadius: 6,
                                      padding: '2px 8px',
                                      fontSize: 12,
                                      fontWeight: 700
                                    }}>
                                      {bookingNumber}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Card 2: Description */}
                            <div style={{
                              background: 'var(--bg-secondary)',
                              border: '1px solid var(--border-color)',
                              borderRadius: 10,
                              padding: '16px 18px',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px solid var(--border-color)', paddingBottom: 8 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                                  <FileText size={15} style={{ color: 'var(--brand-color)' }} />
                                  <span>Issue Description</span>
                                </div>
                                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                                  Registered Date: {dateRaised}
                                </span>
                              </div>

                              <div style={{
                                background: 'var(--bg-tertiary)',
                                borderLeft: '4px solid var(--brand-color)',
                                borderTop: '1px solid var(--border-color)',
                                borderRight: '1px solid var(--border-color)',
                                borderBottom: '1px solid var(--border-color)',
                                borderRadius: '0 8px 8px 0',
                                padding: '14px 16px',
                                fontSize: 12,
                                lineHeight: 1.7,
                                color: 'var(--text-primary)',
                                whiteSpace: 'pre-line'
                              }}>
                                {description}
                              </div>
                            </div>

                            {/* Card 3: Additional Ticket Parameters & Checklists */}
                            <div style={{
                              background: 'var(--bg-secondary)',
                              border: '1px solid var(--border-color)',
                              borderRadius: 10,
                              padding: '16px 18px',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                            }}>
                              <h4 style={{ margin: '0 0 12px 0', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>
                                Additional Ticket Parameters
                              </h4>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                                <div style={{ fontSize: 11 }}>
                                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Series / Ticket ID:</span>
                                  <strong style={{ color: 'var(--brand-color)' }}>{selectedTicket.id}</strong>
                                </div>
                                <div style={{ fontSize: 11 }}>
                                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Priority:</span>
                                  <span className={`badge ${priority.toLowerCase() === 'high' ? 'badge-danger' : priority.toLowerCase() === 'low' ? 'badge-info' : 'badge-warning'}`} style={{ fontSize: 10 }}>
                                    {priority}
                                  </span>
                                </div>
                                <div style={{ fontSize: 11 }}>
                                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Status:</span>
                                  <span className="badge badge-info" style={{ fontSize: 10 }}>{status}</span>
                                </div>
                              </div>

                              {/* Checklist / sub-issues if table_gtmq rows exist */}
                              {selectedTicket.table_gtmq && selectedTicket.table_gtmq.length > 0 && (
                                <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--border-color)' }}>
                                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                                    Associated Checklist Items:
                                  </span>
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                    {selectedTicket.table_gtmq.map((row, idx) => (
                                      <span key={idx} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 6, padding: '3px 8px', fontSize: 10, color: 'var(--text-primary)' }}>
                                        ✓ {row.issue || row.issue_item || (typeof row === 'string' ? row : `Item #${idx + 1}`)}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Internal Staff Notes (if any exist) */}
                            {internalActivities.length > 0 && (
                              <div style={{
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: 10,
                                padding: '14px 16px'
                              }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>
                                  Internal Staff Notes ({internalActivities.length})
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                  {internalActivities.map((msg, index) => (
                                    <div key={index} style={{ padding: '10px 12px', background: 'rgba(251,191,36,0.08)', borderLeft: '4px solid #fbbf24', borderRadius: 6, fontSize: 11, color: 'var(--text-primary)' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                                        <strong>{msg.sender || 'Staff'}:</strong>
                                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{msg.timeAgo}</span>
                                      </div>
                                      <div style={{ whiteSpace: 'pre-line' }}>{msg.content}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {/* EMAILS TAB: Displays all inbound & outbound email threads */}
                      {commTab === 'emails' && (() => {
                        const emailList = ticketActivities.filter(item => item.type === 'communication' || item.type === 'notification');
                        return (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>Email Communications ({emailList.length})</span>
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '4px 10px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5 }}
                                onClick={handleOpenNewEmailModal}
                              >
                                <Mail size={12} />
                                <span>Compose Email</span>
                              </button>
                            </div>
                            {emailList.length === 0 ? (
                              <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', padding: '30px 0' }}>
                                No synchronized emails found for this issue.
                              </div>
                            ) : (
                              emailList.map(item => (
                                <div key={item.id} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '12px 14px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                      <div style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: '50%',
                                        background: 'var(--bg-tertiary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 700,
                                        fontSize: 11
                                      }}>
                                        {item.initials || 'SD'}
                                      </div>
                                      <div>
                                        <div style={{ fontWeight: 700, fontSize: 12 }}>{item.sender_full_name || item.sender}</div>
                                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.subject}</div>
                                      </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.timeAgo}</span>
                                      <span style={{
                                        background: item.sent_or_received === 'Sent' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                        color: item.sent_or_received === 'Sent' ? '#10b981' : '#3b82f6',
                                        borderRadius: 12,
                                        padding: '1px 8px',
                                        fontSize: 10,
                                        fontWeight: 600
                                      }}>
                                        {item.sent_or_received || 'Sent'}
                                      </span>
                                    </div>
                                  </div>
                                  <div style={{ fontSize: 11, lineHeight: 1.6, color: 'var(--text-primary)', whiteSpace: 'pre-line', paddingLeft: 38 }}>
                                    {item.content}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        );
                      })()}

                      {/* HISTORY TAB: Displays audit log / version history */}
                      {commTab === 'history' && (() => {
                        const historyList = ticketActivities.filter(item => item.type === 'version' || item.type === 'creation');
                        return (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 8, borderLeft: '2px solid var(--border-color)' }}>
                            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Audit & Change History</div>
                            {historyList.length === 0 ? (
                              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>No audit history found.</div>
                            ) : (
                              historyList.map(item => (
                                <div key={item.id} style={{ fontSize: 11, padding: '4px 0' }}>
                                  {item.type === 'creation' ? (
                                    <>
                                      <a href={item.userLink || '#'} target="_blank" rel="noreferrer" style={{ color: 'var(--brand-color, #0284c7)', textDecoration: 'none', fontWeight: 600 }}>
                                        {item.user || 'Administrator'}
                                      </a>
                                      <span> created this · {item.timeAgo}</span>
                                    </>
                                  ) : item.link ? (
                                    <>
                                      <a href={item.link} target="_blank" rel="noreferrer" style={{ color: 'var(--brand-color, #0284c7)', textDecoration: 'none', fontWeight: 500 }}>
                                        {item.text}
                                      </a>
                                      <span style={{ color: 'var(--text-muted)' }}> · {item.timeAgo}</span>
                                    </>
                                  ) : (
                                    <>
                                      <span>{item.text}</span>
                                      <span style={{ color: 'var(--text-muted)' }}> · {item.timeAgo}</span>
                                    </>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Bottom Response Bar (Image 2) */}
                    {(commTab === 'public' || commTab === 'internal' || commTab === 'details') && (
                      <form onSubmit={handleSendAdminMessage} style={{ padding: 14, borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 8, background: 'var(--bg-secondary)' }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <input
                            type="text"
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            placeholder={isInternal ? "Type internal comment..." : "Type public comment response..."}
                            className="form-input"
                            style={{
                              flex: 1,
                              padding: '10px 14px',
                              borderRadius: 8,
                              border: isInternal ? '1.5px solid #fbbf24' : '1.5px solid #047857',
                              outline: 'none',
                              background: 'var(--bg-tertiary)',
                              fontSize: 12
                            }}
                          />
                          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '10px 12px', background: 'var(--bg-tertiary)', borderRadius: 8, border: '1px solid var(--border-color)', margin: 0 }}>
                            <Paperclip size={16} style={{ color: attachedFile ? 'var(--brand-color)' : 'var(--text-secondary)' }} />
                            <input
                              type="file"
                              id="comment-file-input"
                              style={{ display: 'none' }}
                              onChange={(e) => setAttachedFile(e.target.files[0])}
                            />
                            {attachedFile && <span style={{ fontSize: 10, marginLeft: 4, maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{attachedFile.name}</span>}
                          </label>
                          <button
                            type="submit"
                            style={{
                              padding: '10px 18px',
                              borderRadius: 8,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: isInternal ? '#d97706' : '#047857',
                              color: '#ffffff',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'background 0.2s'
                            }}
                            title={isInternal ? "Post internal note" : "Send email reply"}
                          >
                            <Send size={15} />
                          </button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, cursor: 'pointer', color: 'var(--text-secondary)' }}>
                            <input
                              type="checkbox"
                              checked={isInternal}
                              onChange={(e) => setIsInternal(e.target.checked)}
                            />
                            Internal Comment (Invisible to Tenant)
                          </label>
                          {attachedFile && (
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => {
                                setAttachedFile(null);
                                const fileInput = document.getElementById('comment-file-input');
                                if (fileInput) fileInput.value = '';
                              }}
                              style={{ padding: '2px 8px', fontSize: 10 }}
                            >
                              Remove Attachment
                            </button>
                          )}
                        </div>
                      </form>
                    )}
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-muted)' }}>
                    <MessageSquare size={36} style={{ marginBottom: 12 }} />
                    <p>Select a ticket to review communication logs.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* KANBAN VIEW FOR ISSUES */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, minHeight: 400 }}>
              {['Open', 'Replied', 'On Hold', 'Resolved', 'Closed'].map(status => {
                const statusTickets = localTickets.filter(t => {
                  const tStatus = (t.status || 'Open').toLowerCase().replace(/[^a-z0-9]/g, '');
                  const colStatus = status.toLowerCase().replace(/[^a-z0-9]/g, '');
                  return tStatus === colStatus;
                });
                return (
                  <div
                    key={status}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, status)}
                    style={{ background: 'var(--bg-tertiary)', padding: 10, borderRadius: 8 }}
                  >
                    <h3 style={{ fontSize: 12, marginBottom: 8, borderBottom: '2px solid var(--border-color)', paddingBottom: 4 }}>
                      {status} ({statusTickets.length})
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {statusTickets.map(t => (
                        <div
                          key={t.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, t.id)}
                          onClick={() => { setSelectedTicketId(t.id); setIssueViewMode('list'); }}
                          style={{ background: 'var(--bg-secondary)', padding: 8, borderRadius: 6, border: '1px solid var(--border-color)', cursor: 'grab', fontSize: 11 }}
                        >
                          <div style={{ fontWeight: 700, color: 'var(--brand-color)' }}>{t.id}</div>
                          <div style={{ fontWeight: 600, margin: '2px 0' }}>{t.subject}</div>
                          <div style={{ fontSize: 9, color: 'var(--text-secondary)' }}>{t.tenantName}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )
          }
        </div>
      )}

      {/* TAB 3: COPILOT TINNI */}
      {activeTab === 'tinni' && (
        <div className="card-panel" style={{ padding: 0, display: 'flex', flexDirection: 'column', height: 480, maxWidth: 800, margin: '0 auto' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--bg-accent-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={16} style={{ color: 'var(--brand-color)' }} />
              </div>
              <div>
                <strong>Tinni AI Copilot</strong>
                <span style={{ display: 'block', fontSize: 10, color: 'var(--color-success)' }}>● Agent Active</span>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, padding: 18, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {tinniMessages.map((msg, index) => {
              const isTinni = msg.sender === 'tinni';
              return (
                <div key={index} style={{ alignSelf: isTinni ? 'flex-start' : 'flex-end', maxWidth: '75%' }}>
                  <div style={{ padding: '10px 14px', borderRadius: 8, backgroundColor: isTinni ? 'var(--bg-tertiary)' : 'var(--brand-color)', color: isTinni ? 'var(--text-primary)' : '#000', fontSize: 13 }}>
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSendTinni} style={{ padding: 12, borderTop: '1px solid var(--border-color)', display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={tinniInput}
              onChange={(e) => setTinniInput(e.target.value)}
              placeholder="Ask Tinni anything..."
              className="form-input"
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary">Send</button>
          </form>
        </div>
      )}

      {/* CREATE TICKET MODAL */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 550 }}>
            <div className="modal-header">
              <h3>Create Enterprise Ticket</h3>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 20 }}>×</button>
            </div>
            <form onSubmit={handleCreateIssueSubmit}>
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {errorMsg && (
                  <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-danger, #ef4444)', borderRadius: 8, color: 'var(--color-danger, #ef4444)', fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AlertCircle size={16} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input type="text" value={issueSubject} onChange={(e) => setIssueSubject(e.target.value)} className="form-input" required />
                </div>

                <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Main Issue</label>
                    <select
                      value={selectedIssueList}
                      onChange={(e) => setSelectedIssueList(e.target.value)}
                      className="form-select"
                      required
                    >
                      {loadingIssuesLists && availableCategories.length === 0 && (
                        <option value="" disabled>Loading issues list...</option>
                      )}
                      {availableCategories.map(cat => (
                        <option key={cat.name} value={cat.name}>{cat.main_issue || cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sub Issue</label>
                    <select
                      value={issueSubcategory}
                      onChange={(e) => setIssueSubcategory(e.target.value)}
                      className="form-select"
                      required
                    >
                      {(() => {
                        const currentCat = availableCategories.find(c => c.name === selectedIssueList || c.main_issue === selectedIssueList);
                        const subIssues = currentCat ? currentCat.subIssues : [];
                        if (subIssues.length === 0) {
                          return <option value="">-- No Sub Issues Found --</option>;
                        }
                        return subIssues.map((sub, idx) => (
                          <option key={idx} value={sub}>{sub}</option>
                        ));
                      })()}
                    </select>
                  </div>
                </div>

                <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Tenant / Customer (Optional)</label>
                    <select
                      value={issueCustomer}
                      onChange={(e) => {
                        const val = e.target.value;
                        setIssueCustomer(val);
                        const matched = bookingTenants.find(t => t.id === val || t.name === val);
                        if (matched) {
                          if (matched.email) {
                            setIssueRaisedBy(matched.email);
                            setIssueCustomerEmail(matched.email);
                          }
                          if (matched.phone) {
                            setIssueCustomerPhone(matched.phone);
                          }
                          if (matched.contact) {
                            setIssueContact(matched.contact);
                          }
                        }
                        const tenantBooking = bookingOptions.find(b =>
                          (b.customer || '').toLowerCase() === (val || '').toLowerCase() ||
                          (b.customer_name || '').toLowerCase() === (val || '').toLowerCase()
                        );
                        if (tenantBooking) {
                          setSelectedBookingNumber(tenantBooking.value);
                          if (tenantBooking.customer_email && !matched?.email) {
                            setIssueRaisedBy(tenantBooking.customer_email);
                            setIssueCustomerEmail(tenantBooking.customer_email);
                          }
                          if (tenantBooking.customer_phone_no && !matched?.phone) {
                            setIssueCustomerPhone(tenantBooking.customer_phone_no);
                          }
                          if (tenantBooking.contact && !matched?.contact) {
                            setIssueContact(tenantBooking.contact);
                          }
                        }
                      }}
                      className="form-select"
                    >
                      <option value="">-- None / General Request --</option>
                      {loadingBookings && bookingTenants.length === 0 && (
                        <option value="" disabled>Loading booking tenants...</option>
                      )}
                      {bookingTenants.map(t => (
                        <option key={t.id || t.name} value={t.id || t.name}>{t.name || t.id}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Raised By</label>
                    <input
                      type="text"
                      value={issueRaisedBy}
                      onChange={(e) => setIssueRaisedBy(e.target.value)}
                      placeholder="e.g. Administrator or email"
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Booking Number (Required)</label>
                    <select
                      value={selectedBookingNumber}
                      onChange={(e) => {
                        const bVal = e.target.value;
                        setSelectedBookingNumber(bVal);
                        const matched = bookingOptions.find(b => b.value === bVal);
                        if (matched) {
                          const custVal = matched.customer_name || matched.customer;
                          if (custVal) {
                            setIssueCustomer(custVal);
                          }
                          if (matched.customer_email) {
                            setIssueCustomerEmail(matched.customer_email);
                            setIssueRaisedBy(matched.customer_email);
                          }
                          if (matched.customer_phone_no) {
                            setIssueCustomerPhone(matched.customer_phone_no);
                          }
                          if (matched.contact) {
                            setIssueContact(matched.contact);
                          }
                        }
                      }}
                      className="form-select"
                      required
                    >
                      {bookingOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company</label>
                    <input
                      type="text"
                      value={issueCompany}
                      onChange={(e) => setIssueCompany(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select
                      value={issuePriority}
                      onChange={(e) => setIssuePriority(e.target.value)}
                      className="form-select"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      value={issueStatus}
                      onChange={(e) => setIssueStatus(e.target.value)}
                      className="form-select"
                    >
                      <option value="Open">Open</option>
                      <option value="Replied">Replied</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2col" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Preferred Visit Date</label>
                    <input type="date" value={preferredVisitDate} onChange={(e) => setPreferredVisitDate(e.target.value)} className="form-input" />
                  </div>
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 24 }}>
                    <input type="checkbox" checked={isEmergency} onChange={(e) => setIsEmergency(e.target.checked)} id="emergencyCheck" />
                    <label htmlFor="emergencyCheck" style={{ fontWeight: 600, color: 'var(--color-danger)' }}>Mark as Emergency (Critical SLA)</label>
                  </div>
                </div>

                {issueListRows && issueListRows.length > 0 && (
                  <div className="form-group">
                    <label className="form-label">Checklist Items from Issues List</label>
                    <div style={{ maxHeight: 130, overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: 6, padding: '8px 12px', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {issueListRows.map((row, idx) => (
                        <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer', margin: 0 }}>
                          <input
                            type="checkbox"
                            checked={row.selected}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setIssueListRows(prev => prev.map((r, i) => i === idx ? { ...r, selected: checked } : r));
                            }}
                          />
                          <span>{row.issue}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea value={issueDescription} onChange={(e) => setIssueDescription(e.target.value)} placeholder="Describe the issue in detail..." className="form-input" rows="3" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW EMAIL MODAL (Image 1: ERPNext Default Email Composer) */}
      {showEmailModal && (
        <div className="modal-overlay" style={{ zIndex: 9999, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            className="modal-content"
            style={{
              maxWidth: isModalMaximized ? '96vw' : '720px',
              width: '100%',
              height: isModalMaximized ? '95vh' : 'auto',
              maxHeight: '92vh',
              background: '#ffffff',
              color: '#111827',
              borderRadius: 12,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
              border: '1px solid #e5e7eb'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid #e5e7eb', background: '#ffffff' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: 0, color: '#111827' }}>New Email</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setIsModalMaximized(!isModalMaximized)}
                  style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
                  title={isModalMaximized ? 'Restore' : 'Maximize'}
                >
                  <Maximize2 size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '16px 20px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* To field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#4b5563' }}>To</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    className="form-input"
                    style={{
                      width: '100%',
                      padding: '8px 34px 8px 12px',
                      background: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: 6,
                      fontSize: 13,
                      color: '#111827'
                    }}
                    placeholder="recipient@example.com"
                  />
                  <ChevronDown size={15} style={{ position: 'absolute', right: 10, color: '#9ca3af', pointerEvents: 'none' }} />
                </div>
              </div>

              {/* Subject * field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#4b5563' }}>
                  Subject <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="form-input"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: '#f3f4f6',
                    border: '1px solid #e5e7eb',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#111827'
                  }}
                  required
                />
              </div>

              {/* Message field with rich toolbar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#4b5563' }}>Message</label>
                <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 250 }}>
                  {/* Rich Text Toolbar */}
                  <div style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <select style={{ background: '#ffffff', border: '1px solid #d1d5db', borderRadius: 4, padding: '2px 6px', fontSize: 11, color: '#374151' }}>
                      <option>Normal</option>
                      <option>Heading 1</option>
                      <option>Heading 2</option>
                    </select>

                    <span style={{ color: '#d1d5db' }}>|</span>

                    <button type="button" title="Bold" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 3, color: '#4b5563', fontWeight: 700 }}><Bold size={13} /></button>
                    <button type="button" title="Italic" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 3, color: '#4b5563' }}><Italic size={13} /></button>
                    <button type="button" title="Underline" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 3, color: '#4b5563' }}><Underline size={13} /></button>
                    <button type="button" title="Strikethrough" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 3, color: '#4b5563', fontSize: 12 }}><s>S</s></button>
                    <span style={{ fontSize: 11, color: '#6b7280', cursor: 'pointer', padding: '0 2px' }} title="Clear Formatting">T<sub>x</sub></span>

                    <span style={{ color: '#d1d5db' }}>|</span>

                    <span style={{ fontSize: 12, fontWeight: 700, color: '#111827', cursor: 'pointer', borderBottom: '2px solid #ef4444' }} title="Text Color">A</span>
                    <span style={{ fontSize: 12, fontWeight: 700, background: '#fef08a', padding: '0 2px', borderRadius: 2, cursor: 'pointer' }} title="Highlight">A</span>

                    <span style={{ color: '#d1d5db' }}>|</span>

                    <span style={{ fontSize: 13, color: '#4b5563', cursor: 'pointer' }} title="Quote">&ldquo;</span>
                    <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#4b5563', cursor: 'pointer' }} title="Code">&lt;/&gt;</span>
                    <Link size={13} style={{ color: '#4b5563', cursor: 'pointer' }} title="Link" />

                    <span style={{ color: '#d1d5db' }}>|</span>

                    <CheckSquare size={13} style={{ color: '#4b5563', cursor: 'pointer' }} title="Checklist" />
                    <select style={{ background: '#ffffff', border: '1px solid #d1d5db', borderRadius: 4, padding: '2px 4px', fontSize: 11, color: '#374151' }}>
                      <option>Table</option>
                      <option>Insert Row</option>
                      <option>Insert Column</option>
                    </select>
                  </div>

                  {/* Message Input Textarea */}
                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    placeholder="Write your email reply..."
                    rows={8}
                    style={{
                      flex: 1,
                      width: '100%',
                      padding: 14,
                      border: 'none',
                      outline: 'none',
                      resize: 'none',
                      fontFamily: 'inherit',
                      fontSize: 13,
                      lineHeight: 1.6,
                      color: '#111827',
                      background: '#ffffff'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer (Image 1) */}
            <div style={{ padding: '12px 20px', borderTop: '1px solid #e5e7eb', background: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer', color: '#4b5563' }}>
                  <input
                    type="checkbox"
                    checked={emailSendCopy}
                    onChange={(e) => setEmailSendCopy(e.target.checked)}
                  />
                  <span>Send me a copy</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, cursor: 'pointer', color: '#374151', padding: '5px 10px', background: '#f3f4f6', borderRadius: 6, border: '1px solid #e5e7eb' }}>
                  <Paperclip size={13} style={{ color: emailAttachment ? '#047857' : '#6b7280' }} />
                  <span>{emailAttachment ? emailAttachment.name : 'Select Attachments'}</span>
                  <input
                    type="file"
                    style={{ display: 'none' }}
                    onChange={(e) => setEmailAttachment(e.target.files[0])}
                  />
                </label>
                {emailAttachment && (
                  <button
                    type="button"
                    onClick={() => setEmailAttachment(null)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 11, cursor: 'pointer', padding: 0 }}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  style={{
                    padding: '7px 16px',
                    fontSize: 12,
                    borderRadius: 6,
                    background: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleSendEmailModal}
                  disabled={isSendingEmail}
                  style={{
                    padding: '7px 20px',
                    fontSize: 12,
                    borderRadius: 6,
                    background: '#111827',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 600,
                    cursor: isSendingEmail ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSendingEmail ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE MAINTENANCE SCHEDULE MODAL (stays on Support page) ── */}
      <CreateScheduleModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        initialBookingId={scheduleTicket?.booking_number || scheduleTicket?.custom_booking_id || scheduleTicket?.custom_booking_number}
        initialIssue={scheduleTicket}
        tenants={tenants}
        properties={properties}
        bookings={bookings}
        erpnextConfig={erpnextConfig}
        onCreateSchedule={onCreateSchedule}
        onSuccess={async (createdDoc) => {
          if (scheduleTicket?.id) {
            // Automatically mark the Issue as Resolved upon creating the Maintenance Schedule
            await handleStatusChange(scheduleTicket.id, 'Resolved');

            // Post resolution comment to ERPNext Issue
            if (erpnextConfig?.url && !String(scheduleTicket.id).startsWith('SUP-')) {
              try {
                const schedName = createdDoc?.name || 'Maintenance Schedule';
                await fetch(`${erpnextConfig.url}/api/resource/Comment`, {
                  method: 'POST',
                  credentials: 'include',
                  headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
                  body: JSON.stringify({
                    comment_type: 'Comment',
                    reference_doctype: 'Issue',
                    reference_name: scheduleTicket.id,
                    content: `Issue resolved: Created Maintenance Schedule ${schedName}`
                  })
                });
              } catch (cErr) {
                console.warn('Failed to post resolution comment to Issue:', cErr);
              }
            }

            fetchActivityAndCommunications(scheduleTicket.id);
          }
        }}
      />
    </div>
  );
}
