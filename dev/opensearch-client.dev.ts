import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { Client } from "@opensearch-project/opensearch";
import { AwsSigv4Signer } from "@opensearch-project/opensearch/aws";

import { OpenSearchClient } from "./../src/opensearch-client";

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
      ...AwsSigv4Signer({
        region: awsRegion,
        // Example with AWS SDK V2:
        getCredentials: defaultProvider(),
      }),
      node: `https://${searchDomainEndpoint}`,
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
    const results = await client.search("anton", "user1");
    // eslint-disable-next-line no-console
    console.log(
      `found results: ${results.hits.length}`,
      JSON.stringify(results)
    );
    expect(results.hits.length).toBeGreaterThan(0);
  });
});
