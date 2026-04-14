// Mock Data
export interface Owner { id: string; name: string; avatar: string; phone?: string; }
export type AppRole = 'USER' | 'ADMIN';
export interface AppUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  roles: AppRole[];
}
export interface Pet {
  id: string; name: string; species: 'dog' | 'cat' | 'bird' | 'other';
  breed: string; age: number; gender: 'male' | 'female';
  distance: number; photos: string[]; bio: string; traits: string[];
  owner: Owner; isOnline: boolean;
  // Extended profile fields
  personalityTags?: string[]; vaccineStatus?: 'vaccinated' | 'partial' | 'none';
  favoriteActivities?: string[]; gallery?: string[]; isMatched?: boolean;
}
export interface ChatMessage { id: string; text: string; isMine: boolean; timestamp: Date; }
export interface Conversation {
  id: string; pet: Pet; messages: ChatMessage[];
  lastMessage: string; lastMessageTime: Date; unreadCount: number;
}

// Pet images
const petPhoto = (n: number) => `https://placedog.net/600/800?id=${n}`;
const petThumb = (n: number) => `https://placedog.net/80/80?id=${n}`;
const catPhoto = (n: number) => `https://loremflickr.com/600/800/cat?lock=${n}`;
const catThumb = (n: number) => `https://loremflickr.com/80/80/cat?lock=${n + 1}`;

export const mockPets: Pet[] = [
  {
    id: '1', name: 'Luna 🌙', species: 'dog', breed: 'Golden Retriever', age: 18, gender: 'female',
    distance: 2.5, photos: [petPhoto(100)], bio: 'Luna loves long walks in the park! Always happy and energetic.',
    traits: ['Playful', 'Friendly', 'Vaccinated'], owner: { id: 'o1', name: 'Sarah Chen', avatar: petThumb(100) },
    isOnline: true, personalityTags: ['Energetic', 'Social', 'Loves water'], vaccineStatus: 'vaccinated',
    favoriteActivities: ['Beach walks', 'Fetch', 'Swimming'], gallery: [petPhoto(101), petPhoto(102), petPhoto(103)],
  },
  {
    id: '2', name: 'Max 🐾', species: 'dog', breed: 'French Bulldog', age: 24, gender: 'male',
    distance: 3.1, photos: [petPhoto(200)], bio: 'Max is a chill dude who loves naps and snuggles.',
    traits: ['Calm', 'Affectionate', 'Friendly'], owner: { id: 'o2', name: 'Mike Rodriguez', avatar: petThumb(200) },
    isOnline: false, personalityTags: ['Relaxed', 'Cuddly', 'Good with kids'], vaccineStatus: 'vaccinated',
    favoriteActivities: ['Napping', 'Couch surfing', 'Snack time'], gallery: [petPhoto(201), petPhoto(202)],
  },
  {
    id: '3', name: 'Whiskers 🐱', species: 'cat', breed: 'British Shorthair', age: 12, gender: 'male',
    distance: 1.8, photos: [catPhoto(300)], bio: 'Whiskers is sophisticated and independent. Prefers his space but loves chin scratches.',
    traits: ['Elegant', 'Independent', 'Quiet'], owner: { id: 'o3', name: 'Emily Watson', avatar: catThumb(300) },
    isOnline: true, personalityTags: ['Dignified', 'Calm', 'Low maintenance'], vaccineStatus: 'vaccinated',
    favoriteActivities: ['Bird watching', 'Napping', 'Grooming'], gallery: [catPhoto(301), catPhoto(302), catPhoto(303)],
  },
  {
    id: '4', name: 'Bella 🌸', species: 'dog', breed: 'Labrador', age: 30, gender: 'female',
    distance: 4.2, photos: [petPhoto(400)], bio: 'Bella is the friendliest dog! Loves everyone she meets.',
    traits: ['Adventurous', 'Friendly', 'Gentle'], owner: { id: 'o4', name: 'David Kim', avatar: petThumb(400) },
    isOnline: true, personalityTags: ['Outgoing', 'Gentle', 'Obedient'], vaccineStatus: 'vaccinated',
    favoriteActivities: ['Hiking', 'Picnics', 'Play dates'], gallery: [petPhoto(401), petPhoto(402)],
  },
  {
    id: '5', name: 'Mochi 🍡', species: 'cat', breed: 'Scottish Fold', age: 8, gender: 'female',
    distance: 0.5, photos: [catPhoto(500)], bio: 'Mochi is tiny but mighty! Loves to play and cuddle.',
    traits: ['Cuddly', 'Sweet', 'Playful'], owner: { id: 'o5', name: 'Anna Lee', avatar: catThumb(500) },
    isOnline: false, personalityTags: ['Playful', 'Curious', 'Vocal'], vaccineStatus: 'partial',
    favoriteActivities: ['Climbing', 'Playing with toys', 'Purring sessions'], gallery: [catPhoto(501), catPhoto(502)],
  },
  {
    id: '6', name: 'Charlie 🐶', species: 'dog', breed: 'Beagle', age: 36, gender: 'male',
    distance: 5.0, photos: [petPhoto(600)], bio: 'Charlie has an excellent nose! Always following interesting scents.',
    traits: ['Curious', 'Social', 'Playful'], owner: { id: 'o6', name: 'Tom Baker', avatar: petThumb(600) },
    isOnline: true, personalityTags: ['Adventurous', 'Friendly', 'Food-motivated'], vaccineStatus: 'vaccinated',
    favoriteActivities: ['Exploring', 'Sniffing', 'Playing with other dogs'], gallery: [petPhoto(601), petPhoto(602), petPhoto(603)],
  },
  {
    id: '7', name: 'Cleo 👑', species: 'cat', breed: 'Maine Coon', age: 20, gender: 'female',
    distance: 2.9, photos: [catPhoto(700)], bio: 'Cleo is fluffy royalty! Gentle giant who loves attention.',
    traits: ['Regal', 'Majestic', 'Gentle'], owner: { id: 'o7', name: 'Sophie Martin', avatar: catThumb(700) },
    isOnline: false, personalityTags: ['Gentle', 'Patient', 'Affectionate'], vaccineStatus: 'vaccinated',
    favoriteActivities: ['Grooming', 'Perching', 'Bird watching'], gallery: [catPhoto(701), catPhoto(702)],
  },
  {
    id: '8', name: 'Buddy 😊', species: 'dog', breed: 'Corgi', age: 14, gender: 'male',
    distance: 1.2, photos: [petPhoto(800)], bio: "Buddy's got the best smile! Herding dog with endless energy.",
    traits: ['Smart', 'Energetic', 'Loyal'], owner: { id: 'o8', name: 'James Wilson', avatar: petThumb(800) },
    isOnline: true, personalityTags: ['Intelligent', 'Active', 'Loyal'], vaccineStatus: 'vaccinated',
    favoriteActivities: ['Herding', 'Running', 'Agility'], gallery: [petPhoto(801), petPhoto(802)],
  },
];

