import type { AxiosInstance } from "axios";
import { HtmlOgParser, type OgMetadata } from "./HtmlOgParser";
import { injectable } from "inversify";

@injectable()
export class HttpOgParser extends HtmlOgParser {
  constructor(private readonly http: AxiosInstance) {
    super();
  }

  async parse(url: string): Promise<OgMetadata | null> {
    const { data } = await this.http.get<OgMetadata | null>(
      `/open-graph/parse?url=${encodeURIComponent(url)}`
    );

    return data;
  }
}
