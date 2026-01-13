// ============================================================================
// Skills Data
// ============================================================================

import type { Skill } from '@/types';
import { GiMaterialsScience } from 'react-icons/gi';
import { LiaLaptopCodeSolid } from 'react-icons/lia';
import { TbDatabaseSmile } from 'react-icons/tb';

export const skills: Skill[] = [
  {
    category: 'Laboratory Skills',
    icon: GiMaterialsScience,
    items: [
      'Chlorophyll Extraction',
      'PCR',
      'Cell Culture',
      'Gel Electrophoresis',
      'Cell Transformation',
      'DNA Purification',
      'Plasmid Ligation and Transformation',
      'Biolistic Cell Bombardment',
      'Spectroscopy',
    ],
  },
  {
    category: 'Computation + Bioinformatics',
    icon: TbDatabaseSmile,
    items: [
      'R',
      'IBM SPSS',
      'Python',
      'PDB',
      'AlphaFold',
      'NCBI BLAST',
      'NCBI PubMed',
      'PSIPRED',
      'DeepTMHMM',
      'Phobius',
      'UCSC Genome Browser',
      'PyMol',
      'Jalview',
    ],
  },
];

export const researchInterests = [
  "Abiotic Stress Responses",
  "Plant-Microbe Interactions",
  "Molecular Biology",
  "Plant Physiology",
  "Microbiology",
];
