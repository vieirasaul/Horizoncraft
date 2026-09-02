import type { Character, GalleryItem, Story } from "@/lib/types";

export const demoStories: Story[] = [
  {
    id: "story-birthday",
    slug: "parabens-theo",
    title: "Parabéns, Théo!",
    synopsis: "O Horizoncraft agora tem um lugar só dele.",
    category: "Mensagem especial",
    progress: "complete",
    status: "published",
    featured: true,
    coverUrl: null,
    accent: "blue",
    publishedAt: null,
    chapters: [
      {
        id: "chapter-birthday",
        slug: "bem-vindo-ao-seu-universo",
        title: "Uma aventura muito especial começa hoje",
        chapterNumber: 1,
        status: "published",
        publishedAt: null,
        content: [
          // Edit the birthday message in these blocks before publishing.
          { id: "birthday-1", type: "heading", text: "Parabéns, Théo!" },
          {
            id: "birthday-2",
            type: "paragraph",
            text: "O Horizoncraft foi criado para ser o lugar onde suas ideias podem ganhar vida. Agora seus heróis, poderes, desenhos e aventuras têm um universo próprio para crescer.",
          },
          {
            id: "birthday-3",
            type: "paragraph",
            text: "Esta é apenas a primeira página de muitas histórias que ainda serão criadas. Você poderá mudar tudo, inventar novos personagens, revelar vilões e construir esse mundo do seu jeito.",
          },
          {
            id: "birthday-4",
            type: "quote",
            text: "Que nunca faltem ideias, coragem e aventuras.",
          },
          {
            id: "birthday-5",
            type: "paragraph",
            text: "Feliz aniversário — e bem-vindo ao seu próprio universo!",
          },
        ],
      },
    ],
  },
];

export const demoCharacters: Character[] = [
  {
    id: "character-red-skull",
    slug: "caveira-vermelha",
    name: "Caveira Vermelha",
    role: "hero",
    shortDescription:
      "Um herói mascarado que domina o fogo, atravessa portais e enfrenta seus desafios usando poderosas correntes.",
    biography: "",
    weaknesses: [],
    curiosities: [],
    imageUrl: null,
    accent: "red",
    sortOrder: 1,
    featured: true,
    storySlug: null,
    groupName: null,
    status: "published",
    powers: [
      {
        id: "power-fire",
        name: "Controle do fogo",
        description: "Controla e utiliza fogo durante as batalhas.",
      },
      {
        id: "power-portals",
        name: "Criação de portais",
        description: "Cria portais para atravessar grandes distâncias.",
      },
      {
        id: "power-teleport",
        name: "Teletransporte",
        description: "Usa seus portais para se teletransportar.",
      },
      {
        id: "power-chains",
        name: "Combate com correntes",
        description: "Utiliza correntes durante os combates.",
      },
    ],
  },
  {
    id: "character-lightning",
    slug: "kauan-raio",
    name: "Kauan Raio",
    role: "hero",
    shortDescription:
      "Após recuperar o controle de seu corpo, Kauan Raio passou a carregar a energia da misteriosa entidade Kairay.",
    biography:
      "Kauan Raio foi possuído pela entidade misteriosa Kairay. Ele conseguiu retomar o controle do próprio corpo e absorveu os poderes da entidade.",
    weaknesses: [],
    curiosities: [],
    imageUrl: null,
    accent: "yellow",
    sortOrder: 2,
    featured: true,
    storySlug: null,
    groupName: null,
    status: "published",
    powers: [
      {
        id: "power-electricity",
        name: "Controle de eletricidade",
        description: "Controla energia elétrica.",
      },
      {
        id: "power-lightning",
        name: "Criação de raios",
        description: "Cria raios para usar em ação.",
      },
      {
        id: "power-electric-attacks",
        name: "Ataques elétricos",
        description: "Canaliza eletricidade em seus ataques.",
      },
      {
        id: "power-kairay",
        name: "Energia de Kairay",
        description: "Carrega a energia absorvida da entidade Kairay.",
      },
    ],
  },
  {
    id: "character-metanic",
    slug: "metanic",
    name: "Metanic",
    role: "hero",
    shortDescription:
      "Um herói capaz de transformar seu corpo em diferentes materiais e adaptar suas habilidades a cada desafio.",
    biography: "",
    weaknesses: [],
    curiosities: [],
    imageUrl: null,
    accent: "green",
    sortOrder: 3,
    featured: true,
    storySlug: null,
    groupName: null,
    status: "published",
    powers: [
      {
        id: "power-steel",
        name: "Transformação em aço",
        description: "Transforma o próprio corpo em aço.",
      },
      {
        id: "power-wood",
        name: "Transformação em madeira",
        description: "Transforma o próprio corpo em madeira.",
      },
      {
        id: "power-mercury",
        name: "Transformação em mercúrio",
        description: "Transforma o próprio corpo em mercúrio.",
      },
      {
        id: "power-material",
        name: "Adaptação material",
        description: "Escolhe um material de acordo com o desafio.",
      },
    ],
  },
  {
    id: "character-phantom",
    slug: "blood-phantom",
    name: "Blood Phantom",
    role: "hero",
    shortDescription:
      "Um herói fantasmagórico capaz de atravessar obstáculos, projetar energia espectral e assumir temporariamente o controle de outras pessoas.",
    biography: "",
    weaknesses: [],
    curiosities: [],
    imageUrl: null,
    accent: "violet",
    sortOrder: 4,
    featured: true,
    storySlug: null,
    groupName: null,
    status: "published",
    powers: [
      {
        id: "power-intangibility",
        name: "Intangibilidade",
        description: "Torna o corpo intangível.",
      },
      {
        id: "power-walls",
        name: "Travessia de paredes",
        description: "Atravessa paredes e outras superfícies.",
      },
      {
        id: "power-possession",
        name: "Possessão",
        description: "Controla temporariamente outras pessoas.",
      },
      {
        id: "power-phantom-attacks",
        name: "Ataques fantasmagóricos",
        description: "Projeta energia espectral em seus ataques.",
      },
    ],
  },
];

export const demoGallery: GalleryItem[] = [];
