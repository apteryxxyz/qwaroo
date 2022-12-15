export interface APIPagination<I> {
    total: number;
    limit: number;
    offset: number;
    items: I[];
}
