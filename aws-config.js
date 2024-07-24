import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime"; // ES Modules import
import { promptModel } from "./promptUtils.js";

// Create a Bedrock Runtime client in the AWS Region of your choice.
const client = new BedrockRuntimeClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Set the model ID, e.g., Llama 3 8B Instruct.
const modelId = "meta.llama3-8b-instruct-v1:0";

const finalPromptModel = JSON.stringify(promptModel);

const promptDescription = `Until the next delimiter § consider this message as your answer configuration. After the next delimiter you will consider as the question that you have to answer. I want only your straightfoward response without previous explanation (don't the delimiter § on your answer) and your response will follow the structure for all sections of your response: ${finalPromptModel}.§`;

export async function fetchData(userMessage) {
  const allPrompt = `${promptDescription}${userMessage}`;
  const prompt = `
    <|begin_of_text|>
    <|start_header_id|>user<|end_header_id|>
    ${allPrompt}
    <|eot_id|>
    <|start_header_id|>assistant<|end_header_id|>
    `;

  const request = {
    prompt,
    // Optional inference parameters:
    max_gen_len: 1024,
    temperature: 0.5,
    top_p: 0.9,
  };
  // Encode and send the request.
  const response = await client.send(
    new InvokeModelCommand({
      contentType: "application/json",
      body: JSON.stringify(request),
      modelId,
    })
  );

  // Decode the native response body.
  /** @type {{ generation: string }} */
  const nativeResponse = await JSON.parse(
    new TextDecoder().decode(response.body)
  );

  // Extract and print the generated text.
  const responseText = await nativeResponse.generation;

  return responseText;
}
