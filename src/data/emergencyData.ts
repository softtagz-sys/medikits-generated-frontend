import { EmergencyCategory, EmergencyStep } from '../types';

export const emergencyCategories: EmergencyCategory[] = [
  {
    id: 'hartaanval',
    name: 'Hartaanval',
    icon: '💔',
    color: '#C12F2F',
    description: 'Hartstilstand of hartaanval',
    initialStepId: 'heart-check-consciousness',
  },
  {
    id: 'brandwonden',
    name: 'Brandwonden',
    icon: '🔥',
    color: '#FF6B35',
    description: 'Brand- of hitteletsel',
    initialStepId: 'burn-assess-severity',
  },
  {
    id: 'hevige-bloeding',
    name: 'Hevige bloeding',
    icon: '🩸',
    color: '#C12F2F',
    description: 'Ernstig bloedverlies',
    initialStepId: 'bleeding-locate-source',
  },
  {
    id: 'verstikking',
    name: 'Verstikking',
    icon: '🫁',
    color: '#016565',
    description: 'Luchtwegobstructie',
    initialStepId: 'choking-assess-airway',
  },
  {
    id: 'bewusteloos',
    name: 'Bewusteloos slachtoffer',
    icon: '😴',
    color: '#7B68EE',
    description: 'Bewusteloosheid of coma',
    initialStepId: 'unconscious-check-response',
  },
  {
    id: 'val-hoogte',
    name: 'Val van grote hoogte',
    icon: '⬇️',
    color: '#FF8C00',
    description: 'Valtrauma en mogelijk rugletsel',
    initialStepId: 'fall-stabilize-neck',
  },
  {
    id: 'elektrocutie',
    name: 'Elektrocutie',
    icon: '⚡',
    color: '#FFD700',
    description: 'Elektrische schok',
    initialStepId: 'electric-ensure-safety',
  },
  {
    id: 'amputatie',
    name: 'Amputatie',
    icon: '🦿',
    color: '#DC143C',
    description: 'Afgescheurd lichaamsdeel',
    initialStepId: 'amputation-control-bleeding',
  },
];

