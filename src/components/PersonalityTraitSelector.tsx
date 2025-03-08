
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PersonalityTraitSelectorProps {
  selectedTraits: string[];
  onSelectTrait: (trait: string) => void;
}

const PersonalityTraitSelector: React.FC<PersonalityTraitSelectorProps> = ({
  selectedTraits,
  onSelectTrait
}) => {
  const availableTraits = [
    "Creative", "Outgoing", "Shy", "Analytical", "Romantic", 
    "Ambitious", "Adventurous", "Calm", "Funny", "Honest",
    "Loyal", "Spontaneous", "Thoughtful", "Compassionate", "Patient",
    "Determined", "Reliable", "Intelligent", "Optimistic", "Sensitive"
  ];
  
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500 mb-3">Select traits that describe you (click to toggle)</p>
      <div className="flex flex-wrap gap-2">
        {availableTraits.map((trait) => {
          const isSelected = selectedTraits.includes(trait);
          return (
            <Badge 
              key={trait}
              variant={isSelected ? "default" : "outline"}
              className={cn(
                "cursor-pointer py-1.5 px-3 hover:bg-love-50",
                isSelected ? "bg-love-500 hover:bg-love-600" : "hover:text-love-600 hover:border-love-200"
              )}
              onClick={() => onSelectTrait(trait)}
            >
              {trait}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default PersonalityTraitSelector;
