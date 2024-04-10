import { sql } from 'drizzle-orm';
import type {
  IndexBuilderOn,
  IndexColumn,
  SQLiteColumn,
  SQLiteTableWithColumns
} from 'drizzle-orm/sqlite-core';
import { index, integer, text } from 'drizzle-orm/sqlite-core';
import { BaseSchemaBuilder } from './base';

export enum Time {
  Now
}

const defaults: Record<Time, unknown> = {
  [Time.Now]: sql`CURRENT_TIMESTAMP`
};

export interface TimeOpts {
  default?: Time;
}

export interface TableConfig {
  name: string;
  schema: string | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: Record<string, SQLiteColumn<any, object>>;
  dialect: string;
}

export class SQLiteSchemaBuilder extends BaseSchemaBuilder {
  // SQLiteTableWithColumns<TableConfig>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  relation(table: SQLiteTableWithColumns<any>) {
    const field = integer(`${this.tableName}_id`);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (table.id) {
      // eslint-disable-next-line @typescript-eslint/dot-notation, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      field.references(() => table['id']!, {
        onDelete: 'cascade'
      });
    }
    return field;
  }

  timeDate(name: string, opts: TimeOpts = {}) {
    const ts = text(name);

    if (opts.default) {
      const td = defaults[opts.default];
      ts.default(td);
    }
    return ts;
  }

  indexFor(names: string[]) {
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

  primary() {
    return integer('id').primaryKey().notNull();
  }

  str(name: string) {
    return text(name);
  }
}
