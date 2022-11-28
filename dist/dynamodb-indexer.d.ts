import { DynamoDB } from "aws-sdk";
import { OpenSearchClient } from "./opensearch-client";
interface DynamoDBIndexerProperties {
    dynamoDocumentClient: DynamoDB.DocumentClient;
    dynamodbTableName: string;
    documentIDPrefix: string;
    documentIDField: string;
    openSearchClient: OpenSearchClient;
    remapItem: (item: DynamoDB.DocumentClient.AttributeMap) => DynamoDB.DocumentClient.AttributeMap;
}
export declare class DynamoDBIndexer {
    private properties;
    constructor(properties: DynamoDBIndexerProperties);
    addAllRowsToOpenSearchIndex(): Promise<void>;
    private getAllItems;
}
export {};
