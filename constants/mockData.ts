// Mock Data
export interface Owner { id: string; name: string; avatar: string; }
export interface Pet { id: string; name: string; species: 'dog' | 'cat' | 'bird' | 'other'; breed: string; age: number; gender: 'male' | 'female'; distance: number; photos: string[]; bio: string; traits: string[]; owner: Owner; isOnline: boolean; }
export interface ChatMessage { id: string; text: string; isMine: boolean; timestamp: Date; }
export interface Conversation { id: string; pet: Pet; messages: ChatMessage[]; lastMessage: string; lastMessageTime: Date; unreadCount: number; }

const photo = (n: number) => `https://i.pravatar.cc/400?img=${n}`;

export const mockPets: Pet[] = [
  { id: '1', name: 'Luna', species: 'dog', breed: 'Golden Retriever', age: 18, gender: 'female', distance: 2.5, photos: [photo(101)], bio: 'Luna loves long walks in the park!', traits: ['Playful', 'Friendly'], owner: { id: 'o1', name: 'Sarah Chen', avatar: photo(1) }, isOnline: true },
  { id: '2', name: 'Max', species: 'dog', breed: 'French Bulldog', age: 24, gender: 'male', distance: 3.1, photos: [photo(102)], bio: 'Max is a chill dude who loves naps.', traits: ['Calm', 'Affectionate'], owner: { id: 'o2', name: 'Mike Rodriguez', avatar: photo(3) }, isOnline: false },
  { id: '3', name: 'Whiskers', species: 'cat', breed: 'British Shorthair', age: 12, gender: 'male', distance: 1.8, photos: [photo(103)], bio: 'Whiskers is sophisticated and independent.', traits: ['Elegant', 'Independent'], owner: { id: 'o3', name: 'Emily Watson', avatar: photo(5) }, isOnline: true },
  { id: '4', name: 'Bella', species: 'dog', breed: 'Labrador', age: 30, gender: 'female', distance: 4.2, photos: [photo(104)], bio: 'Bella is the friendliest dog!', traits: ['Adventurous', 'Friendly'], owner: { id: 'o4', name: 'David Kim', avatar: photo(7) }, isOnline: true },
  { id: '5', name: 'Mochi', species: 'cat', breed: 'Scottish Fold', age: 8, gender: 'female', distance: 0.5, photos: [photo(105)], bio: 'Mochi is tiny but mighty!', traits: ['Cuddly', 'Sweet'], owner: { id: 'o5', name: 'Anna Lee', avatar: photo(9) }, isOnline: false },
  { id: '6', name: 'Charlie', species: 'dog', breed: 'Beagle', age: 36, gender: 'male', distance: 5.0, photos: [photo(106)], bio: 'Charlie has an excellent nose!', traits: ['Curious', 'Social'], owner: { id: 'o6', name: 'Tom Baker', avatar: photo(11) }, isOnline: true },
  { id: '7', name: 'Cleo', species: 'cat', breed: 'Maine Coon', age: 20, gender: 'female', distance: 2.9, photos: [photo(107)], bio: 'Cleo is fluffy royalty!', traits: ['Regal', 'Majestic'], owner: { id: 'o7', name: 'Sophie Martin', avatar: photo(13) }, isOnline: false },
  { id: '8', name: 'Buddy', species: 'dog', breed: 'Corgi', age: 14, gender: 'male', distance: 1.2, photos: [photo(108)], bio: "Buddy's got the best smile!", traits: ['Herding', 'Smart'], owner: { id: 'o8', name: 'James Wilson', avatar: photo(15) }, isOnline: true },
];

export const mockConversations: Conversation[] = [
  { id: 'c1', pet: mockPets[0], messages: [{ id: 'm1', text: 'Hi! Luna would love a playdate!', isMine: false, timestamp: new Date() }, { id: 'm2', text: 'That sounds great!', isMine: true, timestamp: new Date() }], lastMessage: 'That sounds great!', lastMessageTime: new Date(), unreadCount: 1 },
  { id: 'c2', pet: mockPets[2], messages: [{ id: 'm3', text: 'Hey! Whiskers seemed interested 😸', isMine: false, timestamp: new Date() }], lastMessage: 'Hey! Whiskers seemed interested', lastMessageTime: new Date(), unreadCount: 0 },
];

export const currentUser = { id: 'user1', name: 'Alex Johnson', email: 'alex@example.com', avatar: photo(47) };