export const emergencySteps: { [key: string]: EmergencyStep } = {
  // Hartaanval steps
  'heart-check-consciousness': {
    id: 'heart-check-consciousness',
    title: 'Controleer bewustzijn',
    instruction: 'Tik op de schouders en roep luid. Reageert het slachtoffer?',
    instructionFirstResponder: 'Controleer bewustzijn door stevig op schouders te tikken en luid "Hallo, gaat het?" te roepen. Let op oogopening, verbale respons en motorische respons.',
    image: 'https://images.pexels.com/photos/7615464/pexels-photo-7615464.jpeg',
    nextSteps: [
      { text: 'Ja, slachtoffer reageert', stepId: 'heart-comfort-position' },
      { text: 'Nee, geen reactie', stepId: 'heart-check-breathing' },
    ],
  },
  'heart-check-breathing': {
    id: 'heart-check-breathing',
    title: 'Controleer ademhaling',
    instruction: 'Leg oor bij mond/neus. Zie je de borst bewegen? Voel je ademhaling?',
    instructionFirstResponder: 'Kijk, luister en voel maximaal 10 seconden naar ademhaling. Normaal: 12-20 per minuut. Let op: schokademhaling is niet normaal.',
    image: 'https://images.pexels.com/photos/6816432/pexels-photo-6816432.jpeg',
    nextSteps: [
      { text: 'Ja, normale ademhaling', stepId: 'heart-recovery-position' },
      { text: 'Nee of abnormaal', stepId: 'heart-start-cpr' },
    ],
  },
  'heart-start-cpr': {
    id: 'heart-start-cpr',
    title: 'Begin reanimatie',
    instruction: 'Leg handen op borst, druk 30x hard en snel (100-120/min), daarna 2 beademingen.',
    instructionFirstResponder: 'Hartmassage: handen op onderste helft borstbeen, 5-6cm diep, 100-120/min. 30 compressies : 2 beademingen. Wissel elke 2 minuten.',
    image: 'https://images.pexels.com/photos/6816439/pexels-photo-6816439.jpeg',
    nextSteps: [
      { text: 'Ga door tot ambulance arriveert', stepId: 'heart-continue-cpr' },
    ],
  },

  // Brandwonden steps
  'burn-assess-severity': {
    id: 'burn-assess-severity',
    title: 'Beoordeel brandwond',
    instruction: 'Hoe groot is de brandwond? Groter dan de handpalm van het slachtoffer?',
    instructionFirstResponder: 'Beoordeel: 1e graad (roodheid), 2e graad (blaren), 3e graad (wit/zwart). Oppervlakte: handpalm = 1% lichaamsoppervlak.',
    image: 'https://images.pexels.com/photos/7195110/pexels-photo-7195110.jpeg',
    nextSteps: [
      { text: 'Klein (< handpalm)', stepId: 'burn-cool-small' },
      { text: 'Groot (> handpalm)', stepId: 'burn-cool-large' },
    ],
  },
  'burn-cool-small': {
    id: 'burn-cool-small',
    title: 'Koel de brandwond',
    instruction: 'Spoel 10-20 minuten met lauw stromend water. Niet ijskoud!',
    instructionFirstResponder: 'Koel met lauw water (15-20°C) gedurende 20 minuten. Verwijder sieraden/kleding rondom brandwond voordat zwelling optreedt.',
    image: 'https://images.pexels.com/photos/7195264/pexels-photo-7195264.jpeg',
    nextSteps: [
      { text: 'Na koelen: afdekken', stepId: 'burn-cover-wound' },
    ],
  },

  // Body map integration example
  'bleeding-locate-source': {
    id: 'bleeding-locate-source',
    title: 'Lokaliseer bloeding',
    instruction: 'Waar zit de bloeding? Klik op het lichaamsdeel.',
    instructionFirstResponder: 'Inspecteer systematisch: hoofd, romp, armen, benen. Let op arteriële vs veneuze bloeding (spuitend vs vloeiend).',
    image: 'https://images.pexels.com/photos/7195201/pexels-photo-7195201.jpeg',
    requiresBodyMap: true,
    bodyMapRegions: ['head', 'chest', 'arm-left', 'arm-right', 'leg-left', 'leg-right'],
    nextSteps: [
      { text: 'Ga naar lichaamskaart', stepId: 'body-map' },
    ],
  },
};

export const bodyMapSteps: { [key: string]: EmergencyStep } = {
  'head-bleeding': {
    id: 'head-bleeding',
    title: 'Hoofdbloeding',
    instruction: 'Druk voorzichtig op de wond met schone doek. Let op mogelijke schedelfractuur.',
    instructionFirstResponder: 'Bij hoofdtrauma: stabiliseer nekwervelkolom. Druk niet op ingezonken fracturen. Controleer bewustzijn en pupillen.',
    image: 'https://images.pexels.com/photos/7195110/pexels-photo-7195110.jpeg',
    nextSteps: [
      { text: 'Bleeding gestopt', stepId: 'head-monitor' },
      { text: 'Bleeding gaat door', stepId: 'head-emergency' },
    ],
  },
  'chest-bleeding': {
    id: 'chest-bleeding',
    title: 'Borstbloeding',
    instruction: 'Druk stevig op de wond. Let op ademhalingsproblemen.',
    instructionFirstResponder: 'Bij penetrerend trauma: object niet verwijderen. Controleer pneumothorax tekenen: asymmetrische ademhaling, afwijkende percussie.',
    image: 'https://images.pexels.com/photos/7195201/pexels-photo-7195201.jpeg',
    nextSteps: [
      { text: 'Normale ademhaling', stepId: 'chest-pressure' },
      { text: 'Ademhalingsproblemen', stepId: 'chest-emergency' },
    ],
  },
};