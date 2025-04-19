import { User } from '@/types/user';

const demoUsers: User[] = [
  {
    id: "demo-1",
    name: "Sophie Adams",
    email: "sophie.a@example.com",
    age: 28,
    bio: "Passionate about photography and travel. Looking for someone to share adventures with.",
    location: "New York, NY",
    interests: ["photography", "travel", "cooking", "hiking"],
    photos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1964&auto=format&fit=crop"
    ],
    gender: "female",
    interestedIn: ["male", "female"],
    popularityPoints: 342,
    premiumStatus: "unlimited", // Changed from "premium" to "unlimited"
    giftInventory: {
      rose: 5,
      heart: 3,
      teddy: 1
    },
    receivedGifts: {
      rose: 12,
      heart: 8,
      teddy: 3
    },
    compatibilityScore: 0,
    personalityTraits: ["creative", "adventurous", "spontaneous"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    lastMessage: "Hi there! How are you doing today?",
    lastMessageTime: new Date(),
    status: "online",
    favoriteMusic: ["pop", "indie", "electronic"],
    voiceIntro: "",
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    isDemo: true
  },
  {
    id: "demo-2",
    name: "Michael Chen",
    email: "michael.c@example.com",
    age: 32,
    bio: "Software engineer by day, amateur chef by night. Looking for someone who appreciates good food and good conversation.",
    location: "San Francisco, CA",
    interests: ["cooking", "technology", "hiking", "movies"],
    photos: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=1970&auto=format&fit=crop"
    ],
    gender: "male",
    interestedIn: ["female"],
    popularityPoints: 287,
    premiumStatus: "standard", // Changed from "basic" to "standard"
    giftInventory: {
      rose: 2,
      heart: 1,
      teddy: 0
    },
    receivedGifts: {
      rose: 5,
      heart: 2,
      teddy: 0
    },
    compatibilityScore: 0,
    personalityTraits: ["analytical", "creative", "patient"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    lastMessage: "I found this great new restaurant we should try!",
    lastMessageTime: new Date(),
    status: "offline",
    favoriteMusic: ["jazz", "classical", "rock"],
    voiceIntro: "",
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    isDemo: true
  },
  {
    id: "demo-3",
    name: "Alex Johnson",
    email: "alex.j@example.com",
    age: 26,
    bio: "Non-binary artist and musician. Looking for open-minded individuals who appreciate art in all its forms.",
    location: "Portland, OR",
    interests: ["art", "music", "poetry", "nature"],
    photos: [
      "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
    ],
    gender: "non-binary",
    interestedIn: ["male", "female", "non-binary"],
    popularityPoints: 310,
    premiumStatus: "unlimited", // Changed from "premium" to "unlimited"
    giftInventory: {
      rose: 7,
      heart: 4,
      teddy: 2
    },
    receivedGifts: {
      rose: 15,
      heart: 9,
      teddy: 4
    },
    compatibilityScore: 0,
    personalityTraits: ["creative", "empathetic", "philosophical"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    lastMessage: "Have you seen the new exhibit at the modern art museum?",
    lastMessageTime: new Date(),
    status: "online",
    favoriteMusic: ["indie", "alternative", "experimental"],
    voiceIntro: "",
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    isDemo: true
  },
  {
    id: "demo-4",
    name: "Emily Rodriguez",
    email: "emily.r@example.com",
    age: 29,
    bio: "Yoga instructor and wellness coach. Seeking someone who values mindfulness and healthy living.",
    location: "Los Angeles, CA",
    interests: ["yoga", "meditation", "nutrition", "beach"],
    photos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1974&auto=format&fit=crop"
    ],
    gender: "female",
    interestedIn: ["male"],
    popularityPoints: 375,
    premiumStatus: "standard", // Changed from "basic" to "standard"
    giftInventory: {
      rose: 3,
      heart: 2,
      teddy: 1
    },
    receivedGifts: {
      rose: 20,
      heart: 12,
      teddy: 5
    },
    compatibilityScore: 0,
    personalityTraits: ["calm", "disciplined", "compassionate"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    lastMessage: "Just finished a great meditation session. How was your day?",
    lastMessageTime: new Date(),
    status: "away",
    favoriteMusic: ["ambient", "world", "acoustic"],
    voiceIntro: "",
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    isDemo: true
  },
  {
    id: "demo-5",
    name: "James Wilson",
    email: "james.w@example.com",
    age: 34,
    bio: "Financial analyst who loves outdoor adventures on weekends. Looking for someone to share both quiet evenings and exciting trips.",
    location: "Chicago, IL",
    interests: ["finance", "hiking", "skiing", "reading"],
    photos: [
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1974&auto=format&fit=crop"
    ],
    gender: "male",
    interestedIn: ["female"],
    popularityPoints: 256,
    premiumStatus: "unlimited", // Changed from "premium" to "unlimited"
    giftInventory: {
      rose: 4,
      heart: 2,
      teddy: 1
    },
    receivedGifts: {
      rose: 7,
      heart: 3,
      teddy: 1
    },
    compatibilityScore: 0,
    personalityTraits: ["analytical", "adventurous", "reliable"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    lastMessage: "Planning a hiking trip next weekend. Would you be interested?",
    lastMessageTime: new Date(),
    status: "online",
    favoriteMusic: ["rock", "classical", "blues"],
    voiceIntro: "",
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    isDemo: true
  },
  {
    id: "demo-6",
    name: "Olivia Kim",
    email: "olivia.k@example.com",
    age: 27,
    bio: "Graphic designer with a passion for street photography. Looking for someone creative and curious about the world.",
    location: "Seattle, WA",
    interests: ["design", "photography", "coffee", "art"],
    photos: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop"
    ],
    gender: "female",
    interestedIn: ["male", "female"],
    popularityPoints: 298,
    premiumStatus: "standard", // Changed from "basic" to "standard"
    giftInventory: {
      rose: 1,
      heart: 0,
      teddy: 0
    },
    receivedGifts: {
      rose: 10,
      heart: 5,
      teddy: 2
    },
    compatibilityScore: 0,
    personalityTraits: ["creative", "observant", "thoughtful"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    lastMessage: "Check out this photo I took yesterday!",
    lastMessageTime: new Date(),
    status: "offline",
    favoriteMusic: ["indie", "electronic", "alternative"],
    voiceIntro: "",
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    isDemo: true
  },
  {
    id: "demo-7",
    name: "David Thompson",
    email: "david.t@example.com",
    age: 31,
    bio: "English teacher and aspiring novelist. Looking for someone who enjoys deep conversations and quiet evenings with a good book.",
    location: "Boston, MA",
    interests: ["literature", "writing", "teaching", "travel"],
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
    ],
    gender: "male",
    interestedIn: ["female"],
    popularityPoints: 245,
    premiumStatus: "standard", // Changed from "basic" to "standard"
    giftInventory: {
      rose: 2,
      heart: 1,
      teddy: 0
    },
    receivedGifts: {
      rose: 6,
      heart: 2,
      teddy: 1
    },
    compatibilityScore: 0,
    personalityTraits: ["intellectual", "thoughtful", "articulate"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    lastMessage: "What's your favorite book? Mine is 'To Kill a Mockingbird'.",
    lastMessageTime: new Date(),
    status: "away",
    favoriteMusic: ["classical", "jazz", "folk"],
    voiceIntro: "",
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    isDemo: true
  },
  {
    id: "demo-8",
    name: "Sophia Martinez",
    email: "sophia.m@example.com",
    age: 30,
    bio: "Marketing executive who loves salsa dancing and trying new restaurants. Looking for someone spontaneous and fun-loving.",
    location: "Miami, FL",
    interests: ["dancing", "food", "marketing", "beach"],
    photos: [
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1974&auto=format&fit=crop"
    ],
    gender: "female",
    interestedIn: ["male"],
    popularityPoints: 320,
    premiumStatus: "unlimited", // Changed from "premium" to "unlimited"
    giftInventory: {
      rose: 5,
      heart: 3,
      teddy: 1
    },
    receivedGifts: {
      rose: 18,
      heart: 10,
      teddy: 4
    },
    compatibilityScore: 0,
    personalityTraits: ["outgoing", "ambitious", "passionate"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    lastMessage: "There's a new Cuban restaurant downtown we should check out!",
    lastMessageTime: new Date(),
    status: "online",
    favoriteMusic: ["latin", "pop", "dance"],
    voiceIntro: "",
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    isDemo: true
  },
  {
    id: "demo-9",
    name: "Daniel Lee",
    email: "daniel.l@example.com",
    age: 29,
    bio: "Physical therapist who enjoys rock climbing and outdoor photography. Looking for an active partner to share adventures.",
    location: "Denver, CO",
    interests: ["climbing", "photography", "fitness", "nature"],
    photos: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop"
    ],
    gender: "male",
    interestedIn: ["female"],
    popularityPoints: 275,
    premiumStatus: "standard", // Changed from "basic" to "standard"
    giftInventory: {
      rose: 3,
      heart: 1,
      teddy: 0
    },
    receivedGifts: {
      rose: 8,
      heart: 3,
      teddy: 1
    },
    compatibilityScore: 0,
    personalityTraits: ["active", "patient", "detail-oriented"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    lastMessage: "Just got back from an amazing hike! The views were incredible.",
    lastMessageTime: new Date(),
    status: "offline",
    favoriteMusic: ["alternative", "rock", "indie"],
    voiceIntro: "",
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    isDemo: true
  },
  {
    id: "demo-10",
    name: "Emma Davis",
    email: "emma.d@example.com",
    age: 26,
    bio: "Veterinarian and animal lover. Looking for someone kind-hearted who shares my passion for animal welfare.",
    location: "Austin, TX",
    interests: ["animals", "volunteering", "nature", "cooking"],
    photos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop"
    ],
    gender: "female",
    interestedIn: ["male"],
    popularityPoints: 290,
    premiumStatus: "unlimited", // Changed from "premium" to "unlimited"
    giftInventory: {
      rose: 4,
      heart: 2,
      teddy: 1
    },
    receivedGifts: {
      rose: 14,
      heart: 8,
      teddy: 3
    },
    compatibilityScore: 0,
    personalityTraits: ["compassionate", "dedicated", "nurturing"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    lastMessage: "Just rescued the cutest puppy at the shelter today!",
    lastMessageTime: new Date(),
    status: "online",
    favoriteMusic: ["folk", "acoustic", "indie"],
    voiceIntro: "",
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    isDemo: true
  },
  {
    id: "demo-11",
    name: "Ryan Patel",
    email: "ryan.p@example.com",
    age: 33,
    bio: "Startup founder and tech enthusiast. Looking for someone ambitious who enjoys intellectual conversations and travel.",
    location: "San Francisco, CA",
    interests: ["technology", "entrepreneurship", "travel", "philosophy"],
    photos: [
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=1970&auto=format&fit=crop"
    ],
    gender: "male",
    interestedIn: ["female"],
    popularityPoints: 305,
    premiumStatus: "unlimited", // Changed from "premium" to "unlimited"
    giftInventory: {
      rose: 6,
      heart: 3,
      teddy: 1
    },
    receivedGifts: {
      rose: 9,
      heart: 4,
      teddy: 2
    },
    compatibilityScore: 0,
    personalityTraits: ["ambitious", "innovative", "curious"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    lastMessage: "Just closed a new funding round! We should celebrate.",
    lastMessageTime: new Date(),
    status: "away",
    favoriteMusic: ["electronic", "ambient", "jazz"],
    voiceIntro: "",
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    isDemo: true
  },
  {
    id: "demo-12",
    name: "Zoe Williams",
    email: "zoe.w@example.com",
    age: 25,
    bio: "Environmental scientist passionate about sustainability. Looking for someone who cares about making a positive impact.",
    location: "Portland, OR",
    interests: ["environment", "hiking", "gardening", "activism"],
    photos: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop"
    ],
    gender: "female",
    interestedIn: ["male", "female", "non-binary"],
    popularityPoints: 265,
    premiumStatus: "standard", // Changed from "basic" to "standard"
    giftInventory: {
      rose: 2,
      heart: 1,
      teddy: 0
    },
    receivedGifts: {
      rose: 11,
      heart: 6,
      teddy: 2
    },
    compatibilityScore: 0,
    personalityTraits: ["passionate", "principled", "thoughtful"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    lastMessage: "Just joined a new community garden project!",
    lastMessageTime: new Date(),
    status: "online",
    favoriteMusic: ["folk", "indie", "world"],
    voiceIntro: "",
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    isDemo: true
  },
  {
    id: "demo-13",
    name: "Marcus Johnson",
    email: "marcus.j@example.com",
    age: 30,
    bio: "Jazz musician and music teacher. Looking for someone who appreciates the arts and spontaneous jam sessions.",
    location: "New Orleans, LA",
    interests: ["music", "jazz", "teaching", "food"],
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
    ],
    gender: "male",
    interestedIn: ["female"],
    popularityPoints: 280,
    premiumStatus: "standard", // Changed from "basic" to "standard"
    giftInventory: {
      rose: 3,
      heart: 1,
      teddy: 0
    },
    receivedGifts: {
      rose: 7,
      heart: 3,
      teddy: 1
    },
    compatibilityScore: 0,
    personalityTraits: ["creative", "expressive", "laid-back"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    lastMessage: "Playing at the Blue Note this weekend. Would love for you to come!",
    lastMessageTime: new Date(),
    status: "offline",
    favoriteMusic: ["jazz", "blues", "soul"],
    voiceIntro: "",
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    isDemo: true
  },
  {
    id: "demo-14",
    name: "Isabella Garcia",
    email: "isabella.g@example.com",
    age: 28,
    bio: "Fashion designer with a love for vintage aesthetics. Seeking someone stylish with an appreciation for the arts.",
    location: "New York, NY",
    interests: ["fashion", "art", "vintage", "photography"],
    photos: [
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1974&auto=format&fit=crop"
    ],
    gender: "female",
    interestedIn: ["male"],
    popularityPoints: 315,
    premiumStatus: "unlimited", // Changed from "premium" to "unlimited"
    giftInventory: {
      rose: 5,
      heart: 3,
      teddy: 1
    },
    receivedGifts: {
      rose: 16,
      heart: 9,
      teddy: 4
    },
    compatibilityScore: 0,
    personalityTraits: ["creative", "detail-oriented", "expressive"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    lastMessage: "Just finished my new collection! Can't wait to show you.",
    lastMessageTime: new Date(),
    status: "online",
    favoriteMusic: ["indie", "vintage", "alternative"],
    voiceIntro: "",
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    isDemo: true
  },
  {
    id: "demo-15",
    name: "Nathan Wright",
    email: "nathan.w@example.com",
    age: 32,
    bio: "Architect with a passion for sustainable design. Looking for someone who appreciates creativity and thoughtful conversation.",
    location: "Chicago, IL",
    interests: ["architecture", "design", "sustainability", "art"],
    photos: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop"
    ],
    gender: "male",
    interestedIn: ["female"],
    popularityPoints: 270,
    premiumStatus: "standard", // Changed from "basic" to "standard"
    giftInventory: {
      rose: 2,
      heart: 1,
      teddy: 0
    },
    receivedGifts: {
      rose: 6,
      heart: 2,
      teddy: 1
    },
    compatibilityScore: 0,
    personalityTraits: ["creative", "analytical", "thoughtful"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    lastMessage: "Just visited this amazing building downtown. The design is incredible!",
    lastMessageTime: new Date(),
    status: "away",
    favoriteMusic: ["classical", "ambient", "jazz"],
    voiceIntro: "",
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    isDemo: true
  },
  {
    id: "demo-16",
    name: "Lily Chen",
    email: "lily.c@example.com",
    age: 27,
    bio: "Nutritionist and food blogger. Looking for someone who enjoys cooking and exploring new cuisines together.",
    location: "Seattle, WA",
    interests: ["nutrition", "cooking", "blogging", "travel"],
    photos: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop"
    ],
    gender: "female",
    interestedIn: ["male"],
    popularityPoints: 295,
    premiumStatus: "unlimited", // Changed from "premium" to "unlimited"
    giftInventory: {
      rose: 4,
      heart: 2,
      teddy: 1
    },
    receivedGifts: {
      rose: 13,
      heart: 7,
      teddy: 3
    },
    compatibilityScore: 0,
    personalityTraits: ["health-conscious", "creative", "organized"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    lastMessage: "I just posted a new recipe on my blog. Would love your feedback!",
    lastMessageTime: new Date(),
    status: "online",
    favoriteMusic: ["pop", "acoustic", "world"],
    voiceIntro: "",
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    isDemo: true
  },
  {
    id: "demo-17",
    name: "Jordan Taylor",
    email: "jordan.t@example.com",
    age: 29,
    bio: "Non-binary fitness coach and mental health advocate. Looking for someone who values wellness in all its forms.",
    location: "Austin, TX",
    interests: ["fitness", "mental health", "meditation", "outdoors"],
    photos: [
      "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=1974&auto=format&fit=crop"
    ],
    gender: "non-binary",
    interestedIn: ["male", "female", "non-binary"],
    popularityPoints: 285,
    premiumStatus: "standard", // Changed from "basic" to "standard"
    giftInventory: {
      rose: 3,
      heart: 1,
      teddy: 0
    },
    receivedGifts: {
      rose: 9,
      heart: 4,
      teddy: 2
    },
    compatibilityScore: 0,
    personalityTraits: ["motivational", "empathetic", "balanced"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    lastMessage: "Just finished teaching a great mindfulness class today!",
    lastMessageTime: new Date(),
    status: "away",
    favoriteMusic: ["electronic", "ambient", "motivational"],
    voiceIntro: "",
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    isDemo: true
  },
  {
    id: "demo-18",
    name: "Ethan Miller",
    email: "ethan.m@example.com",
    age: 31,
    bio: "Travel photographer who's visited over 40 countries. Looking for someone with wanderlust and a sense of adventure.",
    location: "Los Angeles, CA",
    interests: ["photography", "travel", "cultures", "languages"],
    photos: [
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1974&auto=format&fit=crop"
    ],
    gender: "male",
    interestedIn: ["female"],
    popularityPoints: 310,
    premiumStatus: "unlimited", // Changed from "premium" to "unlimited"
    giftInventory: {
      rose: 5,
      heart: 3,
      teddy: 1
    },
    receivedGifts: {
      rose: 8,
      heart: 4,
      teddy: 2
    },
    compatibilityScore: 0,
    personalityTraits: ["adventurous", "curious", "adaptable"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    lastMessage: "Just booked my next trip to Thailand! Have you been?",
    lastMessageTime: new Date(),
    status: "online",
    favoriteMusic: ["world", "electronic", "ambient"],
    voiceIntro: "",
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    isDemo: true
  },
  {
    id: "demo-19",
    name: "Ava Robinson",
    email: "ava.r@example.com",
    age: 26,
    bio: "Marine biologist passionate about ocean conservation. Looking for someone who shares my love for the sea and environmental causes.",
    location: "San Diego, CA",
    interests: ["marine life", "conservation", "diving", "beach"],
    photos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop"
    ],
    gender: "female",
    interestedIn: ["male"],
    popularityPoints: 275,
    premiumStatus: "standard", // Changed from "basic" to "standard"
    giftInventory: {
      rose: 2,
      heart: 1,
      teddy: 0
    },
    receivedGifts: {
      rose: 12,
      heart: 6,
      teddy: 2
    },
    compatibilityScore: 0,
    personalityTraits: ["passionate", "dedicated", "curious"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    lastMessage: "Just got back from an amazing dive with sea turtles!",
    lastMessageTime: new Date(),
    status: "offline",
    favoriteMusic: ["indie", "acoustic", "ambient"],
    voiceIntro: "",
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    isDemo: true
  },
  {
    id: "demo-20",
    name: "Benjamin Foster",
    email: "benjamin.f@example.com",
    age: 33,
    bio: "Chef and culinary instructor with a passion for farm-to-table cooking. Looking for a foodie to share culinary adventures.",
    location: "Portland, OR",
    interests: ["cooking", "food", "farming", "wine"],
    photos: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop"
    ],
    gender: "male",
    interestedIn: ["female"],
    popularityPoints: 290,
    premiumStatus: "unlimited", // Changed from "premium" to "unlimited"
    giftInventory: {
      rose: 4,
      heart: 2,
      teddy: 1
    },
    receivedGifts: {
      rose: 7,
      heart: 3,
      teddy: 1
    },
    compatibilityScore: 0,
    personalityTraits: ["creative", "detail-oriented", "passionate"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    lastMessage: "Just perfected a new recipe I'd love to cook for you!",
    lastMessageTime: new Date(),
    status: "away",
    favoriteMusic: ["jazz", "classical", "world"],
    voiceIntro: "",
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    isDemo: true
  }
];

export default demoUsers;
