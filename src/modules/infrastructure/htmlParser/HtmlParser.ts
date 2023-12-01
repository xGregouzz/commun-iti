import { parse } from "node-html-parser";
import * as axios from "axios";

export class HTMLParser {
  async parseUrl(url: string) {
    const now = Date.now();
    const regex = /^.*(<head>.*<\/head>).*$/gims;
    const html = await axios.default.get(url);

    const match = regex.exec(html.data);
    if (match) {
      const res = parse(match[1]).querySelectorAll("meta[property^=og:]");

      const after = Date.now();
      console.log(match[1]);
      console.log(after - now);
      return res;
    }
  }
}
