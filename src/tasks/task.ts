import type { Id } from "./id.js";
import type { Original } from "./original.js";
import type { Source } from "./source.js";

interface Task {
  id: Id;
  source: Source;
  original: Original;
}

export type { Task };
