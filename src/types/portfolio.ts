export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  thesis?: {
    title: string;
    supervisor: string;
    supervisorLink?: string;
  };
  awards?: string[];
  highlights?: string[];
  description?: string;
}

export interface ResearchExperience {
  id: string;
  title: string;
  organization: string;
  organizationLink?: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string[];
  skills?: string[];
  supervisor?: {
    name: string;
    link?: string;
  };
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  venue?: string;
  date: string;
  type: 'paper' | 'essay' | 'article' | 'thesis';
  link?: string;
  abstract?: string;
  tags?: string[];
}

export interface Talk {
  id: string;
  title: string;
  event: string;
  location: string;
  date: string;
  type: 'presentation' | 'poster' | 'seminar' | 'workshop';
  description?: string;
  slides?: string;
  video?: string;
}

export interface Skill {
  category: string;
  items: string[];
}

export interface Contact {
  email: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  orcid?: string;
  googleScholar?: string;
}

export interface ResearchInterest {
  id: string;
  title: string;
  description: string;
  icon?: string;
}
