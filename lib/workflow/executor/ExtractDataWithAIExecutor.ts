import { ExecutionEnvironment } from "@/types/executor";
import { ExtractDataWithAiTask } from "../task/ExtractDataWithAiTask";
import { GetCredential } from "@/actions/credentials/getCredential";
import { symmetricDecrypt } from "@/lib/encryption";

export async function ExtractDataWithAIExecutor(
  environment: ExecutionEnvironment<typeof ExtractDataWithAiTask>
) {
  try {
    const credentials = environment.getInput('Credentials');
    if (!credentials) {
      environment.log.error('input->Credentials not found');
    }
    const prompt = environment.getInput('Prompt');
    if (!prompt) {
      environment.log.error('input->Prompt not found');
    }
    const content = environment.getInput('Content');
    if (!content) {
      environment.log.error('input->Content not found');
    }

    // Get credentials from DB
    const credential= await GetCredential(credentials);

    if (!credential) {
      environment.log.error('Credential not found');
      return false
    }

    const plainCredentialValue = symmetricDecrypt(credential.value)

    if (!plainCredentialValue) {
      environment.log.error('Credential value not found');
      return false
    }

    const mockExtractedData = {}

    environment.setOutput('Extracted Data', JSON.stringify(mockExtractedData))

    return true
  } catch (error: any) {
    environment.log.error(error.message)
    return false;
  }
}
