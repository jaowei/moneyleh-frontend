import * as S from "@effect/schema/Schema";
import {
  NonEmptyString1000,
  SqliteBoolean,
  id,
  table,
  database,
} from "@evolu/common";
import { createEvolu } from "@evolu/common-web";

const TodoId = id("Todo");
type TodoId = S.Schema.Type<typeof TodoId>;

const TodoTable = table({
  id: TodoId,
  title: NonEmptyString1000,
  isCompleted: SqliteBoolean,
});
type TodoTable = S.Schema.Type<typeof TodoTable>;

const Database = database({
  todo: TodoTable,
});
type Database = S.Schema.Type<typeof Database>;

export const evolu = createEvolu(Database);
