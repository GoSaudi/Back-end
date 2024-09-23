import customerOnboard from "./docHelpers/customer-onboard";
import vendorOnboard from "./docHelpers/vendor-onboard";
import customerConfirm from "./docHelpers/customer-confirm";

export default ({ env }) => {
  return {
    documentation: {
      config: {
        "x-strapi-config": {
          mutateDocumentation: (generatedDocumentationDraft) => {
            generatedDocumentationDraft = vendorOnboard(
              generatedDocumentationDraft
            );
            generatedDocumentationDraft = customerOnboard(
              generatedDocumentationDraft
            );
            generatedDocumentationDraft = customerConfirm(
              generatedDocumentationDraft
            );

            return generatedDocumentationDraft; // Return the modified draft
          },
        },
      },
    },
    email: {
      config: {
        provider: "sendgrid",
        providerOptions: {
          apiKey: env("SENDGRID_API_KEY"),
        },
        settings: {
          defaultFrom: "bnq@go-saudi.com",
          defaultReplyTo: "bnq@go-saudi.com",
        },
      },
    },
    dashboard: {
      enabled: true,
      resolve: "./src/plugins/dashboard",
    },
    upload: {
      config: {
        provider:
          "@strapi-community/strapi-provider-upload-google-cloud-storage",
        providerOptions: {
          bucketName: env("STRAPI_ADMIN_GCS_BUCKET_NAME"),
          publicFiles: true,
          uniform: true,
          serviceAccount: env.json("STRAPI_ADMIN_GCS_SA"),
          baseUrl: "https://storage.googleapis.com/{bucket-name}",
          basePath: "",
        },
      },
    },
  };
};
