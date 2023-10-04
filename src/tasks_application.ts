import type { Logger } from "./logging_service.js";
import type TextFileService from "./text_file_service.js";

// Bracket task regex (e.g. [ ] Task)
const BRACKET_REGEX = /^[ \t]*\[[ |x]?\][ \t].*$/;
// Markdown task regex (e.g. - [ ] Task)
const MARKDOWN_REGEX = /^[ \t]*\- ?\[[ |x]?\][ \t].*$/;
// Numerated task regex (e.g. 1. [ ] Task)
const NUMERATED_REGEX = /^[ \t]*[0-9]+\.[ \t]?\[[ |x]?\][ \t].*$/;
// TASK task regex (e.g. task: Task)
const TASK_TAG_REGEX = /^[ \t]*task:?[ \t].*$/;
// TODO task regex (e.g. todo: Task)
const TODO_TAG_REGEX = /^[ \t]*todo:?[ \t].*$/;

export default class TasksApplication {
  #logger: Logger;
  subscribers: { (task: string): void }[] = [];

  constructor(logger: Logger) {
    this.#logger = logger;
  }

  registerSubscriber(sub: { (task: string): void }): void {
    this.#logger.debug("registerSubscriber()");
    this.subscribers.push(sub);
  }

  private createTask(task: string) {
    this.#logger.debug(`createTask()`);

    // TODO
    // Create tasks using domain

    // Notify subscribers
    this.publish(task);
  }

  private publish(task: string): void {
    this.#logger.debug(`publish()`);

    for (const sub of this.subscribers) {
      sub(task);
    }
  }

  async sync(text_file_service: TextFileService): Promise<string[]> {
    this.#logger.debug(`sync()`);

    const tasks: string[] = await text_file_service.searchAllFiles([
      BRACKET_REGEX,
      MARKDOWN_REGEX,
      NUMERATED_REGEX,
      TASK_TAG_REGEX,
      TODO_TAG_REGEX,
    ]);

    for (const task of tasks) {
      this.createTask(task);
    }

    return tasks;
  }
}
