import { useState } from "react";
import { Brain, Menu, User, Settings, LogOut, HelpCircle, BarChart, TrendingUp, Clock, Users as UsersIcon, Plane, MapPin, Star } from "lucide-react";
import { CustomerQueryInput } from "@/app/components/CustomerQueryInput";
import { IntentAnalysis } from "@/app/components/IntentAnalysis";
import { RecommendationCard, Recommendation } from "@/app/components/RecommendationCard";
import { ItineraryBuilder, ItineraryItem } from "@/app/components/ItineraryBuilder";
import { DecisionAssistant, Alert } from "@/app/components/DecisionAssistant";
import { AgentControlPanel } from "@/app/components/AgentControlPanel";
import { ComparisonDialog } from "@/app/components/ComparisonDialog";
import { BookingConfidenceSummary } from "@/app/components/BookingConfidenceSummary";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import { toast } from "sonner";

interface IntentData {
  destination: string;
  dates: string;
  travelers: { adults: number; children: number };
  budget: string;
  preferences: string[];
  confidence: number;
}

interface AgentControls {
  budgetSensitivity: "low" | "medium" | "high";
  preferenceWeight: "location" | "price" | "experience";
  riskTolerance: "conservative" | "balanced" | "aggressive";
  upsellMode: "soft" | "recommended" | "maximize";
  showAlternatives: boolean;
  autoOptimize: boolean;
}

