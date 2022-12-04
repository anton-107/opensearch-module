import { Connection } from "@opensearch-project/opensearch";
import aws4 from "aws4";
export declare class OpenSearchServerlessConnection extends Connection {
    buildRequestObject(params: Record<string, unknown>): aws4.Request;
}
