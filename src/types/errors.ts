export class ArticleFetchError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = "ArticleFetchError";
  }
}

export class ArticleNotFoundError extends Error {
  constructor(slug: string) {
    super(`Article not found: ${slug}`);
    this.name = "ArticleNotFoundError";
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unknown error occurred";
}
