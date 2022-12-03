import { AWSError, DynamoDB } from "aws-sdk";
import { Request } from "aws-sdk/lib/request";
import { anything, instance, mock, verify, when } from "ts-mockito";

import { DynamoDBIndexer } from "../src/dynamodb-indexer";
import { OpenSearchClient } from "../src/opensearch-client";

describe("DynamoDBIndexer", () => {
  it("should add all rows to opensearch index", async () => {
    const documentClientMock = mock<DynamoDB.DocumentClient>();
    const scanOutputMock =
      mock<Request<DynamoDB.DocumentClient.ScanOutput, AWSError>>();
    when(scanOutputMock.promise()).thenResolve({
      LastEvaluatedKey: undefined,
      Items: [
        {
          id: "item-1",
        },
      ],
      $response: instance(mock()),
    });
    when(documentClientMock.scan(anything())).thenReturn(
      instance(scanOutputMock)
    );

    const openSearchClientMock = mock<OpenSearchClient>();
    const indexer = new DynamoDBIndexer({
      dynamoDocumentClient: instance(documentClientMock),
      dynamodbTableName: "test-table",
      documentIDPrefix: "item-",
      documentIDField: "id",
      openSearchClient: instance(openSearchClientMock),
      remapItem: (item) => {
        return item;
      },
    });
    await indexer.addAllRowsToOpenSearchIndex();
    verify(openSearchClientMock.addToIndex("item-item-1", anything())).once();
  });
  it("should ignore dynamo results when no items are returned", async () => {
    const documentClientMock = mock<DynamoDB.DocumentClient>();
    const scanOutputMock =
      mock<Request<DynamoDB.DocumentClient.ScanOutput, AWSError>>();
    when(scanOutputMock.promise()).thenResolve({
      LastEvaluatedKey: undefined,
      $response: instance(mock()),
    });
    when(documentClientMock.scan(anything())).thenReturn(
      instance(scanOutputMock)
    );

    const openSearchClientMock = mock<OpenSearchClient>();
    const indexer = new DynamoDBIndexer({
      dynamoDocumentClient: instance(documentClientMock),
      dynamodbTableName: "test-table",
      documentIDPrefix: "item-",
      documentIDField: "id",
      openSearchClient: instance(openSearchClientMock),
      remapItem: (item) => {
        return item;
      },
    });
    await indexer.addAllRowsToOpenSearchIndex();
    verify(openSearchClientMock.addToIndex(anything(), anything())).never();
  });
});
