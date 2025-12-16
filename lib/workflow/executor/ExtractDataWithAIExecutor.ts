// import { ExecutionEnvironment } from "@/types/executor";
// import { ExtractDataWithAiTask } from "../task/ExtractDataWithAI";
// import { GetCredential } from "@/actions/credentials/getCredential";
// import { symmetricDecrypt } from "@/lib/encryption";
// import { scrapeWithAI } from "@/huggingFace/huggingfaceExtractor";

// export async function ExtractDataWithAIExecutor(
//   environment: ExecutionEnvironment<typeof ExtractDataWithAiTask>
// ) {
//   try {
//     const credentials = environment.getInput("Credentials");
//     if (!credentials) {
//       environment.log.error("input->Credentials not found");
//       return false;
//     }

//     const prompt = environment.getInput("Prompt");
//     if (!prompt) {
//       environment.log.error("input->Prompt not found");
//       return false;
//     }

//     const content = environment.getInput("Content");
//     if (!content) {
//       environment.log.error("input->Content not found");
//       return false;
//     }

//     // Get credentials from DB
//     const credential = await GetCredential(credentials);
//     if (!credential) {
//       environment.log.error("Credential not found");
//       return false;
//     }

//     const plainCredentialValue = symmetricDecrypt(credential.value);
//     if (!plainCredentialValue) {
//       environment.log.error("Credential value not found");
//       return false;
//     }

//     // Call Hugging Face API with the decrypted API key
//     const extractedData = await scrapeWithAI(content, prompt, plainCredentialValue);

//     const result = extractedData.choices[0].message.content
//     if (!result) {
//       environment.log.error("No result found");
//       return false;
//     }

//     environment.log.info(`Prompt tokens: ${extractedData.usage.prompt_tokens} `)
//     environment.log.info(`Completion tokens: ${extractedData.usage.completion_tokens} `)

//     environment.setOutput("Extracted Data", result);

//     return true;
//   } catch (error: any) {
//     environment.log.error(error.message);
//     return false;
//   }
// }

import { ExecutionEnvironment } from "@/types/executor";
import { ExtractDataWithAITask } from "../task/ExtractDataWithAI";
import prisma from "@/lib/prisma";
import { symmetricDecrypt } from "@/lib/encryption";
import OpenAI from "openai";
import { scrapeWithAI } from "@/huggingFace/huggingfaceExtractor";

export async function ExtractDataWithAIExecutor(
  environment: ExecutionEnvironment<typeof ExtractDataWithAITask>
): Promise<boolean> {
  try {
    const credentials = environment.getInput("Credentials");
    if (!credentials) {
      environment.log.error("Input Credentials is required");
      return false;
    }
    const prompt = environment.getInput("Prompt");
    if (!prompt) {
      environment.log.error("Input Prompt is required");
      return false;
    }
    const content = environment.getInput("Content");
    if (!content) {
      environment.log.error("Input Content is required");
      return false;
    } // Extract API key from credentials (now properly formatted by credential system)
    let apiKey: string;
    try {
      // Try to parse as JSON first (for structured API credentials)
      const apiConfig = JSON.parse(credentials);
      apiKey = apiConfig.apiKey || apiConfig.key;

      if (!apiKey) {
        environment.log.error("API key not found in structured credentials");
        return false;
      }
    } catch {
      // If parsing fails, treat credentials as plain API key string
      apiKey = credentials;
    }

    const extractedData = await scrapeWithAI(content, prompt, apiKey);

    environment.log.info(`Prompt token ${extractedData.usage?.prompt_tokens}`);
    environment.log.info(
      `Completion token ${extractedData.usage?.completion_tokens}`
    );
    const result = extractedData.choices[0].message.content;
    if (!result) {
      environment.log.error("Empty response from AI");
      return false;
    }
    environment.setOutput("Extracted data", result);
    return true;
  } catch (e: any) {
    environment.log.error(e.message);
    return false;
  }
}
