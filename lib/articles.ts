import fs from "fs";
import path from "path";

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  originalUrl: string;
  timestamp: string;
  category: string;
  image?: string;
}

const NEWS_DIR = path.join(process.cwd(), "content", "news");

export function getAllArticles(): Article[] {
  if (!fs.existsSync(NEWS_DIR)) return [];

  const files = fs.readdirSync(NEWS_DIR).filter((f) => f.endsWith(".json"));

  const articles = files
    .map((file) => {
      const raw = fs.readFileSync(path.join(NEWS_DIR, file), "utf-8");
      return JSON.parse(raw) as Article;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return articles;
}

export function getArticleBySlug(slug: string): Article | null {
  const articles = getAllArticles();
  return articles.find((a) => a.slug === slug) || null;
}

export function getArticleById(id: string): Article | null {
  const articles = getAllArticles();
  return articles.find((a) => a.id === id) || null;
}
