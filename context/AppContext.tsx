import React, { createContext, useContext, useReducer, ReactNode, useState } from 'react';
import { Pet, Conversation, mockPets, mockConversations, mockMatches, currentUser } from '@/constants/mockData';

interface AppState {
  favorites: string[];
  pets: Pet[];
  matches: string[];
  conversations: Conversation[];
  user: typeof currentUser;
  hasCompletedOnboarding: boolean;
  selectedCategory: 'all' | 'dog' | 'cat' | 'bird' | 'other';
  selectedGender: 'all' | 'male' | 'female';
  // Explore filters
  searchQuery: string;
  maxDistance: number;
  minAge: number;
  maxAge: number;
  onlineOnly: boolean;
  newestOnly: boolean;
  sameInterests: boolean;
}

type AppAction =
  | { type: 'TOGGLE_FAVORITE'; petId: string }
  | { type: 'SET_CATEGORY'; category: AppState['selectedCategory'] }
  | { type: 'SET_GENDER'; gender: AppState['selectedGender'] }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'ADD_CONVERSATION'; conversation: Conversation }
  | { type: 'SET_SEARCH'; query: string }
  | { type: 'SET_FILTERS'; filters: Partial<AppState> }

const initialState: AppState = {
  favorites: ['1', '3', '4'],
  pets: mockPets,
  matches: mockMatches.map(p => p.id),
  conversations: mockConversations,
  user: { ...currentUser },
  hasCompletedOnboarding: false,
  selectedCategory: 'all',
  selectedGender: 'all',
  searchQuery: '',
  maxDistance: 50,
  minAge: 0,
  maxAge: 120,
  onlineOnly: false,
  newestOnly: false,
  sameInterests: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'TOGGLE_FAVORITE':
      return { ...state, favorites: state.favorites.includes(action.petId) ? state.favorites.filter(id => id !== action.petId) : [...state.favorites, action.petId] };
    case 'SET_CATEGORY': return { ...state, selectedCategory: action.category };
    case 'SET_GENDER': return { ...state, selectedGender: action.gender };
    case 'COMPLETE_ONBOARDING': return { ...state, hasCompletedOnboarding: true };
    case 'ADD_CONVERSATION': return { ...state, conversations: [...state.conversations, action.conversation] };
    case 'SET_SEARCH': return { ...state, searchQuery: action.query };
    case 'SET_FILTERS': return { ...state, ...action.filters };
    default: return state;
  }
}

interface AppContextType {
  state: AppState;
  toggleFavorite: (petId: string) => void;
  setCategory: (category: AppState['selectedCategory']) => void;
  setGender: (gender: AppState['selectedGender']) => void;
  completeOnboarding: () => void;
  setSearch: (query: string) => void;
  setFilters: (filters: Partial<AppState>) => void;
  resetFilters: () => void;
  getFilteredPets: () => Pet[];
  getFavoritePets: () => Pet[];
  getMatchPets: () => Pet[];
  getPetById: (id: string) => Pet | undefined;
  getConversationByPetId: (petId: string) => Conversation | undefined;
  createConversation: (petId: string) => Conversation;
  getFilteredConversations: (filter: 'all' | 'unread' | 'online') => Conversation[];
  // Match popup state
  matchPopupPet: Pet | null;
  showMatchPopup: (pet: Pet) => void;
  hideMatchPopup: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [matchPopupPet, setMatchPopupPet] = useState<Pet | null>(null);

  const toggleFavorite = (petId: string) => dispatch({ type: 'TOGGLE_FAVORITE', petId });
  const setCategory = (category: AppState['selectedCategory']) => dispatch({ type: 'SET_CATEGORY', category });
  const setGender = (gender: AppState['selectedGender']) => dispatch({ type: 'SET_GENDER', gender });
  const completeOnboarding = () => dispatch({ type: 'COMPLETE_ONBOARDING' });
  const setSearch = (query: string) => dispatch({ type: 'SET_SEARCH', query });
  const setFilters = (filters: Partial<AppState>) => dispatch({ type: 'SET_FILTERS', filters: filters });
  const resetFilters = () => dispatch({ type: 'SET_FILTERS', filters: { maxDistance: 50, minAge: 0, maxAge: 120, onlineOnly: false, newestOnly: false, sameInterests: false } });

  const showMatchPopup = (pet: Pet) => setMatchPopupPet(pet);
  const hideMatchPopup = () => setMatchPopupPet(null);

  const getFilteredPets = () => {
    let filtered = state.pets;

    // Category filter
    if (state.selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.species === state.selectedCategory);
    }
    // Gender filter
    if (state.selectedGender !== 'all') {
      filtered = filtered.filter(p => p.gender === state.selectedGender);
    }
    // Search filter
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.breed.toLowerCase().includes(q) ||
        p.owner.name.toLowerCase().includes(q)
      );
    }
    // Advanced filters
    filtered = filtered.filter(p => p.distance <= state.maxDistance);
    if (state.onlineOnly) filtered = filtered.filter(p => p.isOnline);
    return filtered;
  };

  const getFavoritePets = () => state.pets.filter(p => state.favorites.includes(p.id));
  const getMatchPets = () => state.pets.filter(p => state.matches.includes(p.id));
  const getPetById = (id: string) => state.pets.find(p => p.id === id);
  const getConversationByPetId = (petId: string) => state.conversations.find(c => c.pet.id === petId);

  const createConversation = (petId: string): Conversation => {
    const existing = getConversationByPetId(petId);
    if (existing) return existing;
    const pet = getPetById(petId)!;
    const newConv: Conversation = { id: `c${Date.now()}`, pet, messages: [], lastMessage: '', lastMessageTime: new Date(), unreadCount: 0 };
    dispatch({ type: 'ADD_CONVERSATION', conversation: newConv });
    return newConv;
  };

  const getFilteredConversations = (filter: 'all' | 'unread' | 'online') => {
    switch (filter) {
      case 'unread': return state.conversations.filter(c => c.unreadCount > 0);
      case 'online': return state.conversations.filter(c => c.pet.isOnline);
      default: return state.conversations;
    }
  };

  return (
    <AppContext.Provider value={{
      state, toggleFavorite, setCategory, setGender, completeOnboarding,
      setSearch, setFilters, resetFilters,
      getFilteredPets, getFavoritePets, getMatchPets,
      getPetById, getConversationByPetId, createConversation, getFilteredConversations,
      matchPopupPet, showMatchPopup, hideMatchPopup,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}

// Alias so both naming conventions work
export const useApp = useAppContext;