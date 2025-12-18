import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";
import { ArticleFeedDTO } from "./ArticleFeedDTO";
import { ArticleDetailDTO } from "./ArticleDetailDTO";

const articlesDir = path.join(process.cwd(), "articles");
const outputDir = path.join(process.cwd(), "public", "data");

interface FrontmatterData {
  title?: string;
  excerpt?: string;
  created_at?: string;
  tags?: string[];
}

function validateFrontmatter(data: FrontmatterData, filename: string): void {
  const errors: string[] = [];

  if (!data.title || typeof data.title !== "string") {
    errors.push("Missing or invalid title");
  }
  if (!data.excerpt || typeof data.excerpt !== "string") {
    errors.push("Missing or invalid excerpt");
  }
  if (!data.created_at) {
    errors.push("Missing created_at");
  } else {
    const date = new Date(data.created_at);
    if (isNaN(date.getTime())) {
      errors.push(`Invalid date format: ${data.created_at}`);
    }
  }
  if (data.tags && !Array.isArray(data.tags)) {
    errors.push("Tags must be an array");
  }

  if (errors.length > 0) {
    throw new Error(
      `Validation failed for ${filename}:\n  ${errors.join("\n  ")}`,
    );
  }
}

function buildArticleList() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const slugsSeen = new Set<string>();

  const articles: ArticleFeedDTO[] = fs
    .readdirSync(articlesDir)
    .filter((file) => path.extname(file) === ".md")
    .map((file) => {
      const filePath = path.join(articlesDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);

      // Validate frontmatter
      validateFrontmatter(data as FrontmatterData, file);

      return data;
    })
    .map((data) => {
      const dto = new ArticleFeedDTO(
        data.title,
        data.excerpt,
        data.created_at,
        data.tags,
      );

      // Check for duplicate slugs
      if (slugsSeen.has(dto.slug)) {
        throw new Error(`Duplicate slug detected: ${dto.slug}`);
      }
      slugsSeen.add(dto.slug);

      return dto;
    });

  const articlesList = {
    articles: articles,
  };

  fs.writeFileSync(
    path.join(outputDir, "articles.json"),
    JSON.stringify(articlesList, null, 2),
  );

  console.log(`✓ Built article list with ${articles.length} articles`);
}

function buildArticleDetailFiles() {
  const slugsSeen = new Set<string>();

  fs.readdirSync(articlesDir)
    .filter((file) => path.extname(file) === ".md")
    .map((file) => {
      const filePath = path.join(articlesDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      // Validate frontmatter
      validateFrontmatter(data as FrontmatterData, file);

      return { data, content, file };
    })
    .map(({ data, content, file }) => {
      const dto = new ArticleDetailDTO(
        data.title,
        data.created_at,
        content,
        data.tags,
      );

      // Check for duplicate slugs
      if (slugsSeen.has(dto.slug)) {
        throw new Error(`Duplicate slug detected: ${dto.slug} (from ${file})`);
      }
      slugsSeen.add(dto.slug);

      return dto;
    })
    .forEach((article) => {
      fs.writeFileSync(
        path.join(outputDir, `${article.slug}.json`),
        JSON.stringify(article, null, 2),
      );
    });

  console.log(`✓ Built ${slugsSeen.size} article detail files`);
}

try {
  buildArticleList();
  buildArticleDetailFiles();
  console.log(`✓ Articles metadata has been written to ${outputDir}`);
} catch (error) {
  console.error("❌ Build failed:", error);
  process.exit(1);
}
