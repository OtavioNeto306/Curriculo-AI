import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData } from "../types";

export const generateEnhancedResume = async (apiKey: string, data: ResumeData): Promise<ResumeData> => {
  if (!apiKey) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are an elite professional resume writer. I will provide you with raw resume data in JSON format.
    Your task is to output a CLEAN, VALID JSON object with enhanced content.

    CRITICAL INSTRUCTIONS - READ CAREFULLY:
    1. **NO META-COMMENTARY**: Never include explanations, notes, or justifications (e.g., "I have updated...", "The output is JSON...", "Fields preserved..."). The output must be PURE DATA strings.
    2. **Summary**: Combine the user's 'objective', 'summary', and 'softSkills' into a single, professional "Professional Summary" paragraph (3-5 lines). Write in the first person (implied) or third person, ready to publish. Do NOT explain that you combined them.
    3. **Experience**: Enhance descriptions to be impactful and results-oriented using strong action verbs. Do not change dates, titles, or companies.
    4. **Language**: Output in the same language as the input data (Portuguese or English).
    5. **Strict JSON**: Return ONLY the JSON object.
    
    If a field is empty in the input, keep it empty or generate a reasonable default based on context, but do not add placeholder text like "[Insert text here]".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Here is the raw resume data to enhance: ${JSON.stringify(data)}`,
      config: {
        systemInstruction: prompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fullName: { type: Type.STRING },
            age: { type: Type.STRING },
            phone: { type: Type.STRING },
            email: { type: Type.STRING },
            address: { type: Type.STRING },
            cityState: { type: Type.STRING },
            linkedin: { type: Type.STRING },
            github: { type: Type.STRING },
            summary: { type: Type.STRING },
            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            softSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            languages: { 
                type: Type.ARRAY, 
                items: { 
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING },
                        name: { type: Type.STRING },
                        level: { type: Type.STRING }
                    }
                } 
            },
            experiences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  company: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  description: { type: Type.STRING },
                }
              }
            },
            education: {
               type: Type.ARRAY,
               items: {
                 type: Type.OBJECT,
                 properties: {
                   id: { type: Type.STRING },
                   institution: { type: Type.STRING },
                   degree: { type: Type.STRING },
                   year: { type: Type.STRING },
                 }
               }
            },
            projects: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING },
                        name: { type: Type.STRING },
                        url: { type: Type.STRING },
                        description: { type: Type.STRING },
                        technologies: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                }
            },
            certifications: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING },
                        name: { type: Type.STRING },
                        institution: { type: Type.STRING },
                        year: { type: Type.STRING }
                    }
                }
            },
            courses: {
              type: Type.ARRAY,
               items: {
                 type: Type.OBJECT,
                 properties: {
                   id: { type: Type.STRING },
                   name: { type: Type.STRING },
                   year: { type: Type.STRING },
                 }
               }
            }
          }
        }
      }
    });

    if (response.text) {
      let cleanText = response.text.trim();
      // Remove markdown code blocks if present
      if (cleanText.startsWith("```json")) {
        cleanText = cleanText.replace(/^```json/, "").replace(/```$/, "");
      } else if (cleanText.startsWith("```")) {
        cleanText = cleanText.replace(/^```/, "").replace(/```$/, "");
      }
      
      const parsed = JSON.parse(cleanText);

      // MERGE: Use parsed data, but fallback to original data for any missing fields
      const mergedData: ResumeData = {
        ...data, // Start with original
        ...parsed, // Override with AI results
        // Ensure arrays are actually arrays and exist
        experiences: Array.isArray(parsed.experiences) ? parsed.experiences : data.experiences,
        education: Array.isArray(parsed.education) ? parsed.education : data.education,
        skills: Array.isArray(parsed.skills) ? parsed.skills : data.skills,
        courses: Array.isArray(parsed.courses) ? parsed.courses : data.courses,
        languages: Array.isArray(parsed.languages) ? parsed.languages : data.languages,
        projects: Array.isArray(parsed.projects) ? parsed.projects : data.projects,
        certifications: Array.isArray(parsed.certifications) ? parsed.certifications : data.certifications,
      };
      
      return mergedData;
    }
    
    throw new Error("No text returned from model");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};