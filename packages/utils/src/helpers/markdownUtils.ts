import { remark } from "remark";
import html from "remark-html";

export interface MarkdownElements {
  iframes: string[];
  images: string[];
  lottiePlayer: string[];
  videos: string[];
}

export const markdownUtils = {
  /**
   * Extract HTML elements from markdown
   */
  async extractElementsFromMarkdown(markdown: string): Promise<MarkdownElements | null> {
    if (!markdown) return null;

    const processedContent = await remark().use(html).process(markdown);
    const htmlContent = processedContent.toString();

    // Using regex to extract different types of elements
    const imgRegex = /<img [^>]*src="[^"]*"[^>]*>/g;
    const iframeRegex = /<iframe[\s\S]*?<\/iframe>/g;
    const videoRegex = /<video[\s\S]*?<\/video>/g;
    const lottiePlayerRegex = /<lottie-player[\s\S]*?<\/lottie-player>/g;

    return {
      iframes: htmlContent.match(iframeRegex) || [],
      images: htmlContent.match(imgRegex) || [],
      lottiePlayer: htmlContent.match(lottiePlayerRegex) || [],
      videos: htmlContent.match(videoRegex) || [],
    };
  },

  /**
   * Extract plain text from markdown
   */
  extractTextFromMarkdown(markdown: string): string {
    // Remove markdown syntax and return plain text
    return markdown
      .replace(/#+\s/g, "") // Remove headers
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
      .replace(/\*(.*?)\*/g, "$1") // Remove italic
      .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Remove links
      .replace(/`(.*?)`/g, "$1") // Remove inline code
      .replace(/```[\s\S]*?```/g, "") // Remove code blocks
      .trim();
  },

  /**
   * Process markdown to HTML
   */
  async processMarkdown(markdown: string): Promise<string> {
    const processedContent = await remark().use(html).process(markdown);
    return processedContent.toString();
  },
};
