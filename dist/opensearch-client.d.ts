import { Client } from "@opensearch-project/opensearch";
export type OpenSearchDocument = Record<string, string>;
export interface OpenSearchMethods {
    index: Client["index"];
    search: Client["search"];
}
interface OpenSearchClientProperties {
    indexName: string;
    openSearchClient: OpenSearchMethods;
}
export declare class OpenSearchClient {
    private properties;
    constructor(properties: OpenSearchClientProperties);
    addToIndex(documentID: string, document: OpenSearchDocument): Promise<boolean>;
    search(searchQuery: string, documentOwner: string, fuzziness?: number): Promise<any>;
}
export {};
