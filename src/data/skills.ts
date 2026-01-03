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
    ],
  },
  {
    category: 'Technical Skills',
    icon: LiaLaptopCodeSolid,
    items: [
      'R',
      'IBM SPSS',
      'Python',
    ],
  },
  {
    category: 'Databases + Bioinformatics',
    icon: TbDatabaseSmile,
    items: [
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
  {
    id: 'abiotic-stress',
    title: 'Abiotic Stress Responses',
    description: 'Plant physiological, metabolic, and genetic responses to abiotic stress',
    icon: 'plant',
  },
  {
    id: 'plant-microbe',
    title: 'Plant-Microbe Interactions',
    description: 'Beneficial plant-microbe interactions',
    icon: 'bacteria',
  },
  {
    id: 'protein-transport',
    title: 'Protein Subcellular Transport',
    description: 'Molecular mechanisms of protein subcellular transport in plant cells',
    icon: 'cell',
  },
];
