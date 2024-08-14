// eslink-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    disciplines: {
      id: string
      name: string
      displayName: string
    }
  }
}
