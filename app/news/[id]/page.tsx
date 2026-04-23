import { notFound } from "next/navigation";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import ArticleClient from "./ArticleClient";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";

export function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    id: article.slug,
  }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const article = getArticleBySlug(params.id);
  if (!article) return { title: "Article Not Found" };

  return {
    title: `${article.title} | Jeromian`,
    description: article.excerpt,
  };
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  const article = getArticleBySlug(params.id);

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
