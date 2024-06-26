import { ColumnBaseConfig, ColumnDataType, relations, sql } from 'drizzle-orm';
import type {
  IndexColumn,
  PgColumn,
  PgTableExtraConfig,
  PgTableWithColumns
} from 'drizzle-orm/pg-core';
import type { IndexBuilderOn, PgTimestampConfig } from 'drizzle-orm/pg-core';
import { index, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { BaseSchemaBuilder } from './base';

export enum Time {
  Now
}

export type StrOpts = number | Record<string, unknown>;

export interface TimeOpts extends PgTimestampConfig {
  default?: Time;
}

const defaults: Record<Time, unknown> = {
  [Time.Now]: sql`NOW()`
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Table = PgTableWithColumns<any>;

export class PgSchemaBuilder extends BaseSchemaBuilder {
  relation(table: Table) {
    const field = serial(`${this.tableName}_id`);
    if (table.id) {
      // eslint-disable-next-line @typescript-eslint/dot-notation, @typescript-eslint/no-unsafe-return
      field.references(() => table.id!, {
        onDelete: 'cascade'
      });
    }
    return field;
  }

  primary() {
    return serial('serial').primaryKey().notNull();
  }

  str(name: string, opts: StrOpts = 255) {
    const strOpts = typeof opts == 'number' ? { length: opts } : opts;
    return varchar(name, strOpts);
  }

  timeDate(name: string, opts: TimeOpts = { precision: 6, withTimezone: true }) {
    const ts = timestamp(name, { precision: 6, withTimezone: true });

    if (opts.default) {
      const td = defaults[opts.default];
      ts.default(td);
    }
    return ts;
  }

  indexFor(...names: string[]) {
    return (table: Record<string, IndexColumn>) =>
      names.reduce((acc: PgTableExtraConfig, name) => {
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
