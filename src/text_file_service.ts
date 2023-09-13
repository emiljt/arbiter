import { TFile, Vault } from "obsidian";

export default class TextFileService {
  #vault: Vault;

  constructor(vault: Vault) {
    this.#vault = vault;
  }

  async searchAllFiles(regex: RegExp): Promise<string[] | null> {
    let results: string[] = [];

    for (const file of this.#vault.getFiles()) {
      results = results.concat(await this.searchFile(file, regex));
    }

    return results;
  }

  private async searchFile(file: TFile, regex: RegExp): Promise<string[]> {
    const content: string = await this.#vault.cachedRead(file);
    const matches: RegExpMatchArray | [] = content.match(regex) || [];

    return matches;
  }
}
