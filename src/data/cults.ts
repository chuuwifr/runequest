import { RuneType } from '../types/runequest';

export interface CultDefinition {
  id: string;
  name: string;
  englishName: string;
  pantheon: 'Tempêtes' | 'Terre' | 'Solaire' | 'Ténèbres' | 'Lunaire' | 'Praxien' | 'Neutre / Savoirs';
  runes: RuneType[];
  concept: string;
  description: string;
  holyDay: string;
  cultSkills: string[];
  spiritMagicSpells: string[];
  runeSpells: string[];
  runePointsCost: number;
  initiatesTitle: string;
  lordsTitle?: string;
  priestsTitle?: string;
  requirements: string;
}

export const CULTS: CultDefinition[] = [
  {
    id: 'orlanth',
    name: 'Orlanth (Aventurier & Tonitruant)',
    englishName: 'Orlanth (Adventurous & Thunderous)',
    pantheon: 'Tempêtes',
    runes: ['Air', 'Mouvement', 'Maîtrise'],
    concept: 'Roi des Dieux, Maître des Tempêtes, Dieu de la Liberté et de l\'Honneur',
    description: 'Le grand dieu de la tempête et souverain du Panthéon de la Tempête. Il a apporté la liberté aux mortels et terrassé l\'Empereur du Soleil lors de la Guerre des Dieux.',
    holyDay: 'Jour des Vents, Semaine du Mouvement',
    cultSkills: ['Épée large 1M', 'Lutte', 'Saut', 'Éloquence', 'Chant', 'Survie'],
    spiritMagicSpells: ['Lame de Feu', 'Protection', 'Mobilité', 'Force', 'Fracas'],
    runeSpells: ['Foudre', 'Vol', 'Vent Obéissant', 'Bouclier de Foudre', 'Charisme des Tempêtes', 'Flèche de Foudre'],
    runePointsCost: 3,
    initiatesTitle: 'Initié d\'Orlanth',
    lordsTitle: 'Seigneur des Vents',
    priestsTitle: 'Prêtre des Tempêtes',
    requirements: 'Rune de l\'Air 50%+, Passion Loyauté ou Dévotion 60%+',
  },
  {
    id: 'ernalda',
    name: 'Ernalda la Reine de la Terre',
    englishName: 'Ernalda the Earth Queen',
    pantheon: 'Terre',
    runes: ['Terre', 'Fertilité', 'Harmonie'],
    concept: 'Mère Terre, Déesse de la Fertilité, de la Vie, des Moissons et de la Famille',
    description: 'Épouse principale d\'Orlanth et souveraine de tout ce qui pousse et vit. Elle offre la bénédiction des récoltes, protège les foyers et guide les matriarches.',
    holyDay: 'Jour de l\'Argile, Semaine de la Fertilité',
    cultSkills: ['Premiers Soins', 'Marchandage', 'Danse', 'Perspicacité', 'Cuisine & Plantes'],
    spiritMagicSpells: ['Soin', 'Vigueur', 'Apaisement', 'Démoralisation', 'Bénédiction du Foyer'],
    runeSpells: ['Bénédiction des Récoltes', 'Restauration de Santé', 'Guérison de l\'Âme', 'Harmonisation Terrestre', 'Croissance Végétale'],
    runePointsCost: 3,
    initiatesTitle: 'Initiée d\'Ernalda',
    lordsTitle: 'Grande Prêtresse de la Terre',
    priestsTitle: 'Prêtresse du Foyer',
    requirements: 'Rune de la Terre 50%+, Passion Amour (Famille) ou Dévotion 60%+',
  },
  {
    id: 'humakt',
    name: 'Humakt le Seigneur de la Mort',
    englishName: 'Humakt the God of Death & War',
    pantheon: 'Tempêtes',
    runes: ['Mort', 'Vérité', 'Air'],
    concept: 'Dieu de la Mort, de la Vérité absolue, de la Guerre honorable et du Serment',
    description: 'Humakt a coupé les liens avec sa famille divine pour devenir le gardien impartial de la Mort et de l\'Épée. Ses adeptes renoncent à la résurrection en échange d\'une prouesse martiale inégalée.',
    holyDay: 'Jour du Gel, Semaine de la Mort',
    cultSkills: ['Épée large 1M', 'Épée bâtarde', 'Bouclier moyen', 'Sens du Danger', 'Intimidation'],
    spiritMagicSpells: ['Tranchant de Fer', 'Parade d\'Acier', 'Détection des Morts-Vivants', 'Vitesse'],
    runeSpells: ['Épée Sacrée', 'Destruction des Morts-Vivants', 'Détection du Mensonge', 'Immunité à la Peur', 'Coup Mortel'],
    runePointsCost: 3,
    initiatesTitle: 'Initié d\'Humakt',
    lordsTitle: 'Seigneur de l\'Épée',
    priestsTitle: 'Prêtre du Trépas',
    requirements: 'Rune de la Mort 50%+, Passion Honneur 60%+, Vœu d\'Humakt',
  },
  {
    id: 'issaries',
    name: 'Issaries le Négociateur',
    englishName: 'Issaries the God of Trade & Communication',
    pantheon: 'Tempêtes',
    runes: ['Harmonie', 'Mouvement', 'Air'],
    concept: 'Dieu du Commerce, des Voyages, de la Parole et des Échanges pacifiques',
    description: 'Issaries protège les caravanes, les marchands et les émissaires. Ses adeptes traversent les frontières et garantissent la neutralité des marchés sacrés.',
    holyDay: 'Jour de l\'Eau, Semaine de l\'Harmonie',
    cultSkills: ['Marchandage', 'Persuasion', 'Évaluation', 'Langues étrangères', 'Équitation'],
    spiritMagicSpells: ['Traduction Magique', 'Glamour', 'Lumière', 'Mobilité', 'Fausse Pièce'],
    runeSpells: ['Marché Scellé', 'Chemin Sécurisé', 'Compréhension Universelle', 'Bénédiction de la Caravane'],
    runePointsCost: 3,
    initiatesTitle: 'Initié d\'Issaries',
    lordsTitle: 'Grand Maître Caravanier',
    priestsTitle: 'Prêtre du Verbe',
    requirements: 'Rune de l\'Harmonie ou Mouvement 50%+, Passion Loyauté 60%+',
  },
  {
    id: 'chalana_arroy',
    name: 'Chalana Arroy la Guérisseuse',
    englishName: 'Chalana Arroy the Goddess of Healing & Compassion',
    pantheon: 'Terre',
    runes: ['Fertilité', 'Harmonie', 'Homme'],
    concept: 'Déesse de la Guérison absolue, du Pardon et de la Compassion',
    description: 'La Sainte Mère blanche qui refuse de verser le moindre sang et soigne amis comme ennemis. Ses prêtresses peuvent ressusciter les trépassés.',
    holyDay: 'Jour de l\'Argile, Semaine de la Fertilité',
    cultSkills: ['Premiers Soins', 'Médecine', 'Perspicacité', 'Empathie', 'Herboristerie'],
    spiritMagicSpells: ['Soin Majeur', 'Apaisement', 'Purification du Poison', 'Endormissement'],
    runeSpells: ['Résurrection', 'Guérison Suprême', 'Guérison de la Folie', 'Paix Sacrée', 'Régénération'],
    runePointsCost: 3,
    initiatesTitle: 'Initié de la Robe Blanche',
    priestsTitle: 'Haute Soigneuse',
    requirements: 'Rune de Fertilité ou Harmonie 50%+, Vœu de non-violence absolue',
  },
  {
    id: 'lhankor_mhy',
    name: 'Lhankor Mhy le Savant à la Barbe',
    englishName: 'Lhankor Mhy the God of Knowledge & Lore',
    pantheon: 'Neutre / Savoirs',
    runes: ['Vérité', 'Stase', 'Air'],
    concept: 'Dieu de la Connaissance, des Archives, des Écritures et de la Vérité',
    description: 'Le sage barbu qui consigna les secrets du monde avant la fin de l\'Âge des Dieux. Tous ses initiés portent la barbe sacrée (même les femmes) et recherchent la vérité universelle.',
    holyDay: 'Jour du Gel, Semaine de la Vérité',
    cultSkills: ['Lecture/Écriture', 'Histoire Ancienne', 'Alchimie', 'Droit Ancien', 'Détection Magique'],
    spiritMagicSpells: ['Détection de la Magie', 'Lumière', 'Compréhension', 'Réparation'],
    runeSpells: ['Vision du Passé', 'Vérité Infaillible', 'Déchiffrage des Écritures Perdues', 'Analyse Runique'],
    runePointsCost: 3,
    initiatesTitle: 'Initié Érudit',
    priestsTitle: 'Sage des Parchemins',
    requirements: 'Rune de la Vérité 50%+, INT 13+',
  },
  {
    id: 'storm_bull',
    name: 'Taureau Tempête (Storm Bull / Urox)',
    englishName: 'Storm Bull (Urox the Chaos Buster)',
    pantheon: 'Tempêtes',
    runes: ['Air', 'Bête', 'Mort'],
    concept: 'Destructeur du Chaos, Dieu de la Fureur Guerrière et du Désert',
    description: 'Le dieu berserk qui écrasa le Démon Wakboth sous le Bloc de Pierre lors de la Grande Nuit. Ses adorateurs chassent impitoyablement les créatures du Chaos.',
    holyDay: 'Jour Sauvage, Semaine du Désordre',
    cultSkills: ['Hache à deux mains', 'Gourdin lourd', 'Intimidation', 'Pistage du Chaos', 'Lutte'],
    spiritMagicSpells: ['Fureur Guerrière', 'Force du Taureau', 'Détection du Chaos', 'Démoralisation'],
    runeSpells: ['Frénésie Berserk', 'Éradication du Chaos', 'Peau de Taureau', 'Hurlement Tempétueux'],
    runePointsCost: 3,
    initiatesTitle: 'Initié du Taureau',
    lordsTitle: 'Khahn du Taureau',
    priestsTitle: 'Chamane-Prêtre d\'Urox',
    requirements: 'Rune de la Bête ou Air 50%+, Haine (Chaos) 60%+',
  },
  {
    id: 'seven_mothers',
    name: 'Les Sept Mères (Seven Mothers)',
    englishName: 'The Seven Mothers (Lunar Cult)',
    pantheon: 'Lunaire',
    runes: ['Lune', 'Illusion', 'Harmonie'],
    concept: 'Les créatrices de la Déesse Rouge, voie d\'accès à l\'Empire Lunaire',
    description: 'Le culte missionnaire qui répand la philosophie et la magie de la Déesse Rouge à travers toute la Passe du Dragon et les terres conquises.',
    holyDay: 'Jour de la Lune Rouge (Croissante)',
    cultSkills: ['Persuasion', 'Intrigue', 'Cimeterre 1M', 'Méditation Lunaire', 'Rhétorique'],
    spiritMagicSpells: ['Rayon Lunaire', 'Glamour', 'Soin', 'Protection', 'Confusion'],
    runeSpells: ['Faveur de la Déesse', 'Illusion Majeure', 'Rayonnement de la Lune Rousse', 'Contrôle Mental'],
    runePointsCost: 3,
    initiatesTitle: 'Initié Lunaire',
    priestsTitle: 'Prêtre des Sept Voies',
    requirements: 'Rune de la Lune 50%+, Loyauté (Empire Lunaire) 60%+',
  }
];
