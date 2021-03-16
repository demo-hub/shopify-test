import { QueryResult } from './graphQLResult';

export class Order {
    id: string;
    tags?: string[];
    lineItems: QueryResult
}