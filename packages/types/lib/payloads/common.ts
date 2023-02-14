export interface APIPage<I = unknown> {
    total: number;
    limit: number;
    offset: number;
    items: I[];
}

export interface FetchPageOptions {
    limit?: number;
    skip?: number;
}
