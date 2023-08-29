import Id from "./id.js";
import Original from "./original.js";
import Source from "./source.js";

interface Task {
  id: Id;
  source: Source;
  original: Original;
}

export default Task;
