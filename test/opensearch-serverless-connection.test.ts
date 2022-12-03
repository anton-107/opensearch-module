import { OpenSearchServerlessConnection } from "./../src/opensearch-serverless-connection";

describe("OpenSearchServerlessConnection", () => {
  const env = Object.assign({}, process.env);
  const sampleURL = new URL(
    "https://aaaaaaaaaaaaaaaaaa.eu-west-1.aoss.amazon.com"
  );

  beforeEach(() => {
    process.env = Object.assign({}, process.env, {
      AWS_REGION: "eu-west-1",
    });
  });
  afterEach(() => {
    process.env = env;
  });

  it("should throw an error if AWS_REGION is undefined", () => {
    process.env = Object.assign({}, process.env, {
      AWS_REGION: undefined,
    });
    const c = new OpenSearchServerlessConnection({
      url: sampleURL,
    });
    expect(() => c.buildRequestObject({})).toThrow("");
  });
  it("should build request object", () => {
    const c = new OpenSearchServerlessConnection({
      url: sampleURL,
    });
    const request = c.buildRequestObject({});
    expect(request).toBeDefined();
  });
  it("should set content-length to 0 before signing and then set it back", () => {
    const c = new OpenSearchServerlessConnection({
      url: sampleURL,
    });
    const request = c.buildRequestObject({
      headers: {
        "content-length": 250,
      },
    });
    if (!request.headers) {
      throw Error("Expected headers to be set");
    }
    expect(request.headers["content-length"]).toBe(250);
  });
});
