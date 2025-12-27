export interface textLink {
  label: string;
  url?: string;
}

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
  org?: textLink
  lab?: textLink
  location: string;
  startDate: Date;
  endDate?: Date;
  description: string[];
  skills?: string[];
  supervisor?: textLink;
  highlights?: string[];
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  medium?: string;
  date: string;
  type: 'paper' | 'essay' | 'article' | 'thesis';
  url?: string;
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

export interface GardenTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
  animations: {
    bloomDuration: number;
    growthDuration: number;
    transitionDuration: number;
  };
};

export interface NavItem {
  label: string;
  href: string;
  gardenIcon: string; // emoji representation
};