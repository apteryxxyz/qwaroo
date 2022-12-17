export interface APIItems<I> {
    total: number;
    limit: number;
    skip: number;
    items: I[];
}
