"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { type Profile, type Project, type Skill, type ExtraLink } from "@/lib/content";

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [pw, setPw] = useState("");
  const [tab, setTab] = useState<"profile" | "projects" | "skills">("profile");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    accent_color: "#9d8ff0", visible: true, display_order: 99,
  });

  useEffect(() => {
    const stored = sessionStorage.getItem("admin_authed");
    setAuthed(stored === "true");
  }, []);

  useEffect(() => {
    if (!authed) return;
    supabase.from("profile").select("*").eq("id", 1).single().then(({ data }) => { if (data) setProfile(data); });
    supabase.from("projects").select("*").order("display_order").then(({ data }) => { if (data) setProjects(data); });
    supabase.from("skills").select("*").order("display_order").then(({ data }) => { if (data) setSkills(data); });
  }, [authed]);

  function flash(m: string) { setMsg(m); setTimeout(() => setMsg(""), 3000); }

  function login() {
    const PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "admin123";
    if (pw === PASS) {
      sessionStorage.setItem("admin_authed", "true");
      setAuthed(true);
    } else {
      flash("Wrong password");
    }
  }

  async function saveProfile() {
    setSaving(true);
    const { error } = await supabase.from("profile")
      .update({ ...profile, updated_at: new Date().toISOString() })
      .eq("id", 1);
    setSaving(false);
    flash(error ? `Error: ${error.message}` : "Profile saved ✓");
  }

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
    if (!newProject.title || !newProject.description) {
      flash("Title and description required"); return;
    }
    setSaving(true);
    const { data, error } = await supabase.from("projects")
      .insert({ ...newProject, tags: (newProject.tags as any) || [] })
      .select().single();
    setSaving(false);
    if (error) { flash(`Error: ${error.message}`); return; }
    setProjects(p => [...p, data]);
    setNewProject({ accent_color: "#9d8ff0", visible: true, display_order: 99 });
    flash("Project added ✓");
  }

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

  const [newSkill, setNewSkill] = useState({ category: "", color: "#9d8ff0", display_order: 99 });

  async function addSkill() {
    if (!newSkill.category) { flash("Category name required"); return; }
    setSaving(true);
    const { data, error } = await supabase.from("skills")
      .insert({ ...newSkill, items: [] }).select().single();
    setSaving(false);
    if (error) { flash(`Error: ${error.message}`); return; }
    setSkills(s => [...s, data]);
    setNewSkill({ category: "", color: "#9d8ff0", display_order: 99 });
    flash("Skill category added ✓");
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
    const { data, error } = await supabase.from("skills")
      .insert({ ...newSkill, items: [] })
      .select().single();
    setSaving(false);
    if (error) { flash(`Error: ${error.message}`); return; }
    setSkills(s => [...s, data]);
    setNewSkill({ category: "", color: "#9d8ff0", display_order: 99 });
    flash("Skill category added ✓");
  }

  // Styles
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
    ...btnStyle,
    background: "rgba(255,100,100,0.15)",
    color: "#ff6b35",
    border: "1px solid rgba(255,100,100,0.3)",
  };
  const ghostBtn: React.CSSProperties = {
    ...btnStyle,
    background: "rgba(255,255,255,0.06)",
    color: "#94a3b8",
    border: "1px solid rgba(255,255,255,0.1)",
  };

  // Loading
  if (authed === null) return (
    <div style={{ minHeight: "100vh", background: "#080810", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#9d8ff0", animation: "glow-pulse 1s ease-in-out infinite" }} />
    </div>
  );

  // Login gate
  if (!authed) return (
    <div style={{ minHeight: "100vh", background: "#080810", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "DM Sans, sans-serif" }}>
      <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: 40, width: 340 }}>
        <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 24, fontWeight: 800, color: "white", marginBottom: 8 }}>Admin</h1>
        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>Enter password to continue</p>
        <input
          type="password" value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") login(); }}
          placeholder="Password"
          style={{ ...inputStyle, marginBottom: 12 }}
        />
        <button onClick={login} style={{ ...btnStyle, width: "100%", padding: "12px" }}>
          Enter
        </button>
        {msg && (
          <p style={{ color: "#ff6b35", fontSize: 13, marginTop: 12, textAlign: "center" }}>{msg}</p>
        )}
      </div>
    </div>
  );

  // Admin panel
  return (
    <div style={{ minHeight: "100vh", background: "#080810", color: "#e2e8f0", fontFamily: "DM Sans, sans-serif" }}>

      {/* Header */}
      <div style={{
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "16px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(255,255,255,0.02)",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/" style={{ color: "#64748b", textDecoration: "none", fontSize: 13 }}>← Portfolio</a>
          <span style={{ color: "#475569" }}>·</span>
          <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 18, color: "white" }}>
            Admin Panel
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {msg && (
            <span style={{ fontSize: 13, color: msg.includes("Error") ? "#ff6b35" : "#00ffaa" }}>
              {msg}
            </span>
          )}
          {saving && <span style={{ fontSize: 13, color: "#9d8ff0" }}>Saving...</span>}
          <button
            onClick={() => { sessionStorage.removeItem("admin_authed"); setAuthed(false); }}
            style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#64748b", cursor: "pointer", fontSize: 13 }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: 4, marginBottom: 32,
          background: "rgba(255,255,255,0.03)", padding: 4,
          borderRadius: 12, width: "fit-content",
          border: "1px solid rgba(255,255,255,0.07)",
        }}>
          {(["profile", "projects", "skills"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "8px 20px", borderRadius: 9, border: "none", cursor: "pointer",
              background: tab === t ? "linear-gradient(135deg, #7c6fcd, #9d8ff0)" : "transparent",
              color: tab === t ? "white" : "#64748b",
              fontWeight: 600, fontSize: 13,
              fontFamily: "DM Sans, sans-serif",
              textTransform: "capitalize",
            }}>{t}</button>
          ))}
        </div>

        {/* ── PROFILE TAB ── */}
        {tab === "profile" && (
          <div style={cardStyle}>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 18, color: "white", marginBottom: 24 }}>
              Profile
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              {([["Name", "name"], ["Email", "email"], ["GitHub URL", "github_url"], ["LinkedIn URL", "linkedin_url"], ["Resume URL", "resume_url"], ["Avatar URL", "avatar_url"]] as [string, string][]).map(([label, key]) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input
                    style={inputStyle}
                    value={(profile as any)[key] ?? ""}
                    placeholder={key === "avatar_url" ? "https://..." : ""}
                    onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Bio</label>
              <textarea
                style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
                value={profile.bio ?? ""}
                onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Roles (comma separated)</label>
              <input
                style={inputStyle}
                value={(profile.roles ?? []).join(", ")}
                onChange={e => setProfile(p => ({ ...p, roles: e.target.value.split(",").map(r => r.trim()).filter(Boolean) }))}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: "#94a3b8" }}>
                <input
                  type="checkbox"
                  checked={profile.open_to_work ?? true}
                  onChange={e => setProfile(p => ({ ...p, open_to_work: e.target.checked }))}
                />
                Open to Work
              </label>
            </div>

            {/* Extra links */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Extra Links (HackerRank, LeetCode, etc.)</label>
              {(profile.extra_links ?? []).map((link: ExtraLink, i: number) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr auto", gap: 8, marginBottom: 8 }}>
                  <input style={inputStyle} value={link.label} placeholder="Label"
                    onChange={e => { const u = [...(profile.extra_links ?? [])]; u[i] = { ...link, label: e.target.value }; setProfile(p => ({ ...p, extra_links: u })); }} />
                  <input style={inputStyle} value={link.url} placeholder="URL"
                    onChange={e => { const u = [...(profile.extra_links ?? [])]; u[i] = { ...link, url: e.target.value }; setProfile(p => ({ ...p, extra_links: u })); }} />
                  <input style={inputStyle} value={link.icon} placeholder="Icon (linkedin/hackerrank/leetcode)"
                    onChange={e => { const u = [...(profile.extra_links ?? [])]; u[i] = { ...link, icon: e.target.value }; setProfile(p => ({ ...p, extra_links: u })); }} />
                  <button
                    onClick={() => setProfile(p => ({ ...p, extra_links: (p.extra_links ?? []).filter((_, j) => j !== i) }))}
                    style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,100,100,0.3)", background: "rgba(255,100,100,0.1)", color: "#ff6b35", cursor: "pointer" }}
                  >✕</button>
                </div>
              ))}
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button onClick={() => setProfile(p => ({ ...p, extra_links: [...(p.extra_links ?? []), { label: "", url: "", icon: "" }] }))} style={ghostBtn}>
                  + Add Link
                </button>
                <button onClick={saveProfile} style={btnStyle} disabled={saving}>
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── PROJECTS TAB ── */}
        {tab === "projects" && (
          <div>
            {projects.map(p => (
              <div key={p.id} style={cardStyle}>
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
                  <div>
                    <label style={labelStyle}>Display Order</label>
                    <input type="number" style={inputStyle} value={p.display_order}
                      onChange={e => setProjects(ps => ps.map(x => x.id === p.id ? { ...x, display_order: Number(e.target.value) } : x))} />
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
                  <input style={inputStyle} value={p.tags.join(", ")}
                    onChange={e => setProjects(ps => ps.map(x => x.id === p.id ? { ...x, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) } : x))} />
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => saveProject(p)} style={btnStyle}>Save</button>
                  <button onClick={() => deleteProject(p.id)} style={dangerBtn}>Delete</button>
                </div>
              </div>
            ))}

            {/* Add new project */}
            <div style={{ ...cardStyle, border: "1px dashed rgba(157,143,240,0.3)" }}>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 16, color: "#9d8ff0", marginBottom: 20 }}>
                + Add New Project
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={labelStyle}>Title *</label>
                  <input style={inputStyle} value={newProject.title ?? ""}
                    onChange={e => setNewProject(p => ({ ...p, title: e.target.value }))} />
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
                  <input style={inputStyle} value={newProject.github_url ?? ""}
                    onChange={e => setNewProject(p => ({ ...p, github_url: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Live Demo URL</label>
                  <input style={inputStyle} value={newProject.live_url ?? ""} placeholder="https://..."
                    onChange={e => setNewProject(p => ({ ...p, live_url: e.target.value }))} />
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Description *</label>
                <textarea style={{ ...inputStyle, minHeight: 70, resize: "vertical" }} value={newProject.description ?? ""}
                  onChange={e => setNewProject(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Tags (comma separated)</label>
                <input style={inputStyle}
                  value={Array.isArray(newProject.tags) ? (newProject.tags as string[]).join(", ") : ""}
                  onChange={e => setNewProject(p => ({ ...p, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) as any }))} />
              </div>
              <button onClick={addProject} style={btnStyle}>Add Project</button>
            </div>
          </div>
        )}

        {/* ── SKILLS TAB ── */}
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

                <label style={labelStyle}>Skills</label>
                {s.items.map((item, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "3fr 1fr auto", gap: 8, marginBottom: 8 }}>
                    <input style={inputStyle} value={item.name} placeholder="Skill name"
                      onChange={e => { const u = [...s.items]; u[i] = { ...item, name: e.target.value }; setSkills(ss => ss.map(x => x.id === s.id ? { ...x, items: u } : x)); }} />
                    <input type="number" min={0} max={100} style={inputStyle} value={item.pct}
                      onChange={e => { const u = [...s.items]; u[i] = { ...item, pct: Number(e.target.value) }; setSkills(ss => ss.map(x => x.id === s.id ? { ...x, items: u } : x)); }} />
                    <button
                      onClick={() => setSkills(ss => ss.map(x => x.id === s.id ? { ...x, items: x.items.filter((_, j) => j !== i) } : x))}
                      style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,100,100,0.3)", background: "rgba(255,100,100,0.1)", color: "#ff6b35", cursor: "pointer" }}
                    >✕</button>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                  <button
                    onClick={() => setSkills(ss => ss.map(x => x.id === s.id ? { ...x, items: [...x.items, { name: "", pct: 80 }] } : x))}
                    style={ghostBtn}
                  >+ Skill</button>
                  <button onClick={() => saveSkill(s)} style={btnStyle}>Save</button>
                  <button onClick={() => deleteSkill(s.id)} style={dangerBtn}>Delete Category</button>
                </div>
              </div>
            ))}
            {/* Add new skill category */}
            <div style={{ ...cardStyle, border: "1px dashed rgba(157,143,240,0.3)" }}>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 16, color: "#9d8ff0", marginBottom: 20 }}>
                + Add Skill Category
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Category Name *</label>
                  <input style={inputStyle} value={newSkill.category} placeholder="e.g. DevOps"
                    onChange={e => setNewSkill(s => ({ ...s, category: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Color</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input type="color" value={newSkill.color}
                      onChange={e => setNewSkill(s => ({ ...s, color: e.target.value }))}
                      style={{ width: 44, height: 42, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", cursor: "pointer" }} />
                    <input style={{ ...inputStyle, flex: 1 }} value={newSkill.color}
                      onChange={e => setNewSkill(s => ({ ...s, color: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Display Order</label>
                  <input type="number" style={inputStyle} value={newSkill.display_order}
                    onChange={e => setNewSkill(s => ({ ...s, display_order: Number(e.target.value) }))} />
                </div>
              </div>
              <button onClick={addSkill} style={btnStyle}>Add Category</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}