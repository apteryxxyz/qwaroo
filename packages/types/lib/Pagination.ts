export interface Pagination<T> {
    /** The number of the previous page. */
    previousPage: number | null;
    /** The number of the current page. */
    currentPage: number;
    /** The number of the next page. */
    nextPage: number | null;
    /** The total number of pages. */
    pageCount: number;
    /** The total number of items. */
    itemCount: number;
    /** The items on the current page. */
    items: T[];
}
