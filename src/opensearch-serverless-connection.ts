import { Connection } from "@opensearch-project/opensearch";
import AWS from "aws-sdk";
import aws4, { Request } from "aws4";
import { OutgoingHttpHeader } from "http";

export class OpenSearchServerlessConnection extends Connection {
  buildRequestObject(params: Record<string, unknown>) {
    const awsRegion = process.env["AWS_REGION"];
    if (!awsRegion) {
      throw Error(
        "Please specify AWS_REGION environment variable to make requests to OpenSearch Serverless"
      );
    }

    const request = super.buildRequestObject(params);
    const aossRequest: Request = {};
    Object.assign(aossRequest, request);

    aossRequest.service = "aoss";
    aossRequest.region = awsRegion;

    let contentLength: OutgoingHttpHeader = "0";
    if (aossRequest.headers && aossRequest.headers["content-length"]) {
      contentLength = aossRequest.headers["content-length"];
      aossRequest.headers["content-length"] = "0";
    }
    if (aossRequest.headers) {
      aossRequest.headers["x-amz-content-sha256"] = "UNSIGNED-PAYLOAD";
    }
    const signedRequest = aws4.sign(
      aossRequest,
      AWS.config.credentials || undefined
    );
    if (signedRequest.headers) {
      signedRequest.headers["content-length"] = contentLength;
    }

    return signedRequest;
  }
}
