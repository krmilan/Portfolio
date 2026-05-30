import { supabase } from "./supabase";

export interface ExtraLink {
  label: string;
  url: string;
  icon: string;
}

export interface Profile {
  id: number;
  name: string;
  bio: string;
  avatar_url: string;
  roles: string[];
  open_to_work: boolean;
  github_url: string;
  linkedin_url: string;
  email: string;
  resume_url: string;
  extra_links: ExtraLink[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  accent_color: string;
  github_url: string;
  live_url: string;
  display_order: number;
  visible: boolean;
}

export interface SkillItem {
  name: string;
  pct: number;
}

export interface Skill {
  id: string;
  category: string;
  color: string;
  display_order: number;
  items: SkillItem[];
}

export async function getProfile(): Promise<Profile | null> {
  const { data } = await supabase.from("profile").select("*").eq("id", 1).single();
  return data;
}

export async function getProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("visible", true)
    .order("display_order");
  return data ?? [];
}

export async function getSkills(): Promise<Skill[]> {
  const { data } = await supabase
    .from("skills")
    .select("*")
    .order("display_order");
  return data ?? [];
}