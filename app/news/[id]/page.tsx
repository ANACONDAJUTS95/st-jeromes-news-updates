import { notFound } from "next/navigation";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import ArticleClient from "./ArticleClient";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({
    id: article.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getArticleBySlug(id);
  if (!article) return { title: "Article Not Found" };

  return {
    title: `${article.title} | Jeromian`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getArticleBySlug(id);

  if (!article) {
    notFound();
  }

  return (
    <>
      <Masthead />
      <ArticleClient article={article} />
      <Footer />
    </>
  );
}
