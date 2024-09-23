import crypto from "crypto";

export default ({
  iv: ivfromHttpHeader,
  authTag: authTagFromHttpHeader,
  httpBody,
}) => {
  try {
    const secretFromConfiguration = process.env.STRAPI_ADMIN_HP_KEY;

    // Convert data to process
    const key = Buffer.from(secretFromConfiguration, "hex");
    const iv = Buffer.from(ivfromHttpHeader, "hex");
    const authTag = Buffer.from(authTagFromHttpHeader, "hex");
    const cipherText = Buffer.from(httpBody, "hex");

    // Prepare descryption
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(authTag);

    // Decrypt
    const resultBuffer = Buffer.concat([
      decipher.update(cipherText),
      decipher.final(),
    ]);

    //Convert to JSON
    const result = JSON.parse(resultBuffer.toString());
    return { result };
  } catch (error) {
    return { error };
  }
};
