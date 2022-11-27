"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenSearchClient = void 0;
class OpenSearchClient {
    constructor(properties) {
        this.properties = properties;
    }
    async addToIndex(documentID, document) {
        const response = await this.properties.openSearchClient.index({
            id: documentID,
            index: this.properties.indexName,
            body: document,
            refresh: true,
        });
        if (response.statusCode !== 200 && response.statusCode !== 201) {
            throw Error(`Could not add document to index. Status code: ${response.statusCode}`);
        }
        return true;
    }
    async search(searchQuery, documentOwner, fuzziness = 0) {
        const results = await this.properties.openSearchClient.search({
            index: this.properties.indexName,
            body: {
                query: {
                    bool: {
                        must: [
                            {
                                match: {
                                    owner: {
                                        query: `"${documentOwner}"`,
                                        fuzziness: 0,
                                        fuzzy_transpositions: false,
                                    },
                                },
                            },
                            {
                                multi_match: {
                                    query: searchQuery,
                                    fuzziness,
                                },
                            },
                        ],
                    },
                },
            },
        });
        return results.body.hits;
    }
}
exports.OpenSearchClient = OpenSearchClient;
