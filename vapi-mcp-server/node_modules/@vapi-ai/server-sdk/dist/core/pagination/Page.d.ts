/**
 * A page of results from a paginated API.
 *
 * @template T The type of the items in the page.
 */
export declare class Page<T> implements AsyncIterable<T> {
    data: T[];
    private response;
    private _hasNextPage;
    private getItems;
    private loadNextPage;
    constructor({ response, hasNextPage, getItems, loadPage, }: {
        response: unknown;
        hasNextPage: (response: unknown) => boolean;
        getItems: (response: unknown) => T[];
        loadPage: (response: unknown) => Promise<any>;
    });
    /**
     * Retrieves the next page
     * @returns this
     */
    getNextPage(): Promise<this>;
    /**
     * @returns whether there is a next page to load
     */
    hasNextPage(): boolean;
    private iterMessages;
    [Symbol.asyncIterator](): AsyncIterator<T, void, any>;
}
