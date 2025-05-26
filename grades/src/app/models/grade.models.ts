export interface Grade {
  name: string;
  description: string;
  characteristics: string[];
  education: {
    formal: string;
    self: string;
  };
  experience: {
    total: string;
    project: string;
    difficulty: string;
    teamSize: string;
  };
  hardSkills: Map<string, string[]>;
  softSkills: Map<string, string[]>;
  projectSkills: Map<string, string[]>;
  questions?: Map<string, string[]>;
  howToRate?: string[];
  imageUrl: string;
  recommendations?: Map<string, string[]>;
}