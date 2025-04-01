
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DiscoverContent from './DiscoverContent';
import { UserWithCoordinates } from '@/types/user';
import { toast } from 'sonner';

const Discover = () => {
  // Mock data for testing
  const [profiles, setProfiles] = useState<UserWithCoordinates[]>([
    {
      id: "1",
      name: "Sophie",
      email: "sophie@example.com",
      age: 28,
      bio: "Adventure seeker and coffee enthusiast",
      location: "New York",
      interests: ["hiking", "photography", "travel"],
      photos: ["https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"],
      gender: "female",
      interestedIn: ["male"],
      popularityPoints: 85,
      premiumStatus: "basic",
      giftInventory: { rose: 0, heart: 0, teddy: 0 },
      receivedGifts: { rose: 0, heart: 0, teddy: 0 },
      compatibilityScore: 87,
      personalityTraits: ["outgoing", "creative", "spontaneous"],
      role: "subscriber",
      isBanned: false,
      verificationStatus: "verified",
      voiceIntro: "",
      favoriteMusic: [],
      lastMessage: "",
      lastMessageTime: new Date(),
      status: "online",
      coordinates: { latitude: 40.7128, longitude: -74.0060 },
      distance: 2.5,
      bankDetails: {
        accountName: "",
        accountNumber: "",
        bankName: "",
        routingNumber: "",
        accountType: ""
      }
    },
    {
      id: "2",
      name: "James",
      email: "james@example.com",
      age: 32,
      bio: "Tech enthusiast and foodie. Looking for someone to explore new restaurants with.",
      location: "San Francisco",
      interests: ["technology", "food", "music"],
      photos: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"],
      gender: "male",
      interestedIn: ["female"],
      popularityPoints: 72,
      premiumStatus: "premium",
      giftInventory: { rose: 0, heart: 0, teddy: 0 },
      receivedGifts: { rose: 0, heart: 0, teddy: 0 },
      compatibilityScore: 78,
      personalityTraits: ["analytical", "curious", "ambitious"],
      role: "subscriber",
      isBanned: false,
      verificationStatus: "verified",
      voiceIntro: "",
      favoriteMusic: [],
      lastMessage: "",
      lastMessageTime: new Date(),
      status: "online",
      coordinates: { latitude: 37.7749, longitude: -122.4194 },
      distance: 5.8,
      bankDetails: {
        accountName: "",
        accountNumber: "",
        bankName: "",
        routingNumber: "",
        accountType: ""
      }
    },
  ]);

  const handleSwipe = (id: string, direction: 'left' | 'right') => {
    // Remove the swiped profile from the list
    setProfiles(profiles.filter(profile => profile.id !== id));
    
    // Show feedback based on swipe direction
    if (direction === 'right') {
      toast.success("You liked this profile!", {
        description: "We'll notify you if it's a match!",
      });
    } else {
      toast.info("Profile skipped", {
        description: "We won't show this profile again",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-4 pb-32">
        <DiscoverContent profiles={profiles} onSwipe={handleSwipe} />
      </main>
      <Footer className="mt-auto" />
    </div>
  );
};

export default Discover;
