import { OpenSearchClient } from "../src/opensearch-client";

describe("OpenSearch client", () => {
  it("should index a document", async () => {
    const client = new OpenSearchClient();
    await client.addToIndex("my-document", {
      name: "This is my document",
      content: "This is document's content",
      owner: "user-1",
    });
  });
});
