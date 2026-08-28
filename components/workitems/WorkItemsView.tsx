'use client';

import { useState, useMemo } from 'react';
import { WORK_ITEMS } from '@/lib/workItemsData';
import type { WorkItem, WorkItemStatus, WorkItemPriority } from '@/lib/workItemsData';
import { CURRENT_USER } from '@/lib/currentUser';
import { Avatar, ActivityPanel, Button } from '@/components/ui';
import type { ActivityItem } from '@/components/ui';
import {
  SearchIcon, ChevronDownIcon, MoreVerticalIcon,
  CalendarIcon, PatientIcon, ReportIcon, FolderIcon,
  EyeIcon, AlertCircleIcon, ReferralIcon,
} from '@/components/icons';

// ─── Types ────────────────────────────────────────────────────────────────────

type DetailTab = 'information' | 'activity' | 'comments';
type StatusFilter = 'All' | WorkItemStatus;

// ─── Priority dot ─────────────────────────────────────────────────────────────

function PriorityDot({ priority, size = 20 }: { priority: WorkItemPriority; size?: number }) {
  const cfg = {
    high:   { bg: 'var(--error-light)', stroke: 'var(--error-main)', color: 'var(--error-dark)', dir: 'up' as const },
    medium: { bg: 'var(--accent-light)', stroke: 'var(--accent-main)', color: 'var(--accent-dark)', dir: 'mid' as const },
    low:    { bg: 'var(--background-soft)', stroke: 'var(--border)', color: 'var(--text-secondary)', dir: 'down' as const },
  }[priority];

  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: cfg.bg, border: `1px solid ${cfg.stroke}`,
      color: cfg.color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {cfg.dir === 'up' && (
        <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      )}
      {cfg.dir === 'mid' && (
        <svg width={size * 0.45} height={size * 0.45} viewBox="0 0 8 8">
          <circle cx="4" cy="4" r="3" fill="currentColor" />
        </svg>
      )}
      {cfg.dir === 'down' && (
        <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      )}
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status, large = false }: { status: WorkItemStatus; large?: boolean }) {
  const styles: Record<WorkItemStatus, { bg: string; color: string }> = {
    'DUE':         { bg: 'var(--error-light)',      color: 'var(--error-dark)'      },
    'IN PROGRESS': { bg: 'var(--success-light)',    color: 'var(--success-dark)'    },
    'ON HOLD':     { bg: '#FDEBD0',                 color: '#7D4E1F'                },
    'TO DO':       { bg: 'var(--background-soft)',  color: 'var(--text-secondary)'  },
    'DONE':        { bg: 'var(--background-soft)',  color: 'var(--text-secondary)'  },
  };
  const s = styles[status];
  return (
    <span style={{
      fontSize: large ? 11 : 10,
      fontWeight: 700,
      padding: large ? '3px 10px' : '2px 7px',
      borderRadius: 20,
      background: s.bg,
      color: s.color,
      whiteSpace: 'nowrap',
      flexShrink: 0,
      letterSpacing: '0.02em',
    }}>
      {status}
    </span>
  );
}

// ─── Work item row ────────────────────────────────────────────────────────────

