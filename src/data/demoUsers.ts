
import { User } from "@/types/user";

// Array of demo users with realistic profiles
export const demoUsers: User[] = [
  {
    id: "demo-1",
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    age: 28,
    bio: "Passionate about art and sustainable living. I love exploring farmers markets and trying new coffee shops. Looking for someone who enjoys meaningful conversations and adventures.",
    location: "New York, NY",
    interests: ["art", "sustainability", "coffee", "hiking", "yoga"],
    photos: [
      "https://randomuser.me/api/portraits/women/22.jpg",
      "https://randomuser.me/api/portraits/women/23.jpg"
    ],
    gender: "female",
    interestedIn: ["male", "non-binary"],
    popularityPoints: 85,
    premiumStatus: "basic",
    giftInventory: { rose: 5, heart: 3, teddy: 1 },
    receivedGifts: { rose: 12, heart: 8, teddy: 3 },
    compatibilityScore: 0,
    personalityTraits: ["creative", "thoughtful", "adventurous"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    voiceIntro: "",
    favoriteMusic: ["indie folk", "classical", "jazz"],
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    lastMessage: "Would love to check out that art exhibit you mentioned!",
    lastMessageTime: new Date("2023-09-15T14:30:00"),
    status: "online",
    isDemo: true,
    preferences: {
      maxDistance: 25,
      ageRange: { min: 25, max: 35 },
      showMeToUsers: true,
      notificationPreferences: {
        messages: true,
        matches: true,
        likes: true,
        app: true
      },
      preferredLocations: ["New York", "Brooklyn", "Queens"],
      matchingPriorities: {
        interests: 5,
        personality: 4,
        location: 3,
        age: 2,
        writingStyle: 1
      }
    }
  },
  {
    id: "demo-2",
    name: "James Rodriguez",
    email: "james.r@example.com",
    age: 32,
    bio: "Software engineer by day, amateur chef by night. I love traveling, trying new recipes, and playing basketball. Looking for someone to share good food and laughter with.",
    location: "San Francisco, CA",
    interests: ["cooking", "travel", "basketball", "technology", "photography"],
    photos: [
      "https://randomuser.me/api/portraits/men/45.jpg",
      "https://randomuser.me/api/portraits/men/46.jpg"
    ],
    gender: "male",
    interestedIn: ["female"],
    popularityPoints: 78,
    premiumStatus: "premium",
    giftInventory: { rose: 8, heart: 5, teddy: 2 },
    receivedGifts: { rose: 7, heart: 4, teddy: 1 },
    compatibilityScore: 0,
    personalityTraits: ["analytical", "creative", "outgoing"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    voiceIntro: "",
    favoriteMusic: ["rock", "hip hop", "electronic"],
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    lastMessage: "I tried that pasta recipe you recommended - amazing!",
    lastMessageTime: new Date("2023-09-16T18:45:00"),
    status: "offline",
    isDemo: true,
    preferences: {
      maxDistance: 30,
      ageRange: { min: 25, max: 38 },
      showMeToUsers: true,
      notificationPreferences: {
        messages: true,
        matches: true,
        likes: true,
        app: false
      },
      preferredLocations: ["San Francisco", "Oakland", "San Jose"],
      matchingPriorities: {
        interests: 4,
        personality: 5,
        location: 3,
        age: 2,
        writingStyle: 1
      }
    }
  },
  {
    id: "demo-3",
    name: "Sophia Chen",
    email: "sophia.c@example.com",
    age: 26,
    bio: "Literature professor with a love for classic novels and modern poetry. I enjoy quiet evenings with a good book, but also love exploring museums and galleries. Looking for someone to share meaningful conversations.",
    location: "Boston, MA",
    interests: ["literature", "poetry", "museums", "theatre", "writing"],
    photos: [
      "https://randomuser.me/api/portraits/women/33.jpg",
      "https://randomuser.me/api/portraits/women/34.jpg"
    ],
    gender: "female",
    interestedIn: ["male", "female"],
    popularityPoints: 90,
    premiumStatus: "vip",
    giftInventory: { rose: 12, heart: 7, teddy: 3 },
    receivedGifts: { rose: 18, heart: 11, teddy: 5 },
    compatibilityScore: 0,
    personalityTraits: ["intellectual", "reflective", "passionate"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    voiceIntro: "",
    favoriteMusic: ["classical", "jazz", "acoustic"],
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    lastMessage: "Have you read that new Margaret Atwood novel?",
    lastMessageTime: new Date("2023-09-14T11:20:00"),
    status: "away",
    isDemo: true,
    preferences: {
      maxDistance: 20,
      ageRange: { min: 24, max: 35 },
      showMeToUsers: true,
      notificationPreferences: {
        messages: true,
        matches: true,
        likes: true,
        app: true
      },
      preferredLocations: ["Boston", "Cambridge", "Somerville"],
      matchingPriorities: {
        interests: 5,
        personality: 5,
        location: 2,
        age: 2,
        writingStyle: 4
      }
    }
  },
  {
    id: "demo-4",
    name: "Marcus Johnson",
    email: "marcus.j@example.com",
    age: 30,
    bio: "Music producer and DJ who loves creating beats and discovering new sounds. When I'm not in the studio, I enjoy hiking and photography. Looking for someone who appreciates creativity and adventure.",
    location: "Los Angeles, CA",
    interests: ["music", "production", "hiking", "photography", "concerts"],
    photos: [
      "https://randomuser.me/api/portraits/men/22.jpg",
      "https://randomuser.me/api/portraits/men/23.jpg"
    ],
    gender: "male",
    interestedIn: ["female", "non-binary"],
    popularityPoints: 82,
    premiumStatus: "premium",
    giftInventory: { rose: 7, heart: 4, teddy: 2 },
    receivedGifts: { rose: 9, heart: 6, teddy: 2 },
    compatibilityScore: 0,
    personalityTraits: ["creative", "ambitious", "adventurous"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    voiceIntro: "",
    favoriteMusic: ["electronic", "hip hop", "jazz", "experimental"],
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    lastMessage: "Just sent you that playlist I was talking about!",
    lastMessageTime: new Date("2023-09-17T09:15:00"),
    status: "online",
    isDemo: true,
    preferences: {
      maxDistance: 35,
      ageRange: { min: 25, max: 35 },
      showMeToUsers: true,
      notificationPreferences: {
        messages: true,
        matches: true,
        likes: false,
        app: true
      },
      preferredLocations: ["Los Angeles", "Santa Monica", "Venice"],
      matchingPriorities: {
        interests: 5,
        personality: 4,
        location: 3,
        age: 2,
        writingStyle: 1
      }
    }
  },
  {
    id: "demo-5",
    name: "Olivia Martinez",
    email: "olivia.m@example.com",
    age: 29,
    bio: "Environmental scientist working on conservation projects. I'm passionate about protecting our planet and enjoy outdoor activities like camping and kayaking. Looking for someone who shares my love for nature.",
    location: "Portland, OR",
    interests: ["environment", "camping", "kayaking", "hiking", "gardening"],
    photos: [
      "https://randomuser.me/api/portraits/women/45.jpg",
      "https://randomuser.me/api/portraits/women/46.jpg"
    ],
    gender: "female",
    interestedIn: ["male"],
    popularityPoints: 75,
    premiumStatus: "basic",
    giftInventory: { rose: 4, heart: 2, teddy: 1 },
    receivedGifts: { rose: 11, heart: 7, teddy: 2 },
    compatibilityScore: 0,
    personalityTraits: ["dedicated", "compassionate", "adventurous"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    voiceIntro: "",
    favoriteMusic: ["folk", "indie", "acoustic"],
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    lastMessage: "There's this amazing hiking trail I want to show you!",
    lastMessageTime: new Date("2023-09-13T16:40:00"),
    status: "offline",
    isDemo: true,
    preferences: {
      maxDistance: 40,
      ageRange: { min: 27, max: 36 },
      showMeToUsers: true,
      notificationPreferences: {
        messages: true,
        matches: true,
        likes: true,
        app: true
      },
      preferredLocations: ["Portland", "Salem", "Eugene"],
      matchingPriorities: {
        interests: 5,
        personality: 4,
        location: 2,
        age: 3,
        writingStyle: 1
      }
    }
  },
  {
    id: "demo-6",
    name: "Daniel Kim",
    email: "daniel.k@example.com",
    age: 27,
    bio: "Startup founder with a passion for innovation and technology. When I'm not working, I enjoy playing guitar and exploring new restaurants. Looking for someone to share interesting conversations and food adventures.",
    location: "Seattle, WA",
    interests: ["technology", "startups", "music", "food", "skiing"],
    photos: [
      "https://randomuser.me/api/portraits/men/67.jpg",
      "https://randomuser.me/api/portraits/men/68.jpg"
    ],
    gender: "male",
    interestedIn: ["female"],
    popularityPoints: 80,
    premiumStatus: "premium",
    giftInventory: { rose: 6, heart: 3, teddy: 1 },
    receivedGifts: { rose: 8, heart: 5, teddy: 2 },
    compatibilityScore: 0,
    personalityTraits: ["innovative", "ambitious", "curious"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    voiceIntro: "",
    favoriteMusic: ["indie rock", "electronic", "alternative"],
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    lastMessage: "Just discovered an amazing ramen place, would love to take you there!",
    lastMessageTime: new Date("2023-09-16T20:10:00"),
    status: "online",
    isDemo: true,
    preferences: {
      maxDistance: 25,
      ageRange: { min: 24, max: 32 },
      showMeToUsers: true,
      notificationPreferences: {
        messages: true,
        matches: true,
        likes: true,
        app: false
      },
      preferredLocations: ["Seattle", "Bellevue", "Redmond"],
      matchingPriorities: {
        interests: 4,
        personality: 5,
        location: 3,
        age: 2,
        writingStyle: 1
      }
    }
  },
  {
    id: "demo-7",
    name: "Maya Patel",
    email: "maya.p@example.com",
    age: 31,
    bio: "Yoga instructor and wellness coach. I believe in mindful living and self-care. When I'm not teaching, I enjoy painting and exploring nature. Seeking someone who values personal growth and mindfulness.",
    location: "Austin, TX",
    interests: ["yoga", "wellness", "painting", "meditation", "hiking"],
    photos: [
      "https://randomuser.me/api/portraits/women/55.jpg",
      "https://randomuser.me/api/portraits/women/56.jpg"
    ],
    gender: "female",
    interestedIn: ["male", "female"],
    popularityPoints: 88,
    premiumStatus: "vip",
    giftInventory: { rose: 9, heart: 6, teddy: 3 },
    receivedGifts: { rose: 15, heart: 9, teddy: 4 },
    compatibilityScore: 0,
    personalityTraits: ["mindful", "empathetic", "balanced"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    voiceIntro: "",
    favoriteMusic: ["ambient", "world music", "meditation"],
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    lastMessage: "That meditation technique really helped with my stress levels!",
    lastMessageTime: new Date("2023-09-15T08:25:00"),
    status: "away",
    isDemo: true,
    preferences: {
      maxDistance: 30,
      ageRange: { min: 28, max: 40 },
      showMeToUsers: true,
      notificationPreferences: {
        messages: true,
        matches: true,
        likes: true,
        app: true
      },
      preferredLocations: ["Austin", "San Antonio", "Houston"],
      matchingPriorities: {
        interests: 5,
        personality: 5,
        location: 2,
        age: 1,
        writingStyle: 2
      }
    }
  },
  {
    id: "demo-8",
    name: "Noah Williams",
    email: "noah.w@example.com",
    age: 34,
    bio: "Professional photographer specializing in wildlife and landscapes. My work takes me to amazing places around the world. Looking for someone who appreciates beauty in nature and has a sense of adventure.",
    location: "Denver, CO",
    interests: ["photography", "travel", "hiking", "wildlife", "camping"],
    photos: [
      "https://randomuser.me/api/portraits/men/33.jpg",
      "https://randomuser.me/api/portraits/men/34.jpg"
    ],
    gender: "male",
    interestedIn: ["female", "non-binary"],
    popularityPoints: 83,
    premiumStatus: "premium",
    giftInventory: { rose: 7, heart: 4, teddy: 2 },
    receivedGifts: { rose: 10, heart: 6, teddy: 2 },
    compatibilityScore: 0,
    personalityTraits: ["observant", "patient", "adventurous"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    voiceIntro: "",
    favoriteMusic: ["folk", "instrumental", "world music"],
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    lastMessage: "Just got back from Yellowstone, the photos came out amazing!",
    lastMessageTime: new Date("2023-09-17T11:30:00"),
    status: "offline",
    isDemo: true,
    preferences: {
      maxDistance: 50,
      ageRange: { min: 28, max: 40 },
      showMeToUsers: true,
      notificationPreferences: {
        messages: true,
        matches: true,
        likes: false,
        app: true
      },
      preferredLocations: ["Denver", "Boulder", "Colorado Springs"],
      matchingPriorities: {
        interests: 5,
        personality: 4,
        location: 2,
        age: 3,
        writingStyle: 1
      }
    }
  },
  {
    id: "demo-9",
    name: "Isabella Garcia",
    email: "isabella.g@example.com",
    age: 25,
    bio: "Fashion designer with a love for sustainable and ethical clothing. I enjoy creating unique pieces and exploring vintage shops. Looking for someone who appreciates creativity and authenticity.",
    location: "Miami, FL",
    interests: ["fashion", "sustainability", "art", "vintage", "design"],
    photos: [
      "https://randomuser.me/api/portraits/women/66.jpg",
      "https://randomuser.me/api/portraits/women/67.jpg"
    ],
    gender: "female",
    interestedIn: ["male"],
    popularityPoints: 85,
    premiumStatus: "basic",
    giftInventory: { rose: 5, heart: 3, teddy: 1 },
    receivedGifts: { rose: 13, heart: 8, teddy: 3 },
    compatibilityScore: 0,
    personalityTraits: ["creative", "ethical", "passionate"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    voiceIntro: "",
    favoriteMusic: ["indie pop", "latin", "jazz"],
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    lastMessage: "Found this amazing vintage shop you have to check out!",
    lastMessageTime: new Date("2023-09-14T15:45:00"),
    status: "online",
    isDemo: true,
    preferences: {
      maxDistance: 25,
      ageRange: { min: 24, max: 33 },
      showMeToUsers: true,
      notificationPreferences: {
        messages: true,
        matches: true,
        likes: true,
        app: true
      },
      preferredLocations: ["Miami", "Fort Lauderdale", "Palm Beach"],
      matchingPriorities: {
        interests: 5,
        personality: 4,
        location: 3,
        age: 2,
        writingStyle: 1
      }
    }
  },
  {
    id: "demo-10",
    name: "William Jackson",
    email: "william.j@example.com",
    age: 29,
    bio: "Professional chef who loves creating innovative dishes. When I'm not in the kitchen, I enjoy playing soccer and exploring local farmers markets. Looking for someone to share culinary adventures with.",
    location: "Chicago, IL",
    interests: ["cooking", "food", "soccer", "farmers markets", "wine"],
    photos: [
      "https://randomuser.me/api/portraits/men/11.jpg",
      "https://randomuser.me/api/portraits/men/12.jpg"
    ],
    gender: "male",
    interestedIn: ["female"],
    popularityPoints: 79,
    premiumStatus: "premium",
    giftInventory: { rose: 6, heart: 4, teddy: 1 },
    receivedGifts: { rose: 8, heart: 5, teddy: 2 },
    compatibilityScore: 0,
    personalityTraits: ["creative", "passionate", "detail-oriented"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    voiceIntro: "",
    favoriteMusic: ["jazz", "blues", "classical"],
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    lastMessage: "I'm planning a special dinner this weekend, would love for you to join!",
    lastMessageTime: new Date("2023-09-16T19:20:00"),
    status: "away",
    isDemo: true,
    preferences: {
      maxDistance: 20,
      ageRange: { min: 25, max: 35 },
      showMeToUsers: true,
      notificationPreferences: {
        messages: true,
        matches: true,
        likes: true,
        app: false
      },
      preferredLocations: ["Chicago", "Evanston", "Oak Park"],
      matchingPriorities: {
        interests: 4,
        personality: 5,
        location: 3,
        age: 2,
        writingStyle: 1
      }
    }
  },
  {
    id: "demo-11",
    name: "Ethan Wright",
    email: "ethan.w@example.com",
    age: 33,
    bio: "Architect with a passion for sustainable urban design. I enjoy sketching cityscapes and exploring buildings with historical significance. Looking for someone to share meaningful conversations about art and design.",
    location: "Washington, DC",
    interests: ["architecture", "design", "art", "urban planning", "history"],
    photos: [
      "https://randomuser.me/api/portraits/men/77.jpg",
      "https://randomuser.me/api/portraits/men/78.jpg"
    ],
    gender: "male",
    interestedIn: ["female", "non-binary"],
    popularityPoints: 81,
    premiumStatus: "premium",
    giftInventory: { rose: 7, heart: 4, teddy: 2 },
    receivedGifts: { rose: 9, heart: 5, teddy: 2 },
    compatibilityScore: 0,
    personalityTraits: ["creative", "thoughtful", "analytical"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    voiceIntro: "",
    favoriteMusic: ["classical", "jazz", "ambient"],
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    lastMessage: "I'd love to show you this fascinating building renovation project!",
    lastMessageTime: new Date("2023-09-15T12:35:00"),
    status: "online",
    isDemo: true,
    preferences: {
      maxDistance: 25,
      ageRange: { min: 27, max: 38 },
      showMeToUsers: true,
      notificationPreferences: {
        messages: true,
        matches: true,
        likes: true,
        app: true
      },
      preferredLocations: ["Washington DC", "Arlington", "Alexandria"],
      matchingPriorities: {
        interests: 5,
        personality: 4,
        location: 3,
        age: 2,
        writingStyle: 1
      }
    }
  },
  {
    id: "demo-12",
    name: "Zoe Thompson",
    email: "zoe.t@example.com",
    age: 26,
    bio: "Marine biologist studying coral reef conservation. I love scuba diving, surfing, and beach cleanups. Looking for someone who shares my passion for protecting our oceans.",
    location: "San Diego, CA",
    interests: ["marine biology", "scuba diving", "surfing", "environment", "beach"],
    photos: [
      "https://randomuser.me/api/portraits/women/77.jpg",
      "https://randomuser.me/api/portraits/women/78.jpg"
    ],
    gender: "female",
    interestedIn: ["male", "female"],
    popularityPoints: 84,
    premiumStatus: "basic",
    giftInventory: { rose: 4, heart: 2, teddy: 1 },
    receivedGifts: { rose: 12, heart: 7, teddy: 3 },
    compatibilityScore: 0,
    personalityTraits: ["passionate", "adventurous", "methodical"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    voiceIntro: "",
    favoriteMusic: ["beach rock", "reggae", "indie"],
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    lastMessage: "The water visibility was amazing today, saw so many species!",
    lastMessageTime: new Date("2023-09-17T16:15:00"),
    status: "offline",
    isDemo: true,
    preferences: {
      maxDistance: 30,
      ageRange: { min: 24, max: 34 },
      showMeToUsers: true,
      notificationPreferences: {
        messages: true,
        matches: true,
        likes: true,
        app: true
      },
      preferredLocations: ["San Diego", "La Jolla", "Oceanside"],
      matchingPriorities: {
        interests: 5,
        personality: 3,
        location: 4,
        age: 2,
        writingStyle: 1
      }
    }
  },
  {
    id: "demo-13",
    name: "Sam Taylor",
    email: "sam.t@example.com",
    age: 28,
    bio: "Music therapist who believes in the healing power of sound. I play multiple instruments and love to compose. Seeking someone who appreciates the emotional connection of music.",
    location: "Nashville, TN",
    interests: ["music", "therapy", "composing", "instruments", "psychology"],
    photos: [
      "https://randomuser.me/api/portraits/men/55.jpg",
      "https://randomuser.me/api/portraits/men/56.jpg"
    ],
    gender: "non-binary",
    interestedIn: ["male", "female", "non-binary"],
    popularityPoints: 82,
    premiumStatus: "premium",
    giftInventory: { rose: 8, heart: 5, teddy: 2 },
    receivedGifts: { rose: 11, heart: 7, teddy: 3 },
    compatibilityScore: 0,
    personalityTraits: ["empathetic", "creative", "intuitive"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    voiceIntro: "",
    favoriteMusic: ["folk", "acoustic", "soul", "experimental"],
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    lastMessage: "Just recorded a new composition, would love to share it with you!",
    lastMessageTime: new Date("2023-09-16T13:50:00"),
    status: "online",
    isDemo: true,
    preferences: {
      maxDistance: 35,
      ageRange: { min: 25, max: 40 },
      showMeToUsers: true,
      notificationPreferences: {
        messages: true,
        matches: true,
        likes: true,
        app: false
      },
      preferredLocations: ["Nashville", "Memphis", "Knoxville"],
      matchingPriorities: {
        interests: 5,
        personality: 5,
        location: 2,
        age: 2,
        writingStyle: 1
      }
    }
  },
  {
    id: "demo-14",
    name: "Lina Ahmed",
    email: "lina.a@example.com",
    age: 30,
    bio: "Tech journalist covering innovation and startups. I'm curious about how technology shapes our future. When not writing, I enjoy rock climbing and trying new cuisines. Looking for someone intellectually curious.",
    location: "Philadelphia, PA",
    interests: ["technology", "journalism", "rock climbing", "food", "podcasts"],
    photos: [
      "https://randomuser.me/api/portraits/women/88.jpg",
      "https://randomuser.me/api/portraits/women/89.jpg"
    ],
    gender: "female",
    interestedIn: ["male"],
    popularityPoints: 78,
    premiumStatus: "basic",
    giftInventory: { rose: 5, heart: 3, teddy: 1 },
    receivedGifts: { rose: 10, heart: 6, teddy: 2 },
    compatibilityScore: 0,
    personalityTraits: ["curious", "analytical", "articulate"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    voiceIntro: "",
    favoriteMusic: ["alternative", "indie rock", "electronic"],
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    lastMessage: "I'm attending this interesting tech conference next week!",
    lastMessageTime: new Date("2023-09-14T19:40:00"),
    status: "away",
    isDemo: true,
    preferences: {
      maxDistance: 25,
      ageRange: { min: 28, max: 38 },
      showMeToUsers: true,
      notificationPreferences: {
        messages: true,
        matches: true,
        likes: false,
        app: true
      },
      preferredLocations: ["Philadelphia", "New York", "Washington DC"],
      matchingPriorities: {
        interests: 4,
        personality: 5,
        location: 2,
        age: 3,
        writingStyle: 1
      }
    }
  },
  {
    id: "demo-15",
    name: "Ryan Cooper",
    email: "ryan.c@example.com",
    age: 31,
    bio: "Veterinarian specializing in wildlife rehabilitation. I'm passionate about animal welfare and conservation. In my free time, I volunteer at animal shelters and enjoy hiking with my dog.",
    location: "Denver, CO",
    interests: ["animals", "veterinary medicine", "hiking", "conservation", "volunteering"],
    photos: [
      "https://randomuser.me/api/portraits/men/88.jpg",
      "https://randomuser.me/api/portraits/men/89.jpg"
    ],
    gender: "male",
    interestedIn: ["female"],
    popularityPoints: 86,
    premiumStatus: "premium",
    giftInventory: { rose: 7, heart: 4, teddy: 2 },
    receivedGifts: { rose: 9, heart: 5, teddy: 2 },
    compatibilityScore: 0,
    personalityTraits: ["compassionate", "dedicated", "patient"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    voiceIntro: "",
    favoriteMusic: ["folk", "country", "acoustic"],
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    lastMessage: "Just nursed an injured eagle back to health - such an amazing feeling!",
    lastMessageTime: new Date("2023-09-16T11:05:00"),
    status: "offline",
    isDemo: true,
    preferences: {
      maxDistance: 30,
      ageRange: { min: 27, max: 37 },
      showMeToUsers: true,
      notificationPreferences: {
        messages: true,
        matches: true,
        likes: true,
        app: true
      },
      preferredLocations: ["Denver", "Boulder", "Fort Collins"],
      matchingPriorities: {
        interests: 4,
        personality: 5,
        location: 3,
        age: 2,
        writingStyle: 1
      }
    }
  },
  {
    id: "demo-16",
    name: "Aisha Johnson",
    email: "aisha.j@example.com",
    age: 27,
    bio: "Professional dancer specializing in contemporary and ballet. I express myself through movement and love the discipline of dance. Looking for someone who appreciates the arts and has their own creative passion.",
    location: "Atlanta, GA",
    interests: ["dance", "choreography", "yoga", "theatre", "visual arts"],
    photos: [
      "https://randomuser.me/api/portraits/women/90.jpg",
      "https://randomuser.me/api/portraits/women/91.jpg"
    ],
    gender: "female",
    interestedIn: ["male", "non-binary"],
    popularityPoints: 89,
    premiumStatus: "vip",
    giftInventory: { rose: 10, heart: 6, teddy: 3 },
    receivedGifts: { rose: 16, heart: 10, teddy: 4 },
    compatibilityScore: 0,
    personalityTraits: ["disciplined", "expressive", "passionate"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    voiceIntro: "",
    favoriteMusic: ["classical", "contemporary", "instrumental"],
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    lastMessage: "Our performance last night was incredible, wish you could have seen it!",
    lastMessageTime: new Date("2023-09-17T08:20:00"),
    status: "online",
    isDemo: true,
    preferences: {
      maxDistance: 25,
      ageRange: { min: 25, max: 35 },
      showMeToUsers: true,
      notificationPreferences: {
        messages: true,
        matches: true,
        likes: true,
        app: true
      },
      preferredLocations: ["Atlanta", "Savannah", "Athens"],
      matchingPriorities: {
        interests: 5,
        personality: 4,
        location: 2,
        age: 3,
        writingStyle: 1
      }
    }
  },
  {
    id: "demo-17",
    name: "Lucas Nguyen",
    email: "lucas.n@example.com",
    age: 29,
    bio: "Astrophysicist studying black holes and gravitational waves. I'm fascinated by the cosmos and enjoy stargazing and astrophotography. Looking for someone who shares my sense of wonder about the universe.",
    location: "Tucson, AZ",
    interests: ["astronomy", "physics", "photography", "hiking", "science fiction"],
    photos: [
      "https://randomuser.me/api/portraits/men/91.jpg",
      "https://randomuser.me/api/portraits/men/92.jpg"
    ],
    gender: "male",
    interestedIn: ["female", "non-binary"],
    popularityPoints: 80,
    premiumStatus: "premium",
    giftInventory: { rose: 6, heart: 4, teddy: 1 },
    receivedGifts: { rose: 8, heart: 5, teddy: 2 },
    compatibilityScore: 0,
    personalityTraits: ["intellectual", "curious", "thoughtful"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    voiceIntro: "",
    favoriteMusic: ["classical", "ambient", "electronic"],
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    lastMessage: "The meteor shower tonight should be spectacular!",
    lastMessageTime: new Date("2023-09-15T22:15:00"),
    status: "offline",
    isDemo: true,
    preferences: {
      maxDistance: 50,
      ageRange: { min: 25, max: 38 },
      showMeToUsers: true,
      notificationPreferences: {
        messages: true,
        matches: true,
        likes: false,
        app: true
      },
      preferredLocations: ["Tucson", "Phoenix", "Flagstaff"],
      matchingPriorities: {
        interests: 5,
        personality: 5,
        location: 2,
        age: 2,
        writingStyle: 1
      }
    }
  },
  {
    id: "demo-18",
    name: "Gabriela Morales",
    email: "gabriela.m@example.com",
    age: 32,
    bio: "Human rights attorney working with refugees and asylum seekers. I'm passionate about social justice and equality. In my spare time, I enjoy painting and learning new languages.",
    location: "Minneapolis, MN",
    interests: ["human rights", "law", "languages", "painting", "international relations"],
    photos: [
      "https://randomuser.me/api/portraits/women/92.jpg",
      "https://randomuser.me/api/portraits/women/93.jpg"
    ],
    gender: "female",
    interestedIn: ["male"],
    popularityPoints: 82,
    premiumStatus: "basic",
    giftInventory: { rose: 5, heart: 3, teddy: 1 },
    receivedGifts: { rose: 11, heart: 7, teddy: 2 },
    compatibilityScore: 0,
    personalityTraits: ["dedicated", "compassionate", "analytical"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    voiceIntro: "",
    favoriteMusic: ["world music", "latin", "jazz"],
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    lastMessage: "Just won an important case for a family seeking asylum!",
    lastMessageTime: new Date("2023-09-16T14:30:00"),
    status: "away",
    isDemo: true,
    preferences: {
      maxDistance: 30,
      ageRange: { min: 28, max: 40 },
      showMeToUsers: true,
      notificationPreferences: {
        messages: true,
        matches: true,
        likes: true,
        app: false
      },
      preferredLocations: ["Minneapolis", "St. Paul", "Rochester"],
      matchingPriorities: {
        interests: 4,
        personality: 5,
        location: 2,
        age: 3,
        writingStyle: 1
      }
    }
  },
  {
    id: "demo-19",
    name: "Jordan Smith",
    email: "jordan.s@example.com",
    age: 26,
    bio: "Video game developer working on indie titles. I'm passionate about storytelling and creating immersive experiences. When not coding, I enjoy board games and fantasy novels.",
    location: "Austin, TX",
    interests: ["game development", "coding", "board games", "fantasy", "storytelling"],
    photos: [
      "https://randomuser.me/api/portraits/men/93.jpg",
      "https://randomuser.me/api/portraits/men/94.jpg"
    ],
    gender: "non-binary",
    interestedIn: ["male", "female", "non-binary"],
    popularityPoints: 77,
    premiumStatus: "premium",
    giftInventory: { rose: 7, heart: 4, teddy: 2 },
    receivedGifts: { rose: 9, heart: 6, teddy: 2 },
    compatibilityScore: 0,
    personalityTraits: ["creative", "analytical", "passionate"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    voiceIntro: "",
    favoriteMusic: ["synthwave", "soundtrack", "indie rock"],
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    lastMessage: "My game just got featured on the indie showcase!",
    lastMessageTime: new Date("2023-09-17T10:45:00"),
    status: "online",
    isDemo: true,
    preferences: {
      maxDistance: 35,
      ageRange: { min: 24, max: 36 },
      showMeToUsers: true,
      notificationPreferences: {
        messages: true,
        matches: true,
        likes: true,
        app: true
      },
      preferredLocations: ["Austin", "San Antonio", "Dallas"],
      matchingPriorities: {
        interests: 5,
        personality: 4,
        location: 2,
        age: 2,
        writingStyle: 2
      }
    }
  },
  {
    id: "demo-20",
    name: "Harper Lee",
    email: "harper.l@example.com",
    age: 28,
    bio: "Environmental lawyer fighting for climate justice. I'm dedicated to protecting our planet for future generations. In my free time, I enjoy rock climbing and botanical illustration.",
    location: "Portland, OR",
    interests: ["law", "environment", "climate justice", "rock climbing", "illustration"],
    photos: [
      "https://randomuser.me/api/portraits/women/28.jpg",
      "https://randomuser.me/api/portraits/women/29.jpg"
    ],
    gender: "female",
    interestedIn: ["male", "female"],
    popularityPoints: 84,
    premiumStatus: "basic",
    giftInventory: { rose: 4, heart: 2, teddy: 1 },
    receivedGifts: { rose: 12, heart: 7, teddy: 3 },
    compatibilityScore: 0,
    personalityTraits: ["determined", "principled", "articulate"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    voiceIntro: "",
    favoriteMusic: ["folk", "indie", "alternative"],
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    lastMessage: "We just won a major case against corporate polluters!",
    lastMessageTime: new Date("2023-09-16T09:35:00"),
    status: "offline",
    isDemo: true,
    preferences: {
      maxDistance: 30,
      ageRange: { min: 26, max: 36 },
      showMeToUsers: true,
      notificationPreferences: {
        messages: true,
        matches: true,
        likes: true,
        app: true
      },
      preferredLocations: ["Portland", "Seattle", "Vancouver"],
      matchingPriorities: {
        interests: 4,
        personality: 5,
        location: 3,
        age: 2,
        writingStyle: 1
      }
    }
  },
  {
    id: "demo-21",
    name: "Elijah Brown",
    email: "elijah.b@example.com",
    age: 34,
    bio: "Jazz musician and music teacher who loves improvisation and composition. I believe music is a universal language that connects people. Looking for someone to share the rhythm of life with.",
    location: "New Orleans, LA",
    interests: ["jazz", "music", "teaching", "composition", "concerts"],
    photos: [
      "https://randomuser.me/api/portraits/men/28.jpg",
      "https://randomuser.me/api/portraits/men/29.jpg"
    ],
    gender: "male",
    interestedIn: ["female"],
    popularityPoints: 81,
    premiumStatus: "premium",
    giftInventory: { rose: 6, heart: 4, teddy: 1 },
    receivedGifts: { rose: 8, heart: 5, teddy: 2 },
    compatibilityScore: 0,
    personalityTraits: ["creative", "expressive", "intuitive"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    voiceIntro: "",
    favoriteMusic: ["jazz", "blues", "soul", "funk"],
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    lastMessage: "My students' recital was fantastic - they've come so far!",
    lastMessageTime: new Date("2023-09-15T20:10:00"),
    status: "online",
    isDemo: true,
    preferences: {
      maxDistance: 25,
      ageRange: { min: 26, max: 40 },
      showMeToUsers: true,
      notificationPreferences: {
        messages: true,
        matches: true,
        likes: false,
        app: true
      },
      preferredLocations: ["New Orleans", "Baton Rouge", "Mobile"],
      matchingPriorities: {
        interests: 5,
        personality: 4,
        location: 3,
        age: 2,
        writingStyle: 1
      }
    }
  },
  {
    id: "demo-22",
    name: "Mia Wong",
    email: "mia.w@example.com",
    age: 31,
    bio: "Nutritionist specializing in plant-based diets. I'm passionate about helping people develop a healthy relationship with food. Outside of work, I enjoy gardening and pottery.",
    location: "Seattle, WA",
    interests: ["nutrition", "plant-based", "gardening", "pottery", "cooking"],
    photos: [
      "https://randomuser.me/api/portraits/women/38.jpg",
      "https://randomuser.me/api/portraits/women/39.jpg"
    ],
    gender: "female",
    interestedIn: ["male"],
    popularityPoints: 83,
    premiumStatus: "basic",
    giftInventory: { rose: 5, heart: 3, teddy: 1 },
    receivedGifts: { rose: 13, heart: 8, teddy: 3 },
    compatibilityScore: 0,
    personalityTraits: ["compassionate", "practical", "nurturing"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    voiceIntro: "",
    favoriteMusic: ["acoustic", "folk", "world music"],
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    lastMessage: "Just harvested my first homegrown vegetables - they taste amazing!",
    lastMessageTime: new Date("2023-09-17T13:25:00"),
    status: "away",
    isDemo: true,
    preferences: {
      maxDistance: 30,
      ageRange: { min: 28, max: 38 },
      showMeToUsers: true,
      notificationPreferences: {
        messages: true,
        matches: true,
        likes: true,
        app: false
      },
      preferredLocations: ["Seattle", "Tacoma", "Bellevue"],
      matchingPriorities: {
        interests: 4,
        personality: 5,
        location: 2,
        age: 3,
        writingStyle: 1
      }
    }
  },
  {
    id: "demo-23",
    name: "Caleb Rodriguez",
    email: "caleb.r@example.com",
    age: 27,
    bio: "Social worker focused on youth development programs. I believe in empowering young people to reach their potential. In my spare time, I coach basketball and write short stories.",
    location: "Detroit, MI",
    interests: ["social work", "youth development", "basketball", "writing", "mentoring"],
    photos: [
      "https://randomuser.me/api/portraits/men/38.jpg",
      "https://randomuser.me/api/portraits/men/39.jpg"
    ],
    gender: "male",
    interestedIn: ["female", "non-binary"],
    popularityPoints: 79,
    premiumStatus: "premium",
    giftInventory: { rose: 7, heart: 4, teddy: 2 },
    receivedGifts: { rose: 9, heart: 5, teddy: 2 },
    compatibilityScore: 0,
    personalityTraits: ["empathetic", "patient", "optimistic"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    voiceIntro: "",
    favoriteMusic: ["hip hop", "jazz", "soul"],
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    lastMessage: "My youth group just won their first tournament - so proud!",
    lastMessageTime: new Date("2023-09-16T17:40:00"),
    status: "offline",
    isDemo: true,
    preferences: {
      maxDistance: 25,
      ageRange: { min: 24, max: 34 },
      showMeToUsers: true,
      notificationPreferences: {
        messages: true,
        matches: true,
        likes: true,
        app: true
      },
      preferredLocations: ["Detroit", "Ann Arbor", "Lansing"],
      matchingPriorities: {
        interests: 3,
        personality: 5,
        location: 4,
        age: 2,
        writingStyle: 1
      }
    }
  },
  {
    id: "demo-24",
    name: "Amara Okafor",
    email: "amara.o@example.com",
    age: 29,
    bio: "Neuroscientist researching memory and learning. I'm fascinated by how the brain works and how we can optimize cognition. Outside the lab, I enjoy painting and long-distance running.",
    location: "Baltimore, MD",
    interests: ["neuroscience", "research", "painting", "running", "cognitive science"],
    photos: [
      "https://randomuser.me/api/portraits/women/48.jpg",
      "https://randomuser.me/api/portraits/women/49.jpg"
    ],
    gender: "female",
    interestedIn: ["male", "female"],
    popularityPoints: 86,
    premiumStatus: "vip",
    giftInventory: { rose: 9, heart: 6, teddy: 3 },
    receivedGifts: { rose: 14, heart: 9, teddy: 4 },
    compatibilityScore: 0,
    personalityTraits: ["analytical", "curious", "disciplined"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    voiceIntro: "",
    favoriteMusic: ["classical", "electronic", "ambient"],
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    lastMessage: "Our research paper just got accepted in a major journal!",
    lastMessageTime: new Date("2023-09-15T12:05:00"),
    status: "online",
    isDemo: true,
    preferences: {
      maxDistance: 30,
      ageRange: { min: 27, max: 40 },
      showMeToUsers: true,
      notificationPreferences: {
        messages: true,
        matches: true,
        likes: true,
        app: true
      },
      preferredLocations: ["Baltimore", "Washington DC", "Philadelphia"],
      matchingPriorities: {
        interests: 5,
        personality: 5,
        location: 2,
        age: 2,
        writingStyle: 1
      }
    }
  },
  {
    id: "demo-25",
    name: "Thomas Clark",
    email: "thomas.c@example.com",
    age: 33,
    bio: "Documentary filmmaker focusing on environmental and social issues. I travel the world capturing stories that need to be told. Looking for someone who appreciates adventure and purpose.",
    location: "Honolulu, HI",
    interests: ["filmmaking", "environment", "travel", "storytelling", "photography"],
    photos: [
      "https://randomuser.me/api/portraits/men/48.jpg",
      "https://randomuser.me/api/portraits/men/49.jpg"
    ],
    gender: "male",
    interestedIn: ["female"],
    popularityPoints: 82,
    premiumStatus: "premium",
    giftInventory: { rose: 6, heart: 4, teddy: 1 },
    receivedGifts: { rose: 8, heart: 5, teddy: 2 },
    compatibilityScore: 0,
    personalityTraits: ["observant", "thoughtful", "adventurous"],
    role: "subscriber",
    isBanned: false,
    verificationStatus: "verified",
    voiceIntro: "",
    favoriteMusic: ["world music", "ambient", "instrumental"],
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      accountType: ""
    },
    lastMessage: "Just got back from filming in the Amazon - incredible experience!",
    lastMessageTime: new Date("2023-09-17T15:55:00"),
    status: "away",
    isDemo: true,
    preferences: {
      maxDistance: 50,
      ageRange: { min: 26, max: 40 },
      showMeToUsers: true,
      notificationPreferences: {
        messages: true,
        matches: true,
        likes: false,
        app: true
      },
      preferredLocations: ["Honolulu", "Maui", "Kauai"],
      matchingPriorities: {
        interests: 5,
        personality: 4,
        location: 2,
        age: 3,
        writingStyle: 1
      }
    }
  },
];
