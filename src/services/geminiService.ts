import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData, INITIAL_RESUME_DATA } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

function sanitizeResumeData(data: any): ResumeData {
  return {
    personalInfo: {
      ...INITIAL_RESUME_DATA.personalInfo,
      ...(data?.personalInfo || {}),
    },
    education: Array.isArray(data?.education) ? data.education : [],
    workExperience: Array.isArray(data?.workExperience) ? data.workExperience : [],
    projects: Array.isArray(data?.projects) ? data.projects : [],
    skills: Array.isArray(data?.skills) ? data.skills : [],
    certifications: Array.isArray(data?.certifications) ? data.certifications : [],
    languages: Array.isArray(data?.languages) ? data.languages : [],
    awards: Array.isArray(data?.awards) ? data.awards : [],
    sectionOrder: Array.isArray(data?.sectionOrder) ? data.sectionOrder : INITIAL_RESUME_DATA.sectionOrder,
  };
}

const RESUME_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    personalInfo: {
      type: Type.OBJECT,
      properties: {
        fullName: { type: Type.STRING },
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        location: { type: Type.STRING },
        website: { type: Type.STRING },
        summary: { type: Type.STRING },
      },
      required: ["fullName"],
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          school: { type: Type.STRING },
          degree: { type: Type.STRING },
          date: { type: Type.STRING },
          gpa: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["school", "degree"],
      },
    },
    workExperience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          company: { type: Type.STRING },
          role: { type: Type.STRING },
          date: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["company", "role"],
      },
    },
    projects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          role: { type: Type.STRING },
          date: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["name"],
      },
    },
    skills: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          items: { type: Type.STRING },
        },
        required: ["category", "items"],
      },
    },
    certifications: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          issuer: { type: Type.STRING },
          date: { type: Type.STRING },
        },
        required: ["name"],
      },
    },
    languages: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          language: { type: Type.STRING },
          proficiency: { type: Type.STRING },
        },
        required: ["language"],
      },
    },
    awards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          date: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["name"],
      },
    },
  },
};

export async function parseResume(fileData: string, mimeType: string): Promise<ResumeData> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            inlineData: {
              data: fileData.split(",")[1],
              mimeType: mimeType,
            },
          },
          {
            text: "Faithfully extract ALL information from ALL pages of this resume file and return it in the specified JSON format. It is CRITICAL that you do not miss any section, even if it's on a later page. Do not optimize, rephrase, or improve the content; focus on 100% accurate recognition and extraction of the original text. If a field is not found, leave it empty. Translate content to Chinese if it's in English to match the UI language, but maintain the original meaning and tone as much as possible. Ensure you capture certifications, languages, and awards if present.",
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: RESUME_SCHEMA,
    },
  });

  try {
    const parsed = JSON.parse(response.text || "{}");
    return sanitizeResumeData(parsed);
  } catch (e) {
    console.error("Failed to parse resume JSON", e);
    throw new Error("解析简历失败，请手动输入或重试。");
  }
}

export async function optimizeResume(data: ResumeData): Promise<ResumeData> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            text: `Optimize the following resume data to be more professional, concise, and impactful. Focus on action verbs and quantifiable achievements. Return the optimized data in the same JSON format.\n\n${JSON.stringify(data)}`,
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: RESUME_SCHEMA,
    },
  });

  try {
    const parsed = JSON.parse(response.text || "{}");
    return sanitizeResumeData(parsed);
  } catch (e) {
    console.error("Failed to optimize resume JSON", e);
    return data;
  }
}
