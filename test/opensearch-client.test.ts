/* eslint-disable @typescript-eslint/no-explicit-any */
import { anything, instance, mock, when } from "ts-mockito";

import { OpenSearchClient, OpenSearchMethods } from "../src/opensearch-client";

describe("OpenSearch client", () => {
  it("should index a document", async () => {
    const clientMock = mock<OpenSearchMethods>();
    const client = new OpenSearchClient({
      indexName: "test-index",
      openSearchClient: instance(clientMock),
    });
    when(clientMock.index(anything())).thenResolve({
      statusCode: 201,
    } as any);
    const isSuccess = await client.addToIndex("my-document", {
      name: "This is my document",
      content: "This is document's content",
      owner: "user-1",
    });
    expect(isSuccess).toBe(true);
  });
  it("should throw an error when non-OK status is returned", async () => {
    const clientMock = mock<OpenSearchMethods>();
    const client = new OpenSearchClient({
      indexName: "test-index",
      openSearchClient: instance(clientMock),
    });
    when(clientMock.index(anything())).thenResolve({
      statusCode: 403,
    } as any);
    expect(
      client.addToIndex("my-document", {
        name: "This is my document",
        content: "This is document's content",
        owner: "user-1",
      })
    ).rejects.toStrictEqual(
      Error("Could not add document to index. Status code: 403")
    );
  });
  it("should search for documents through ", async () => {
    const clientMock = mock<OpenSearchMethods>();
    const client = new OpenSearchClient({
      indexName: "test-index",
      openSearchClient: instance(clientMock),
    });
    when(clientMock.search(anything())).thenResolve({
      body: {
        hits: { hits: [{ id: "doc-result-1" }] },
      },
    } as any);
    const results = await client.search("my document", "user-1");
    expect(results.hits[0].id).toBe("doc-result-1");
  });
});
