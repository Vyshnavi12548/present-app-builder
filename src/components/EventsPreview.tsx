import { Calendar, Clock, MapPin, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  attendees?: number;
  description?: string;
  confidence: number;
}

const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Team Meeting - Q4 Planning",
    date: "2024-01-15",
    time: "10:00 AM - 11:30 AM",
    location: "Conference Room A",
    attendees: 8,
    description: "Quarterly planning session for Q4 objectives",
    confidence: 95
  },
  {
    id: "2", 
    title: "Product Demo - Client Presentation",
    date: "2024-01-18",
    time: "2:00 PM - 3:00 PM",
    location: "Virtual - Zoom",
    attendees: 12,
    description: "Showcase new features to key stakeholders",
    confidence: 92
  },
  {
    id: "3",
    title: "Workshop - AI Implementation",
    date: "2024-01-22",
    time: "9:00 AM - 4:00 PM",
    location: "Training Center B",
    attendees: 25,
    description: "Full-day training on AI tools and workflows",
    confidence: 88
  }
];

const EventsPreview = ({ events = mockEvents }: { events?: CalendarEvent[] }) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "bg-green-100 text-green-800 border-green-200";
    if (confidence >= 80) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent text-accent-foreground">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">AI-Detected Events</h3>
            <p className="text-sm text-muted-foreground">
              Found {events.length} calendar events in your documents
            </p>
          </div>
        </div>
        <Button variant="ai" size="lg">
          <Calendar className="mr-2 h-5 w-5" />
          Add to Google Calendar
        </Button>
      </div>

      <div className="grid gap-4">
        {events.map((event) => (
          <Card key={event.id} className="gradient-card shadow-ai hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {event.time}
                    </div>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={`${getConfidenceColor(event.confidence)} border`}
                >
                  {event.confidence}% confidence
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {event.description && (
                <p className="text-sm text-muted-foreground">{event.description}</p>
              )}
              
              <div className="flex items-center gap-6 text-sm">
                {event.location && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                )}
                {event.attendees && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    {event.attendees} attendees
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button variant="ai-outline" size="sm">
                  Edit Details
                </Button>
                <Button variant="ghost" size="sm">
                  Remove Event
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {events.length === 0 && (
        <Card className="border-dashed border-2 border-muted">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No events detected yet</h3>
            <p className="text-muted-foreground max-w-md">
              Upload a document containing event information and our AI will automatically detect and extract calendar events for you.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EventsPreview;