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

export class OpenSearchClient {
  constructor(private properties: OpenSearchClientProperties) {}
  public async addToIndex(
    documentID: string,
    document: OpenSearchDocument
  ): Promise<boolean> {
    const response = await this.properties.openSearchClient.index({
      id: documentID,
      index: this.properties.indexName,
      body: document,
      refresh: true,
    });

    if (response.statusCode !== 200 && response.statusCode !== 201) {
      throw Error(
        `Could not add document to index. Status code: ${response.statusCode}`
      );
    }

    return true;
  }
  public async search(
    searchQuery: string,
    documentOwner: string,
    fuzziness = 0
  ) {
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
