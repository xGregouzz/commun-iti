import { injectable } from "inversify";

export interface OgMetadata {
  domain: string;
  title?: string;
  description?: string;
  imageUrl?: string;
}

@injectable()
export abstract class HtmlOgParser {
  abstract parse(url: string): Promise<OgMetadata | null>;
}
