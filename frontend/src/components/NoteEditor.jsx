import React, { useState, useEffect, useRef } from 'react'
import { useNotes } from '../context/NotesContext.jsx'
import Tooltip from './Tooltip.jsx'
import toast from 'react-hot-toast'

const COLORS = [
  { key: 'white',  bg: '#ffffff', dot: '#e2e2e2', label: 'White' },
  { key: 'warm',   bg: '#fff8ef', dot: '#f5c07a', label: 'Warm' },
  { key: 'blue',   bg: '#f0f3ff', dot: '#7c8ce8', label: 'Blue' },
  { key: 'green',  bg: '#f0f8f3', dot: '#6dbe8f', label: 'Green' },
  { key: 'rose',   bg: '#fff0f3', dot: '#f08fa0', label: 'Rose' },
  { key: 'amber',  bg: '#fffbee', dot: '#e6b94a', label: 'Amber' },
  { key: 'slate',  bg: '#f5f6f8', dot: '#b0b8c8', label: 'Slate' },
  { key: 'sand',   bg: '#faf7f2', dot: '#c8b89a', label: 'Sand' },
]

/* ─── Tags Input ─── */
function TagsInput({ tags, onChange }) {
  const [inp, setInp] = useState('')
  const add = (v) => {
    const t = v.trim().toLowerCase().replace(/[^a-z0-9-]/g, '')
    if (t && !tags.includes(t) && tags.length < 10) onChange([...tags, t])
    setInp('')
  }
  const onKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(inp) }
    else if (e.key === 'Backspace' && !inp && tags.length) onChange(tags.slice(0, -1))
  }
  return (
    <div className="flex flex-wrap gap-1.5 items-center bg-inp border border-black/10 rounded-md px-2.5 py-1.5 min-h-[38px] focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10 focus-within:bg-card transition-all">
      {tags.map(t => (
        <span key={t} className="inline-flex items-center gap-1 bg-accent-light border border-accent/20 rounded-full px-2 py-0.5 text-[11.5px] text-accent font-mono">
          #{t}
          <button onClick={() => onChange(tags.filter(x => x !== t))} className="opacity-50 hover:opacity-100 hover:text-danger text-sm leading-none transition-opacity">×</button>
        </span>
      ))}
      <input
        value={inp}
        onChange={e => setInp(e.target.value)}
        onKeyDown={onKey}
        onBlur={() => inp && add(inp)}
        placeholder={tags.length === 0 ? 'Add tags — press Enter' : ''}
        className="bg-transparent border-none outline-none text-sm text-primary placeholder-tertiary min-w-[80px] flex-1"
      />
    </div>
  )
}

