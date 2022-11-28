"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDBIndexer = void 0;
class DynamoDBIndexer {
    constructor(properties) {
        this.properties = properties;
    }
    async addAllRowsToOpenSearchIndex() {
        const allItems = await this.getAllItems();
        const promises = [];
        allItems.forEach((item) => {
            const itemID = item[this.properties.documentIDField];
            const documentID = `${this.properties.documentIDPrefix}${itemID}`;
            const remappedItem = this.properties.remapItem(item);
            const promise = this.properties.openSearchClient.addToIndex(documentID, remappedItem);
            promises.push(promise);
        });
        await Promise.all(promises);
    }
    async getAllItems() {
        const items = [];
        let lastEvaluatedKey = undefined;
        do {
            const scanResults = await this.properties.dynamoDocumentClient
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
exports.DynamoDBIndexer = DynamoDBIndexer;
