import { IconType } from "react-icons";

export interface textLink {
  label: string;
  url: string;
}

export interface Location {
  label: string;
  mapUrl: string;
  embedUrl?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: Location;
  startDate: Date;
  endDate: Date;
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

export interface Experience {
  title: string;
  org: Org;
  subOrg?: SubOrg;
  startDate: Date;
  endDate?: Date;
  description: string;
  skills?: string[];
  supervisor?: textLink;
  highlights?: string[];
  links?: textLink[];
  talks?: (keyof typeof import('../data/talks').talks)[];
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  medium?: string;
  date: Date;
  type: 'Article' | 'Essay' | 'Thesis';
  url?: string;
  abstract?: string;
  tags?: string[];
}

export interface Talk {
  title: string;
  event: textLink & { shortLabel?: string };
  host: Org;
  date: Date;
  type: 'Presentation' | 'Poster' | 'Seminar' | 'Workshop';
  description?: string;
  slides?: textLink[];
  video?: textLink[];
  poster?: textLink;
  docs?: textLink[];
}

export interface Skill {
  category: string;
  icon?: IconType;
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

export interface NavItem {
  label: string;
  href: string;
  gardenIcon: string; // emoji representation
};

export interface Org extends Location {
  url: string;
  city: string;
  province: string;
  country: string;
}

export interface SubOrg extends textLink {
  lead?: textLink;
  parentOrg: Org;
}
