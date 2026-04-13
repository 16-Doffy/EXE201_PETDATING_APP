import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Pet, Conversation, mockPets, mockConversations, currentUser } from '@/constants/mockData';

interface AppState {
  favorites: string[];
  pets: Pet[];
  conversations: Conversation[];
  user: typeof currentUser;
  hasCompletedOnboarding: boolean;
  selectedCategory: 'all' | 'dog' | 'cat' | 'bird' | 'other';
  selectedGender: 'all' | 'male' | 'female';
}

type AppAction = { type: 'TOGGLE_FAVORITE'; petId: string } | { type: 'SET_CATEGORY'; category: AppState['selectedCategory'] } | { type: 'SET_GENDER'; gender: AppState['selectedGender'] } | { type: 'COMPLETE_ONBOARDING' };

const initialState: AppState = {
  favorites: ['1', '3'],
  pets: mockPets,
  conversations: mockConversations,
  user: { ...currentUser },
  hasCompletedOnboarding: false,
  selectedCategory: 'all',
  selectedGender: 'all',
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'TOGGLE_FAVORITE':
      return { ...state, favorites: state.favorites.includes(action.petId) ? state.favorites.filter(id => id !== action.petId) : [...state.favorites, action.petId] };
    case 'SET_CATEGORY': return { ...state, selectedCategory: action.category };
    case 'SET_GENDER': return { ...state, selectedGender: action.gender };
    case 'COMPLETE_ONBOARDING': return { ...state, hasCompletedOnboarding: true };
    default: return state;
  }
}

interface AppContextType {
  state: AppState;
  toggleFavorite: (petId: string) => void;
  setCategory: (category: AppState['selectedCategory']) => void;
  setGender: (gender: AppState['selectedGender']) => void;
  completeOnboarding: () => void;
  getFilteredPets: () => Pet[];
  getFavoritePets: () => Pet[];
  getPetById: (id: string) => Pet | undefined;
  getConversationByPetId: (petId: string) => Conversation | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const toggleFavorite = (petId: string) => dispatch({ type: 'TOGGLE_FAVORITE', petId });
  const setCategory = (category: AppState['selectedCategory']) => dispatch({ type: 'SET_CATEGORY', category });
  const setGender = (gender: AppState['selectedGender']) => dispatch({ type: 'SET_GENDER', gender });
  const completeOnboarding = () => dispatch({ type: 'COMPLETE_ONBOARDING' });
  const getFilteredPets = () => {
    let filtered = state.pets;
    if (state.selectedCategory !== 'all') filtered = filtered.filter(p => p.species === state.selectedCategory);
    if (state.selectedGender !== 'all') filtered = filtered.filter(p => p.gender === state.selectedGender);
    return filtered;
  };
  const getFavoritePets = () => state.pets.filter(p => state.favorites.includes(p.id));
  const getPetById = (id: string) => state.pets.find(p => p.id === id);
  const getConversationByPetId = (petId: string) => state.conversations.find(c => c.pet.id === petId);

  return (
    <AppContext.Provider value={{ state, toggleFavorite, setCategory, setGender, completeOnboarding, getFilteredPets, getFavoritePets, getPetById, getConversationByPetId }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
