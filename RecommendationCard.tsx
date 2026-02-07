import { Star, MapPin, Clock, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";

export interface Recommendation {
  id: string;
  type: "hotel" | "flight" | "package";
  name: string;
  location?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  highlights: string[];
  whyRecommended: string;
  tradeoffs?: string;
  urgency?: string;
  matchScore: number;
}

interface RecommendationCardProps {
  recommendation: Recommendation;
  onSelect: (id: string) => void;
  isComparing?: boolean;
  onCompareToggle?: (id: string) => void;
}

export function RecommendationCard({ recommendation, onSelect, isComparing, onCompareToggle }: RecommendationCardProps) {
  const {
    id,
    type,
    name,
    location,
    price,
    originalPrice,
    rating,
    reviews,
    image,
    highlights,
    whyRecommended,
    tradeoffs,
    urgency,
    matchScore,
  } = recommendation;

  const savings = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden bg-muted">
        <img src={image} alt={name} className="size-full object-cover" />
        {savings > 0 && (
          <Badge className="absolute top-3 right-3 bg-green-600 text-white">
            Save {savings}%
          </Badge>
        )}
        <Badge className="absolute top-3 left-3 bg-white/90 text-gray-900">
          {matchScore}% Match
        </Badge>
        {onCompareToggle && (
          <div className="absolute bottom-3 left-3">
            <label className="flex items-center gap-2 bg-white/90 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-white">
              <Checkbox 
                checked={isComparing}
                onCheckedChange={() => onCompareToggle(id)}
              />
              <span className="text-sm font-medium">Compare</span>
            </label>
          </div>
        )}
      </div>

      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="line-clamp-1">{name}</CardTitle>
            {location && (
              <CardDescription className="flex items-center gap-1 mt-1">
                <MapPin className="size-3" />
                {location}
              </CardDescription>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Star className="size-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{rating}</span>
            <span className="text-sm text-muted-foreground">({reviews})</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Highlights */}
        <div className="space-y-1.5">
          {highlights.slice(0, 3).map((highlight, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="size-4 text-green-600 shrink-0" />
              <span>{highlight}</span>
            </div>
          ))}
        </div>

        {/* AI Explanation */}
        <div className="rounded-lg bg-purple-50 border border-purple-200 p-3 space-y-2">
          <div className="flex items-center gap-2 text-purple-900">
            <TrendingUp className="size-4" />
            <span className="text-sm font-semibold">Why Recommended</span>
          </div>
          <p className="text-sm text-purple-900">{whyRecommended}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-purple-700 pt-1">
            <span className="font-medium">Recommended for: Family with kids (5-12 yrs)</span>
            <span>•</span>
            <span>Used in 1,248 similar bookings</span>
            <span>•</span>
            <span>86% success rate</span>
          </div>
        </div>

        {/* Tradeoffs */}
        {tradeoffs && (
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
            <div className="flex items-start gap-2 text-amber-900">
              <AlertTriangle className="size-4 shrink-0 mt-0.5" />
              <p className="text-sm">{tradeoffs}</p>
            </div>
          </div>
        )}

        {/* Urgency */}
        {urgency && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <Clock className="size-4" />
            <span>{urgency}</span>
          </div>
        )}

        {/* Price and Action */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div>
            <div className="text-2xl font-bold">₹{price.toLocaleString('en-IN')}</div>
            {originalPrice && (
              <div className="text-sm text-muted-foreground line-through">
                ₹{originalPrice.toLocaleString('en-IN')}
              </div>
            )}
          </div>
          <Button onClick={() => onSelect(id)}>Add to Itinerary</Button>
        </div>
      </CardContent>
    </Card>
  );
}