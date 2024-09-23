export default (generatedDocumentationDraft) => {
  generatedDocumentationDraft.components.schemas["VendorOnboardRequest"] = {
    type: "object",
    required: ["email, code, password"],
    properties: {
      email: {
        type: "string",
      },
      code: {
        type: "string",
      },
      password: {
        type: "string",
      },
    },
  };

  generatedDocumentationDraft.components.schemas["VendorOnboardResponse"] = {
    type: "object",
    properties: {
      message: {
        type: "string",
      },
    },
  };

  generatedDocumentationDraft.paths["/vendor-onboard"] = {
    post: {
      parameters: [],
      operationId: "post/vendor-onboard",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/VendorOnboardRequest",
            },
          },
        },
      },
      responses: {
        200: {
          description: "OK",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/VendorOnboardResponse",
              },
            },
          },
        },
      },
      tags: ["Vendor"],
    },
  };

  return generatedDocumentationDraft;
};
