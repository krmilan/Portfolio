// Chat
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  message: string;
  history: ChatMessage[];
}

export interface ChatResponse {
  answer: string;
  sources: string[];
}

// Projects
export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  github_url?: string;
  demo_url?: string;
  featured: boolean;
}

// Skills
export interface Skill {
  name: string;
  category: "frontend" | "backend" | "ai" | "devops" | "database";
  level: "beginner" | "intermediate" | "advanced";
}
