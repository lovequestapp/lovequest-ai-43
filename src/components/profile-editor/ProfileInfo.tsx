
import React from "react";
import { useUser } from "@/context/UserContext";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GiftInventory } from "@/types/user";

interface ProfileInfoProps {
  profile?: any;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile }) => {
  const { currentUser } = useUser();
  const userData = profile || currentUser;

  if (!userData) {
    return (
      <div className="p-6 text-center">
        <div className="animate-pulse space-y-4">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-gray-200"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const calculateTotalGifts = (gifts?: GiftInventory): number => {
    if (!gifts) return 0;

    return Object.entries(gifts).reduce((sum, [_, giftOrCount]) => {
      if (
        giftOrCount &&
        typeof giftOrCount === "object" &&
        giftOrCount !== null &&
        "count" in giftOrCount
      ) {
        return sum + (typeof giftOrCount.count === "number" ? giftOrCount.count : 0);
      }
      if (typeof giftOrCount === "number") {
        return sum + giftOrCount;
      }
      return sum;
    }, 0);
  };

  const getGiftCount = (
    gifts: GiftInventory | undefined,
    type: "rose" | "heart" | "teddy"
  ): number => {
    if (!gifts) return 0;
    const gift = gifts[type];
    const giftValue = gift ?? null;

    if (
      giftValue !== null &&
      giftValue !== undefined &&
      typeof giftValue === "object" &&
      "count" in giftValue
    ) {
      return typeof (giftValue as any).count === "number" ? (giftValue as any).count : 0;
    }
    if (typeof giftValue === "number") {
      return giftValue;
    }
    return 0;
  };

  const getGiftValue = (
    gifts: GiftInventory | undefined,
    type: "rose" | "heart" | "teddy"
  ): number => {
    if (!gifts) return 0;
    const gift = gifts[type];
    const giftValue = gift ?? null;

    if (
      giftValue !== null &&
      giftValue !== undefined &&
      typeof giftValue === "object" &&
      "count" in giftValue &&
      "value" in giftValue
    ) {
      const count = typeof (giftValue as any).count === "number" ? (giftValue as any).count : 0;
      const value = typeof (giftValue as any).value === "number" ? (giftValue as any).value : 0;
      return count * value;
    }
    return 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
        <Avatar className="h-24 w-24 border-2 border-love-100">
          <AvatarImage src={userData.photos?.[0] || ""} alt={userData.name} />
          <AvatarFallback className="text-2xl bg-love-100 text-love-800">
            {userData.name?.substring(0, 2).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-semibold">{userData.name || "No Name"}</h2>
            <Badge variant="outline" className="bg-love-50 text-love-700">
              {userData.premiumStatus
                ? userData.premiumStatus.charAt(0).toUpperCase() + userData.premiumStatus.slice(1)
                : "Basic"}
            </Badge>
            {userData.verificationStatus === "verified" && (
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Verified
              </Badge>
            )}
          </div>

          <p className="text-gray-600">{userData.email || "No email"}</p>
          <p className="text-gray-600">{userData.location || "No location set"}</p>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-2">About Me</h3>
        <p className="text-gray-600">
          {userData.bio || "No bio available. Add one by editing your profile!"}
        </p>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-2">Interests</h3>
        <div className="flex flex-wrap gap-2">
          {userData.interests && userData.interests.length > 0 ? (
            userData.interests.map((interest: string, index: number) => (
              <Badge key={index} variant="secondary">
                {interest}
              </Badge>
            ))
          ) : (
            <p className="text-gray-600">No interests added yet</p>
          )}
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-gray-500">Popularity</p>
            <p className="text-2xl font-semibold">{userData.popularityPoints || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-gray-500">Total Gifts Received</p>
            <p className="text-2xl font-semibold">
              {calculateTotalGifts(userData.receivedGifts)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-gray-500">Gift Value</p>
            <p className="text-2xl font-semibold">
              $
              {(
                getGiftValue(userData.receivedGifts, "rose") +
                getGiftValue(userData.receivedGifts, "heart") +
                getGiftValue(userData.receivedGifts, "teddy")
              ).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileInfo;

