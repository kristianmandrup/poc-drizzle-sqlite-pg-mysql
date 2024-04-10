import { ColumnBaseConfig, ColumnDataType, sql } from 'drizzle-orm';
import type { IndexColumn, PgColumn } from 'drizzle-orm/pg-core';
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

export class PgSchemaBuilder extends BaseSchemaBuilder {
  relation(
    table: Record<string, PgColumn<ColumnBaseConfig<ColumnDataType, string>, object, object>>
  ) {
    const field = serial(`${this.tableName}_id`);
    if (table.id) {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      field.references(() => table['id']!, {
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

  indexFor(names: string[]) {
    return (table: Record<string, IndexColumn>) =>
      names.reduce((acc: Record<string, unknown>, name) => {
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
}
