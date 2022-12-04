"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenSearchServerlessConnection = void 0;
const opensearch_1 = require("@opensearch-project/opensearch");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const aws4_1 = __importDefault(require("aws4"));
class OpenSearchServerlessConnection extends opensearch_1.Connection {
    buildRequestObject(params) {
        const awsRegion = process.env["AWS_REGION"];
        if (!awsRegion) {
            throw Error("Please specify AWS_REGION environment variable to make requests to OpenSearch Serverless");
        }
        const request = super.buildRequestObject(params);
        const aossRequest = {};
        Object.assign(aossRequest, request);
        aossRequest.service = "aoss";
        aossRequest.region = awsRegion;
        let contentLength = "0";
        if (aossRequest.headers && aossRequest.headers["content-length"]) {
            contentLength = aossRequest.headers["content-length"];
            aossRequest.headers["content-length"] = "0";
        }
        if (aossRequest.headers) {
            aossRequest.headers["x-amz-content-sha256"] = "UNSIGNED-PAYLOAD";
        }
        const signedRequest = aws4_1.default.sign(aossRequest, aws_sdk_1.default.config.credentials || undefined);
        if (signedRequest.headers) {
            signedRequest.headers["content-length"] = contentLength;
        }
        return signedRequest;
    }
}
exports.OpenSearchServerlessConnection = OpenSearchServerlessConnection;
