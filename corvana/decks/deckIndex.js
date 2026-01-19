// Corvana Deck Index - Central registry for all presentation decks
import { flagshipDeck_v1 } from './flagshipDeck_v1.js'
import { flagshipDeck_elite } from './flagshipDeck_elite.js'
import { managerDeck_v1 } from './managerDeck_v1.js'
import { labelAgencyDeck_v1 } from './labelAgencyDeck_v1.js'
import { investorLiteDeck_v1 } from './investorLiteDeck_v1.js'

// Deck metadata for listing page
export const deckIndex = [
  {
    slug: 'mbq-flagship-elite',
    title: 'MBQ Flagship ELITE',
    subtitle: 'Live Artist Surfaces + Momentum Intelligence',
    version: 'elite',
    slideCount: 13,
    tags: ['Flagship', 'Primary'],
    lastUpdated: 'Jan 2026',
    isPrimary: true
  },
  {
    slug: 'mbq-flagship-v1',
    title: 'MBQ Flagship Deck v1',
    subtitle: 'Live Artist Surface + Momentum Intelligence Layer',
    version: 'v1',
    slideCount: 6,
    tags: ['Flagship'],
    lastUpdated: 'Dec 2025',
    isPrimary: false
  },
  {
    slug: 'mbq-manager-v1',
    title: 'Manager Deck',
    subtitle: 'Fan Journey, Conversion & Touring Intelligence',
    version: 'v1',
    slideCount: 8,
    tags: ['Manager'],
    lastUpdated: 'Jan 2026',
    isPrimary: false
  },
  {
    slug: 'mbq-agency-v1',
    title: 'Label / Agency Deck',
    subtitle: 'Roster Momentum & Signal Intelligence',
    version: 'v1',
    slideCount: 7,
    tags: ['Label', 'Agency'],
    lastUpdated: 'Jan 2026',
    isPrimary: false
  },
  {
    slug: 'mbq-investor-lite-v1',
    title: 'Investor Lite Deck',
    subtitle: 'Category, Moat & Revenue Primitives',
    version: 'v1',
    slideCount: 6,
    tags: ['Investor'],
    lastUpdated: 'Jan 2026',
    isPrimary: false
  }
]

// Map slugs to deck definitions
const deckDefinitions = {
  'mbq-flagship-elite': flagshipDeck_elite,
  'mbq-flagship-v1': flagshipDeck_v1,
  'mbq-manager-v1': managerDeck_v1,
  'mbq-agency-v1': labelAgencyDeck_v1,
  'mbq-investor-lite-v1': investorLiteDeck_v1
}

// Get deck definition by slug
export function getDeckBySlug(slug) {
  const deck = deckDefinitions[slug]
  if (!deck) {
    throw new Error(`Deck "${slug}" not found`)
  }
  return deck
}

// Get all deck metadata
export function getAllDecks() {
  return deckIndex
}
