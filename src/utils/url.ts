import { Injectable } from "@nestjs/common";

@Injectable()
export class UrlUtils {
  // Looks for language-specific part of path (any 2 [a-z] letters surrounded by slash) and replacing with slash
  // Example: https://coinmarketcap.com/de/currencies/bitcoin/ -> https://coinmarketcap.com/currencies/bitcoin/
  public toEnglish(url: string) {
    const regex = /(?<language>\/[a-z]{2}\/)/gm;
    const substitution = `\/`;

    return url.replace(regex, substitution);
  }
}
