import { Client } from "@opensearch-project/opensearch";

import { OpenSearchClient } from "./../src/opensearch-client";
import { OpenSearchServerlessConnection } from "./../src/opensearch-serverless-connection";

describe("OpenSearch exploratory test", () => {
  let client: OpenSearchClient;
  beforeAll(() => {
    const awsRegion = process.env["AWS_REGION"];
    const searchDomainEndpoint = process.env["SEARCH_DOMAIN_ENDPOINT"];
    const indexName = process.env["SEARCH_INDEX_NAME"];
    if (!awsRegion) {
      throw Error("Please specify AWS_REGION environment variable");
    }
    if (!searchDomainEndpoint) {
      throw Error("Please specify SEARCH_DOMAIN_ENDPOINT environment variable");
    }
    if (!indexName) {
      throw Error("Please specify SEARCH_INDEX_NAME environment variable");
    }

    const openSearchClient = new Client({
      node: `https://${searchDomainEndpoint}/`,
      Connection: OpenSearchServerlessConnection,
    });

    client = new OpenSearchClient({
      openSearchClient,
      indexName,
    });
  });

  it("should index a document", async () => {
    const result = await client.addToIndex("user-1_document4", {
      name: "This is fourth my document",
      content: "This is fourth document's content",
      owner: "user-1",
    });
    expect(result).toBe(true);
  });
  it.only("should search for a document", async () => {
    const results = await client.search("stream", "user1");
    // eslint-disable-next-line no-console
    console.log(
      `found results: ${results.hits.length}`,
      JSON.stringify(results)
    );
    expect(results.hits.length).toBeGreaterThan(0);
  });
});
