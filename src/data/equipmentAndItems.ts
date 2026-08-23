import { Weapon, BodyPart } from '../types/runequest';

export interface StandardGearItem {
  id: string;
  name: string;
  category: 'Survie & Voyage' | 'Soins & Alchimie' | 'Outils & Artisanat' | 'Sacré & Magie' | 'Montures & Animaux' | 'Luxe & Commerce';
  description: string;
  costLunars: number;
  encumbrance: number; // Poids / Encombrement
}

export interface StandardSkillPreset {
  name: string;
  category: 'Agilité' | 'Communication' | 'Connaissances' | 'Magie' | 'Manipulation' | 'Perception' | 'Furtivité' | 'Armes' | 'Boucliers';
  baseVal: number;
  description: string;
}

export const STANDARD_SKILLS_CATALOG: StandardSkillPreset[] = [
  // Agilité
  { name: 'Esquive', category: 'Agilité', baseVal: 25, description: 'Éviter les coups, projectiles et sorts physiques au corps à corps.' },
  { name: 'Saut', category: 'Agilité', baseVal: 20, description: 'Franchir des gouffres, ravins ou obstacles rocheux.' },
  { name: 'Escalade', category: 'Agilité', baseVal: 25, description: 'Grimper aux falaises, murailles et arbres séculaires.' },
  { name: 'Équitation', category: 'Agilité', baseVal: 20, description: 'Monter chevaux, grands bisons, lamas ou autres montures praxiennes.' },
  { name: 'Natation', category: 'Agilité', baseVal: 15, description: 'Nager dans les rivières impétueuses et lacs de Glorantha.' },
  { name: 'Acrobatie & Équilibre', category: 'Agilité', baseVal: 15, description: 'Maintenir son équilibre sur des corniches étroites et chutes contrôlées.' },

  // Communication
  { name: 'Éloquence & Persuasion', category: 'Communication', baseVal: 25, description: 'Convaincre, négocier et émouvoir une assemblée ou un chef de clan.' },
  { name: 'Baratin & Tromperie', category: 'Communication', baseVal: 15, description: 'Mentir avec assurance, berner les gardes et faire diversion.' },
  { name: 'Intimidation', category: 'Communication', baseVal: 25, description: 'Imposer le respect par la présence physique, la voix ou la terreur.' },
  { name: 'Marchandage', category: 'Communication', baseVal: 20, description: 'Négocier les prix dans les marchés de Nochet, Pavis ou Jonstown.' },
  { name: 'Chant Sacré & Oratoire', category: 'Communication', baseVal: 20, description: 'Chanter les récits des dieux et mener les hymnes de bataille.' },
  { name: 'Danse Rituelle', category: 'Communication', baseVal: 15, description: 'Participer aux rituels sacrés et cérémonies d\'initiation.' },
  { name: 'Jouer d\'un Instrument', category: 'Communication', baseVal: 10, description: 'Maîtriser la lyre sartarite, la flûte de pan ou les cors d\'airain.' },

  // Connaissances
  { name: 'Coutumes & Lois Locales', category: 'Connaissances', baseVal: 25, description: 'Connaître le droit coutumier sartarite, le wergild et les tabous.' },
  { name: 'Connaissance des Cultes', category: 'Connaissances', baseVal: 20, description: 'Comprendre les mythes divins, les jours saints et les préceptes sacrés.' },
  { name: 'Histoire de la Passe du Dragon', category: 'Connaissances', baseVal: 15, description: 'Chroniques des Guerres Héroïques, Sartar, Tarsh et les Guerres Lunaires.' },
  { name: 'Connaissance des Monstres & Chaos', category: 'Connaissances', baseVal: 15, description: 'Identifier les Broos, Walktapus, Chiens du Chaos et créatures impures.' },
  { name: 'Bataille & Stratégie Militaire', category: 'Connaissances', baseVal: 15, description: 'Tactiques de phalange, manœuvres de cavalerie et sièges de forts.' },
  { name: 'Premiers Soins', category: 'Connaissances', baseVal: 30, description: 'Panser les blessures graves, poser des garrots et réduire les fractures.' },
  { name: 'Survie en Milieu Sauvage', category: 'Connaissances', baseVal: 25, description: 'Trouver de l\'eau potable, bâtir un abri et s\'orienter par les étoiles.' },
  { name: 'Évaluation des Trésors & Butin', category: 'Connaissances', baseVal: 15, description: 'Estimer la valeur des gemmes, armes de bronze et artefacts anciens.' },
  { name: 'Langue (Sartarite / Ilsith)', category: 'Connaissances', baseVal: 50, description: 'Parler couramment la langue des Collines.' },
  { name: 'Langue (Nouveau Pelorien / Lunaire)', category: 'Connaissances', baseVal: 10, description: 'Parler la langue impériale des envahisseurs lunaires.' },
  { name: 'Lire & Écrire (Langue Natale)', category: 'Connaissances', baseVal: 10, description: 'Déchiffrer et tracer les rouleaux de parchemin.' },

  // Magie
  { name: 'Méditation Sacrée', category: 'Magie', baseVal: 20, description: 'Centrer son esprit, accélérer la récupération des PM et préparer les rituels.' },
  { name: 'Combat Spirituel', category: 'Magie', baseVal: 30, description: 'Attaquer et se défendre contre les esprits incorporels dans l\'Autre Monde.' },
  { name: 'Connaissance des Esprits', category: 'Magie', baseVal: 20, description: 'Identifier les esprits de la nature, ancêtres et esprits élémentaires.' },
  { name: 'Cérémonie Magique', category: 'Magie', baseVal: 15, description: 'Officier lors des sacrifices rituels et des grandes quêtes héroïques.' },
  { name: 'Connaissance des Runes', category: 'Magie', baseVal: 15, description: 'Analyser les flux runiques cosmiques et les inscriptions magiques.' },

  // Manipulation
  { name: 'Artisanat (Forge du Bronze)', category: 'Manipulation', baseVal: 20, description: 'Forger épées, pointes de lance et armures métalliques.' },
  { name: 'Artisanat (Cuir & Peaux)', category: 'Manipulation', baseVal: 25, description: 'Travailler le cuir, fabriquer des harnais et armures souples.' },
  { name: 'Tour de Passe-passe', category: 'Manipulation', baseVal: 15, description: 'Dérober discrètement des bourses ou dissimuler un poignard.' },
  { name: 'Crochetage & Mécanismes', category: 'Manipulation', baseVal: 10, description: 'Forcer coffres, verrous de bronze et désamorcer des pièges.' },

  // Perception
  { name: 'Perception Visuelle', category: 'Perception', baseVal: 25, description: 'Repérer un ennemi embusqué, des indices ou des détails cachés.' },
  { name: 'Perception Auditive', category: 'Perception', baseVal: 25, description: 'Entendre des bruits de pas feutrés ou des incantations lointaines.' },
  { name: 'Flair & Goût', category: 'Perception', baseVal: 20, description: 'Détecter la présence du Chaos, des poisons ou du gibier au vent.' },
  { name: 'Pistage', category: 'Perception', baseVal: 20, description: 'Suivre la piste d\'hommes, de bêtes et d\'esprits dans la boue ou les rochers.' },
  { name: 'Sens du Danger', category: 'Perception', baseVal: 25, description: 'Pressentir une embuscade imminente ou un péril mortel.' },
  { name: 'Scruter l\'Autre Côté', category: 'Perception', baseVal: 20, description: 'Apercevoir les auras spirituelles et les passages vers le Monde des Dieux.' },

  // Furtivité
  { name: 'Furtivité & Dissimulation', category: 'Furtivité', baseVal: 20, description: 'Se fondre dans la pénombre, les taillis et derrière les rochers.' },
  { name: 'Déplacement Silencieux', category: 'Furtivité', baseVal: 20, description: 'Marcher sans faire craquer les brindilles ni tinter son armure.' },

  // Armes & Boucliers
  { name: 'Épée Large 1M', category: 'Armes', baseVal: 20, description: 'Maniement de l\'épée large sartarite en bronze.' },
  { name: 'Épée Bâtarde / 2M', category: 'Armes', baseVal: 15, description: 'Épée longue redoutable tenue à deux mains.' },
  { name: 'Épée Courte', category: 'Armes', baseVal: 20, description: 'Glaive court maniable au corps à corps serré.' },
  { name: 'Dague de Combat', category: 'Armes', baseVal: 25, description: 'Poignard de bronze ou couteau de chasse.' },
  { name: 'Hache de Bataille 1M', category: 'Armes', baseVal: 20, description: 'Hache tranchante à une main pour fendre les boucliers.' },
  { name: 'Grande Hache 2M', category: 'Armes', baseVal: 15, description: 'Hache d\'abattage massive de guerrier des tempêtes.' },
  { name: 'Lance Courte 1M', category: 'Armes', baseVal: 25, description: 'Lance d\'hoplite utilisée avec un bouclier.' },
  { name: 'Lance de Cavalerie (Contus)', category: 'Armes', baseVal: 15, description: 'Lance longue maniable à dos de monture en charge.' },
  { name: 'Pique Longue 2M', category: 'Armes', baseVal: 15, description: 'Pique de rang de bataille pour repousser la cavalerie.' },
  { name: 'Masse d\'Armes / Gourdin', category: 'Armes', baseVal: 25, description: 'Arme contondante pour écraser les casques et carapaces.' },
  { name: 'Fléau d\'Armes', category: 'Armes', baseVal: 15, description: 'Chaîne et boule de bronze pour contourner les parades.' },
  { name: 'Arc Composite', category: 'Armes', baseVal: 20, description: 'Arc puissant renforcé de corne et de tendons.' },
  { name: 'Arc Court', category: 'Armes', baseVal: 25, description: 'Arc de chasse maniable en sous-bois.' },
  { name: 'Arbalète Lourde', category: 'Armes', baseVal: 15, description: 'Arbalète de forteresse perforant les armures de bronze.' },
  { name: 'Javelot de Guerre', category: 'Armes', baseVal: 20, description: 'Arme de jet percutante avant le choc au corps à corps.' },
  { name: 'Fronde de Cuir', category: 'Armes', baseVal: 20, description: 'Lanière de cuir propulsant des billes de plomb ou pierres.' },
  { name: 'Pugilat / Lutte', category: 'Armes', baseVal: 30, description: 'Combat à mains nues, clés articulaires et prises.' },
  { name: 'Bouclier Moyen Rond', category: 'Boucliers', baseVal: 20, description: 'Bouclier de bois cerclé de bronze (12 PV).' },
  { name: 'Grand Bouclier d\'Hoplite', category: 'Boucliers', baseVal: 15, description: 'Bouclier concave couvrant tout le torse et les cuisses (16 PV).' },
  { name: 'Targe Légère', category: 'Boucliers', baseVal: 25, description: 'Petit bouclier attaché à l\'avant-bras (8 PV).' },
];

