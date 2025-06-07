import yaml from 'js-yaml';

export function parseFrontMatter(markdownWithFrontMatter: string): { frontMatter: Record<string, any>, content: string } {
  let contentToParse = markdownWithFrontMatter;
  // Strip BOM if present
  if (contentToParse.startsWith('\uFEFF')) {
    contentToParse = contentToParse.substring(1);
  }

  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = frontMatterRegex.exec(contentToParse);

  if (match && match[1] && match[2]) {
    const yamlPart = match[1];
    const contentPart = match[2];
    try {
      // Use js-yaml to parse the front matter. Ensure result is an object.
      const loadedYaml = yaml.load(yamlPart);
      const frontMatter = (typeof loadedYaml === 'object' && loadedYaml !== null) ? loadedYaml as Record<string, any> : {};
      return { frontMatter, content: contentPart.trimStart() };
    } catch (e: any) {
      console.error("Error parsing front matter with js-yaml:", e.message);
      // In case of parsing error, return empty frontMatter and the original content minus the delimiters if possible,
      // or full content if regex match was problematic.
      return { frontMatter: {}, content: contentPart.trimStart() || contentToParse };
    }
  }

  // No front matter found or regex mismatch, return original content with empty frontMatter
  return { frontMatter: {}, content: contentToParse };
}
