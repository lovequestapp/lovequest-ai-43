
import React, { useState } from 'react';
import { format, parseISO, addDays } from 'date-fns';
import { useUser } from '@/context/UserContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Tag, 
  Sparkles, 
  Coffee, 
  UtensilsCrossed, 
  Film, 
  Landmark, 
  Trees, 
  Music, 
  Bike, 
  Heart, 
  Plus 
} from 'lucide-react';

// Types for our date objects
interface DateSuggestion {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  tags: string[];
  location?: string;
}

interface ScheduledDate {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  withUserId?: string;
  withUserName?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  suggestionId?: string;
}

const DateSuggestions: React.FC<{ 
  onSelect: (suggestion: DateSuggestion) => void,
  interests: string[]
}> = ({ onSelect, interests }) => {
  // Date activity suggestions based on interests
  const suggestions: DateSuggestion[] = [
    {
      id: '1',
      title: 'Coffee Date',
      description: 'Meet for coffee and get to know each other in a casual setting.',
      icon: <Coffee className="h-8 w-8 text-love-500" />,
      tags: ['casual', 'conversation', 'coffee'],
      location: 'Local café'
    },
    {
      id: '2',
      title: 'Dinner Date',
      description: 'Enjoy a nice dinner at a restaurant with good ambiance for conversation.',
      icon: <UtensilsCrossed className="h-8 w-8 text-love-500" />,
      tags: ['food', 'dinner', 'conversation'],
      location: 'Restaurant'
    },
    {
      id: '3',
      title: 'Movie Night',
      description: 'Watch a movie together and discuss it afterward.',
      icon: <Film className="h-8 w-8 text-love-500" />,
      tags: ['entertainment', 'movies', 'relaxed'],
      location: 'Cinema or home'
    },
    {
      id: '4',
      title: 'Museum Visit',
      description: 'Explore art or history together at a local museum.',
      icon: <Landmark className="h-8 w-8 text-love-500" />,
      tags: ['culture', 'art', 'history', 'learning'],
      location: 'Local museum'
    },
    {
      id: '5',
      title: 'Hike or Nature Walk',
      description: 'Get some fresh air and enjoy the outdoors together.',
      icon: <Trees className="h-8 w-8 text-love-500" />,
      tags: ['outdoors', 'active', 'nature'],
      location: 'Park or trail'
    },
    {
      id: '6',
      title: 'Concert or Live Music',
      description: 'Enjoy live music together for a fun and energetic date.',
      icon: <Music className="h-8 w-8 text-love-500" />,
      tags: ['music', 'entertainment', 'lively'],
      location: 'Concert venue'
    },
    {
      id: '7',
      title: 'Bike Ride',
      description: 'Rent bikes and explore the city or a scenic trail together.',
      icon: <Bike className="h-8 w-8 text-love-500" />,
      tags: ['active', 'outdoors', 'adventure'],
      location: 'Bike path or park'
    }
  ];
  
  // Filter suggestions by matching tags with user interests
  const getRelevanceScore = (suggestion: DateSuggestion) => {
    let score = 0;
    suggestion.tags.forEach(tag => {
      if (interests.some(interest => 
        interest.toLowerCase().includes(tag) || 
        tag.includes(interest.toLowerCase())
      )) {
        score += 1;
      }
    });
    return score;
  };
  
  // Sort suggestions by relevance to user interests
  const sortedSuggestions = [...suggestions].sort((a, b) => {
    return getRelevanceScore(b) - getRelevanceScore(a);
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sortedSuggestions.map((suggestion) => (
        <Card key={suggestion.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelect(suggestion)}>
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="bg-secondary/50 p-2 rounded-full">
              {suggestion.icon}
            </div>
            <div>
              <CardTitle className="text-lg">{suggestion.title}</CardTitle>
              {suggestion.location && (
                <CardDescription className="flex items-center gap-1 mt-1">
                  <MapPin size={14} />
                  <span>{suggestion.location}</span>
                </CardDescription>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{suggestion.description}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {suggestion.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className={interests.some(i => i.toLowerCase().includes(tag) || tag.includes(i.toLowerCase())) 
                    ? "bg-love-50 text-love-700 border-love-200" 
                    : ""
                  }
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="outline" className="w-full gap-2" onClick={() => onSelect(suggestion)}>
              <Heart size={16} />
              <span>Select This Date</span>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

const Dates: React.FC = () => {
  const { currentUser } = useUser();
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const [scheduledDates, setScheduledDates] = useState<ScheduledDate[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDate, setNewDate] = useState<Partial<ScheduledDate>>({
    title: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '18:00',
    location: '',
    status: 'pending'
  });
  const [selectedSuggestion, setSelectedSuggestion] = useState<DateSuggestion | null>(null);
  
  // Simulate user interests (would come from user profile)
  const userInterests = currentUser?.interests || ['music', 'outdoors', 'food', 'art', 'movies'];
  
  // Function to handle creating a new date
  const handleCreateDate = () => {
    if (newDate.title && newDate.date && newDate.time && newDate.location) {
      const dateToAdd: ScheduledDate = {
        id: Math.random().toString(36).substring(2, 9),
        title: newDate.title || '',
        description: newDate.description || '',
        date: newDate.date || '',
        time: newDate.time || '',
        location: newDate.location || '',
        status: 'pending',
        notes: newDate.notes,
        suggestionId: selectedSuggestion?.id
      };
      
      setScheduledDates([...scheduledDates, dateToAdd]);
      setShowCreateModal(false);
      resetNewDate();
    }
  };
  
  // Reset the new date form
  const resetNewDate = () => {
    setNewDate({
      title: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '18:00',
      location: '',
      status: 'pending'
    });
    setSelectedSuggestion(null);
  };
  
  // Handle selecting a date suggestion
  const handleSelectSuggestion = (suggestion: DateSuggestion) => {
    setSelectedSuggestion(suggestion);
    setNewDate({
      ...newDate,
      title: suggestion.title,
      description: suggestion.description,
      location: suggestion.location || '',
    });
  };
  
  // Get dates for the selected day
  const getDatesForSelectedDay = () => {
    if (!selectedDay) return [];
    
    const formattedSelectedDay = format(selectedDay, 'yyyy-MM-dd');
    return scheduledDates.filter(date => date.date === formattedSelectedDay);
  };
  
  // Dates for the selected day
  const datesForSelectedDay = getDatesForSelectedDay();
  
  // Function to get date class based on whether dates exist for that day
  const getDayClass = (day: Date) => {
    const formattedDay = format(day, 'yyyy-MM-dd');
    const hasDate = scheduledDates.some(date => date.date === formattedDay);
    
    return hasDate ? 'bg-love-100 text-love-900 font-bold rounded-full' : undefined;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold flex items-center gap-2">
            <CalendarIcon className="h-8 w-8" />
            <span>Date Planner</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Schedule and manage your dates with potential matches
          </p>
        </div>
        
        <Tabs defaultValue="calendar" className="mb-8">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="suggestions">Date Ideas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="text-xl">Select a Date</CardTitle>
                  <CardDescription>Choose a day to view or add dates</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDay}
                    onSelect={setSelectedDay}
                    className="rounded-md border shadow-sm p-3 pointer-events-auto"
                    modifiers={{
                      booked: (date) => {
                        const formatted = format(date, 'yyyy-MM-dd');
                        return scheduledDates.some(d => d.date === formatted);
                      }
                    }}
                    modifiersClassNames={{
                      booked: "bg-love-50 text-love-900 font-medium"
                    }}
                  />
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => setShowCreateModal(true)} 
                    className="w-full bg-gradient-love hover:opacity-90"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Schedule New Date
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-xl">
                    {selectedDay ? (
                      <>Dates for {format(selectedDay, 'MMMM d, yyyy')}</>
                    ) : (
                      <>Select a day</>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {datesForSelectedDay.length === 0 
                      ? "No dates scheduled for this day" 
                      : `${datesForSelectedDay.length} date(s) scheduled`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {datesForSelectedDay.length === 0 ? (
                    <div className="text-center py-10">
                      <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Dates Scheduled</h3>
                      <p className="text-muted-foreground max-w-md mx-auto mb-6">
                        You don't have any dates planned for this day yet. 
                        Schedule a date to start planning your next romantic adventure!
                      </p>
                      <Button 
                        onClick={() => setShowCreateModal(true)}
                        className="bg-gradient-love hover:opacity-90"
                      >
                        <Plus className="mr-2 h-4 w-4" /> Schedule a Date
                      </Button>
                    </div>
                  ) : (
                    <ScrollArea className="h-[400px] md:h-auto md:max-h-[600px]">
                      <div className="space-y-4">
                        {datesForSelectedDay.map((date) => (
                          <Card key={date.id} className="overflow-hidden">
                            <div className={`h-2 ${
                              date.status === 'confirmed' ? 'bg-green-500' :
                              date.status === 'pending' ? 'bg-amber-500' :
                              date.status === 'completed' ? 'bg-blue-500' :
                              'bg-red-500'
                            }`} />
                            <CardHeader className="pb-3">
                              <div className="flex justify-between items-start">
                                <CardTitle>{date.title}</CardTitle>
                                <Badge variant={
                                  date.status === 'confirmed' ? 'default' :
                                  date.status === 'pending' ? 'outline' :
                                  date.status === 'completed' ? 'secondary' :
                                  'destructive'
                                }>
                                  {date.status.charAt(0).toUpperCase() + date.status.slice(1)}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center text-muted-foreground">
                                  <Clock size={16} className="mr-1" />
                                  <span>{date.time}</span>
                                </div>
                                <div className="flex items-center text-muted-foreground">
                                  <MapPin size={16} className="mr-1" />
                                  <span>{date.location}</span>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm">{date.description}</p>
                              
                              {date.withUserName && (
                                <div className="mt-3 flex items-center gap-2">
                                  <Heart size={16} className="text-love-500" />
                                  <span className="text-sm font-medium">Date with: {date.withUserName}</span>
                                </div>
                              )}
                              
                              {date.notes && (
                                <div className="mt-3 pt-3 border-t">
                                  <p className="text-sm text-muted-foreground">{date.notes}</p>
                                </div>
                              )}
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2">
                              <Button variant="outline" size="sm">Edit</Button>
                              <Button 
                                variant={date.status === 'confirmed' ? 'default' : 'outline'} 
                                size="sm"
                                className={date.status === 'confirmed' ? 'bg-gradient-love hover:opacity-90' : ''}
                              >
                                {date.status === 'confirmed' ? 'Confirmed' : 'Confirm'}
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="suggestions" className="mt-6">
            <div className="mb-6">
              <h2 className="text-2xl font-display font-semibold mb-3">Date Suggestions</h2>
              <p className="text-muted-foreground">
                Browse these date ideas based on your interests and preferences. 
                The highlighted tags match your profile interests.
              </p>
            </div>
            
            <DateSuggestions 
              onSelect={(suggestion) => {
                handleSelectSuggestion(suggestion);
                setShowCreateModal(true);
              }}
              interests={userInterests}
            />
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Dialog for creating a new date */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Schedule a New Date</DialogTitle>
            <DialogDescription>
              Fill in the details to add this date to your calendar.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {selectedSuggestion && (
              <div className="bg-secondary/30 p-3 rounded-lg mb-2">
                <div className="flex items-center gap-3 mb-2">
                  {selectedSuggestion.icon}
                  <div>
                    <h3 className="font-medium">{selectedSuggestion.title}</h3>
                    <p className="text-xs text-muted-foreground">Date suggestion selected</p>
                  </div>
                </div>
                <p className="text-sm">{selectedSuggestion.description}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newDate.date}
                  onChange={(e) => setNewDate({...newDate, date: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={newDate.time}
                  onChange={(e) => setNewDate({...newDate, time: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newDate.title}
                onChange={(e) => setNewDate({...newDate, title: e.target.value})}
                placeholder="Give your date a name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={newDate.location}
                onChange={(e) => setNewDate({...newDate, location: e.target.value})}
                placeholder="Where will you meet?"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newDate.description}
                onChange={(e) => setNewDate({...newDate, description: e.target.value})}
                placeholder="Add details about your date plans"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Personal Notes</Label>
              <Textarea
                id="notes"
                value={newDate.notes || ''}
                onChange={(e) => setNewDate({...newDate, notes: e.target.value})}
                placeholder="Add any private notes for yourself (not shared with your date)"
                rows={2}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowCreateModal(false);
              resetNewDate();
            }}>
              Cancel
            </Button>
            <Button onClick={handleCreateDate} className="bg-gradient-love hover:opacity-90">
              Schedule Date
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Dates;