// Mutual matches (two-way likes)
export const mockMatches: Pet[] = mockPets.slice(0, 4).map(p => ({ ...p, isMatched: true }));

export const mockConversations: Conversation[] = [
  {
    id: 'c1', pet: mockPets[0], messages: [
      { id: 'm1', text: 'Hi! Luna would love a playdate! 🐕', isMine: false, timestamp: new Date(Date.now() - 3600000) },
      { id: 'm2', text: 'That sounds great! When are you free?', isMine: true, timestamp: new Date(Date.now() - 3000000) },
      { id: 'm3', text: 'How about Saturday afternoon at the park?', isMine: false, timestamp: new Date(Date.now() - 1800000) },
    ],
    lastMessage: 'How about Saturday afternoon at the park?', lastMessageTime: new Date(Date.now() - 1800000), unreadCount: 1,
  },
  {
    id: 'c2', pet: mockPets[2], messages: [
      { id: 'm4', text: 'Hey! Whiskers seemed interested 😸', isMine: false, timestamp: new Date(Date.now() - 86400000) },
    ],
    lastMessage: 'Hey! Whiskers seemed interested', lastMessageTime: new Date(Date.now() - 86400000), unreadCount: 0,
  },
  {
    id: 'c3', pet: mockPets[3], messages: [
      { id: 'm5', text: 'Bella says hi! 🐾', isMine: false, timestamp: new Date() },
    ],
    lastMessage: 'Bella says hi!', lastMessageTime: new Date(), unreadCount: 2,
  },
];

export const currentUser: AppUser = {
  id: 'user1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: petThumb(900),
  roles: ['ADMIN'],
};

export const currentAdminCredentials = {
  username: 'admin',
  password: 'Admin123!',
};
