import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { Client } from "@opensearch-project/opensearch";
import { AwsSigv4Signer } from "@opensearch-project/opensearch/aws";
import { DynamoDB } from "aws-sdk";

import { OpenSearchClient } from "../src/opensearch-client";
import { DynamoDBIndexer } from "./../src/dynamodb-indexer";

describe("DynamoDBIndexer exploratory test", () => {
  it("should read from table and add all items to opensearch", async () => {
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

    const openSearchClient = new OpenSearchClient({
      indexName,
      openSearchClient: new Client({
        ...AwsSigv4Signer({
          region: awsRegion,
          // Example with AWS SDK V2:
          getCredentials: defaultProvider(),
        }),
        node: `https://${searchDomainEndpoint}`,
      }),
    });

    const indexer = new DynamoDBIndexer({
      dynamoDocumentClient: new DynamoDB.DocumentClient(),
      dynamodbTableName: "notes-webserver-people",
      documentIDField: "id",
      documentIDPrefix: "person-",
      openSearchClient,
      remapItem: (item: DynamoDB.DocumentClient.AttributeMap) => {
        return {
          ...item,
          owner: item["manager"],
        };
      },
    });

    await indexer.addAllRowsToOpenSearchIndex();
  });
});
