import { ExecutionEnvironment } from "@/types/executor";
import { ExtractDataWithAiTask } from "../task/ExtractDataWithAiTask";
import { GetCredential } from "@/actions/credentials/getCredential";
import { symmetricDecrypt } from "@/lib/encryption";
import { scrapeWithAI } from "@/huggingFace/huggingfaceExtractor";

export async function ExtractDataWithAIExecutor(
  environment: ExecutionEnvironment<typeof ExtractDataWithAiTask>
) {
  try {
    const credentials = environment.getInput("Credentials");
    if (!credentials) {
      environment.log.error("input->Credentials not found");
      return false;
    }

    const prompt = environment.getInput("Prompt");
    if (!prompt) {
      environment.log.error("input->Prompt not found");
      return false;
    }

    const content = environment.getInput("Content");
    if (!content) {
      environment.log.error("input->Content not found");
      return false;
    }

    // Get credentials from DB
    const credential = await GetCredential(credentials);
    if (!credential) {
      environment.log.error("Credential not found");
      return false;
    }

    const plainCredentialValue = symmetricDecrypt(credential.value);
    if (!plainCredentialValue) {
      environment.log.error("Credential value not found");
      return false;
    }

    // Call Hugging Face API with the decrypted API key
    const extractedData = await scrapeWithAI(content, prompt, plainCredentialValue);

    const result = extractedData.choices[0].message.content
    if (!result) {
      environment.log.error("No result found");
      return false;
    }
    
    environment.log.info(`Prompt tokens: ${extractedData.usage.prompt_tokens} `)
    environment.log.info(`Completion tokens: ${extractedData.usage.completion_tokens} `)

    environment.setOutput("Extracted Data", result);


    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
