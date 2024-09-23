export default (generatedDocumentationDraft) => {
  generatedDocumentationDraft.components.schemas["CustomerOnboardRequest"] = {
    type: "object",
    required: ["email, phone, name, password"],
    properties: {
      email: {
        type: "string",
      },
      name: {
        type: "string",
      },
      phone: {
        type: "string",
      },
      password: {
        type: "string",
      },
    },
  };

  generatedDocumentationDraft.components.schemas["CustomerOnboardResponse"] = {
    type: "object",
    properties: {
      message: {
        type: "string",
      },
    },
  };

  generatedDocumentationDraft.paths["/customer-onboard"] = {
    post: {
      parameters: [],
      operationId: "post/customer-onboard",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CustomerOnboardRequest",
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
                $ref: "#/components/schemas/CustomerOnboardResponse",
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
