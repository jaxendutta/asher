import { BsEnvelopeHeart, BsLinkedin, BsFileEarmarkText } from 'react-icons/bs';

export const SITECONFIG = {
    siteName: "Asher's Garden",
    name: "Asher Kim",
    role: "MSc Biology Candidate",
    org: "University of Ottawa",
    location: "Ottawa, Canada",
    supervisor: {
        name: "Dr. Marina Cvetkovska",
        url: "https://www.uottawa.ca/faculty-science/professors/marina-cvetkovska",
    },
}

export const SOCIAL_LINKS = {
    email: {
        label: 'Email',
        url: 'mailto:rkim070@uottawa.ca',
        id: 'rkim070@uottawa.ca',
        icon: BsEnvelopeHeart,
    },
    linkedin: {
        label: 'LinkedIn',
        url: 'https://www.linkedin.com/in/kimasher',
        id: 'kimasher',
        icon: BsLinkedin,
    },
    resume: {
        label: 'Résumé',
        url: 'https://docs.google.com/viewer?url=https://docs.google.com/document/d/1unbsI5KAf6wia68Ft3ANt6U0lOJXz9myi2gy8TRkrUw/export?format=pdf',
        icon: BsFileEarmarkText,
    }
} as const;
