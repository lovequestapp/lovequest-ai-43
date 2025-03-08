
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Sparkles } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  isTextInput?: boolean;
  minLength?: number;
}

interface CompatibilityQuizProps {
  onComplete: (results: Record<string, string>) => void;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 'personal-story',
    question: 'Tell your personal story. The more details you share, the better we can match you with compatible partners!',
    options: [],
    isTextInput: true,
    minLength: 100
  },
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
  },
  {
    id: 'childhood-influence',
    question: 'Tell us about how your childhood has influenced your approach to relationships today.',
    options: [],
    isTextInput: true,
    minLength: 100
  },
  {
    id: 'life-goals',
    question: 'Describe your most important life goals and how you hope a partner will fit into them.',
    options: [],
    isTextInput: true,
    minLength: 100
  }
];

const CompatibilityQuiz: React.FC<CompatibilityQuizProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");
  
  const handleNext = () => {
    const currentQuestionData = quizQuestions[currentQuestion];
    
    if (currentQuestionData.isTextInput) {
      const minLength = currentQuestionData.minLength || 10;
      if (textInput.trim().length >= minLength) {
        setAnswers(prev => ({
          ...prev,
          [currentQuestionData.id]: textInput
        }));
        
        setCurrentQuestion(prev => prev + 1);
        setTextInput("");
      }
    } else if (selectedOption) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestionData.id]: selectedOption
      }));
      
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
      } else {
        // Quiz completed
        onComplete({
          ...answers,
          [currentQuestionData.id]: selectedOption
        });
      }
    }
  };
  
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const currentQuestionData = quizQuestions[currentQuestion];
  const isTextQuestion = currentQuestionData.isTextInput;
  const minLength = currentQuestionData.minLength || 10;
  const buttonEnabled = isTextQuestion ? textInput.trim().length >= minLength : !!selectedOption;
  
  const getCharacterFeedback = () => {
    const charCount = textInput.trim().length;
    if (charCount < minLength) {
      return {
        message: `Please write at least ${minLength} characters (${charCount}/${minLength})`,
        color: 'text-red-500'
      };
    } else if (charCount < minLength * 2) {
      return {
        message: `Good start! Consider adding more details (${charCount} characters)`,
        color: 'text-amber-500'
      };
    } else if (charCount < minLength * 4) {
      return {
        message: `Great! Your detailed response helps us find better matches (${charCount} characters)`,
        color: 'text-green-500'
      };
    } else {
      return {
        message: `Excellent! Your thorough response will significantly improve your matches (${charCount} characters)`,
        color: 'text-love-500'
      };
    }
  };
  
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
            {currentQuestionData.question}
          </h3>
          
          {isTextQuestion ? (
            <div className="space-y-2">
              <Textarea 
                placeholder={`Share your thoughts here... (at least ${minLength} characters for better matching)`}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="min-h-40 resize-none"
              />
              <p className={`text-sm ${getCharacterFeedback().color}`}>
                {getCharacterFeedback().message}
              </p>
            </div>
          ) : (
            <RadioGroup 
              value={selectedOption || ''} 
              onValueChange={setSelectedOption}
              className="space-y-3"
            >
              {currentQuestionData.options.map((option, index) => (
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
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleNext}
          disabled={!buttonEnabled}
          className="w-full bg-gradient-love hover:opacity-90"
        >
          {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'Complete Quiz'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CompatibilityQuiz;