export const STANDARD_WEAPONS_CATALOG: Omit<Weapon, 'id'>[] = [
  {
    name: 'Épée large en bronze (1M)',
    category: 'Corps à corps',
    sr: 2,
    damage: '1D8+1',
    hasDamageBonus: true,
    hpMax: 12,
    hpCurrent: 12,
    skillName: 'Épée Large 1M',
    notes: 'Lame d\'airain standard des thanes et hoplites sartarites.',
  },
  {
    name: 'Épée bâtarde (1M / 2M)',
    category: 'Corps à corps',
    sr: 2,
    damage: '1D10+1',
    hasDamageBonus: true,
    hpMax: 12,
    hpCurrent: 12,
    skillName: 'Épée Bâtarde / 2M',
    notes: 'Peut être maniée à 1 ou 2 mains. Idéale pour fendre armures.',
  },
  {
    name: 'Épée courte / Glaive (1M)',
    category: 'Corps à corps',
    sr: 3,
    damage: '1D6+1',
    hasDamageBonus: true,
    hpMax: 10,
    hpCurrent: 10,
    skillName: 'Épée Courte',
    notes: 'Très rapide en combat rapproché ou en mêlée dense.',
  },
  {
    name: 'Dague de combat en bronze',
    category: 'Corps à corps',
    sr: 4,
    damage: '1D4+2',
    hasDamageBonus: true,
    hpMax: 6,
    hpCurrent: 6,
    skillName: 'Dague de Combat',
    notes: 'Arme de secours ou de botte secrète.',
  },
  {
    name: 'Hache de bataille en bronze (1M)',
    category: 'Corps à corps',
    sr: 3,
    damage: '1D8+2',
    hasDamageBonus: true,
    hpMax: 10,
    hpCurrent: 10,
    skillName: 'Hache de Bataille 1M',
    notes: 'Dégâts tranchants dévastateurs.',
  },
  {
    name: 'Grande Hache de guerre (2M)',
    category: 'Corps à corps',
    sr: 1,
    damage: '2D6+2',
    hasDamageBonus: true,
    hpMax: 12,
    hpCurrent: 12,
    skillName: 'Grande Hache 2M',
    notes: 'Arme à deux mains terrifiante de la confrérie des Tempêtes.',
  },
  {
    name: 'Lance courte d\'hoplite (1M)',
    category: 'Corps à corps',
    sr: 2,
    damage: '1D6+1',
    hasDamageBonus: true,
    hpMax: 10,
    hpCurrent: 10,
    skillName: 'Lance Courte 1M',
    notes: 'Utilisée avec bouclier en formation de phalange.',
  },
  {
    name: 'Lance de cavalerie / Contus (2M)',
    category: 'Corps à corps',
    sr: 1,
    damage: '1D10+1',
    hasDamageBonus: true,
    hpMax: 12,
    hpCurrent: 12,
    skillName: 'Lance de Cavalerie (Contus)',
    notes: 'Frappe mortelle au galop.',
  },
  {
    name: 'Masse d\'armes de bronze (1M)',
    category: 'Corps à corps',
    sr: 3,
    damage: '1D6+2',
    hasDamageBonus: true,
    hpMax: 10,
    hpCurrent: 10,
    skillName: 'Masse d\'Armes / Gourdin',
    notes: 'Efficace contre les armures de mailles ou de cuir.',
  },
  {
    name: 'Arc composite de chasse',
    category: 'Distance',
    sr: 1,
    damage: '1D8+1',
    hasDamageBonus: false,
    hpMax: 7,
    hpCurrent: 7,
    skillName: 'Arc Composite',
    range: '100 mètres',
    notes: 'Tir à 1/3 rounds ou 1/round selon dextérité.',
  },
  {
    name: 'Arc court en if',
    category: 'Distance',
    sr: 2,
    damage: '1D6+1',
    hasDamageBonus: false,
    hpMax: 5,
    hpCurrent: 5,
    skillName: 'Arc Court',
    range: '80 mètres',
    notes: 'Léger et maniable en forêt.',
  },
  {
    name: 'Javelot de guerre (x3)',
    category: 'Distance',
    sr: 1,
    damage: '1D10',
    hasDamageBonus: true,
    hpMax: 8,
    hpCurrent: 8,
    skillName: 'Javelot de Guerre',
    range: '30 mètres',
    notes: 'Lourd projectile en pointe de bronze.',
  },
  {
    name: 'Fronde de cuir et galets',
    category: 'Distance',
    sr: 2,
    damage: '1D8',
    hasDamageBonus: false,
    hpMax: 4,
    hpCurrent: 4,
    skillName: 'Fronde de Cuir',
    range: '80 mètres',
    notes: 'Silencieuse et munitions gratuites sur le terrain.',
  },
  {
    name: 'Bouclier moyen rond (Bronze)',
    category: 'Bouclier',
    sr: 3,
    damage: '1D4',
    hasDamageBonus: true,
    hpMax: 12,
    hpCurrent: 12,
    skillName: 'Bouclier Moyen Rond',
    notes: 'Absorption de 12 PV lors d\'une parade réussie.',
  },
  {
    name: 'Grand Bouclier d\'Hoplite (Aspis)',
    category: 'Bouclier',
    sr: 2,
    damage: '1D6',
    hasDamageBonus: true,
    hpMax: 16,
    hpCurrent: 16,
    skillName: 'Grand Bouclier d\'Hoplite',
    notes: 'Absorption massive de 16 PV. Protège aussi la cuisse.',
  },
  {
    name: 'Targe légère de tirailleur',
    category: 'Bouclier',
    sr: 3,
    damage: '1D3',
    hasDamageBonus: true,
    hpMax: 8,
    hpCurrent: 8,
    skillName: 'Targe Légère',
    notes: 'Fixée à l\'avant-bras, n\'entrave pas les tirs à l\'arc.',
  },
];

