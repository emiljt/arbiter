import { TFile, Vault } from "obsidian";
import { Logger } from "./logging_service";

export default class TextFileService {
  #logger: Logger;
  #vault: Vault;

  constructor(logger: Logger, vault: Vault) {
    this.#logger = logger;
    this.#vault = vault;
  }

  async searchAllFiles(expressions: RegExp[]): Promise<string[]> {
    this.#logger.debug(`searchAllFiles()`);

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
    this.#logger.debug(`searchFile()`);

    const content: string = await this.#vault.cachedRead(file);
    const optimizedExpressions: string[] = [];

    for (let expression of expressions) {
      optimizedExpressions.push(
        expression.toString().replace(/^\/\^/, "").replace(/\$\/$/, ""),
      );
    }

    const regex = new RegExp(`^${optimizedExpressions.join("|")}$`, "gmi");
    const matches: RegExpMatchArray | [] = content.match(regex) || [];

    return matches;
  }
}
