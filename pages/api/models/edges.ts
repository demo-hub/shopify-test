import { LineItem } from "./lineItem";
import { Order } from "./order";

export class Edges {
    cursor: string;
    node: Order | LineItem;
}