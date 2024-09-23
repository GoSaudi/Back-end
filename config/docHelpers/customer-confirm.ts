export default (generatedDocumentationDraft) => {
  generatedDocumentationDraft.components.schemas["CustomerConfirmRequest"] = {
    type: "object",
    required: ["email, code"],
    properties: {
      email: {
        type: "string",
      },
      code: {
        type: "string",
      },
    },
  };

  generatedDocumentationDraft.components.schemas["CustomerConfirmResponse"] = {
    type: "object",
    properties: {
      message: {
        type: "string",
      },
    },
  };

  generatedDocumentationDraft.paths["/customer-onboard/confirm"] = {
    post: {
      parameters: [],
      operationId: "post/customer-onboard/confirm",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CustomerConfirmRequest",
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
                $ref: "#/components/schemas/CustomerConfirmResponse",
              },
            },
          },
        },
      },
      tags: ["Customer"],
    },
  };

  return generatedDocumentationDraft;
};
