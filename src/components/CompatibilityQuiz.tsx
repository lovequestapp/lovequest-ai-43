
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Sparkles } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
}

interface CompatibilityQuizProps {
  onComplete: (results: Record<string, string>) => void;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 'communication',
    question: 'How do you prefer to communicate in a relationship?',
    options: [
      'Regular, deep conversations about everything',
      'Focused discussions when issues arise',
      'Light, fun conversations with occasional serious talks',
      'Actions speak louder than words'
    ]
  },
  {
    id: 'quality-time',
    question: "What's your ideal way to spend quality time together?",
    options: [
      'Adventurous activities and exploring new places',
      'Quiet evenings at home watching movies or cooking',
      'Social events and spending time with friends',
      'Independent activities in the same space'
    ]
  },
  {
    id: 'future',
    question: 'How do you see your future in the next 5 years?',
    options: [
      'Career-focused, establishing professional success',
      'Starting or growing a family',
      'Traveling and experiencing different cultures',
      'Taking life as it comes without rigid plans'
    ]
  },
  {
    id: 'conflict',
    question: 'How do you typically handle conflict?',
    options: [
      'Address issues immediately and directly',
      'Process emotions first, then discuss calmly',
      'Prefer to let minor issues go to maintain harmony',
      'Need space before addressing problems'
    ]
  },
  {
    id: 'values',
    question: 'What values are most important to you in a relationship?',
    options: [
      'Honesty and open communication',
      "Growth and supporting each other's goals",
      'Passion and maintaining excitement',
      'Stability and reliability'
    ]
  }
];

const CompatibilityQuiz: React.FC<CompatibilityQuizProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const handleNext = () => {
    if (selectedOption) {
      setAnswers(prev => ({
        ...prev,
        [quizQuestions[currentQuestion].id]: selectedOption
      }));
      
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
      } else {
        // Quiz completed
        onComplete({
          ...answers,
          [quizQuestions[currentQuestion].id]: selectedOption
        });
      }
    }
  };
  
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  
  return (
    <Card className="w-full max-w-md mx-auto animate-slide-up-fade">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-display">Compatibility Quiz</CardTitle>
          <Sparkles size={20} className="text-love-500" />
        </div>
        <CardDescription>
          Answer these questions to help our AI find your perfect match
        </CardDescription>
        <Progress value={progress} className="h-2 bg-gray-100" />
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {quizQuestions[currentQuestion].question}
          </h3>
          
          <RadioGroup 
            value={selectedOption || ''} 
            onValueChange={setSelectedOption}
            className="space-y-3"
          >
            {quizQuestions[currentQuestion].options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={option} 
                  id={`option-${index}`} 
                  className="text-love-500 border-gray-300"
                />
                <Label 
                  htmlFor={`option-${index}`}
                  className="flex-grow p-3 rounded-md hover:bg-love-50 cursor-pointer transition-colors"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleNext}
          disabled={!selectedOption}
          className="w-full bg-gradient-love hover:opacity-90"
        >
          {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'Complete Quiz'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CompatibilityQuiz;
