import type {
  IndexBuilderOn,
  IndexColumn,
  MySqlDatetimeConfig,
  MySqlTableWithColumns
} from 'drizzle-orm/mysql-core';
import { datetime, index, int, text } from 'drizzle-orm/mysql-core';
import { BaseSchemaBuilder } from './base';
import { relations, sql } from 'drizzle-orm';

export enum Time {
  Now
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Table = MySqlTableWithColumns<any>;

export interface TimeOpts extends MySqlDatetimeConfig {
  default?: Time;
}

const defaults: Record<Time, unknown> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  [Time.Now]: sql`CURRENT_TIMESTAMP(6)`
};

export class MySqlSchemaBuilder extends BaseSchemaBuilder {
  relation(table: Table) {
    const field = int(`${this.tableName}_id`);
    if (table.id) {
      // eslint-disable-next-line @typescript-eslint/dot-notation, @typescript-eslint/no-unsafe-return
      field.references(() => table.id!, {
        onDelete: 'cascade'
      });
    }
    return field;
  }

  primary() {
    return int('id').primaryKey().autoincrement().notNull();
  }

  str(name: string) {
    return text(name);
  }

  timeDate(name: string, opts: TimeOpts = { fsp: 6 }) {
    const ts = datetime(name, opts);

    if (opts.default) {
      const td = defaults[opts.default];
      ts.default(td);
    }
    return ts;
  }

  indexFor(...names: string[]) {
    return (table: Record<string, IndexColumn>) =>
      names.reduce((acc: Record<string, object>, name) => {
        const indexName = `${name}Idx`;
        const idx: IndexBuilderOn = index(`${this.tableName}_${name}_idx`);
        if (table[name]) {
          const column = table[name]!;
          idx.on(column);
        }
        acc[indexName] = idx;
        return acc;
      }, {});
  }

  oneToMany(parentTable: Table, childTable: Table) {
    relations(childTable, ({ one }) => ({
      user: one(parentTable, {
        fields: [childTable.userId],
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        references: [parentTable.id]
      })
    }));
  }
}
