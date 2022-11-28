import { DynamoDB } from "aws-sdk";

import { OpenSearchClient } from "./opensearch-client";

interface DynamoDBIndexerProperties {
  dynamoDocumentClient: DynamoDB.DocumentClient;
  dynamodbTableName: string;
  documentIDPrefix: string;
  documentIDField: string;
  openSearchClient: OpenSearchClient;
  remapItem: (
    item: DynamoDB.DocumentClient.AttributeMap
  ) => DynamoDB.DocumentClient.AttributeMap;
}

export class DynamoDBIndexer {
  constructor(private properties: DynamoDBIndexerProperties) {}
  public async addAllRowsToOpenSearchIndex() {
    const allItems = await this.getAllItems();
    const promises: Promise<boolean>[] = [];
    allItems.forEach((item) => {
      const itemID = item[this.properties.documentIDField];
      const documentID = `${this.properties.documentIDPrefix}${itemID}`;
      const remappedItem = this.properties.remapItem(item);
      const promise = this.properties.openSearchClient.addToIndex(
        documentID,
        remappedItem
      );
      promises.push(promise);
    });
    await Promise.all(promises);
  }
  private async getAllItems() {
    const items = [];

    let lastEvaluatedKey = undefined;
    do {
      const scanResults: DynamoDB.DocumentClient.ScanOutput =
        await this.properties.dynamoDocumentClient
          .scan({
            TableName: this.properties.dynamodbTableName,
          })
          .promise();
      lastEvaluatedKey = scanResults.LastEvaluatedKey;
      if (!scanResults.Items) {
        continue;
      }
      for (const item of scanResults.Items) {
        items.push(item);
      }
    } while (lastEvaluatedKey);
    return items;
  }
}
