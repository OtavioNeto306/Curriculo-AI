import { GoogleGenAI } from "@google/genai";
import { ResumeData, LLMProvider } from "../types";

// Helper to clean JSON
const cleanJson = (text: string) => {
    let cleanText = text.trim();
    if (cleanText.startsWith("```json")) {
        cleanText = cleanText.replace(/^```json/, "").replace(/```$/, "");
    } else if (cleanText.startsWith("```")) {
        cleanText = cleanText.replace(/^```/, "").replace(/```$/, "");
    }
    return cleanText;
};

// Prompt (Shared)
const getPrompt = (data: ResumeData) => `
    You are an elite professional resume writer. I will provide you with raw resume data in JSON format.
    Your task is to output a CLEAN, VALID JSON object with enhanced content.

    CRITICAL INSTRUCTIONS - READ CAREFULLY:
    1. **NO META-COMMENTARY**: Never include explanations, notes, or justifications. The output must be PURE DATA strings.
    2. **Summary**: Combine the user's 'objective', 'summary', and 'softSkills' into a single, professional "Professional Summary" paragraph (3-5 lines). Write in the first person (implied) or third person, ready to publish.
    3. **Experience**: Enhance descriptions to be impactful and results-oriented using strong action verbs. Do not change dates, titles, or companies.
    4. **Language**: Output in the same language as the input data (Portuguese or English).
    5. **Strict JSON**: Return ONLY the JSON object.
    
    If a field is empty in the input, keep it empty or generate a reasonable default based on context, but do not add placeholder text.
    
    Input Data: ${JSON.stringify(data)}
`;

export const generateResumeWithLLM = async (provider: LLMProvider, apiKey: string, data: ResumeData): Promise<ResumeData> => {
    if (!apiKey) throw new Error("API Key is missing");

    const prompt = getPrompt(data);

    try {
        let resultJson: any;

        if (provider === 'gemini') {
            const ai = new GoogleGenAI({ apiKey });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            if (response.text) {
                resultJson = JSON.parse(cleanJson(response.text));
            }
        } else if (provider === 'openai' || provider === 'groq' || provider === 'deepseek') {
            let url = "";
            let model = "";

            if (provider === 'openai') {
                url = "https://api.openai.com/v1/chat/completions";
                model = "gpt-4-turbo-preview";
            } else if (provider === 'groq') {
                url = "https://api.groq.com/openai/v1/chat/completions";
                model = "llama-3.3-70b-versatile";
            } else if (provider === 'deepseek') {
                url = "https://api.deepseek.com/chat/completions";
                model = "deepseek-chat";
            }

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: "system", content: "You are a helpful assistant that outputs JSON." },
                        { role: "user", content: prompt }
                    ],
                    response_format: { type: "json_object" }
                })
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(`API Error: ${err}`);
            }

            const json = await response.json();
            const content = json.choices[0].message.content;
            resultJson = JSON.parse(cleanJson(content));
        }

        if (!resultJson) throw new Error("No data returned");

        // Merge logic
        const mergedData: ResumeData = {
            ...data,
            ...resultJson,
            experiences: Array.isArray(resultJson.experiences) ? resultJson.experiences : data.experiences,
            education: Array.isArray(resultJson.education) ? resultJson.education : data.education,
            skills: Array.isArray(resultJson.skills) ? resultJson.skills : data.skills,
            courses: Array.isArray(resultJson.courses) ? resultJson.courses : data.courses,
            languages: Array.isArray(resultJson.languages) ? resultJson.languages : data.languages,
            projects: Array.isArray(resultJson.projects) ? resultJson.projects : data.projects,
            certifications: Array.isArray(resultJson.certifications) ? resultJson.certifications : data.certifications,
        };

        return mergedData;

    } catch (error) {
        console.error(`${provider} API Error:`, error);
        throw error;
    }
};
