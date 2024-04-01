import * as S from "@effect/schema/Schema";
import { NonEmptyString1000, id, table, database } from "@evolu/common";
import { createEvolu } from "@evolu/common-web";

export const initDB = () => {
  const EntityId = id("Entity");
  type EntityId = S.Schema.Type<typeof EntityId>;

  const EntityTable = table({
    id: EntityId,
    name: NonEmptyString1000,
  });
  type EntityTable = S.Schema.Type<typeof EntityTable>;

  const Database = database({
    entity: EntityTable,
  });
  type Database = S.Schema.Type<typeof Database>;

  const evolu = createEvolu(Database);

  const entitySeeder = () => {
    const entitySeeds = [
      "DBS",
      "UOB",
      "OCBC",
      "SCB",
      "HSBC",
      "Citi",
      "IBKR",
      "MooMoo",
      "Tiger",
    ];
    for (let seed of entitySeeds) {
      evolu.create("entity", {
        name: S.decodeSync(NonEmptyString1000)(seed),
      });
    }
  };

  const getAllEntities = evolu.createQuery((db) =>
    db.selectFrom("entity").selectAll()
  );

  return { evolu, entitySeeder, getAllEntities };
};