export default function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [intent, setIntent] = useState<IntentData | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [controlPanelOpen, setControlPanelOpen] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [comparisonDialogOpen, setComparisonDialogOpen] = useState(false);
  const [bookingConfidenceOpen, setBookingConfidenceOpen] = useState(false);
  
  const [agentControls, setAgentControls] = useState<AgentControls>({
    budgetSensitivity: "medium",
    preferenceWeight: "experience",
    riskTolerance: "balanced",
    upsellMode: "recommended",
    showAlternatives: true,
    autoOptimize: true,
  });

  const [flightRecommendations, setFlightRecommendations] = useState<any[]>([]);
  const [activityRecommendations, setActivityRecommendations] = useState<any[]>([]);

  const handleAnalyzeQuery = (query: string) => {
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Parse query for destination
      const queryLower = query.toLowerCase();
      
      let destination = "";
      let destinationName = "";
      let destinationType: "leisure" | "pilgrimage" | "business" = "leisure";
      let isFamily = false;
      let isHoneymoon = false;
      let isLuxury = false;
      let budget = "₹1.2L - ₹1.5L";
      let preferences: string[] = [];
      
      // Detect destination - INDIA PILGRIMAGE DESTINATIONS FIRST
      if (queryLower.includes("kedarnath")) {
        destination = "Kedarnath, Uttarakhand";
        destinationName = "Kedarnath";
        destinationType = "pilgrimage";
      } else if (queryLower.includes("badrinath")) {
        destination = "Badrinath, Uttarakhand";
        destinationName = "Badrinath";
        destinationType = "pilgrimage";
      } else if (queryLower.includes("vaishno devi") || queryLower.includes("vaishnodevi")) {
        destination = "Vaishno Devi, Jammu";
        destinationName = "Vaishno Devi";
        destinationType = "pilgrimage";
      } else if (queryLower.includes("tirupati")) {
        destination = "Tirupati, Andhra Pradesh";
        destinationName = "Tirupati";
        destinationType = "pilgrimage";
      } else if (queryLower.includes("amritsar") || queryLower.includes("golden temple")) {
        destination = "Amritsar, Punjab";
        destinationName = "Amritsar";
        destinationType = "pilgrimage";
      } 
      // INDIA LEISURE DESTINATIONS
      else if (queryLower.includes("goa")) {
        destination = "Goa, India";
        destinationName = "Goa";
      } else if (queryLower.includes("kerala")) {
        destination = "Kerala, India";
        destinationName = "Kerala";
      } else if (queryLower.includes("manali") || queryLower.includes("shimla")) {
        destination = "Manali, Himachal Pradesh";
        destinationName = "Manali";
      } else if (queryLower.includes("ladakh") || queryLower.includes("leh")) {
        destination = "Leh-Ladakh";
        destinationName = "Ladakh";
      }
      // INTERNATIONAL DESTINATIONS
      else if (queryLower.includes("singapore")) {
        destination = "Singapore";
        destinationName = "Singapore";
      } else if (queryLower.includes("maldives")) {
        destination = "Maldives";
        destinationName = "Maldives";
      } else if (queryLower.includes("bali")) {
        destination = "Bali, Indonesia";
        destinationName = "Bali";
      } else if (queryLower.includes("thailand") || queryLower.includes("bangkok") || queryLower.includes("phuket")) {
        destination = "Thailand";
        destinationName = "Thailand";
      } else if (queryLower.includes("dubai")) {
        destination = "Dubai, UAE";
        destinationName = "Dubai";
      } else if (queryLower.includes("paris")) {
        destination = "Paris, France";
        destinationName = "Paris";
      }
      
      // If no destination detected, show error
      if (!destination) {
        setIsProcessing(false);
        toast.error("Could not detect destination. Please specify a clear destination in your query.");
        return;
      }
      
      // Detect trip type
      if (queryLower.includes("family") || queryLower.includes("kids") || queryLower.includes("children")) {
        isFamily = true;
        preferences.push("Family-friendly", "Kids activities");
      }
      
      if (queryLower.includes("honeymoon") || queryLower.includes("romantic") || queryLower.includes("couple")) {
        isHoneymoon = true;
        preferences.push("Honeymoon", "Romantic");
      }
      
      if (queryLower.includes("luxury") || queryLower.includes("premium") || queryLower.includes("5 star")) {
        isLuxury = true;
        preferences.push("Luxury resort", "Premium amenities");
      }
      
      // Detect preferences
      if (queryLower.includes("beach")) {
        preferences.push("Beach access");
      }
      if (queryLower.includes("waterpark") || queryLower.includes("water park")) {
        preferences.push("Waterpark");
      }
      if (queryLower.includes("villa") || queryLower.includes("water villa")) {
        preferences.push("Water villa");
      }
      if (queryLower.includes("spa")) {
        preferences.push("Spa & wellness");
      }
      if (queryLower.includes("trek") || queryLower.includes("trekking")) {
        preferences.push("Trekking");
      }
      if (queryLower.includes("spiritual") || queryLower.includes("religious") || queryLower.includes("temple") || queryLower.includes("darshan")) {
        preferences.push("Spiritual", "Temple visit");
        destinationType = "pilgrimage";
      }
      
      // Extract budget
      const budgetMatch = query.match(/(\d+\.?\d*)\s*L/i);
      if (budgetMatch) {
        const amount = parseFloat(budgetMatch[1]);
        budget = `₹${amount - 0.3}L - ₹${amount}L`;
      }
      
      // For pilgrimage, adjust defaults
      if (destinationType === "pilgrimage") {
        if (preferences.length === 0) {
          preferences = ["Spiritual", "Temple visit", "Darshan"];
        }
        budget = budgetMatch ? budget : "₹40K - ₹80K";
      }
      
      // Parse intent from query
      const mockIntent: IntentData = {
        destination,
        dates: destinationType === "pilgrimage" 
          ? "May 15-18, 2026 (3 nights)" 
          : "Dec 15-22, 2026 (7 nights)",
        travelers: isFamily ? { adults: 2, children: 2 } : { adults: 2, children: 0 },
        budget,
        preferences: preferences.length > 0 ? preferences : ["Sightseeing", "Local cuisine"],
        confidence: 92,
      };

      setIntent(mockIntent);
      setRecommendations(getMockRecommendations(destinationName, isFamily, isHoneymoon, isLuxury, destinationType));
      setAlerts(getMockAlerts(destinationName, destinationType));
      setFlightRecommendations(getMockFlights(destinationName));
      setActivityRecommendations(getMockActivities(destinationName, isFamily, destinationType));
      setIsProcessing(false);
      
      toast.success(`${destinationName} detected! Analyzing best options...`);
    }, 2000);
  };

  // Dynamic mock data based on destination
  const getMockRecommendations = (
    destination: string, 
    isFamily: boolean, 
    isHoneymoon: boolean, 
    isLuxury: boolean, 
    destinationType: "leisure" | "pilgrimage" | "business"
  ): Recommendation[] => {
    
    // KEDARNATH PILGRIMAGE
    if (destination === "Kedarnath") {
      return [
        {
          id: "package-1",
          type: "hotel",
          name: "Kedarnath Helicopter Package",
          location: "Kedarnath Temple, Uttarakhand",
          price: 45000,
          originalPrice: 52000,
          rating: 4.6,
          reviews: 890,
          image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1080&q=80",
          highlights: [
            "Round-trip helicopter (Phata-Kedarnath)",
            "VIP darshan pass included",
            "Guesthouse stay in Kedarnath",
          ],
          whyRecommended: "Fastest and most comfortable option. Helicopter saves 16 km trek. Weather permitting, completes yatra in 1 day.",
          tradeoffs: "Weather dependent. May cancel last minute if visibility low. Trek option available as backup.",
          urgency: "Only 8 helicopter slots left for May 15-18",
          matchScore: 94,
        },
        {
          id: "package-2",
          type: "hotel",
          name: "Kedarnath Trek Package",
          location: "Gaurikund to Kedarnath (16 km trek)",
          price: 28000,
          rating: 4.4,
          reviews: 1240,
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080&q=80",
          highlights: [
            "Traditional pilgrimage experience",
            "Guided trek with porter service",
            "Guesthouse accommodation",
          ],
          whyRecommended: "Traditional yatra experience. Budget-friendly. No weather dependency. Spiritual journey on foot.",
          tradeoffs: "Physically demanding 16 km uphill trek. Requires good fitness. 2-3 days needed.",
          matchScore: 86,
        },
      ];
    }
    
    // VAISHNO DEVI
    if (destination === "Vaishno Devi") {
      return [
        {
          id: "package-1",
          type: "hotel",
          name: "Vaishno Devi Yatra Package",
          location: "Katra Base Camp, J&K",
          price: 32000,
          rating: 4.7,
          reviews: 2340,
          image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1080&q=80",
          highlights: [
            "Hotel stay in Katra",
            "Helicopter darshan option",
            "Ardhkuwari cave visit included",
          ],
          whyRecommended: "Well-organized package with flexible darshan options. Helicopter available if needed. Katra hotels comfortable.",
          tradeoffs: "13 km trek still required even with helicopter (only covers part of route)",
          matchScore: 92,
        },
      ];
    }
    
    // GOA LEISURE
    if (destination === "Goa") {
      return [
        {
          id: "hotel-1",
          type: "hotel",
          name: isLuxury ? "Taj Exotica Goa" : "Lemon Tree Hotel",
          location: "Calangute Beach, Goa",
          price: isLuxury ? 38000 : 28000,
          originalPrice: isLuxury ? 45000 : 32000,
          rating: isLuxury ? 4.8 : 4.5,
          reviews: isLuxury ? 2140 : 1580,
          image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1080&q=80",
          highlights: isFamily
            ? ["Beach access", "Kids pool", "Water sports nearby"]
            : ["Private beach", "Beach shacks", "Nightlife access"],
          whyRecommended: isFamily
            ? "Family-friendly resort close to Calangute beach. Safe swimming area for kids."
            : "Perfect beach vacation. Close to clubs and beach parties. Great food scene.",
          tradeoffs: "North Goa can be crowded in December. Book early.",
          urgency: "Peak season pricing starts Dec 20",
          matchScore: 93,
        },
      ];
    }
    
    // Singapore hotels
    if (destination === "Singapore") {
      return [
        {
          id: "hotel-1",
          type: "hotel",
          name: isLuxury ? "Marina Bay Sands" : "Hotel Fort Canning",
          location: isLuxury ? "Marina Bay, Singapore" : "Fort Canning, Singapore",
          price: isLuxury ? 55000 : 42000,
          originalPrice: isLuxury ? 62000 : 48000,
          rating: isLuxury ? 4.9 : 4.6,
          reviews: isLuxury ? 4120 : 2340,
          image: isLuxury 
            ? "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1080&q=80"
            : "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1080&q=80",
          highlights: isFamily 
            ? ["Universal Studios access", "Family suites", "Kids club facilities"]
            : isHoneymoon
            ? ["Infinity pool", "Romantic dining", "Spa packages"]
            : ["City views", "Central location", "Award-winning restaurants"],
          whyRecommended: isFamily 
            ? "Perfect family destination with Universal Studios nearby. Safe, clean, and very kid-friendly."
            : isHoneymoon
            ? "Iconic luxury experience with world-class amenities. Perfect for romantic getaways."
            : "Excellent location with easy access to attractions. Great value for money.",
          tradeoffs: isLuxury ? "Premium pricing, may stretch budget" : "Less resort-like than beach destinations",
          urgency: "Limited availability for peak season",
          matchScore: 95,
        },
        {
          id: "hotel-2",
          type: "hotel",
          name: "Sentosa Resort & Spa",
          location: "Sentosa Island, Singapore",
          price: 48000,
          rating: 4.7,
          reviews: 2890,
          image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1080&q=80",
          highlights: ["Beach access", "Resort facilities", "Close to attractions"],
          whyRecommended: "Resort experience within Singapore. Beach access and family-friendly environment.",
          tradeoffs: "Sentosa location requires transport to main city attractions",
          matchScore: 89,
        },
      ];
    }
    
    // Maldives resorts
    if (destination === "Maldives") {
      return [
        {
          id: "hotel-1",
          type: "hotel",
          name: "Anantara Veli Resort",
          location: "South Male Atoll, Maldives",
          price: 75000,
          originalPrice: 85000,
          rating: 4.9,
          reviews: 1580,
          image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1080&q=80",
          highlights: ["Water villa", "All-inclusive", "Private pool", "Snorkeling"],
          whyRecommended: "Premium overwater villas with exceptional privacy. Perfect for honeymoons with all-inclusive luxury.",
          tradeoffs: "Above typical budget but exceptional value for Maldives standards",
          urgency: "Only 2 water villas available",
          matchScore: 96,
        },
        {
          id: "hotel-2",
          type: "hotel",
          name: "Sun Siyam Iru Fushi",
          location: "Noonu Atoll, Maldives",
          price: 68000,
          rating: 4.8,
          reviews: 2240,
          image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1080&q=80",
          highlights: ["Beach & water villas", "Multiple restaurants", "Diving center"],
          whyRecommended: "Excellent balance of luxury and value. Great for both honeymooners and families.",
          matchScore: 92,
        },
      ];
    }
    
    // Default: Dubai
    return [
      {
        id: "hotel-1",
        type: "hotel",
        name: "Atlantis The Palm",
        location: "Palm Jumeirah, Dubai",
        price: 45000,
        originalPrice: 52000,
        rating: 4.8,
        reviews: 3240,
        image: "https://images.unsplash.com/photo-1759177715489-74112089de1a?w=1080&q=80",
        highlights: isFamily
          ? ["Free Aquaventure Waterpark", "Kids club", "Multiple dining options"]
          : ["Luxury amenities", "Private beach", "Award-winning restaurants"],
        whyRecommended: isFamily
          ? "Perfect for families with children. Includes waterpark access which saves ₹8,000 separately."
          : "Iconic Dubai experience with world-class facilities and dining.",
        tradeoffs: "Palm Island location, 25 min from downtown. Daily transfers needed.",
        urgency: "Only 3 rooms left at this price",
        matchScore: 94,
      },
      {
        id: "hotel-2",
        type: "hotel",
        name: "JW Marriott Marquis",
        location: "Business Bay, Dubai",
        price: 38000,
        rating: 4.6,
        reviews: 2180,
        image: "https://images.unsplash.com/photo-1621073831231-faa453d28112?w=1080&q=80",
        highlights: ["Central location", "Kids pool", "Metro nearby"],
        whyRecommended: "Best location-to-price ratio. Central to all major attractions, saves commute time and money.",
        tradeoffs: "No waterpark access. Less resort-like than beachfront options.",
        matchScore: 88,
      },
    ];
  };

  const getMockAlerts = (destination: string, destinationType: "leisure" | "pilgrimage" | "business"): Alert[] => {
    // KEDARNATH SPECIFIC ALERTS
    if (destination === "Kedarnath") {
      return [
        {
          id: "alert-1",
          type: "warning",
          title: "⚠️ Seasonal Yatra Window",
          message: "Kedarnath temple opens only May-October. Yatra closed in winter due to heavy snowfall. Confirm travel dates within season.",
        },
        {
          id: "alert-2",
          type: "warning",
          title: "⚠️ Weather Dependency",
          message: "Helicopter services weather-dependent. Recommend keeping 1 buffer day. Trek option available as backup if helicopter cancelled.",
        },
        {
          id: "alert-3",
          type: "info",
          title: "💡 Travel Tip",
          message: "Medical fitness certificate recommended for helicopter booking. Carry warm clothing even in summer - temperature drops at 3,500m altitude.",
        },
        {
          id: "alert-4",
          type: "opportunity",
          title: "Upsell Opportunity",
          message: "Complete Char Dham package (Kedarnath + Badrinath + Gangotri + Yamunotri) available for ₹1.2L with helicopter. High conversion for spiritual travelers.",
          action: {
            label: "Show Package",
            onClick: () => toast.success("Char Dham package details loaded"),
          },
        },
      ];
    }
    
    // VAISHNO DEVI
    if (destination === "Vaishno Devi") {
      return [
        {
          id: "alert-1",
          type: "info",
          title: "💡 Booking Tip",
          message: "Online yatra slip registration mandatory. Can help customer with registration. Helicopter tokens sell out fast.",
        },
        {
          id: "alert-2",
          type: "opportunity",
          title: "Upsell Opportunity",
          message: "Combine with Amritsar Golden Temple (₹25K extra). Popular 2-in-1 North India spiritual package.",
          action: {
            label: "Add to Quote",
            onClick: () => toast.success("Amritsar added to itinerary"),
          },
        },
      ];
    }
    
    if (destination === "Singapore") {
      return [
        {
          id: "alert-1",
          type: "warning",
          title: "Peak Season Alert",
          message: "Singapore hotel prices rising due to F1 season. Book now to secure rates.",
          action: {
            label: "View Options",
            onClick: () => toast.success("Showing best available options"),
          },
        },
        {
          id: "alert-2",
          type: "opportunity",
          title: "Upsell Opportunity",
          message: "Universal Studios tickets (₹8,500) + Gardens by the Bay (₹2,500) highly recommended for this itinerary.",
          action: {
            label: "Add to Quote",
            onClick: () => toast.success("Activities added"),
          },
        },
      ];
    }
    
    if (destination === "Maldives") {
      return [
        {
          id: "alert-1",
          type: "info",
          title: "Travel Tip",
          message: "Speedboat transfers to resort cost ₹15,000 extra. Seaplane transfers offer better experience for ₹22,000.",
        },
        {
          id: "alert-2",
          type: "opportunity",
          title: "Upsell Opportunity",
          message: "Diving packages (₹12,000) and sunset cruise (₹8,500) very popular with honeymooners.",
          action: {
            label: "Add to Quote",
            onClick: () => toast.success("Added to itinerary"),
          },
        },
      ];
    }
    
    // Default: Dubai
    return [
      {
        id: "alert-1",
        type: "warning",
        title: "Price Surge Alert",
        message: "Dubai hotel prices rising 12% this week due to high demand. Book soon to lock current rates.",
        action: {
          label: "View Options",
          onClick: () => toast.success("Showing best available options"),
        },
      },
      {
        id: "alert-2",
        type: "opportunity",
        title: "Upsell Opportunity",
        message: "Customer's budget allows for desert safari (₹6,500) + dhow cruise (₹4,000). High conversion rate for Dubai trips.",
        action: {
          label: "Add to Quote",
          onClick: () => {
            const safariItem: ItineraryItem = {
              id: `item-${Date.now()}`,
              day: 3,
              type: "sightseeing",
              title: "Desert Safari with BBQ Dinner",
              time: "3:00 PM",
              duration: "6 hours",
              location: "Dubai Desert",
              price: 6500,
              details: "Dune bashing, camel ride, cultural show, BBQ dinner",
            };
            setItineraryItems(prev => [...prev, safariItem]);
            toast.success("Desert Safari added to itinerary");
            setAlerts(prev => prev.filter(a => a.id !== "alert-2"));
          },
        },
      },
    ];
  };

  const getMockFlights = (destination: string) => {
    if (destination === "Kedarnath") {
      return [
        {
          id: "flight-1",
          airline: "IndiGo",
          route: "Delhi → Dehradun",
          departure: "06:30 AM",
          arrival: "07:45 AM",
          duration: "1h 15m",
          type: "Direct",
          price: 8500,
          class: "Economy",
          matchScore: 95,
        },
        {
          id: "flight-2",
          airline: "Air India",
          route: "Delhi → Dehradun",
          departure: "02:15 PM",
          arrival: "03:30 PM",
          duration: "1h 15m",
          type: "Direct",
          price: 9200,
          class: "Economy",
          matchScore: 92,
        },
      ];
    }

    if (destination === "Singapore") {
      return [
        {
          id: "flight-1",
          airline: "Singapore Airlines",
          route: "Delhi → Singapore",
          departure: "11:30 PM",
          arrival: "07:45 AM +1",
          duration: "5h 45m",
          type: "Direct",
          price: 42000,
          class: "Economy",
          matchScore: 96,
        },
        {
          id: "flight-2",
          airline: "Air India",
          route: "Delhi → Singapore",
          departure: "08:15 AM",
          arrival: "04:30 PM",
          duration: "5h 45m",
          type: "Direct",
          price: 38500,
          class: "Economy",
          matchScore: 93,
        },
      ];
    }

    if (destination === "Maldives") {
      return [
        {
          id: "flight-1",
          airline: "IndiGo",
          route: "Delhi → Male",
          departure: "05:00 AM",
          arrival: "10:30 AM",
          duration: "4h 30m",
          type: "Direct",
          price: 35000,
          class: "Economy",
          matchScore: 94,
        },
        {
          id: "flight-2",
          airline: "Air India",
          route: "Delhi → Male",
          departure: "09:45 PM",
          arrival: "03:15 AM +1",
          duration: "4h 30m",
          type: "Direct",
          price: 32500,
          class: "Economy",
          matchScore: 91,
        },
      ];
    }

    // Default: Dubai
    return [
      {
        id: "flight-1",
        airline: "Emirates",
        route: "Delhi → Dubai",
        departure: "02:45 AM",
        arrival: "05:15 AM",
        duration: "3h 30m",
        type: "Direct",
        price: 28000,
        class: "Economy",
        matchScore: 95,
      },
      {
        id: "flight-2",
        airline: "IndiGo",
        route: "Delhi → Dubai",
        departure: "08:30 AM",
        arrival: "11:00 AM",
        duration: "3h 30m",
        type: "Direct",
        price: 24500,
        class: "Economy",
        matchScore: 92,
      },
    ];
  };

  const getMockActivities = (destination: string, isFamily: boolean, destinationType: "leisure" | "pilgrimage" | "business") => {
    if (destination === "Kedarnath") {
      return [
        {
          id: "activity-1",
          name: "Kedarnath Temple Darshan",
          duration: "2-3 hours",
          price: 0,
          image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&q=80",
          description: "Holy temple dedicated to Lord Shiva, one of 12 Jyotirlingas",
          matchScore: 98,
        },
        {
          id: "activity-2",
          name: "Gaurikund Hot Springs Visit",
          duration: "1 hour",
          price: 0,
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
          description: "Natural hot water springs at trek starting point",
          matchScore: 85,
        },
      ];
    }

    if (destination === "Singapore") {
      return [
        {
          id: "activity-1",
          name: "Universal Studios Singapore",
          duration: "Full day",
          price: 8500,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
          description: "Southeast Asia's first and only Universal Studios theme park",
          matchScore: isFamily ? 98 : 88,
        },
        {
          id: "activity-2",
          name: "Gardens by the Bay",
          duration: "3-4 hours",
          price: 2500,
          image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=80",
          description: "Iconic Supertree Grove and Cloud Forest experience",
          matchScore: 92,
        },
        {
          id: "activity-3",
          name: "Night Safari",
          duration: "4 hours",
          price: 4500,
          image: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600&q=80",
          description: "World's first nocturnal wildlife park",
          matchScore: isFamily ? 94 : 86,
        },
      ];
    }

    if (destination === "Maldives") {
      return [
        {
          id: "activity-1",
          name: "Scuba Diving Package",
          duration: "Half day",
          price: 12000,
          image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
          description: "Explore vibrant coral reefs and marine life",
          matchScore: 95,
        },
        {
          id: "activity-2",
          name: "Sunset Dolphin Cruise",
          duration: "2 hours",
          price: 8500,
          image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80",
          description: "Romantic sunset cruise with dolphin watching",
          matchScore: 93,
        },
        {
          id: "activity-3",
          name: "Private Island Picnic",
          duration: "Full day",
          price: 15000,
          image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&q=80",
          description: "Exclusive sandbank picnic experience",
          matchScore: 90,
        },
      ];
    }

    // Default: Dubai
    return [
      {
        id: "activity-1",
        name: "Desert Safari with BBQ",
        duration: "6 hours",
        price: 6500,
        image: "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=600&q=80",
        description: "Dune bashing, camel ride, cultural show, BBQ dinner",
        matchScore: 96,
      },
      {
        id: "activity-2",
        name: "Burj Khalifa At The Top",
        duration: "2 hours",
        price: 4500,
        image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",
        description: "124th & 125th floor observation deck",
        matchScore: 94,
      },
      {
        id: "activity-3",
        name: "Dubai Marina Dhow Cruise",
        duration: "2 hours",
        price: 4000,
        image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&q=80",
        description: "Traditional dhow cruise with dinner buffet",
        matchScore: 91,
      },
    ];
  };

  const handleSelectRecommendation = (id: string) => {
    const recommendation = recommendations.find(r => r.id === id);
    if (!recommendation) return;

    // Convert recommendation to itinerary items
    if (recommendation.type === "hotel") {
      const hotelItem: ItineraryItem = {
        id: `item-${Date.now()}`,
        day: 1,
        type: "hotel",
        title: recommendation.name,
        location: recommendation.location,
        price: recommendation.price,
        details: "7 nights accommodation",
      };
      setItineraryItems(prev => [...prev, hotelItem]);
      
      // Add related transfer if it's the first hotel
      if (itineraryItems.filter(i => i.type === "hotel").length === 0) {
        const transferItem: ItineraryItem = {
          id: `item-${Date.now() + 1}`,
          day: 1,
          type: "transfer",
          title: "Airport Transfer",
          time: "Arrival",
          location: "Dubai International Airport",
          price: 2500,
          details: "Private car, meet & greet service",
        };
        setItineraryItems(prev => [...prev, transferItem]);
      }

      toast.success(`${recommendation.name} added to itinerary`);
    }
  };

  const handleRemoveItem = (id: string) => {
    setItineraryItems(prev => prev.filter(item => item.id !== id));
    toast.info("Item removed from itinerary");
  };

  const handleOptimizeItinerary = () => {
    toast.success("Route optimized! Saved 2 hours of travel time.");
  };

  const handleDismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const handleCompareToggle = (id: string) => {
    setSelectedForCompare(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      } else if (prev.length < 2) {
        return [...prev, id];
      } else {
        toast.error("You can compare up to 2 hotels at a time");
        return prev;
      }
    });
  };

  const handleCompare = () => {
    if (selectedForCompare.length === 2) {
      setComparisonDialogOpen(true);
    } else {
      toast.error("Please select 2 hotels to compare");
    }
  };

  const handleControlsChange = (controls: AgentControls) => {
    setAgentControls(controls);
    toast.success("Settings updated");
  };

  const handleProceedToBooking = () => {
    if (itineraryItems.length === 0) {
      toast.error("Please add items to the itinerary first");
      return;
    }
    setBookingConfidenceOpen(true);
  };

  const handleConfirmBooking = () => {
    setBookingConfidenceOpen(false);
    toast.success("Booking confirmed! Processing payment...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                <Brain className="size-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-xl">TBO Travel Copilot</h1>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300">
                    <span className="size-2 rounded-full bg-green-600 mr-1.5 animate-pulse" />
                    Copilot Active
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Decision Augmentation for Travel Agents</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setControlPanelOpen(true)}
                title="Agent Controls"
              >
                <Settings className="size-5" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="size-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">Agent Profile</p>
                    <p className="text-xs text-muted-foreground">sarah.agent@tbo.com</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => {
                    toast.success("Agent Stats: 47 bookings this month, ₹18.2L revenue, 94% satisfaction");
                  }}>
                    <BarChart className="size-4 mr-2" />
                    My Stats
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => {
                    toast.info("Help Center opening...");
                  }}>
                    <HelpCircle className="size-4 mr-2" />
                    Help & Support
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-600"
                    onSelect={() => {
                      toast.success("Logged out successfully. See you soon!");
                      setTimeout(() => {
                        window.location.reload();
                      }, 1500);
                    }}
                  >
                    <LogOut className="size-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Agent Control Panel */}
      <AgentControlPanel
        isOpen={controlPanelOpen}
        onClose={() => setControlPanelOpen(false)}
        controls={agentControls}
        onControlsChange={handleControlsChange}
      />

      {/* Comparison Dialog */}
      <ComparisonDialog
        isOpen={comparisonDialogOpen}
        onClose={() => setComparisonDialogOpen(false)}
        hotels={recommendations.filter(r => selectedForCompare.includes(r.id))}
        onSelect={handleSelectRecommendation}
      />

      {/* Booking Confidence Summary */}
      <BookingConfidenceSummary
        isOpen={bookingConfidenceOpen}
        onClose={() => setBookingConfidenceOpen(false)}
        onConfirm={handleConfirmBooking}
        totalPrice={itineraryItems.reduce((sum, item) => sum + item.price, 0)}
        itemCount={itineraryItems.length}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Welcome State - Show when no query analyzed */}
        {!intent && (
          <div className="mb-6">
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="py-8">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold">Welcome to TBO Travel Copilot</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Your intelligent assistant for faster, smarter travel bookings
                  </p>
                  
                  <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto mt-6">
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">35%</div>
                      <div className="text-sm text-muted-foreground">Avg. Time Saved</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">-68%</div>
                      <div className="text-sm text-muted-foreground">Fewer Booking Errors</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-1">+32%</div>
                      <div className="text-sm text-muted-foreground">Upsell Conversion</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Input & Intent */}
          <div className="lg:col-span-2 space-y-6">
            <CustomerQueryInput
              onAnalyze={handleAnalyzeQuery}
              isProcessing={isProcessing}
            />

            {intent && <IntentAnalysis intent={intent} />}

            {recommendations.length > 0 && (
              <div>
                <Tabs defaultValue="hotels" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <TabsList className="grid w-auto grid-cols-3">
                      <TabsTrigger value="hotels">Hotels ({recommendations.length})</TabsTrigger>
                      <TabsTrigger value="flights">Flights</TabsTrigger>
                      <TabsTrigger value="activities">Activities</TabsTrigger>
                    </TabsList>
                    
                    {selectedForCompare.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {selectedForCompare.length} selected
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCompare}
                          disabled={selectedForCompare.length !== 2}
                        >
                          Compare Options
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedForCompare([])}
                        >
                          Clear
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <TabsContent value="hotels" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-semibold text-lg">Smart Recommendations</h2>
                        <p className="text-sm text-muted-foreground">
                          Top options ranked by match score
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {recommendations.map(rec => (
                        <RecommendationCard
                          key={rec.id}
                          recommendation={rec}
                          onSelect={handleSelectRecommendation}
                          isComparing={selectedForCompare.includes(rec.id)}
                          onCompareToggle={handleCompareToggle}
                        />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="flights" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-semibold text-lg">Flight Options</h2>
                        <p className="text-sm text-muted-foreground">
                          Best-priced flights with optimal timing
                        </p>
                      </div>
                    </div>
                    {flightRecommendations.length > 0 ? (
                      <div className="grid gap-4">
                        {flightRecommendations.map((flight: any) => (
                          <Card key={flight.id} className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2">
                                  <Plane className="size-5 text-blue-600" />
                                  <div className="font-semibold">{flight.airline}</div>
                                  <Badge variant="secondary" className="ml-2">{flight.type}</Badge>
                                  <Badge className="ml-auto bg-green-100 text-green-700 border-green-300">
                                    Match {flight.matchScore}%
                                  </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {flight.route}
                                </div>
                                <div className="flex items-center gap-6 text-sm">
                                  <div>
                                    <div className="text-muted-foreground">Departure</div>
                                    <div className="font-medium">{flight.departure}</div>
                                  </div>
                                  <div>
                                    <div className="text-muted-foreground">Arrival</div>
                                    <div className="font-medium">{flight.arrival}</div>
                                  </div>
                                  <div>
                                    <div className="text-muted-foreground">Duration</div>
                                    <div className="font-medium">{flight.duration}</div>
                                  </div>
                                  <div>
                                    <div className="text-muted-foreground">Class</div>
                                    <div className="font-medium">{flight.class}</div>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right ml-4">
                                <div className="text-2xl font-bold text-blue-600">₹{flight.price.toLocaleString()}</div>
                                <Button size="sm" className="mt-2" onClick={() => {
                                  const flightItem: ItineraryItem = {
                                    id: `item-${Date.now()}`,
                                    day: 1,
                                    type: "transfer",
                                    title: `${flight.airline} Flight`,
                                    time: flight.departure,
                                    location: flight.route,
                                    price: flight.price,
                                    details: `${flight.duration}, ${flight.class}`,
                                  };
                                  setItineraryItems(prev => [...prev, flightItem]);
                                  toast.success("Flight added to itinerary");
                                }}>
                                  Add to Itinerary
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        No flight data available
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="activities" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-semibold text-lg">Recommended Activities</h2>
                        <p className="text-sm text-muted-foreground">
                          Top experiences ranked by customer interest
                        </p>
                      </div>
                    </div>
                    {activityRecommendations.length > 0 ? (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {activityRecommendations.map((activity: any) => (
                          <Card key={activity.id} className="overflow-hidden">
                            <img src={activity.image} alt={activity.name} className="w-full h-40 object-cover" />
                            <div className="p-4 space-y-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold">{activity.name}</h3>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                    <Clock className="size-3" />
                                    {activity.duration}
                                  </div>
                                </div>
                                <Badge className="bg-green-100 text-green-700 border-green-300">
                                  {activity.matchScore}%
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {activity.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="text-lg font-bold text-blue-600">
                                  {activity.price === 0 ? "Free" : `₹${activity.price.toLocaleString()}`}
                                </div>
                                <Button size="sm" onClick={() => {
                                  const activityItem: ItineraryItem = {
                                    id: `item-${Date.now()}`,
                                    day: 2,
                                    type: "sightseeing",
                                    title: activity.name,
                                    time: "9:00 AM",
                                    duration: activity.duration,
                                    location: activity.name,
                                    price: activity.price,
                                    details: activity.description,
                                  };
                                  setItineraryItems(prev => [...prev, activityItem]);
                                  toast.success("Activity added to itinerary");
                                }}>
                                  Add to Itinerary
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        No activity data available
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>

          {/* Right Column - Assistant & Itinerary */}
          <div className="space-y-6">
            <DecisionAssistant alerts={alerts} onDismiss={handleDismissAlert} />
            
            {itineraryItems.length > 0 && (
              <ItineraryBuilder
                items={itineraryItems}
                onRemove={handleRemoveItem}
                onOptimize={handleOptimizeItinerary}
                onProceed={handleProceedToBooking}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}