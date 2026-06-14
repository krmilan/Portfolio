"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { type Profile, type Project, type Skill, type ExtraLink } from "@/lib/content";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Experience {
  id: string;
  type: "work" | "edu" | "cert";
  period: string;
  role: string;
  org: string;
  location: string;
  points: string[];
  tags: string[];
  accent: string;
  credential_url?: string;
  display_order: number;
}

interface Cert {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credential_url?: string;
  display_order: number;
}

interface ContactItem {
  id: string;
  label: string;
  value: string;
  href: string;
  accent: string;
  display_order: number;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [pw, setPw] = useState("");
  const [tab, setTab] = useState<"profile" | "projects" | "skills" | "experience" | "contact">("profile");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [syncing, setSyncing] = useState(false);

  // Data state
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [certs, setCerts] = useState<Cert[]>([]);
  const [contacts, setContacts] = useState<ContactItem[]>([]);

  // New item state
  const [newProject, setNewProject] = useState<Partial<Project>>({ accent_color: "#9d8ff0", visible: true, display_order: 99 });
  const [newProjectTagsRaw, setNewProjectTagsRaw] = useState("");
  const [newSkill, setNewSkill] = useState({ category: "", color: "#9d8ff0", display_order: 99 });
  const [newExp, setNewExp] = useState<Partial<Experience>>({ type: "work", accent: "#9d8ff0", points: [], tags: [], display_order: 99 });
  const [newExpPointsRaw, setNewExpPointsRaw] = useState("");
  const [newExpTagsRaw, setNewExpTagsRaw] = useState("");
  const [newCert, setNewCert] = useState<Partial<Cert>>({ display_order: 99 });
  const [newContact, setNewContact] = useState<Partial<ContactItem>>({ accent: "#9d8ff0", display_order: 99 });

