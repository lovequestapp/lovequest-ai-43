
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';

interface InterestsFormProps {
  interests: string[];
  onInterestSelect: (interest: string) => void;
}

const InterestsForm: React.FC<InterestsFormProps> = ({
  interests,
  onInterestSelect
}) => {
  // Available categories with their interests
  const interestCategories = [
    {
      category: "Sports & Fitness",
      items: ["Running", "Yoga", "Gym", "Hiking", "Swimming", "Cycling", "Basketball", "Soccer", "Tennis", "Boxing"]
    },
    {
      category: "Arts & Culture",
      items: ["Music", "Art", "Theater", "Dance", "Photography", "Writing", "Reading", "Film", "Museums", "Concerts"]
    },
    {
      category: "Food & Drink",
      items: ["Cooking", "Baking", "Wine", "Craft Beer", "Foodie", "Coffee", "Vegan", "Vegetarian", "BBQ", "Fine Dining"]
    },
    {
      category: "Lifestyle",
      items: ["Travel", "Fashion", "Shopping", "Gaming", "Technology", "Pets", "Gardening", "DIY", "Meditation", "Spirituality"]
    },
    {
      category: "Social Activities",
      items: ["Nightlife", "Parties", "Board Games", "Karaoke", "Volunteer Work", "Networking", "Languages", "Politics", "Activism", "Podcasts"]
    }
  ];
  
  return (
    <div className="space-y-6 mt-8">
      <div>
        <h3 className="text-lg font-medium">What are your interests?</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Select interests that you enjoy or are passionate about. This helps us match you with like-minded people.
        </p>
      </div>
      
      <div className="space-y-6">
        {interestCategories.map((category) => (
          <div key={category.category} className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">{category.category}</h4>
            <div className="flex flex-wrap gap-2">
              {category.items.map((item) => {
                const isSelected = interests.includes(item);
                return (
                  <Badge 
                    key={item}
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer py-1.5 px-3 hover:bg-love-50",
                      isSelected ? "bg-love-500 hover:bg-love-600" : "hover:text-love-600 hover:border-love-200"
                    )}
                    onClick={() => onInterestSelect(item)}
                  >
                    {item}
                  </Badge>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {interests.length > 0 && (
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Selected Interests</span>
            <span className="text-sm text-muted-foreground">{interests.length}/20</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {interests.map((interest) => (
              <Badge
                key={interest}
                variant="default"
                className="bg-love-500 hover:bg-love-600 py-1.5 px-3 cursor-pointer"
                onClick={() => onInterestSelect(interest)}
              >
                {interest}
                <span className="ml-1">×</span>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InterestsForm;
