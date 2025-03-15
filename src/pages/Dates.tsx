
import React, { useState, useEffect } from 'react';
import { format, parseISO, addDays } from 'date-fns';
import { useUser } from '@/context/UserContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MapView from '@/components/MapView';
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
import { useIsMobile } from '@/hooks/use-mobile';
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
  Plus,
  Search,
  Trash2,
  Map
} from 'lucide-react';
import { toast } from 'sonner';

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
  city?: string;
  coordinates?: [number, number];
  withUserId?: string;
  withUserName?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  suggestionId?: string;
}

interface CitySuggestion {
  name: string;
  venueTags: string[];
}

// City data for suggestions
const cityData: CitySuggestion[] = [
  { 
    name: "New York", 
    venueTags: ["Central Park", "restaurants", "Broadway", "museums", "cafes", "High Line"] 
  },
  { 
    name: "San Francisco", 
    venueTags: ["Golden Gate Park", "tech museums", "seafood", "Fisherman's Wharf", "Alcatraz"] 
  },
  { 
    name: "Los Angeles", 
    venueTags: ["beaches", "Hollywood", "Griffith Observatory", "entertainment", "studios"] 
  },
  { 
    name: "Chicago", 
    venueTags: ["Millennium Park", "deep dish pizza", "museums", "architecture tours", "jazz"] 
  },
  { 
    name: "Miami", 
    venueTags: ["beaches", "Art Deco", "Cuban food", "nightlife", "water sports"] 
  },
  { 
    name: "Seattle", 
    venueTags: ["Space Needle", "coffee shops", "Pike Place Market", "seafood", "nature"] 
  },
  { 
    name: "Austin", 
    venueTags: ["live music", "BBQ", "food trucks", "outdoor activities", "bars"] 
  },
  { 
    name: "Boston", 
    venueTags: ["Freedom Trail", "historic sites", "seafood", "universities", "breweries"] 
  },
  { 
    name: "Denver", 
    venueTags: ["mountain views", "outdoor activities", "breweries", "arts", "museums"] 
  },
  { 
    name: "Portland", 
    venueTags: ["food trucks", "nature", "coffee", "craft beer", "bookstores"] 
  }
];

