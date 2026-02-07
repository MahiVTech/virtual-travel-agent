import { useState } from "react";
import { Calendar, MapPin, Clock, DollarSign, Edit2, Trash2, Plane, Hotel, Car, Camera, AlertTriangle, List, CalendarDays } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";

export interface ItineraryItem {
  id: string;
  day: number;
  type: "flight" | "hotel" | "transfer" | "sightseeing";
  title: string;
  time?: string;
  duration?: string;
  location?: string;
  price: number;
  details?: string;
}

interface ItineraryBuilderProps {
  items: ItineraryItem[];
  onRemove: (id: string) => void;
  onOptimize: () => void;
  onProceed?: () => void;
}

export function ItineraryBuilder({ items, onRemove, onOptimize, onProceed }: ItineraryBuilderProps) {
  const [viewMode, setViewMode] = useState<"list" | "timeline">("timeline");
  
  const groupedByDay = items.reduce((acc, item) => {
    if (!acc[item.day]) acc[item.day] = [];
    acc[item.day].push(item);
    return acc;
  }, {} as Record<number, ItineraryItem[]>);

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  const getIcon = (type: string) => {
    switch (type) {
      case "flight":
        return <Plane className="size-4" />;
      case "hotel":
        return <Hotel className="size-4" />;
      case "transfer":
        return <Car className="size-4" />;
      case "sightseeing":
        return <Camera className="size-4" />;
      default:
        return <MapPin className="size-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "flight":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "hotel":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "transfer":
        return "bg-green-100 text-green-700 border-green-200";
      case "sightseeing":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Check for risks
  const getRisks = () => {
    const risks = [];
    const hotelItems = items.filter(i => i.type === "hotel");
    
    if (hotelItems.length > 0 && hotelItems[0].price > 45000) {
      risks.push("Premium hotel may impact budget flexibility");
    }
    
    const dayItems = groupedByDay[1] || [];
    if (dayItems.length > 3) {
      risks.push("Day 1 schedule is packed - consider customer fatigue");
    }
    
    return risks;
  };

  const risks = getRisks();

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Itinerary Builder</CardTitle>
          <CardDescription>Add items from recommendations to build the itinerary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Calendar className="size-12 mx-auto mb-3 opacity-50" />
            <p>No items added yet</p>
            <p className="text-sm mt-1">Start by selecting recommended options</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Itinerary Builder</CardTitle>
            <CardDescription>{items.length} items • {Object.keys(groupedByDay).length} days</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setViewMode(viewMode === "list" ? "timeline" : "list")}
            >
              {viewMode === "list" ? <CalendarDays className="size-4" /> : <List className="size-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={onOptimize}>
              <Clock className="size-4 mr-2" />
              Optimize
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Risk Warnings */}
        {risks.length > 0 && (
          <div className="space-y-2">
            {risks.map((risk, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm p-3 rounded-lg bg-red-50 border border-red-200 text-red-900">
                <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                <span>{risk}</span>
              </div>
            ))}
          </div>
        )}

        {/* Timeline View */}
        {viewMode === "timeline" ? (
          <div className="space-y-6">
            {Object.entries(groupedByDay)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([day, dayItems]) => (
                <div key={day} className="relative">
                  {/* Day Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center size-10 rounded-full bg-blue-600 text-white font-bold shrink-0">
                      {day}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">Day {day}</div>
                      <div className="text-sm text-muted-foreground">
                        {dayItems.length} activities
                      </div>
                    </div>
                  </div>

                  {/* Timeline Items */}
                  <div className="ml-5 border-l-2 border-dashed border-gray-300 pl-6 space-y-4">
                    {dayItems.map((item, idx) => (
                      <div key={item.id} className="relative">
                        {/* Timeline Dot */}
                        <div className={`absolute -left-[29px] size-4 rounded-full border-2 border-white ${getTypeColor(item.type).split(' ')[0]}`} />
                        
                        {/* Item Card */}
                        <div className={`rounded-lg border-2 p-3 ${getTypeColor(item.type)}`}>
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-full bg-white">
                              {getIcon(item.type)}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="font-medium">{item.title}</div>
                              
                              <div className="flex flex-wrap items-center gap-3 mt-1 text-sm opacity-90">
                                {item.time && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="size-3" />
                                    {item.time}
                                  </span>
                                )}
                                {item.duration && (
                                  <span>{item.duration}</span>
                                )}
                                {item.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="size-3" />
                                    {item.location}
                                  </span>
                                )}
                              </div>

                              {item.details && (
                                <p className="text-sm mt-1 opacity-90">{item.details}</p>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="text-right">
                                <div className="font-semibold whitespace-nowrap">₹{item.price.toLocaleString('en-IN')}</div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onRemove(item.id)}
                                className="size-8 hover:bg-white/50"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          // List View (existing code)
          <div className="space-y-6">
            {Object.entries(groupedByDay)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([day, dayItems]) => (
                <div key={day} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-600">Day {day}</Badge>
                    <Separator className="flex-1" />
                  </div>

                  <div className="space-y-2">
                    {dayItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="mt-1 p-2 rounded-full bg-blue-100 text-blue-600">
                          {getIcon(item.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{item.title}</div>
                          
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                            {item.time && (
                              <span className="flex items-center gap-1">
                                <Clock className="size-3" />
                                {item.time}
                              </span>
                            )}
                            {item.duration && (
                              <span>{item.duration}</span>
                            )}
                            {item.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="size-3" />
                                {item.location}
                              </span>
                            )}
                          </div>

                          {item.details && (
                            <p className="text-sm text-muted-foreground mt-1">{item.details}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <div className="font-semibold">₹{item.price.toLocaleString('en-IN')}</div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemove(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}

        <Separator />

        <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 border border-blue-200">
          <div>
            <div className="font-semibold">Total Package Cost</div>
            <div className="text-sm text-muted-foreground">All items included</div>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            ₹{totalPrice.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1" onClick={onProceed}>Review & Book</Button>
          <Button variant="outline">Save Draft</Button>
        </div>
      </CardContent>
    </Card>
  );
}