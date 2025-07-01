import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";
import { ArticleFeedDTO } from "./ArticleFeedDTO";
import { ArticleDetailDTO } from "./ArticleDetailDTO";

const articlesDir = path.join(process.cwd(), "articles");
const outputDir = path.join(process.cwd(), "public", "data");

function buildArticleList() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const articles: ArticleFeedDTO[] = fs
    .readdirSync(articlesDir)
    .filter((file) => path.extname(file) === ".md")
    .map((file) => {
      const filePath = path.join(articlesDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);
      return data;
    })
    .map(
      (data) =>
        new ArticleFeedDTO(
          data.title,
          data.excerpt,
          data.created_at,
          data.tags,
        ),
    );

  const articlesList = {
    articles: articles,
  };

  fs.writeFileSync(
    path.join(outputDir, "articles.json"),
    JSON.stringify(articlesList, null, 2),
  );
}

function buildArticleDetailFiles() {
  fs.readdirSync(articlesDir)
    .filter((file) => path.extname(file) === ".md")
    .map((file) => {
      const filePath = path.join(articlesDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);
      return { data, content };
    })
    .map(
      ({ data, content }) =>
        new ArticleDetailDTO(data.title, data.created_at, content, data.tags),
    )
    .forEach((article) => {
      fs.writeFileSync(
        path.join(outputDir, `${article.slug}.json`),
        JSON.stringify(article, null, 2),
      );
    });
}

buildArticleList();
buildArticleDetailFiles();
console.log(`Articles metadata has been written to ${outputDir}`);
