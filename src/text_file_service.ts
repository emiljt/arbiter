import { TFile, Vault } from "obsidian";

export default class TextFileService {
  #vault: Vault;

  constructor(vault: Vault) {
    this.#vault = vault;
  }

  async searchAllFiles(expressions: RegExp[]): Promise<string[]> {
    let results: string[] = [];

    for (const file of this.#vault.getFiles()) {
      results = results.concat(await this.searchFile(file, expressions));
    }

    return results;
  }

  private async searchFile(
    file: TFile,
    expressions: RegExp[],
  ): Promise<string[]> {
    console.log(`Searching file: ${file.basename}`);

    const content: string = await this.#vault.cachedRead(file);
    const optimizedExpressions: string[] = [];

    for (let expression of expressions) {
      optimizedExpressions.push(
        expression.toString().replace(/^\/\^/, "").replace(/\$\/$/, ""),
      );
    }

    const regex = new RegExp(`^${optimizedExpressions.join("|")}$`, "gmi");
    const matches: RegExpMatchArray | [] = content.match(regex) || [];

    console.log(`Found ${matches.length} matches for ${regex}`);
    return matches;
  }
}
