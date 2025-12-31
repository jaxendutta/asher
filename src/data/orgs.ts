// ============================================================================
// Organization Data
// ============================================================================

import type { Org, SubOrg, textLink } from '@/types';

export const orgs: Record<string, Org> = {
    uO: {
        label: 'University of Ottawa',
        url: 'https://uottawa.ca/',
        mapUrl: 'https://maps.app.goo.gl/fTPpvkTadhk7SRiJ6',
        city: 'Ottawa',
        province: 'ON',
        country: 'CA',
    },
    UW: {
        label: 'University of Waterloo',
        url: 'https://uwaterloo.ca/',
        mapUrl: 'https://maps.app.goo.gl/KMeDQQRfvthmS6cH9',
        city: 'Waterloo',
        province: 'ON',
        country: 'CA',
    }
};

export const people: Record<string, textLink> = {
    marinaCvetkovska: {
        label: 'Dr. Marina Cvetkovska',
        url: 'https://www.uottawa.ca/faculty-science/professors/marina-cvetkovska',
    },
    simonChuong: {
        label: 'Dr. Simon D. X. Chuong',
        url: 'https://uwaterloo.ca/biology/profile/schuong',
    },
    rebeccaRooney: {
        label: 'Dr. Rebecca Rooney',
        url: 'https://uwaterloo.ca/biology/profile/rrooney',
    },
};

export const subOrgs: Record<string, SubOrg> = {
    uO_Bio: {
        label: 'Department of Biology',
        url: 'https://uottawa.ca/biology',
        parentOrg: orgs.uO,
    },
    uO_CvetkovskaLab: {
        label: 'Cvetkovska Lab',
        lead: people.marinaCvetkovska,
        url: 'https://cvetkovskalab.weebly.com/',
        parentOrg: orgs.uO,
    },
    UW_Bio: {
        label: 'Department of Biology',
        url: 'https://uwaterloo.ca/biology',
        parentOrg: orgs.UW,
    },
    UW_ChuongLab: {
        label: 'Chuong Lab',
        lead: people.simonChuong,
        url: 'https://uwaterloo.ca/biology/profile/schuong',
        parentOrg: orgs.UW,
    },
    UW_WetlandLab: {
        label: 'Waterloo Wetland Laboratory',
        lead: people.rebeccaRooney,
        url: 'https://uwaterloo.ca/rooney-lab/',
        parentOrg: orgs.UW,
    },
    UW_SER: {
        label: 'Society of Ecological Restoration',
        url: 'https://uwaterloo.ca/sustainability/news/supporting-bird-friendly-campus',
        parentOrg: orgs.UW,
    },
    UW_ChemOutreach: {
        label: 'Chemistry Community Outreach',
        url: 'https://uwaterloo.ca/chemistry/community-outreach',
        parentOrg: orgs.UW,
    },
    UW_ESMuseum: {
        label: 'Earth Sciences Museum',
        url: 'https://uwaterloo.ca/earth-sciences-museum/',
        parentOrg: orgs.UW,
    },
    UW_SciOutreach: {
        label: 'Science Community Outreach',
        url: 'https://uwaterloo.ca/science/outreach',
        parentOrg: orgs.UW,
    },
    UW_Athletics: {
        label: 'Athletics Department',
        url: 'https://uwaterloo.ca/athletics/',
        parentOrg: orgs.UW,
    },
};
