export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    summary: string;
    photo?: string;
  };
  education: Array<{
    school: string;
    degree: string;
    date: string;
    gpa?: string;
    description?: string;
  }>;
  workExperience: Array<{
    company: string;
    role: string;
    date: string;
    description: string;
  }>;
  projects: Array<{
    name: string;
    role: string;
    date: string;
    description: string;
  }>;
  skills: Array<{
    category: string;
    items: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
  languages: Array<{
    language: string;
    proficiency: string;
  }>;
  awards: Array<{
    name: string;
    date: string;
    description: string;
  }>;
  sectionOrder: string[];
}

export type TemplateType = 'minimal' | 'modern' | 'professional' | 'two-column' | 'ats';

export const INITIAL_RESUME_DATA: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    summary: '',
    photo: '',
  },
  education: [],
  workExperience: [],
  projects: [],
  skills: [],
  certifications: [],
  languages: [],
  awards: [],
  sectionOrder: ['summary', 'workExperience', 'projects', 'education', 'skills', 'certifications', 'languages', 'awards'],
};
