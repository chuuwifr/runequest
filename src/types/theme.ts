export type ThemeId = 
  | 'dark-mystic'
  | 'parchment'
  | 'orlanthi-storm'
  | 'lunar-crimson'
  | 'ernalda-earth'
  | 'troll-darkness';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  subtitle: string;
  runeSymbol: string;
  previewColors: {
    bg: string;
    card: string;
    accent: string;
    border: string;
    text: string;
  };
  headingFont: string;
  bodyFont: string;
  description: string;
  tag: string;
}

export const THEMES: ThemeConfig[] = [
  {
    id: 'dark-mystic',
    name: 'Sombre Mystique',
    subtitle: 'Nuit des Runes & Astromancie',
    runeSymbol: '✨',
    previewColors: {
      bg: '#0c0d12',
      card: '#181924',
      accent: '#f59e0b',
      border: '#d97706',
      text: '#f5f5f4',
    },
    headingFont: "'Cinzel', Georgia, serif",
    bodyFont: "'Inter', sans-serif",
    description: 'Obsidienne sombre, éclats d\'or ambré et atmosphère ésotérique des grands rituels héroïques.',
    tag: 'Recommandé / Par défaut',
  },
  {
    id: 'parchment',
    name: 'Parchemin Ancien',
    subtitle: 'Grimoire & Vélin Médiéval',
    runeSymbol: '📜',
    previewColors: {
      bg: '#f6f0df',
      card: '#ede3cd',
      accent: '#9a3412',
      border: '#b45309',
      text: '#291b12',
    },
    headingFont: "'MedievalSharp', 'Crimson Pro', Georgia, serif",
    bodyFont: "'Crimson Pro', Georgia, serif",
    description: 'Vélin patiné, enluminures manuscrites, encres sépia et sceaux de cire pour une immersion totale dans les chroniques.',
    tag: 'Style Manuscrit',
  },
  {
    id: 'orlanthi-storm',
    name: 'Tempêtes d’Orlanth',
    subtitle: 'Bronze de Sartar & Azur Céleste',
    runeSymbol: '⚡',
    previewColors: {
      bg: '#0a101d',
      card: '#131e33',
      accent: '#38bdf8',
      border: '#0284c7',
      text: '#f0f9ff',
    },
    headingFont: "'Cinzel', Georgia, serif",
    bodyFont: "'Inter', sans-serif",
    description: 'Teintes d\'orage, azur électrique et bronze sartarite en hommage au Roi des Dieux et aux guerriers des Collines.',
    tag: 'Tribu des Tempêtes',
  },
  {
    id: 'lunar-crimson',
    name: 'Écarlate Lunaire',
    subtitle: 'Pourpre de Glamour & Lune Rouge',
    runeSymbol: '🔴',
    previewColors: {
      bg: '#16080d',
      card: '#270e17',
      accent: '#f43f5e',
      border: '#e11d48',
      text: '#fff1f2',
    },
    headingFont: "'Uncial Antiqua', 'Cinzel', serif",
    bodyFont: "'Inter', sans-serif",
    description: 'Pourpre impérial, rubis cramoisi et reflets d\'argent en honneur de la Déesse Rouge et des Sept Mères.',
    tag: 'Empire Lunaire',
  },
  {
    id: 'ernalda-earth',
    name: 'Jardins d’Ernalda',
    subtitle: 'Jade Sylvestre & Terre Vivante',
    runeSymbol: '🌿',
    previewColors: {
      bg: '#08140c',
      card: '#102417',
      accent: '#34d399',
      border: '#059669',
      text: '#ecfdf5',
    },
    headingFont: "'Almendra', 'Cinzel', serif",
    bodyFont: "'Inter', sans-serif",
    description: 'Mousse émeraude, humus fertile, chants de guérison de Chalana Arroy et bénédiction de la Terre Mère.',
    tag: 'Culte de la Terre',
  },
  {
    id: 'troll-darkness',
    name: 'Ténèbres d’Uzore',
    subtitle: 'Abysse de Kyger Litor & Braises',
    runeSymbol: '🌑',
    previewColors: {
      bg: '#050505',
      card: '#121212',
      accent: '#ea580c',
      border: '#c2410c',
      text: '#fafaf9',
    },
    headingFont: "'Cinzel Decorative', 'Cinzel', serif",
    bodyFont: "'Inter', sans-serif",
    description: 'Noir d\'ébène absolu du Monde Inférieur, charbon et braises ardentes de Zorak Zoran.',
    tag: 'Profondeurs Ténébreuses',
  },
];