export const STANDARD_GEAR_CATALOG: StandardGearItem[] = [
  // Survie & Voyage
  { id: 'g_sac', name: 'Sac à dos en cuir renforcé', category: 'Survie & Voyage', description: 'Capacité de 20 kg d\'équipement avec sangles de bronze.', costLunars: 5, encumbrance: 1 },
  { id: 'g_corde', name: 'Corde de chanvre tressée (15m)', category: 'Survie & Voyage', description: 'Résiste au poids de 3 guerriers armurés.', costLunars: 3, encumbrance: 2 },
  { id: 'g_torches', name: 'Torches suiffées (lot de 6)', category: 'Survie & Voyage', description: 'Chaque torche brûle pendant 1 heure.', costLunars: 1, encumbrance: 2 },
  { id: 'g_briquet', name: 'Briquet, amadou et silex', category: 'Survie & Voyage', description: 'Allumage rapide d\'un feu de camp par tout temps.', costLunars: 2, encumbrance: 0 },
  { id: 'g_outre', name: 'Outre d\'eau ou vin de Sartar (2L)', category: 'Survie & Voyage', description: 'Cuir bouilli étanche.', costLunars: 1, encumbrance: 2 },
  { id: 'g_rations', name: 'Rations de voyage de fer (1 semaine)', category: 'Survie & Voyage', description: 'Viande séchée de bison, galettes d\'orge et fromage d\'Ernalda.', costLunars: 5, encumbrance: 3 },
  { id: 'g_tente', name: 'Tente de toile pour 2 personnes', category: 'Survie & Voyage', description: 'Toile huilée imperméable et piquets de frêne.', costLunars: 10, encumbrance: 4 },
  { id: 'g_couverture', name: 'Couverture de laine chaude', category: 'Survie & Voyage', description: 'Laine épaisse tissée d\'Heortland.', costLunars: 2, encumbrance: 1 },

  // Soins & Alchimie
  { id: 'g_trousse_soin', name: 'Trousse de soins de Chalana Arroy', category: 'Soins & Alchimie', description: 'Bandelettes de lin propres, aiguilles de bronze, baume antiseptique (+10% aux Premiers Soins).', costLunars: 15, encumbrance: 1 },
  { id: 'g_herbes', name: 'Herbes médicinales séchées (3 doses)', category: 'Soins & Alchimie', description: 'Infusion qui accélère la récupération de 2 PV par jour.', costLunars: 8, encumbrance: 0 },
  { id: 'g_antivenin', name: 'Fiole d\'onguent anti-venin praxien', category: 'Soins & Alchimie', description: 'Neutralise le poison d\'araignées géantes ou scorpions (CON vs POU du venin).', costLunars: 25, encumbrance: 0 },
  { id: 'g_potion_pm', name: 'Élixir de restitution magique', category: 'Soins & Alchimie', description: 'Restaure 1D6 Points de Magie immédiatement.', costLunars: 40, encumbrance: 0 },

  // Sacré & Magie
  { id: 'g_cristal_pm', name: 'Cristal de stockage magique (4 PM)', category: 'Sacré & Magie', description: 'Cristal taillé contenant 4 PM disponibles pour tout sort.', costLunars: 150, encumbrance: 0 },
  { id: 'g_symbole_culte', name: 'Symbole sacré en bronze gravé', category: 'Sacré & Magie', description: 'Rune ornée bénie par le Grand Prêtre du Culte (+5% aux Cérémonies).', costLunars: 20, encumbrance: 0 },
  { id: 'g_tambour', name: 'Tambour rituel chamanique en peau', category: 'Sacré & Magie', description: 'Utilisé pour entrer en transe et appeler les esprits alliés.', costLunars: 18, encumbrance: 1 },
  { id: 'g_encens', name: 'Encens sacré de sanctuaire (lot de 5)', category: 'Sacré & Magie', description: 'Brûlé lors des prières quotidiennes aux Dieux.', costLunars: 6, encumbrance: 0 },

  // Outils & Artisanat
  { id: 'g_crochets', name: 'Trousse de crochetage de précision', category: 'Outils & Artisanat', description: 'Piges et crochets en bronze trempé (+10% en Crochetage).', costLunars: 30, encumbrance: 0 },
  { id: 'g_outils_forge', name: 'Outils d\'artisanat portatifs', category: 'Outils & Artisanat', description: 'Marteau, burin, limes et pinces à métaux.', costLunars: 25, encumbrance: 3 },
  { id: 'g_parchemin', name: 'Rouleaux de parchemin et encres', category: 'Outils & Artisanat', description: '5 feuilles de vélin vierge, plume d\'aigle et encres sépia.', costLunars: 12, encumbrance: 1 },

  // Montures & Animaux
  { id: 'g_cheval', name: 'Cheval de selle sartarite', category: 'Montures & Animaux', description: 'Robuste monture de montagne des Collines.', costLunars: 100, encumbrance: 0 },
  { id: 'g_harnais', name: 'Selle de guerre et sacoches en cuir', category: 'Montures & Animaux', description: 'Équipement complet de cavalier.', costLunars: 20, encumbrance: 2 },
  { id: 'g_chien', name: 'Chien de guerre et de chasse dressé', category: 'Montures & Animaux', description: 'Fidèle compagnon canin (Alerte et morsure 1D6).', costLunars: 40, encumbrance: 0 },

  // Luxe & Commerce
  { id: 'g_cape_soie', name: 'Cape d\'apparat en laine brodée d\'or', category: 'Luxe & Commerce', description: 'Portée par les nobles et marchands d\'Issaries (+5% en Éloquence).', costLunars: 60, encumbrance: 1 },
  { id: 'g_bijoux', name: 'Torque de cou en bronze ciselé', category: 'Luxe & Commerce', description: 'Signe distinctif de noblesse et de haut lignage.', costLunars: 45, encumbrance: 0 },
];