function WorkItemRow({
  item,
  isSelected,
  onSelect,
}: {
  item: WorkItem;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className="cursor-pointer transition-colors hover:bg-hover"
      style={{
        display: 'flex', alignItems: 'center', position: 'relative',
        padding: '10px 14px 10px 18px',
        background: isSelected ? 'var(--hover)' : 'transparent',
        borderBottom: '1px solid var(--border-light)',
        gap: 10,
      }}
    >
      {/* Selection bar */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
        borderRadius: '0 2px 2px 0',
        background: isSelected ? 'var(--accent-main)' : 'transparent',
        transition: 'background 150ms',
      }} />

      {/* ID + title */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
          {item.id}
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.title}
        </span>
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
          {item.createdDate}
        </span>
        <StatusBadge status={item.status} />
        <PriorityDot priority={item.priority} />
        <Avatar initials={item.assignedTo.initials} variant={item.assignedTo.avatarVariant} size={22} />
        <button
          onClick={e => e.stopPropagation()}
          className="hover:bg-hover transition-colors rounded"
          style={{ padding: 2, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}
        >
          <MoreVerticalIcon size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Group header + rows ──────────────────────────────────────────────────────

function WorkItemGroup({
  label,
  items,
  selectedId,
  onSelect,
}: {
  label: string;
  items: WorkItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px 8px',
        position: 'sticky', top: 0, zIndex: 1,
        background: 'var(--background)',
        borderBottom: '1px solid var(--border-light)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</p>
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{items.length} work {items.length === 1 ? 'item' : 'items'}</span>
        </div>
        <button
          className="hover:bg-hover transition-colors rounded"
          style={{ padding: 3, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}
        >
          <MoreVerticalIcon size={14} />
        </button>
      </div>
      {items.map(item => (
        <WorkItemRow
          key={item.id}
          item={item}
          isSelected={item.id === selectedId}
          onSelect={() => onSelect(item.id)}
        />
      ))}
    </div>
  );
}

// ─── Detail action icon button ────────────────────────────────────────────────

function ActionIconBtn({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <Button variant="icon" size="xs" aria-label={label} title={label}>
      {children}
    </Button>
  );
}

// ─── Information tab row ──────────────────────────────────────────────────────

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
      <span style={{ fontSize: 12, color: 'var(--text-secondary)', width: 90, flexShrink: 0 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        {children}
      </div>
    </div>
  );
}

// ─── Activity items for a work item ───────────────────────────────────────────

function buildActivityItems(item: WorkItem): ActivityItem[] {
  const items: ActivityItem[] = [
    {
      id: `${item.id}-created`,
      user: item.createdBy.name,
      userInitials: item.createdBy.initials,
      avatarVariant: item.createdBy.avatarVariant,
      action: 'created this work item',
      timestamp: item.createdOn,
      iconType: 'task',
    },
  ];

  if (item.linkedPatient) {
    items.push({
      id: `${item.id}-patient`,
      user: item.createdBy.name,
      userInitials: item.createdBy.initials,
      avatarVariant: item.createdBy.avatarVariant,
      action: 'linked patient',
      target: item.linkedPatient.displayName,
      timestamp: item.createdOn,
      iconType: 'patient',
    });
  }

  if (item.linkedDocument) {
    items.push({
      id: `${item.id}-doc`,
      user: item.createdBy.name,
      userInitials: item.createdBy.initials,
      avatarVariant: item.createdBy.avatarVariant,
      action: 'attached document',
      target: item.linkedDocument.title,
      timestamp: item.createdOn,
      iconType: 'file',
    });
  }

  if (item.assignedTo.name !== item.createdBy.name) {
    items.push({
      id: `${item.id}-assigned`,
      user: item.createdBy.name,
      userInitials: item.createdBy.initials,
      avatarVariant: item.createdBy.avatarVariant,
      action: 'assigned this item to',
      target: item.assignedTo.name,
      timestamp: item.assignedOn,
      iconType: 'notification',
    });
  }

  return items;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function WorkItemsContent() {
  const [selectedId, setSelectedId] = useState(WORK_ITEMS[0].id);
  const [detailTab, setDetailTab] = useState<DetailTab>('information');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');

  const selectedItem = useMemo(
    () => WORK_ITEMS.find(w => w.id === selectedId)!,
    [selectedId],
  );

  const filteredItems = useMemo(() => {
    let items = WORK_ITEMS;
    if (statusFilter !== 'All') items = items.filter(w => w.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(w =>
        w.title.toLowerCase().includes(q) ||
        w.id.toLowerCase().includes(q),
      );
    }
    return items;
  }, [search, statusFilter]);

  const todayItems    = filteredItems.filter(w => w.dueGroup === 'today');
  const tomorrowItems = filteredItems.filter(w => w.dueGroup === 'tomorrow');
  const thisWeekItems = filteredItems.filter(w => w.dueGroup === 'this-week');
  const activityItems = useMemo(() => buildActivityItems(selectedItem), [selectedItem]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setDetailTab('information');
  };

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>

        {/* ══ LEFT — work item list ══════════════════════════════════════════════ */}
        <div style={{
          width: '42%', flexShrink: 0,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          borderRight: '1px solid var(--border)',
          background: 'var(--background)',
        }}>
          {/* List controls */}
          <div style={{
            flexShrink: 0, padding: '12px 14px',
            display: 'flex', alignItems: 'center', gap: 8,
            borderBottom: '1px solid var(--border)',
          }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap', marginRight: 2 }}>
              Showing {filteredItems.length} of {WORK_ITEMS.length}
            </span>

            {/* Status filter */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as StatusFilter)}
                style={{
                  height: 28, paddingLeft: 10, paddingRight: 26,
                  borderRadius: 20, border: '1px solid var(--border)',
                  background: 'var(--background)', color: 'var(--text-primary)',
                  fontSize: 12, appearance: 'none', cursor: 'pointer', outline: 'none',
                }}
              >
                <option value="All">All</option>
                <option value="DUE">DUE</option>
                <option value="TO DO">TO DO</option>
                <option value="IN PROGRESS">IN PROGRESS</option>
                <option value="ON HOLD">ON HOLD</option>
                <option value="DONE">DONE</option>
              </select>
              <span style={{ position: 'absolute', right: 8, pointerEvents: 'none', display: 'flex' }}>
                <ChevronDownIcon size={12} className="text-text-secondary" />
              </span>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', flex: 1 }}>
              <span style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex' }}>
                <SearchIcon size={13} className="text-text-secondary" />
              </span>
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%', height: 28, paddingLeft: 28, paddingRight: 8,
                  fontSize: 12, color: 'var(--text-primary)',
                  background: 'var(--background)', border: '1px solid var(--border)',
                  borderRadius: 20, outline: 'none',
                }}
              />
            </div>

            {/* Settings / filter control */}
            <Button variant="icon" size="xs" aria-label="Filter options">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="20" y2="12" />
                <line x1="12" y1="18" x2="20" y2="18" />
                <circle cx="4" cy="12" r="2" fill="currentColor" stroke="none" />
                <circle cx="8" cy="18" r="2" fill="currentColor" stroke="none" />
              </svg>
            </Button>
          </div>

          {/* Scrollable list */}
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }} className="conversation-scroll">
            {filteredItems.length === 0 ? (
              <p style={{ padding: '32px 20px', fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center' }}>
                No work items match your search.
              </p>
            ) : (
              <>
                <WorkItemGroup label="Due today"     items={todayItems}    selectedId={selectedId} onSelect={handleSelect} />
                <WorkItemGroup label="Due tomorrow"  items={tomorrowItems} selectedId={selectedId} onSelect={handleSelect} />
                <WorkItemGroup label="Due this week" items={thisWeekItems} selectedId={selectedId} onSelect={handleSelect} />
              </>
            )}
          </div>
        </div>

        {/* ══ RIGHT — detail panel ══════════════════════════════════════════════ */}
        <div style={{
          flex: 1, minWidth: 0,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          background: 'var(--background)',
        }}>
          {/* Detail header bar */}
          <div style={{
            flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 18px',
            borderBottom: '1px solid var(--border)',
          }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
              {selectedItem.id}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Status dropdown */}
              <button
                className="hover:bg-hover transition-colors"
                style={{
                  height: 28, paddingLeft: 10, paddingRight: 8,
                  borderRadius: 20, border: '1px solid var(--border)',
                  background: 'var(--background)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 5,
                  fontSize: 11, fontWeight: 600,
                  color: selectedItem.status === 'DUE' ? 'var(--error-dark)' : 'var(--text-secondary)',
                }}
              >
                {selectedItem.status}
                <ChevronDownIcon size={12} />
              </button>
              <PriorityDot priority={selectedItem.priority} size={24} />
              <button
                className="hover:bg-hover transition-colors rounded"
                style={{ padding: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}
              >
                <MoreVerticalIcon size={16} />
              </button>
            </div>
          </div>

          {/* Scrollable detail content */}
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }} className="conversation-scroll">

            {/* Title + breadcrumb + action toolbar */}
            <div style={{ padding: '16px 20px 14px', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', marginTop: 7, flexShrink: 0,
                  background: selectedItem.priority === 'high' ? 'var(--error-main)' :
                               selectedItem.priority === 'medium' ? 'var(--accent-main)' : 'var(--border)',
                }} />
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, margin: 0 }}>
                  {selectedItem.title}
                </h2>
              </div>
              {selectedItem.breadcrumb.length > 0 && (
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 12 }}>
                  {selectedItem.breadcrumb.join(' › ')}
                </p>
              )}
              {/* Action icons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <ActionIconBtn label="Link"><ReferralIcon size={14} /></ActionIconBtn>
                <ActionIconBtn label="Attachments"><FolderIcon size={14} /></ActionIconBtn>
                <ActionIconBtn label="Flag"><AlertCircleIcon size={14} /></ActionIconBtn>
                <ActionIconBtn label="Watch"><EyeIcon size={14} /></ActionIconBtn>
                <div style={{ flex: 1 }} />
                <ActionIconBtn label="More actions"><MoreVerticalIcon size={14} /></ActionIconBtn>
              </div>
            </div>

            {/* Description */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-light)' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                Description
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.65 }}>
                {selectedItem.description}
              </p>
            </div>

            {/* Linked to */}
            {(selectedItem.linkedPatient || selectedItem.linkedDocument) && (
              <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-light)' }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                  linked to
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {selectedItem.linkedPatient && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '9px 12px', borderRadius: 8,
                      border: '1px solid var(--border)', background: 'var(--background-soft)',
                      cursor: 'pointer',
                    }}
                      className="hover:bg-hover transition-colors"
                    >
                      <span style={{ flexShrink: 0, display: 'flex' }}><PatientIcon size={16} className="text-text-secondary" /></span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                        {selectedItem.linkedPatient.displayName}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', marginLeft: 4 }}>
                        NHS {selectedItem.linkedPatient.nhsNo}
                      </span>
                    </div>
                  )}
                  {selectedItem.linkedDocument && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '9px 12px', borderRadius: 8,
                      border: '1px solid var(--border)', background: 'var(--background-soft)',
                      cursor: 'pointer',
                    }}
                      className="hover:bg-hover transition-colors"
                    >
                      <span style={{ flexShrink: 0, display: 'flex' }}><ReportIcon size={16} className="text-text-secondary" /></span>
                      <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
                        {selectedItem.linkedDocument.id}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {selectedItem.linkedDocument.title}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text-secondary)', flexShrink: 0, marginLeft: 8 }}>
                        Uploaded {selectedItem.linkedDocument.uploadedOn}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tabs */}
            <div style={{ flexShrink: 0, borderBottom: '1px solid var(--border)', paddingLeft: 20 }}>
              <div style={{ display: 'flex', gap: 0 }}>
                {(['information', 'activity', 'comments'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setDetailTab(tab)}
                    style={{
                      height: 40, paddingLeft: 14, paddingRight: 14,
                      fontSize: 13, fontWeight: detailTab === tab ? 600 : 400,
                      color: detailTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      borderBottom: detailTab === tab ? '2px solid var(--primary-main)' : '2px solid transparent',
                      marginBottom: -1,
                      display: 'flex', alignItems: 'center', gap: 5,
                      textTransform: 'capitalize',
                    }}
                  >
                    {tab}
                    {tab === 'comments' && selectedItem.commentCount > 0 && (
                      <span style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: 'var(--success-main)',
                        display: 'inline-block', flexShrink: 0,
                      }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div style={{ padding: '16px 20px' }}>

              {/* Information */}
              {detailTab === 'information' && (
                <div>
                  <InfoRow label="Assigned to">
                    <Avatar initials={selectedItem.assignedTo.initials} variant={selectedItem.assignedTo.avatarVariant} size={20} />
                    <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{selectedItem.assignedTo.name}</span>
                  </InfoRow>
                  <InfoRow label="Assigned on">
                    <CalendarIcon size={14} className="text-text-secondary" />
                    <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{selectedItem.assignedOn}</span>
                  </InfoRow>
                  <InfoRow label="Created by">
                    <Avatar initials={selectedItem.createdBy.initials} variant={selectedItem.createdBy.avatarVariant} size={20} />
                    <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{selectedItem.createdBy.name}</span>
                  </InfoRow>
                  <InfoRow label="Created on">
                    <CalendarIcon size={14} className="text-text-secondary" />
                    <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{selectedItem.createdOn}</span>
                  </InfoRow>
                  <InfoRow label="Priority">
                    <PriorityDot priority={selectedItem.priority} size={18} />
                    <span style={{ fontSize: 13, color: 'var(--text-primary)', textTransform: 'capitalize' }}>{selectedItem.priority}</span>
                  </InfoRow>
                  <InfoRow label="Status">
                    <StatusBadge status={selectedItem.status} />
                  </InfoRow>
                  <InfoRow label="Due">
                    <CalendarIcon size={14} className="text-text-secondary" />
                    <span style={{ fontSize: 13, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                      {selectedItem.dueGroup === 'today' ? 'Today' :
                       selectedItem.dueGroup === 'tomorrow' ? 'Tomorrow' : 'This week'}
                    </span>
                  </InfoRow>
                </div>
              )}

              {/* Activity */}
              {detailTab === 'activity' && (
                <ActivityPanel items={activityItems} variant="compact" />
              )}

              {/* Comments */}
              {detailTab === 'comments' && (
                <div>
                  {selectedItem.commentCount === 0 ? (
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', padding: '12px 0' }}>
                      No comments yet.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {Array.from({ length: selectedItem.commentCount }).map((_, i) => (
                        <div key={i} style={{
                          display: 'flex', gap: 10,
                          padding: '10px 12px',
                          borderRadius: 8, border: '1px solid var(--border)',
                          background: 'var(--background-soft)',
                        }}>
                          <Avatar
                            initials={i % 2 === 0 ? selectedItem.createdBy.initials : selectedItem.assignedTo.initials}
                            variant={i % 2 === 0 ? selectedItem.createdBy.avatarVariant : selectedItem.assignedTo.avatarVariant}
                            size={28}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                                {i % 2 === 0 ? selectedItem.createdBy.name : selectedItem.assignedTo.name}
                              </span>
                              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                                {selectedItem.createdOn}
                              </span>
                            </div>
                            <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                              {i === 0
                                ? 'Added a note to follow up after reviewing the latest results. Will update the record once confirmed.'
                                : i === 1
                                ? 'Confirmed — chased the lab this morning, results expected by end of day.'
                                : i === 2
                                ? 'Results received. Reviewed and actioned. Patient notified via AccuRx.'
                                : 'Closing this item once the record has been updated.'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Comment input */}
                  <div style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                    <Avatar initials={CURRENT_USER.initials} variant="accent1" size={28} />
                    <div style={{ flex: 1, position: 'relative' }}>
                      <textarea
                        placeholder="Add a comment..."
                        rows={2}
                        style={{
                          width: '100%', padding: '8px 40px 8px 12px', fontSize: 13,
                          color: 'var(--text-primary)', background: 'var(--background)',
                          border: '1px solid var(--border)', borderRadius: 8, outline: 'none', resize: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                      <Button
                        variant="primary"
                        size="xs"
                        style={{ position: 'absolute', right: 8, bottom: 8 }}
                      >
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}