  // Drag state for projects
  const dragIndex = useRef<number | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("admin_authed");
    setAuthed(stored === "true");
  }, []);

  useEffect(() => {
    if (!authed) return;
    supabase.from("profile").select("*").eq("id", 1).single().then(({ data }) => { if (data) setProfile(data); });
    supabase.from("projects").select("*").order("display_order").then(({ data }) => { if (data) setProjects(data); });
    supabase.from("skills").select("*").order("display_order").then(({ data }) => { if (data) setSkills(data); });
    supabase.from("experience").select("*").order("display_order").then(({ data }) => { if (data) setExperiences(data); });
    supabase.from("certifications").select("*").order("display_order").then(({ data }) => { if (data) setCerts(data); });
    supabase.from("contact_info").select("*").order("display_order").then(({ data }) => { if (data) setContacts(data); });
  }, [authed]);

  function flash(m: string) { setMsg(m); setTimeout(() => setMsg(""), 3000); }

  function login() {
    const PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "admin123";
    if (pw === PASS) { sessionStorage.setItem("admin_authed", "true"); setAuthed(true); }
    else flash("Wrong password");
  }

  // ─── Profile ───────────────────────────────────────────────────────────────

  async function saveProfile() {
    setSaving(true);
    const { error } = await supabase.from("profile").update({ ...profile, updated_at: new Date().toISOString() }).eq("id", 1);
    setSaving(false);
    flash(error ? `Error: ${error.message}` : "Profile saved ✓");
  }

  // ─── Projects ──────────────────────────────────────────────────────────────

  async function saveProject(p: Project) {
    setSaving(true);
    const { error } = await supabase.from("projects").update(p).eq("id", p.id);
    setSaving(false);
    flash(error ? `Error: ${error.message}` : "Project saved ✓");
  }

  async function deleteProject(id: string) {
    if (!confirm("Delete this project?")) return;
    await supabase.from("projects").delete().eq("id", id);
    setProjects(p => p.filter(x => x.id !== id));
    flash("Project deleted");
  }

  async function addProject() {
    if (!newProject.title || !newProject.description) { flash("Title and description required"); return; }
    setSaving(true);
    const { data, error } = await supabase.from("projects")
      .insert({ ...newProject, tags: newProjectTagsRaw.split(",").map(t => t.trim()).filter(Boolean) })
      .select().single();
    setSaving(false);
    if (error) { flash(`Error: ${error.message}`); return; }
    setProjects(p => [...p, data]);
    setNewProject({ accent_color: "#9d8ff0", visible: true, display_order: 99 });
    setNewProjectTagsRaw("");
    flash("Project added ✓");
  }

  // Drag-to-reorder projects
  function onDragStart(i: number) { dragIndex.current = i; }
  function onDragOver(e: React.DragEvent, i: number) {
    e.preventDefault();
    if (dragIndex.current === null || dragIndex.current === i) return;
    const reordered = [...projects];
    const [moved] = reordered.splice(dragIndex.current, 1);
    reordered.splice(i, 0, moved);
    dragIndex.current = i;
    setProjects(reordered);
  }
  function onDragEnd() { dragIndex.current = null; }

  async function saveProjectOrder() {
    setSaving(true);
    const updates = projects.map((p, i) => supabase.from("projects").update({ display_order: i + 1 }).eq("id", p.id));
    await Promise.all(updates);
    setProjects(ps => ps.map((p, i) => ({ ...p, display_order: i + 1 })));
    setSaving(false);
    flash("Order saved ✓");
  }

  // ─── Skills ────────────────────────────────────────────────────────────────

  async function saveSkill(s: Skill) {
    setSaving(true);
    const { error } = await supabase.from("skills").update(s).eq("id", s.id);
    setSaving(false);
    flash(error ? `Error: ${error.message}` : "Skill saved ✓");
  }

  async function deleteSkill(id: string) {
    if (!confirm("Delete this skill category?")) return;
    await supabase.from("skills").delete().eq("id", id);
    setSkills(s => s.filter(x => x.id !== id));
    flash("Skill category deleted");
  }

  async function addSkill() {
    if (!newSkill.category) { flash("Category name required"); return; }
    setSaving(true);
    const { data, error } = await supabase.from("skills").insert({ ...newSkill, items: [] }).select().single();
    setSaving(false);
    if (error) { flash(`Error: ${error.message}`); return; }
    setSkills(s => [...s, data]);
    setNewSkill({ category: "", color: "#9d8ff0", display_order: 99 });
    flash("Skill category added ✓");
  }

  // ─── Experience ────────────────────────────────────────────────────────────

  async function saveExperience(e: Experience) {
    setSaving(true);
    const { error } = await supabase.from("experience").update(e).eq("id", e.id);
    setSaving(false);
    flash(error ? `Error: ${error.message}` : "Experience saved ✓");
  }

  async function deleteExperience(id: string) {
    if (!confirm("Delete this entry?")) return;
    await supabase.from("experience").delete().eq("id", id);
    setExperiences(ex => ex.filter(x => x.id !== id));
    flash("Entry deleted");
  }

  async function addExperience() {
    if (!newExp.role || !newExp.org) { flash("Role and Org required"); return; }
    setSaving(true);
    const payload = {
      ...newExp,
      points: newExpPointsRaw.split("\n").map(s => s.trim()).filter(Boolean),
      tags: newExpTagsRaw.split(",").map(s => s.trim()).filter(Boolean),
    };
    const { data, error } = await supabase.from("experience").insert(payload).select().single();
    setSaving(false);
    if (error) { flash(`Error: ${error.message}`); return; }
    setExperiences(ex => [...ex, data].sort((a, b) => a.display_order - b.display_order));
    setNewExp({ type: "work", accent: "#9d8ff0", points: [], tags: [], display_order: 99 });
    setNewExpPointsRaw("");
    setNewExpTagsRaw("");
    flash("Experience added ✓");
  }

  // ─── Certs ─────────────────────────────────────────────────────────────────

  async function saveCert(c: Cert) {
    setSaving(true);
    const { error } = await supabase.from("certifications").update(c).eq("id", c.id);
    setSaving(false);
    flash(error ? `Error: ${error.message}` : "Cert saved ✓");
  }

  async function deleteCert(id: string) {
    if (!confirm("Delete this cert?")) return;
    await supabase.from("certifications").delete().eq("id", id);
    setCerts(c => c.filter(x => x.id !== id));
    flash("Cert deleted");
  }

  async function addCert() {
    if (!newCert.name || !newCert.issuer) { flash("Name and issuer required"); return; }
    setSaving(true);
    const { data, error } = await supabase.from("certifications").insert(newCert).select().single();
    setSaving(false);
    if (error) { flash(`Error: ${error.message}`); return; }
    setCerts(c => [...c, data]);
    setNewCert({ display_order: 99 });
    flash("Cert added ✓");
  }

  // ─── Contact ───────────────────────────────────────────────────────────────

  async function saveContact(c: ContactItem) {
    setSaving(true);
    const { error } = await supabase.from("contact_info").update(c).eq("id", c.id);
    setSaving(false);
    flash(error ? `Error: ${error.message}` : "Contact saved ✓");
  }

  async function deleteContact(id: string) {
    if (!confirm("Delete this contact entry?")) return;
    await supabase.from("contact_info").delete().eq("id", id);
    setContacts(c => c.filter(x => x.id !== id));
    flash("Contact deleted");
  }

  async function addContact() {
    if (!newContact.label || !newContact.href) { flash("Label and href required"); return; }
    setSaving(true);
    const { data, error } = await supabase.from("contact_info").insert(newContact).select().single();
    setSaving(false);
    if (error) { flash(`Error: ${error.message}`); return; }
    setContacts(c => [...c, data]);
    setNewContact({ accent: "#9d8ff0", display_order: 99 });
    flash("Contact added ✓");
  }

  // ─── RAG Sync ──────────────────────────────────────────────────────────────

  async function syncRag() {
    setSyncing(true);
    flash("Syncing RAG...");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/ingest`, {
        method: "POST",
        headers: { "x-ingest-secret": process.env.NEXT_PUBLIC_INGEST_SECRET ?? "" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      flash(`RAG synced ✓ — ${data.documents_ingested} documents`);
    } catch (e: any) {
      flash(`Sync failed: ${e.message}`);
    } finally {
      setSyncing(false);
    }
  }

  // ─── Styles ────────────────────────────────────────────────────────────────

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: 10,
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
    color: "white", fontSize: 14, outline: "none", boxSizing: "border-box",
    fontFamily: "DM Sans, sans-serif",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 12, color: "#94a3b8", fontWeight: 600, marginBottom: 6,
    display: "block", textTransform: "uppercase", letterSpacing: "0.05em",
  };
  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16, padding: 24, marginBottom: 16,
  };
  const btnStyle: React.CSSProperties = {
    padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer",
    background: "linear-gradient(135deg, #7c6fcd, #9d8ff0)", color: "white",
    fontWeight: 600, fontSize: 13, fontFamily: "DM Sans, sans-serif",
  };
  const dangerBtn: React.CSSProperties = {
    ...btnStyle, background: "rgba(255,100,100,0.15)",
    color: "#ff6b35", border: "1px solid rgba(255,100,100,0.3)",
  };
  const ghostBtn: React.CSSProperties = {
    ...btnStyle, background: "rgba(255,255,255,0.06)",
    color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)",
  };
  const sectionTitle: React.CSSProperties = {
    fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 16,
    color: "white", marginBottom: 20,
  };
  const addCardStyle: React.CSSProperties = {
    ...cardStyle, border: "1px dashed rgba(157,143,240,0.3)",
  };

  // ─── Loading ───────────────────────────────────────────────────────────────

  if (authed === null) return (
    <div style={{ minHeight: "100vh", background: "#080810", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#9d8ff0" }} />
    </div>
  );

  if (!authed) return (
    <div style={{ minHeight: "100vh", background: "#080810", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "DM Sans, sans-serif" }}>
      <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: 40, width: 340 }}>
        <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 24, fontWeight: 800, color: "white", marginBottom: 8 }}>Admin</h1>
        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>Enter password to continue</p>
        <input type="password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => { if (e.key === "Enter") login(); }}
          placeholder="Password" style={{ ...inputStyle, marginBottom: 12 }} />
        <button onClick={login} style={{ ...btnStyle, width: "100%", padding: "12px" }}>Enter</button>
        {msg && <p style={{ color: "#ff6b35", fontSize: 13, marginTop: 12, textAlign: "center" }}>{msg}</p>}
      </div>
    </div>
  );

  const TABS = ["profile", "projects", "skills", "experience", "contact"] as const;

  return (
    <div style={{ minHeight: "100vh", background: "#080810", color: "#e2e8f0", fontFamily: "DM Sans, sans-serif" }}>

      {/* Header */}
      <div style={{
        borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "16px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(255,255,255,0.02)", position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/" style={{ color: "#64748b", textDecoration: "none", fontSize: 13 }}>← Portfolio</a>
          <span style={{ color: "#475569" }}>·</span>
          <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 18, color: "white" }}>Admin Panel</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {msg && <span style={{ fontSize: 13, color: msg.startsWith("Error") ? "#ff6b35" : "#00ffaa" }}>{msg}</span>}
          {saving && <span style={{ fontSize: 13, color: "#9d8ff0" }}>Saving...</span>}
          <button onClick={() => { sessionStorage.removeItem("admin_authed"); setAuthed(false); }}
            style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#64748b", cursor: "pointer", fontSize: 13 }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{
            display: "flex", gap: 4,
            background: "rgba(255,255,255,0.03)", padding: 4,
            borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)",
          }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "8px 20px", borderRadius: 9, border: "none", cursor: "pointer",
                background: tab === t ? "linear-gradient(135deg, #7c6fcd, #9d8ff0)" : "transparent",
                color: tab === t ? "white" : "#64748b",
                fontWeight: 600, fontSize: 13, fontFamily: "DM Sans, sans-serif", textTransform: "capitalize",
              }}>{t}</button>
            ))}
          </div>
          <button onClick={syncRag} disabled={syncing} style={{
            padding: "8px 20px", borderRadius: 9, border: "1px solid rgba(0,255,180,0.3)",
            background: syncing ? "rgba(0,255,180,0.05)" : "rgba(0,255,180,0.1)",
            color: syncing ? "#475569" : "#00ffb4",
            fontWeight: 600, fontSize: 13, fontFamily: "DM Sans, sans-serif", cursor: syncing ? "not-allowed" : "pointer",
          }}>{syncing ? "Syncing..." : "⚡ Sync RAG"}</button>
        </div>

        {/* ── PROFILE TAB ──────────────────────────────────────────────────── */}
        {tab === "profile" && (
          <div style={cardStyle}>
            <h2 style={sectionTitle}>Profile</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              {([["Name", "name"], ["Email", "email"], ["GitHub URL", "github_url"], ["LinkedIn URL", "linkedin_url"], ["Resume URL", "resume_url"], ["Avatar URL", "avatar_url"]] as [string, string][]).map(([label, key]) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input style={inputStyle} value={(profile as any)[key] ?? ""} placeholder={key === "avatar_url" ? "https://..." : ""}
                    onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} />
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Bio</label>
              <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} value={profile.bio ?? ""}
                onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Roles (comma separated)</label>
              <input style={inputStyle} value={(profile.roles ?? []).join(", ")}
                onChange={e => setProfile(p => ({ ...p, roles: e.target.value.split(",").map(r => r.trim()).filter(Boolean) }))} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: "#94a3b8" }}>
                <input type="checkbox" checked={profile.open_to_work ?? true}
                  onChange={e => setProfile(p => ({ ...p, open_to_work: e.target.checked }))} />
                Open to Work
              </label>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Extra Links (HackerRank, LeetCode, etc.)</label>
              {(profile.extra_links ?? []).map((link: ExtraLink, i: number) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr auto", gap: 8, marginBottom: 8 }}>
                  <input style={inputStyle} value={link.label} placeholder="Label"
                    onChange={e => { const u = [...(profile.extra_links ?? [])]; u[i] = { ...link, label: e.target.value }; setProfile(p => ({ ...p, extra_links: u })); }} />
                  <input style={inputStyle} value={link.url} placeholder="URL"
                    onChange={e => { const u = [...(profile.extra_links ?? [])]; u[i] = { ...link, url: e.target.value }; setProfile(p => ({ ...p, extra_links: u })); }} />
                  <input style={inputStyle} value={link.icon} placeholder="Icon slug"
                    onChange={e => { const u = [...(profile.extra_links ?? [])]; u[i] = { ...link, icon: e.target.value }; setProfile(p => ({ ...p, extra_links: u })); }} />
                  <button onClick={() => setProfile(p => ({ ...p, extra_links: (p.extra_links ?? []).filter((_, j) => j !== i) }))}
                    style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,100,100,0.3)", background: "rgba(255,100,100,0.1)", color: "#ff6b35", cursor: "pointer" }}>✕</button>
                </div>
              ))}
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button onClick={() => setProfile(p => ({ ...p, extra_links: [...(p.extra_links ?? []), { label: "", url: "", icon: "" }] }))} style={ghostBtn}>+ Add Link</button>
                <button onClick={saveProfile} style={btnStyle} disabled={saving}>Save Profile</button>
              </div>
            </div>
          </div>
        )}

        {/* ── PROJECTS TAB ─────────────────────────────────────────────────── */}
        {tab === "projects" && (
          <div>
            {/* Drag-to-reorder banner */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "rgba(157,143,240,0.07)", border: "1px solid rgba(157,143,240,0.2)",
              borderRadius: 12, padding: "12px 18px", marginBottom: 20,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 16 }}>⠿</span>
                <span style={{ fontSize: 13, color: "#94a3b8" }}>Drag cards to reorder, then click <b style={{ color: "white" }}>Save Order</b></span>
              </div>
              <button onClick={saveProjectOrder} style={btnStyle}>Save Order</button>
            </div>

            {projects.map((p, i) => (
              <div
                key={p.id}
                draggable
                onDragStart={() => onDragStart(i)}
                onDragOver={e => onDragOver(e, i)}
                onDragEnd={onDragEnd}
                style={{ ...cardStyle, borderLeft: `3px solid ${p.accent_color}`, cursor: "grab", position: "relative" }}
              >
                {/* Drag handle */}
                <div style={{
                  position: "absolute", top: 12, right: 14,
                  fontSize: 18, color: "rgba(255,255,255,0.15)", userSelect: "none", cursor: "grab",
                }}>⠿</div>

                {/* Order badge */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 11, fontFamily: "monospace", padding: "2px 8px", borderRadius: 4, background: `${p.accent_color}20`, color: p.accent_color, border: `1px solid ${p.accent_color}40` }}>
                    #{i + 1} · {p.title}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={labelStyle}>Title</label>
                    <input style={inputStyle} value={p.title}
                      onChange={e => setProjects(ps => ps.map(x => x.id === p.id ? { ...x, title: e.target.value } : x))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Accent Color</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input type="color" value={p.accent_color}
                        onChange={e => setProjects(ps => ps.map(x => x.id === p.id ? { ...x, accent_color: e.target.value } : x))}
                        style={{ width: 44, height: 42, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", cursor: "pointer" }} />
                      <input style={{ ...inputStyle, flex: 1 }} value={p.accent_color}
                        onChange={e => setProjects(ps => ps.map(x => x.id === p.id ? { ...x, accent_color: e.target.value } : x))} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>GitHub URL</label>
                    <input style={inputStyle} value={p.github_url}
                      onChange={e => setProjects(ps => ps.map(x => x.id === p.id ? { ...x, github_url: e.target.value } : x))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Live Demo URL</label>
                    <input style={inputStyle} value={p.live_url} placeholder="https://..."
                      onChange={e => setProjects(ps => ps.map(x => x.id === p.id ? { ...x, live_url: e.target.value } : x))} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 28 }}>
                    <input type="checkbox" checked={p.visible}
                      onChange={e => setProjects(ps => ps.map(x => x.id === p.id ? { ...x, visible: e.target.checked } : x))} />
                    <span style={{ fontSize: 14, color: "#94a3b8" }}>Visible</span>
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={labelStyle}>Description</label>
                  <textarea style={{ ...inputStyle, minHeight: 70, resize: "vertical" }} value={p.description}
                    onChange={e => setProjects(ps => ps.map(x => x.id === p.id ? { ...x, description: e.target.value } : x))} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Tags (comma separated)</label>
                  <input style={inputStyle} defaultValue={p.tags.join(", ")}
                    onBlur={e => setProjects(ps => ps.map(x => x.id === p.id ? { ...x, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) } : x))}
                    placeholder="Next.js, TypeScript, FastAPI" />
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => saveProject(p)} style={btnStyle}>Save</button>
                  <button onClick={() => deleteProject(p.id)} style={dangerBtn}>Delete</button>
                </div>
              </div>
            ))}

            {/* Add new project */}
            <div style={addCardStyle}>
              <h3 style={{ ...sectionTitle, color: "#9d8ff0" }}>+ Add New Project</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={labelStyle}>Title *</label>
                  <input style={inputStyle} value={newProject.title ?? ""} onChange={e => setNewProject(p => ({ ...p, title: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Accent Color</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input type="color" value={newProject.accent_color}
                      onChange={e => setNewProject(p => ({ ...p, accent_color: e.target.value }))}
                      style={{ width: 44, height: 42, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", cursor: "pointer" }} />
                    <input style={{ ...inputStyle, flex: 1 }} value={newProject.accent_color}
                      onChange={e => setNewProject(p => ({ ...p, accent_color: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>GitHub URL</label>
                  <input style={inputStyle} value={newProject.github_url ?? ""} onChange={e => setNewProject(p => ({ ...p, github_url: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Live Demo URL</label>
                  <input style={inputStyle} value={newProject.live_url ?? ""} placeholder="https://..." onChange={e => setNewProject(p => ({ ...p, live_url: e.target.value }))} />
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Description *</label>
                <textarea style={{ ...inputStyle, minHeight: 70, resize: "vertical" }} value={newProject.description ?? ""}
                  onChange={e => setNewProject(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Tags (comma separated)</label>
                <input style={inputStyle} value={newProjectTagsRaw} onChange={e => setNewProjectTagsRaw(e.target.value)} placeholder="Next.js, TypeScript, FastAPI" />
              </div>
              <button onClick={addProject} style={btnStyle}>Add Project</button>
            </div>
          </div>
        )}

        {/* ── SKILLS TAB ───────────────────────────────────────────────────── */}
        {tab === "skills" && (
          <div>
            {skills.map(s => (
              <div key={s.id} style={cardStyle}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div>
                    <label style={labelStyle}>Category</label>
                    <input style={inputStyle} value={s.category}
                      onChange={e => setSkills(ss => ss.map(x => x.id === s.id ? { ...x, category: e.target.value } : x))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Color</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input type="color" value={s.color}
                        onChange={e => setSkills(ss => ss.map(x => x.id === s.id ? { ...x, color: e.target.value } : x))}
                        style={{ width: 44, height: 42, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", cursor: "pointer" }} />
                      <input style={{ ...inputStyle, flex: 1 }} value={s.color}
                        onChange={e => setSkills(ss => ss.map(x => x.id === s.id ? { ...x, color: e.target.value } : x))} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Order</label>
                    <input type="number" style={inputStyle} value={s.display_order}
                      onChange={e => setSkills(ss => ss.map(x => x.id === s.id ? { ...x, display_order: Number(e.target.value) } : x))} />
                  </div>
                </div>

                <label style={labelStyle}>Skills (name · % proficiency · icon slug)</label>
                <div style={{ fontSize: 11, color: "#475569", marginBottom: 8, fontFamily: "monospace" }}>
                  Icon slug = SimpleIcons name, e.g. "typescript", "react", "docker" — leave blank to hide icon
                </div>
                {s.items.map((item: any, i: number) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "3fr 2fr auto", gap: 8, marginBottom: 8 }}>
                    <input style={inputStyle} value={item.name} placeholder="Skill name"
                      onChange={e => { const u = [...s.items]; u[i] = { ...item, name: e.target.value }; setSkills(ss => ss.map(x => x.id === s.id ? { ...x, items: u } : x)); }} />
                    <input style={inputStyle} value={item.icon ?? ""} placeholder="e.g. typescript"
                      onChange={e => { const u = [...s.items]; u[i] = { ...item, icon: e.target.value }; setSkills(ss => ss.map(x => x.id === s.id ? { ...x, items: u } : x)); }} />
                    <button
                      onClick={() => setSkills(ss => ss.map(x => x.id === s.id ? { ...x, items: x.items.filter((_: any, j: number) => j !== i) } : x))}
                      style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,100,100,0.3)", background: "rgba(255,100,100,0.1)", color: "#ff6b35", cursor: "pointer" }}>✕</button>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                  <button onClick={() => setSkills(ss => ss.map(x => x.id === s.id ? { ...x, items: [...x.items, { name: "", icon: "" }] } : x))} style={ghostBtn}>+ Skill</button>
                  <button onClick={() => saveSkill(s)} style={btnStyle}>Save</button>
                  <button onClick={() => deleteSkill(s.id)} style={dangerBtn}>Delete Category</button>
                </div>
              </div>
            ))}
            <div style={addCardStyle}>
              <h3 style={{ ...sectionTitle, color: "#9d8ff0" }}>+ Add Skill Category</h3>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Category Name *</label>
                  <input style={inputStyle} value={newSkill.category} placeholder="e.g. DevOps"
                    onChange={e => setNewSkill(s => ({ ...s, category: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Color</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input type="color" value={newSkill.color} onChange={e => setNewSkill(s => ({ ...s, color: e.target.value }))}
                      style={{ width: 44, height: 42, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", cursor: "pointer" }} />
                    <input style={{ ...inputStyle, flex: 1 }} value={newSkill.color} onChange={e => setNewSkill(s => ({ ...s, color: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Display Order</label>
                  <input type="number" style={inputStyle} value={newSkill.display_order} onChange={e => setNewSkill(s => ({ ...s, display_order: Number(e.target.value) }))} />
                </div>
              </div>
              <button onClick={addSkill} style={btnStyle}>Add Category</button>
            </div>
          </div>
        )}

        {/* ── EXPERIENCE TAB ───────────────────────────────────────────────── */}
        {tab === "experience" && (
          <div>
            <p style={{ fontSize: 13, color: "#475569", marginBottom: 20, fontFamily: "monospace" }}>
              Changes here update the Experience section on the portfolio.
            </p>

            {/* Existing entries */}
            {experiences.map(e => (
              <ExperienceCard
                key={e.id}
                exp={e}
                inputStyle={inputStyle}
                labelStyle={labelStyle}
                btnStyle={btnStyle}
                dangerBtn={dangerBtn}
                ghostBtn={ghostBtn}
                cardStyle={cardStyle}
                onSave={saveExperience}
                onDelete={deleteExperience}
                onChange={updated => setExperiences(ex => ex.map(x => x.id === e.id ? updated : x))}
              />
            ))}

            {/* Add new experience */}
            <div style={addCardStyle}>
              <h3 style={{ ...sectionTitle, color: "#9d8ff0" }}>+ Add Experience / Education</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={labelStyle}>Type</label>
                  <select style={{ ...inputStyle }}
                    value={newExp.type}
                    onChange={e => setNewExp(x => ({ ...x, type: e.target.value as any }))}>
                    <option value="work">⚡ Work</option>
                    <option value="edu">🎓 Education</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Period</label>
                  <input style={inputStyle} value={newExp.period ?? ""} placeholder="2024 — Present"
                    onChange={e => setNewExp(x => ({ ...x, period: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Accent Color</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input type="color" value={newExp.accent} onChange={e => setNewExp(x => ({ ...x, accent: e.target.value }))}
                      style={{ width: 44, height: 42, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", cursor: "pointer" }} />
                    <input style={{ ...inputStyle, flex: 1 }} value={newExp.accent ?? "#9d8ff0"} onChange={e => setNewExp(x => ({ ...x, accent: e.target.value }))} />
                  </div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={labelStyle}>Role / Degree *</label>
                  <input style={inputStyle} value={newExp.role ?? ""} placeholder="Full-Stack AI Engineer"
                    onChange={e => setNewExp(x => ({ ...x, role: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Organization *</label>
                  <input style={inputStyle} value={newExp.org ?? ""} placeholder="Company / University"
                    onChange={e => setNewExp(x => ({ ...x, org: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Location</label>
                  <input style={inputStyle} value={newExp.location ?? ""} placeholder="Bengaluru, IN"
                    onChange={e => setNewExp(x => ({ ...x, location: e.target.value }))} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={labelStyle}>Bullet Points (one per line)</label>
                  <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} value={newExpPointsRaw}
                    onChange={e => setNewExpPointsRaw(e.target.value)} placeholder="Built a RAG pipeline...&#10;Deployed on Vercel..." />
                </div>
                <div>
                  <label style={labelStyle}>Tags (comma separated)</label>
                  <input style={inputStyle} value={newExpTagsRaw}
                    onChange={e => setNewExpTagsRaw(e.target.value)} placeholder="Next.js, FastAPI, Docker" />
                  <div style={{ marginTop: 12 }}>
                    <label style={labelStyle}>Display Order</label>
                    <input type="number" style={inputStyle} value={newExp.display_order}
                      onChange={e => setNewExp(x => ({ ...x, display_order: Number(e.target.value) }))} />
                  </div>
                </div>
              </div>
              <button onClick={addExperience} style={btnStyle}>Add Entry</button>
            </div>

            {/* Certs sub-section */}
            <div style={{ marginTop: 32 }}>
              <h2 style={{ ...sectionTitle, fontSize: 18, borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: 12, marginBottom: 20 }}>
                🏅 Certifications
              </h2>
              {certs.map(c => (
                <div key={c.id} style={{ ...cardStyle, borderLeft: "3px solid #ff6b35" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 12 }}>
                    <div>
                      <label style={labelStyle}>Name</label>
                      <input style={inputStyle} value={c.name}
                        onChange={e => setCerts(cs => cs.map(x => x.id === c.id ? { ...x, name: e.target.value } : x))} />
                    </div>
                    <div>
                      <label style={labelStyle}>Issuer</label>
                      <input style={inputStyle} value={c.issuer}
                        onChange={e => setCerts(cs => cs.map(x => x.id === c.id ? { ...x, issuer: e.target.value } : x))} />
                    </div>
                    <div>
                      <label style={labelStyle}>Date</label>
                      <input style={inputStyle} value={c.date}
                        onChange={e => setCerts(cs => cs.map(x => x.id === c.id ? { ...x, date: e.target.value } : x))} />
                    </div>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <label style={labelStyle}>Credential URL</label>
                    <input style={inputStyle} value={c.credential_url ?? ""} placeholder="https://..."
                      onChange={e => setCerts(cs => cs.map(x => x.id === c.id ? { ...x, credential_url: e.target.value } : x))} />
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                    <button onClick={() => saveCert(c)} style={btnStyle}>Save</button>
                    <button onClick={() => deleteCert(c.id)} style={dangerBtn}>Delete</button>
                  </div>
                </div>
              ))}
              <div style={addCardStyle}>
                <h3 style={{ ...sectionTitle, color: "#ff6b35", fontSize: 14 }}>+ Add Certification</h3>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={labelStyle}>Name *</label>
                    <input style={inputStyle} value={newCert.name ?? ""} placeholder="Google AI Essentials"
                      onChange={e => setNewCert(c => ({ ...c, name: e.target.value }))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Issuer *</label>
                    <input style={inputStyle} value={newCert.issuer ?? ""} placeholder="Google"
                      onChange={e => setNewCert(c => ({ ...c, issuer: e.target.value }))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Date</label>
                    <input style={inputStyle} value={newCert.date ?? ""} placeholder="2024"
                      onChange={e => setNewCert(c => ({ ...c, date: e.target.value }))} />
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Credential URL</label>
                  <input style={inputStyle} value={newCert.credential_url ?? ""} placeholder="https://..."
                    onChange={e => setNewCert(c => ({ ...c, credential_url: e.target.value }))} />
                </div>
                <button onClick={addCert} style={btnStyle}>Add Cert</button>
              </div>
            </div>
          </div>
        )}

        {/* ── CONTACT TAB ──────────────────────────────────────────────────── */}
        {tab === "contact" && (
          <div>
            <p style={{ fontSize: 13, color: "#475569", marginBottom: 20, fontFamily: "monospace" }}>
              Controls contact cards in the footer section (email, GitHub, LinkedIn, etc.)
            </p>

            {contacts.map(c => (
              <div key={c.id} style={{ ...cardStyle, borderLeft: `3px solid ${c.accent}` }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={labelStyle}>Label</label>
                    <input style={inputStyle} value={c.label}
                      onChange={e => setContacts(cs => cs.map(x => x.id === c.id ? { ...x, label: e.target.value } : x))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Display Value</label>
                    <input style={inputStyle} value={c.value}
                      onChange={e => setContacts(cs => cs.map(x => x.id === c.id ? { ...x, value: e.target.value } : x))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Accent Color</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input type="color" value={c.accent}
                        onChange={e => setContacts(cs => cs.map(x => x.id === c.id ? { ...x, accent: e.target.value } : x))}
                        style={{ width: 44, height: 42, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", cursor: "pointer" }} />
                      <input style={{ ...inputStyle, flex: 1 }} value={c.accent}
                        onChange={e => setContacts(cs => cs.map(x => x.id === c.id ? { ...x, accent: e.target.value } : x))} />
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={labelStyle}>HREF (mailto: or https://)</label>
                  <input style={inputStyle} value={c.href}
                    onChange={e => setContacts(cs => cs.map(x => x.id === c.id ? { ...x, href: e.target.value } : x))} />
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => saveContact(c)} style={btnStyle}>Save</button>
                  <button onClick={() => deleteContact(c.id)} style={dangerBtn}>Delete</button>
                </div>
              </div>
            ))}

            <div style={addCardStyle}>
              <h3 style={{ ...sectionTitle, color: "#9d8ff0" }}>+ Add Contact Entry</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={labelStyle}>Label *</label>
                  <input style={inputStyle} value={newContact.label ?? ""} placeholder="Email"
                    onChange={e => setNewContact(c => ({ ...c, label: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Display Value</label>
                  <input style={inputStyle} value={newContact.value ?? ""} placeholder="milanray.dev@gmail.com"
                    onChange={e => setNewContact(c => ({ ...c, value: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Accent Color</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input type="color" value={newContact.accent}
                      onChange={e => setNewContact(c => ({ ...c, accent: e.target.value }))}
                      style={{ width: 44, height: 42, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", cursor: "pointer" }} />
                    <input style={{ ...inputStyle, flex: 1 }} value={newContact.accent ?? "#9d8ff0"}
                      onChange={e => setNewContact(c => ({ ...c, accent: e.target.value }))} />
                  </div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>HREF *</label>
                  <input style={inputStyle} value={newContact.href ?? ""} placeholder="mailto:... or https://..."
                    onChange={e => setNewContact(c => ({ ...c, href: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Display Order</label>
                  <input type="number" style={inputStyle} value={newContact.display_order}
                    onChange={e => setNewContact(c => ({ ...c, display_order: Number(e.target.value) }))} />
                </div>
              </div>
              <button onClick={addContact} style={btnStyle}>Add Contact</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ─── Experience Card sub-component ───────────────────────────────────────────

function ExperienceCard({
  exp, inputStyle, labelStyle, btnStyle, dangerBtn, ghostBtn, cardStyle, onSave, onDelete, onChange,
}: {
  exp: Experience;
  inputStyle: React.CSSProperties;
  labelStyle: React.CSSProperties;
  btnStyle: React.CSSProperties;
  dangerBtn: React.CSSProperties;
  ghostBtn: React.CSSProperties;
  cardStyle: React.CSSProperties;
  onSave: (e: Experience) => void;
  onDelete: (id: string) => void;
  onChange: (e: Experience) => void;
}) {
  return (
    <div style={{ ...cardStyle, borderLeft: `3px solid ${exp.accent}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{
          fontSize: 9, fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.15em",
          textTransform: "uppercase", padding: "2px 8px", borderRadius: 4,
          background: `${exp.accent}15`, color: exp.accent, border: `1px solid ${exp.accent}30`,
        }}>
          {exp.type === "work" ? "⚡ Work" : "🎓 Education"}
        </span>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>{exp.role}</span>
        <span style={{ fontSize: 12, color: "#475569", fontFamily: "monospace" }}>· {exp.org}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div>
          <label style={labelStyle}>Type</label>
          <select style={{ ...inputStyle }} value={exp.type} onChange={e => onChange({ ...exp, type: e.target.value as any })}>
            <option value="work">⚡ Work</option>
            <option value="edu">🎓 Education</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Period</label>
          <input style={inputStyle} value={exp.period} onChange={e => onChange({ ...exp, period: e.target.value })} />
        </div>
        <div>
          <label style={labelStyle}>Accent Color</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input type="color" value={exp.accent} onChange={e => onChange({ ...exp, accent: e.target.value })}
              style={{ width: 44, height: 42, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", cursor: "pointer" }} />
            <input style={{ ...inputStyle, flex: 1 }} value={exp.accent} onChange={e => onChange({ ...exp, accent: e.target.value })} />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div>
          <label style={labelStyle}>Role / Degree</label>
          <input style={inputStyle} value={exp.role} onChange={e => onChange({ ...exp, role: e.target.value })} />
        </div>
        <div>
          <label style={labelStyle}>Organization</label>
          <input style={inputStyle} value={exp.org} onChange={e => onChange({ ...exp, org: e.target.value })} />
        </div>
        <div>
          <label style={labelStyle}>Location</label>
          <input style={inputStyle} value={exp.location} onChange={e => onChange({ ...exp, location: e.target.value })} />
        </div>
      </div>

      {/* Bullet points */}
      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Bullet Points</label>
        {exp.points.map((pt, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, marginBottom: 6 }}>
            <input style={inputStyle} value={pt}
              onChange={e => { const u = [...exp.points]; u[i] = e.target.value; onChange({ ...exp, points: u }); }} />
            <button
              onClick={() => onChange({ ...exp, points: exp.points.filter((_, j) => j !== i) })}
              style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,100,100,0.3)", background: "rgba(255,100,100,0.1)", color: "#ff6b35", cursor: "pointer" }}>✕</button>
          </div>
        ))}
        <button onClick={() => onChange({ ...exp, points: [...exp.points, ""] })} style={ghostBtn}>+ Point</button>
      </div>

      {/* Tags */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Tags (comma separated)</label>
        <input style={inputStyle} defaultValue={exp.tags.join(", ")}
          onBlur={e => onChange({ ...exp, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
          placeholder="Next.js, FastAPI, Docker" />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => onSave(exp)} style={btnStyle}>Save</button>
        <button onClick={() => onDelete(exp.id)} style={dangerBtn}>Delete</button>
      </div>
    </div>
  );
}
