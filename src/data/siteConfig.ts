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
        url: 'https://doc-14-4c-apps-viewer.googleusercontent.com/viewer/secure/pdf/6qfs7oqrjlj1rj1ak6ant9vd2po0g25m/60rkgs9b2umb7ch3so44abtmhk0lcg86/1767582225000/lantern/02413682096756226965/ACFrOgC31TUDISJ9uxPYJbKE9usGlxncKeHQU9NYU2BG95KRSX0il8iZ3c9cu7u7MPd8xlt1VV6yf_VrvxA-IHTAMljMzeIrKmFfLx8FgqAVUDfGNYQE88S_hOgR6lJAT9gwJEKNKrLj3yEtGM66?view',
        icon: BsFileEarmarkText,
    }
} as const;
