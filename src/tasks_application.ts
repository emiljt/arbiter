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
  subscribers: { (task: string): void }[] = [];

  constructor() {}

  registerSubscriber(sub: { (task: string): void }): void {
    console.log("Registering subscriber...");
    this.subscribers.push(sub);
    console.log(`Subscriber count: ${this.subscribers.length}`);
  }

  private createTask(task: string) {
    // TODO
    // Create tasks using domain

    // Notify subscribers
    this.publish(task);
  }

  private publish(task: string): void {
    console.log(`Subscriber count: ${this.subscribers.length}`);
    for (const sub of this.subscribers) {
      sub(task);
    }
  }

  async sync(text_file_service: TextFileService): Promise<string[]> {
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
