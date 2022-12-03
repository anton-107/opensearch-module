# OpenSearch module

Module that can be used to index data and then search for data in OpenSearch

## OpenSearch Serverless

Using @opensearch-project/opensearch client with OpenSearch Serverless is resulting in an AccessDenied error:

```
"reason":"Credential should be scoped to correct service: 'es'
```

To solve this issue you can use `OpenSearchServerlessConnection` class provided in this module. The code in this class is adapted from [AWS Documentation for OpenSearch Serverless](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-clients.html#serverless-javascript).