const DateSuggestions: React.FC<{ 
  onSelect: (suggestion: DateSuggestion) => void,
  interests: string[],
  cityName?: string
}> = ({ onSelect, interests, cityName }) => {
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
  
  // Function to add city-specific suggestions
  const generateCitySuggestions = (): DateSuggestion[] => {
    if (!cityName) return [];
    
    const matchedCity = cityData.find(city => 
      city.name.toLowerCase() === cityName.toLowerCase() ||
      cityName.toLowerCase().includes(city.name.toLowerCase())
    );
    
    if (!matchedCity) return [];
    
    // Create city-specific date suggestions
    return matchedCity.venueTags.map((tag, index) => ({
      id: `city-${index}`,
      title: `${tag} in ${matchedCity.name}`,
      description: `Enjoy ${tag} in ${matchedCity.name}, a local favorite activity.`,
      icon: <MapPin className="h-8 w-8 text-love-500" />,
      tags: [tag, matchedCity.name.toLowerCase(), 'local', 'city'],
      location: matchedCity.name
    }));
  };
  
  // Combine standard suggestions with city-specific ones
  const allSuggestions = [...suggestions, ...generateCitySuggestions()];
  
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
    
    // Give city suggestions a boost
    if (suggestion.id.startsWith('city-')) {
      score += 2;
    }
    
    return score;
  };
  
  // Sort suggestions by relevance to user interests
  const sortedSuggestions = [...allSuggestions].sort((a, b) => {
    return getRelevanceScore(b) - getRelevanceScore(a);
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-20 md:pb-0">
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

const DateDetailsCard: React.FC<{
  date: ScheduledDate;
  onDelete?: (id: string) => void;
  onEdit?: (date: ScheduledDate) => void;
}> = ({ date, onDelete, onEdit }) => {
  const [showMap, setShowMap] = useState(false);
  
  return (
    <Card className="overflow-hidden mb-4">
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
        
        <div className="flex flex-wrap items-center gap-4 mt-2">
          <div className="flex items-center text-muted-foreground">
            <CalendarIcon size={16} className="mr-1" />
            <span>{format(new Date(date.date), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock size={16} className="mr-1" />
            <span>{date.time}</span>
          </div>
        </div>
        
        <div className="flex items-center text-muted-foreground mt-1">
          <MapPin size={16} className="mr-1 flex-shrink-0" />
          <span className="truncate">{date.location}</span>
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
        
        {showMap && date.city && (
          <div className="mt-3">
            <MapView 
              location={date.city} 
              height="200px"
            />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between gap-2">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowMap(!showMap)}>
            <Map size={16} className="mr-1" />
            {showMap ? 'Hide Map' : 'Show Map'}
          </Button>
          {onDelete && (
            <Button variant="outline" size="sm" onClick={() => onDelete(date.id)} className="text-destructive">
              <Trash2 size={16} className="mr-1" />
              Delete
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <Button variant="outline" size="sm" onClick={() => onEdit(date)}>Edit</Button>
          )}
          <Button 
            variant={date.status === 'confirmed' ? 'default' : 'outline'} 
            size="sm"
            className={date.status === 'confirmed' ? 'bg-gradient-love hover:opacity-90' : ''}
          >
            {date.status === 'confirmed' ? 'Confirmed' : 'Confirm'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const Dates: React.FC = () => {
  const { currentUser } = useUser();
  const isMobile = useIsMobile();
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const [scheduledDates, setScheduledDates] = useState<ScheduledDate[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDate, setNewDate] = useState<Partial<ScheduledDate>>({
    title: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '18:00',
    location: '',
    city: '',
    status: 'pending'
  });
  const [selectedSuggestion, setSelectedSuggestion] = useState<DateSuggestion | null>(null);
  const [selectedTabView, setSelectedTabView] = useState('calendar');
  const [editingDateId, setEditingDateId] = useState<string | null>(null);
  
  // Simulate user interests (would come from user profile)
  const userInterests = currentUser?.interests || ['music', 'outdoors', 'food', 'art', 'movies'];
  
  // Function to handle creating a new date
  const handleCreateDate = () => {
    if (newDate.title && newDate.date && newDate.time && newDate.location) {
      const dateToAdd: ScheduledDate = {
        id: editingDateId || Math.random().toString(36).substring(2, 9),
        title: newDate.title || '',
        description: newDate.description || '',
        date: newDate.date || '',
        time: newDate.time || '',
        location: newDate.location || '',
        city: newDate.city || '',
        coordinates: newDate.coordinates,
        status: 'pending',
        notes: newDate.notes,
        suggestionId: selectedSuggestion?.id
      };
      
      if (editingDateId) {
        setScheduledDates(scheduledDates.map(date => 
          date.id === editingDateId ? dateToAdd : date
        ));
        setEditingDateId(null);
        toast.success("Date updated successfully!");
      } else {
        setScheduledDates([...scheduledDates, dateToAdd]);
        toast.success("New date scheduled successfully!");
      }
      
      setShowCreateModal(false);
      resetNewDate();
    } else {
      toast.error("Please fill in all required fields");
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
      city: '',
      status: 'pending'
    });
    setSelectedSuggestion(null);
    setEditingDateId(null);
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
  
  // Function to handle deleting a date
  const handleDeleteDate = (id: string) => {
    setScheduledDates(scheduledDates.filter(date => date.id !== id));
    toast.success("Date removed successfully");
  };
  
  // Function to handle editing a date
  const handleEditDate = (date: ScheduledDate) => {
    setNewDate({
      ...date
    });
    setEditingDateId(date.id);
    setShowCreateModal(true);
  };
  
  // Handle location selection from the map
  const handleLocationSelect = (location: string, coordinates?: [number, number]) => {
    // Extract city from location (usually the first part before the comma)
    const cityMatch = location.match(/^([^,]+)/);
    const city = cityMatch ? cityMatch[1].trim() : '';
    
    setNewDate({
      ...newDate,
      location: location,
      city: city,
      coordinates: coordinates
    });
  };
  
  // Dates for the selected day
  const datesForSelectedDay = getDatesForSelectedDay();
  
  // Function to get date class based on whether dates exist for that day
  const getDayClass = (day: Date) => {
    const formattedDay = format(day, 'yyyy-MM-dd');
    const hasDate = scheduledDates.some(date => date.date === formattedDay);
    
    return hasDate ? 'bg-love-100 text-love-900 font-bold rounded-full' : undefined;
  };
  
  // Load example dates on first render for demo purposes
  useEffect(() => {
    if (scheduledDates.length === 0) {
      const today = new Date();
      const tomorrow = addDays(today, 1);
      const nextWeek = addDays(today, 7);
      
      const exampleDates: ScheduledDate[] = [
        {
          id: '1',
          title: 'Coffee Date',
          description: 'First date at a cozy coffee shop',
          date: format(today, 'yyyy-MM-dd'),
          time: '15:30',
          location: 'Starbucks, Union Square',
          city: 'San Francisco',
          status: 'confirmed',
          withUserName: 'Jamie Smith'
        },
        {
          id: '2',
          title: 'Museum Visit',
          description: 'Exploring the modern art museum',
          date: format(tomorrow, 'yyyy-MM-dd'),
          time: '13:00',
          location: 'SFMOMA, 151 3rd St',
          city: 'San Francisco',
          status: 'pending'
        },
        {
          id: '3',
          title: 'Dinner Date',
          description: 'Trying out the new Italian restaurant',
          date: format(nextWeek, 'yyyy-MM-dd'),
          time: '19:30',
          location: 'Il Fornaio, 1265 Battery St',
          city: 'San Francisco',
          status: 'pending',
          notes: 'Remember to make a reservation'
        }
      ];
      
      setScheduledDates(exampleDates);
    }
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold flex items-center gap-2">
            <CalendarIcon className="h-7 w-7" />
            <span>Date Planner</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Schedule and manage your dates with potential matches
          </p>
        </div>
        
        <Tabs value={selectedTabView} onValueChange={setSelectedTabView} className="mb-8">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="suggestions">Date Ideas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="mt-6 pb-16 md:pb-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
              <Card className="md:col-span-1 order-2 md:order-1">
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
              
              <Card className="md:col-span-2 order-1 md:order-2">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center justify-between">
                    <span>
                      {selectedDay ? (
                        <>Dates for {format(selectedDay, 'MMMM d, yyyy')}</>
                      ) : (
                        <>Select a day</>
                      )}
                    </span>
                    {isMobile && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setShowCreateModal(true)}
                        className="flex md:hidden"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
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
                    <ScrollArea className="h-[400px] md:h-auto md:max-h-[600px] pr-4">
                      <div className="space-y-4">
                        {datesForSelectedDay.map((date) => (
                          <DateDetailsCard 
                            key={date.id} 
                            date={date} 
                            onDelete={handleDeleteDate}
                            onEdit={handleEditDate}
                          />
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="suggestions" className="mt-6 pb-20 md:pb-0">
            <div className="mb-6">
              <h2 className="text-2xl font-display font-semibold mb-3">Date Suggestions</h2>
              <p className="text-muted-foreground mb-4">
                Browse these date ideas based on your interests and preferences. 
                The highlighted tags match your profile interests.
              </p>
              
              <div className="mb-6">
                <Label htmlFor="citySearch" className="mb-2 block">Search for city-specific date ideas:</Label>
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="citySearch"
                    placeholder="Enter a city name (e.g., New York, San Francisco)"
                    className="pl-10"
                    value={newDate.city || ''}
                    onChange={(e) => setNewDate({...newDate, city: e.target.value})}
                  />
                </div>
                {newDate.city && (
                  <p className="text-sm text-love-500 mt-2">
                    Showing suggestions for {newDate.city}
                  </p>
                )}
              </div>
            </div>
            
            <DateSuggestions 
              onSelect={(suggestion) => {
                handleSelectSuggestion(suggestion);
                setShowCreateModal(true);
              }}
              interests={userInterests}
              cityName={newDate.city}
            />
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Dialog for creating a new date */}
      <Dialog open={showCreateModal} onOpenChange={(open) => {
        if (!open) resetNewDate();
        setShowCreateModal(open);
      }}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingDateId ? 'Edit Date' : 'Schedule a New Date'}</DialogTitle>
            <DialogDescription>
              Fill in the details to {editingDateId ? 'update' : 'add'} this date to your calendar.
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
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={newDate.city || ''}
                onChange={(e) => setNewDate({...newDate, city: e.target.value})}
                placeholder="City name (e.g., New York, San Francisco)"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Full Address/Location</Label>
              <Input
                id="location"
                value={newDate.location}
                onChange={(e) => setNewDate({...newDate, location: e.target.value})}
                placeholder="Where will you meet?"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Search on Map (Optional)</Label>
              <MapView 
                location={newDate.location || newDate.city || ''}
                onLocationSelect={handleLocationSelect}
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
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-2">
            <Button variant="outline" onClick={() => {
              setShowCreateModal(false);
              resetNewDate();
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateDate} 
              className="bg-gradient-love hover:opacity-90"
              type="button"
            >
              {editingDateId ? 'Update Date' : 'Schedule Date'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Dates;
