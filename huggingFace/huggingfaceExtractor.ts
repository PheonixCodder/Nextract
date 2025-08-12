import OpenAI from "openai";

export async function scrapeWithAI(content: string, prompt: string, apiKey: string) {
     const client = new OpenAI({
	baseURL: "https://router.huggingface.co/v1",
	apiKey: apiKey,
});

const response = await client.chat.completions.create({
	model: "mistralai/Mistral-7B-Instruct-v0.2:featherless-ai",
    messages: [
        {
            role: "system",
            content: "You are a webscraper helper that extracts data from HTML or text. You will be given a piece of text or HTML content as input and also the prompt with the data you have to extract. The response should always be only the extracted data as a JSON array or object, without any additional words or explanations. Analyze the input carefully and extract data precisely based on the prompt. If no data is found, return an empty JSON array. Work only with the provided content and ensure the output is always a valid JSON array without any surrounding text",
        },
        {
            role: "user",
            content: content,
        },
        {
            role : "user",
            content: prompt,
        }
    ],
    temperature : 0.5,
});
return response

  }