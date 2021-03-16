import { QueryResult } from './queryResult';

export class Order {
    id: string;
    tags?: string[];
    lineItems: QueryResult;
}