/* ─── Markdown Renderer ─── */
function MarkdownContent({ content }) {
  const html = (content || '')
    .replace(/^### (.+)$/gm, '<h3 style="font-size:15px;font-weight:600;margin:14px 0 6px;color:#1a1c23">$1</h3>')
    .replace(/^## (.+)$/gm,  '<h2 style="font-size:18px;font-weight:600;margin:16px 0 8px;color:#1a1c23">$1</h2>')
    .replace(/^# (.+)$/gm,   '<h1 style="font-family:\'Instrument Serif\',serif;font-size:22px;font-style:italic;margin:18px 0 10px;color:#1a1c23">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight:600">$1</strong>')
    .replace(/\*(.+?)\*/g,    '<em style="color:#6b6b78">$1</em>')
    .replace(/`(.+?)`/g,      '<code style="background:#f7f4ef;padding:1px 6px;border-radius:4px;font-family:DM Mono,monospace;font-size:13px;color:#5c6ac4">$1</code>')
    .replace(/^- (.+)$/gm,    '<li style="margin:3px 0;color:#6b6b78;margin-left:16px">$1</li>')
    .replace(/^> (.+)$/gm,    '<blockquote style="border-left:3px solid rgba(92,106,196,0.4);padding:2px 0 2px 12px;margin:10px 0;color:#6b6b78;font-style:italic">$1</blockquote>')
    .replace(/^---$/gm,       '<hr style="border:none;border-top:1px solid rgba(0,0,0,0.09);margin:16px 0">')
    .replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br/>')
  return <div className="text-sm text-primary leading-[1.85]" dangerouslySetInnerHTML={{ __html: html }} />
}

/* ─── Toolbar Button ─── */
function TbBtn({ icon, syntax, title, shortcut, cls = '', onClick }) {
  return (
    <Tooltip text={title} shortcut={shortcut} position="bottom">
      <button
        onClick={onClick}
        className={`w-7 h-7 flex items-center justify-center rounded border border-black/8 bg-white/80 text-secondary hover:bg-accent-light hover:text-accent hover:border-accent/25 transition-all text-[11px] font-mono ${cls}`}
      >
        {icon}
      </button>
    </Tooltip>
  )
}

/* ─── Main NoteEditor ─── */
export default function NoteEditor({ note, onClose, onSaved }) {
  const { createNote, updateNote } = useNotes()
  const isNew = !note

  const [form, setForm] = useState({
    title:      note?.title      || '',
    content:    note?.content    || '',
    tags:       note?.tags       || [],
    subject:    note?.subject    || '',
    priority:   note?.priority   || 'medium',
    color:      note?.color      || 'white',
    isPinned:   note?.isPinned   || false,
    isFavorite: note?.isFavorite || false,
  })

  const [saving, setSaving]           = useState(false)
  const [splitPreview, setSplitPreview] = useState(false) // live split for new notes
  const [fullPreview, setFullPreview]  = useState(false)   // full preview toggle for editing
  const [showColors, setShowColors]    = useState(false)
  const [savedAt, setSavedAt]          = useState(null)
  const timerRef = useRef(null)
  const taRef    = useRef(null)

  const set = k => v => setForm(f => ({ ...f, [k]: v }))
  const toggle = k => () => setForm(f => ({ ...f, [k]: !f[k] }))

  // Auto-save for existing notes
  useEffect(() => {
    if (isNew) return
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      try { await updateNote(note._id, form); setSavedAt(new Date()) } catch (_) {}
    }, 1500)
    return () => clearTimeout(timerRef.current)
  }, [form])

  useEffect(() => { setTimeout(() => taRef.current?.focus(), 80) }, [])
  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [form])

  const wordCount = form.content.trim().split(/\s+/).filter(Boolean).length
  const readTime  = Math.max(1, Math.ceil(wordCount / 200))

  const insertMd = syntax => {
    const ta = taRef.current
    if (!ta) return
    const s = ta.selectionStart, e = ta.selectionEnd
    const sel = form.content.slice(s, e)
    const map = {
      bold:    `**${sel || 'bold text'}**`,
      italic:  `*${sel || 'italic text'}*`,
      code:    `\`${sel || 'code'}\``,
      h1:      `\n# ${sel || 'Heading 1'}`,
      h2:      `\n## ${sel || 'Heading 2'}`,
      list:    `\n- ${sel || 'List item'}`,
      quote:   `\n> ${sel || 'Blockquote'}`,
      divider: '\n---\n',
    }
    const ins = map[syntax] || ''
    const newContent = form.content.slice(0, s) + ins + form.content.slice(e)
    setForm(f => ({ ...f, content: newContent }))
    setTimeout(() => { ta.focus(); ta.selectionStart = ta.selectionEnd = s + ins.length }, 0)
  }

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Please add a title'); return }
    setSaving(true)
    try {
      if (isNew) await createNote(form)
      else { await updateNote(note._id, form); setSavedAt(new Date()) }
      onSaved?.()
      onClose()
    } catch (_) {
    } finally { setSaving(false) }
  }

  const handleClose = () => {
    if (isNew && (form.title || form.content)) {
      if (window.confirm('Discard unsaved note?')) onClose()
    } else onClose()
  }

  const currentColor = COLORS.find(c => c.key === form.color) || COLORS[0]
  const bg = currentColor.bg

  const showingPreview = isNew ? splitPreview : fullPreview

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-[10px] z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in"
      onClick={e => e.target === e.currentTarget && handleClose()}
    >
      <div
        className="relative w-full flex flex-col rounded-xl border border-black/10 shadow-modal animate-slide-up overflow-hidden"
        style={{
          background: bg,
          maxWidth: isNew && splitPreview ? '1060px' : '820px',
          maxHeight: '92vh',
          transition: 'max-width 0.3s ease',
        }}
      >
        {/* ── Header ── */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-black/8 flex-wrap flex-shrink-0" style={{ background: bg }}>
          <input
            className="flex-1 min-w-0 bg-transparent border-none outline-none font-serif italic text-[22px] text-primary placeholder-tertiary"
            placeholder="Note title..."
            value={form.title}
            onChange={e => set('title')(e.target.value)}
            maxLength={200}
          />
          <div className="flex gap-1.5 flex-shrink-0">
            <Tooltip text={form.isFavorite ? 'Remove from favourites' : 'Add to favourites'} position="bottom">
              <button
                onClick={toggle('isFavorite')}
                className={`w-8 h-8 flex items-center justify-center rounded-md border transition-all text-sm
                  ${form.isFavorite ? 'bg-warning-bg border-warning/25 text-warm' : 'bg-white/70 border-black/8 text-tertiary hover:text-warm hover:bg-warning-bg'}`}
              >★</button>
            </Tooltip>
            <Tooltip text={form.isPinned ? 'Unpin note' : 'Pin note'} position="bottom">
              <button
                onClick={toggle('isPinned')}
                className={`w-8 h-8 flex items-center justify-center rounded-md border transition-all text-sm
                  ${form.isPinned ? 'bg-accent-light border-accent/25 text-accent' : 'bg-white/70 border-black/8 text-tertiary hover:text-accent hover:bg-accent-light'}`}
              >◉</button>
            </Tooltip>
            <Tooltip text="Close editor" shortcut="Esc" position="bottom">
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-md border bg-white/70 border-black/8 text-tertiary hover:text-danger hover:bg-danger-bg hover:border-danger/20 transition-all text-sm"
              >✕</button>
            </Tooltip>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="flex items-center gap-1 px-6 py-2 border-b border-black/8 flex-wrap flex-shrink-0" style={{ background: bg }}>
          <TbBtn icon="B"  syntax="bold"    title="Bold"        shortcut="Ctrl+B" cls="font-bold"  onClick={() => insertMd('bold')} />
          <TbBtn icon="I"  syntax="italic"  title="Italic"      shortcut="Ctrl+I" cls="italic"     onClick={() => insertMd('italic')} />
          <TbBtn icon="H1" syntax="h1"      title="Heading 1"   shortcut="Ctrl+1"                  onClick={() => insertMd('h1')} />
          <TbBtn icon="H2" syntax="h2"      title="Heading 2"   shortcut="Ctrl+2"                  onClick={() => insertMd('h2')} />
          <TbBtn icon="<>" syntax="code"    title="Inline code" shortcut="Ctrl+`"  cls="font-mono" onClick={() => insertMd('code')} />
          <TbBtn icon="—"  syntax="divider" title="Divider"                                         onClick={() => insertMd('divider')} />
          <TbBtn icon="·"  syntax="list"    title="Bullet list" shortcut="Ctrl+L"                  onClick={() => insertMd('list')} />
          <TbBtn icon='"'  syntax="quote"   title="Blockquote"  shortcut="Ctrl+Q"                  onClick={() => insertMd('quote')} />

          <div className="w-px h-4 bg-black/8 mx-1" />

          {/* Preview / Split toggle */}
          {isNew ? (
            <Tooltip text={splitPreview ? 'Hide live preview' : 'Show live preview'} position="bottom">
              <button
                onClick={() => setSplitPreview(!splitPreview)}
                className={`flex items-center gap-1 px-2 h-7 rounded border text-[11px] transition-all font-sans ${
                  splitPreview
                    ? 'bg-accent text-white border-transparent'
                    : 'border-black/8 bg-white/80 text-secondary hover:bg-accent-light hover:text-accent'
                }`}
              >
                <span>{splitPreview ? '✎' : '◧'}</span>
                <span className="hidden sm:inline">{splitPreview ? 'Editor' : 'Split'}</span>
              </button>
            </Tooltip>
          ) : (
            <Tooltip text={fullPreview ? 'Back to editor' : 'Preview markdown'} position="bottom">
              <button
                onClick={() => setFullPreview(!fullPreview)}
                className={`flex items-center gap-1 px-2 h-7 rounded border text-[11px] transition-all font-sans ${
                  fullPreview
                    ? 'bg-accent text-white border-transparent'
                    : 'border-black/8 bg-white/80 text-secondary hover:bg-accent-light hover:text-accent'
                }`}
              >
                <span>{fullPreview ? '✎' : '◉'}</span>
                <span className="hidden sm:inline">{fullPreview ? 'Edit' : 'Preview'}</span>
              </button>
            </Tooltip>
          )}

          {/* Color picker */}
          <div className="relative">
            <Tooltip text="Note background colour" position="bottom">
              <button
                onClick={() => setShowColors(!showColors)}
                className="w-7 h-7 rounded-full border-2 border-white shadow-xs transition-all hover:scale-110 ml-0.5"
                style={{ background: currentColor.dot }}
              />
            </Tooltip>
            {showColors && (
              <div className="absolute left-0 top-full mt-1.5 bg-card border border-black/10 rounded-lg shadow-lg p-3 z-20 animate-fade-in">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-tertiary mb-2">Background</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {COLORS.map(c => (
                    <Tooltip key={c.key} text={c.label} position="bottom">
                      <button
                        onClick={() => { set('color')(c.key); setShowColors(false) }}
                        className={`w-6 h-6 rounded-full transition-all hover:scale-110 ${
                          form.color === c.key ? 'ring-2 ring-accent ring-offset-1' : 'ring-1 ring-black/10'
                        }`}
                        style={{ background: c.dot }}
                      />
                    </Tooltip>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Subject + Priority */}
          <div className="ml-auto flex gap-1.5 items-center flex-wrap">
            <Tooltip text="Academic subject / course" position="bottom">
              <input
                className="bg-white/80 border border-black/8 rounded-md px-2.5 py-1 text-xs text-primary placeholder-tertiary outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all w-32"
                placeholder="Subject..."
                value={form.subject}
                onChange={e => set('subject')(e.target.value)}
              />
            </Tooltip>
            <Tooltip text="Note priority level" position="bottom">
              <select
                value={form.priority}
                onChange={e => set('priority')(e.target.value)}
                className="bg-white/80 border border-black/8 rounded-md px-2.5 py-1 text-xs text-primary outline-none focus:border-accent transition-all cursor-pointer"
              >
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </Tooltip>
          </div>
        </div>

        {/* ── Body ── */}
        <div
          className="flex-1 overflow-hidden"
          style={{ background: bg, display: 'flex', minHeight: 0 }}
        >
          {/* Editor pane */}
          <div
            className={`flex flex-col overflow-hidden transition-all duration-300 ${
              isNew && splitPreview ? 'w-1/2 border-r border-black/8' : 'w-full'
            } ${!isNew && fullPreview ? 'hidden' : ''}`}
          >
            <textarea
              ref={taRef}
              value={form.content}
              onChange={e => set('content')(e.target.value)}
              className="flex-1 w-full px-7 py-5 bg-transparent border-none outline-none text-[15px] text-primary leading-[1.85] resize-none placeholder-tertiary"
              placeholder={`Start writing...\n\nMarkdown supported:\n**bold**  *italic*  # Heading\n\`code\`  - list  > quote  ---`}
              style={{ background: 'transparent' }}
            />
          </div>

          {/* Preview pane — shown as split (new note) or full (edit mode toggle) */}
          {((isNew && splitPreview) || (!isNew && fullPreview)) && (
            <div
              className={`overflow-y-auto px-7 py-5 ${isNew && splitPreview ? 'w-1/2' : 'w-full'}`}
              style={{ background: bg }}
            >
              {/* Preview header label */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-black/8">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-tertiary">Preview</span>
                {form.title && (
                  <span className="font-serif italic text-sm text-secondary truncate">— {form.title}</span>
                )}
              </div>
              {form.content ? (
                <MarkdownContent content={form.content} />
              ) : (
                <p className="text-sm text-tertiary italic">Start typing to see a live preview...</p>
              )}
            </div>
          )}
        </div>

        {/* ── Tags ── */}
        <div className="px-6 py-2.5 border-t border-black/8" style={{ background: bg }}>
          <TagsInput tags={form.tags} onChange={set('tags')} />
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center gap-2 px-6 py-3 border-t border-black/8 flex-shrink-0" style={{ background: bg }}>
          <div className="flex gap-2.5 font-mono text-[11.5px] text-tertiary mr-auto flex-wrap">
            <span>{wordCount} words</span>
            <span>·</span>
            <span>{form.content.length} chars</span>
            <span>·</span>
            <span>~{readTime} min read</span>
            {savedAt && !isNew && <span className="text-success">· Auto-saved ✓</span>}
          </div>
          <Tooltip text="Discard changes" position="top">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-secondary bg-white/80 border border-black/10 rounded-md hover:bg-hover hover:text-primary transition-all"
            >
              Cancel
            </button>
          </Tooltip>
          <Tooltip text={isNew ? 'Save new note' : 'Save changes'} shortcut="Ctrl+S" position="top">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-accent hover:bg-accent-hover text-white rounded-md transition-all shadow-accent disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? (
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-dot1" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-dot2" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-dot3" />
                </span>
              ) : isNew ? 'Create note' : 'Save changes'}
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
