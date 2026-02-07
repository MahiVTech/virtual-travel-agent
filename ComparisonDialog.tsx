import { X, TrendingDown, TrendingUp, Minus, MapPin, Star, Clock, Users, Wifi, UtensilsCrossed } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";
import { Recommendation } from "@/app/components/RecommendationCard";

interface ComparisonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  hotels: Recommendation[];
  onSelect: (id: string) => void;
}

export function ComparisonDialog({ isOpen, onClose, hotels, onSelect }: ComparisonDialogProps) {
  if (hotels.length !== 2) return null;

  const [hotel1, hotel2] = hotels;

  const ComparisonRow = ({ 
    label, 
    value1, 
    value2, 
    icon: Icon,
    type = "text"
  }: { 
    label: string; 
    value1: any; 
    value2: any; 
    icon: any;
    type?: "text" | "price" | "rating" | "badge";
  }) => {
    let winner: "left" | "right" | "tie" = "tie";
    
    if (type === "price") {
      winner = value1 < value2 ? "left" : value1 > value2 ? "right" : "tie";
    } else if (type === "rating") {
      winner = value1 > value2 ? "left" : value1 < value2 ? "right" : "tie";
    }

    return (
      <div className="grid grid-cols-[1fr_auto_1fr] gap-4 py-3">
        <div className={`text-right ${winner === "left" ? "font-semibold text-green-600" : ""}`}>
          {type === "price" ? `₹${value1.toLocaleString('en-IN')}` : 
           type === "rating" ? (
             <div className="flex items-center justify-end gap-1">
               <Star className="size-3 fill-yellow-400 text-yellow-400" />
               <span>{value1}</span>
             </div>
           ) : value1}
          {winner === "left" && type !== "tie" && (
            <TrendingUp className="size-3 inline ml-1 text-green-600" />
          )}
        </div>
        <div className="flex flex-col items-center gap-1 min-w-[120px]">
          <Icon className="size-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground text-center">{label}</span>
        </div>
        <div className={`text-left ${winner === "right" ? "font-semibold text-green-600" : ""}`}>
          {type === "price" ? `₹${value2.toLocaleString('en-IN')}` : 
           type === "rating" ? (
             <div className="flex items-center gap-1">
               <Star className="size-3 fill-yellow-400 text-yellow-400" />
               <span>{value2}</span>
             </div>
           ) : value2}
          {winner === "right" && type !== "tie" && (
            <TrendingUp className="size-3 inline ml-1 text-green-600" />
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Compare Options</DialogTitle>
          <DialogDescription>
            Side-by-side comparison to help you explain decisions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Hotel Names & Images */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="relative h-32 rounded-lg overflow-hidden">
                <img src={hotel1.image} alt={hotel1.name} className="size-full object-cover" />
                <Badge className="absolute top-2 right-2 bg-blue-600">
                  {hotel1.matchScore}% Match
                </Badge>
              </div>
              <div>
                <h3 className="font-semibold">{hotel1.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="size-3" />
                  {hotel1.location}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="relative h-32 rounded-lg overflow-hidden">
                <img src={hotel2.image} alt={hotel2.name} className="size-full object-cover" />
                <Badge className="absolute top-2 right-2 bg-blue-600">
                  {hotel2.matchScore}% Match
                </Badge>
              </div>
              <div>
                <h3 className="font-semibold">{hotel2.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="size-3" />
                  {hotel2.location}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Comparison Rows */}
          <div className="space-y-1">
            <ComparisonRow
              label="Price (7 nights)"
              value1={hotel1.price}
              value2={hotel2.price}
              icon={TrendingDown}
              type="price"
            />
            
            <Separator />
            
            <ComparisonRow
              label="Guest Rating"
              value1={hotel1.rating}
              value2={hotel2.rating}
              icon={Star}
              type="rating"
            />
            
            <Separator />
            
            <ComparisonRow
              label="Reviews"
              value1={`${hotel1.reviews} reviews`}
              value2={`${hotel2.reviews} reviews`}
              icon={Users}
              type="text"
            />
            
            <Separator />
            
            <ComparisonRow
              label="Distance to Downtown"
              value1={hotel1.name.includes("Marriott") ? "5 km" : "18 km"}
              value2={hotel2.name.includes("Marriott") ? "5 km" : "18 km"}
              icon={MapPin}
              type="text"
            />
            
            <Separator />
            
            <ComparisonRow
              label="Kids Facilities"
              value1={hotel1.highlights.some(h => h.toLowerCase().includes("kid")) ? "⭐⭐⭐⭐⭐" : "⭐⭐⭐⭐"}
              value2={hotel2.highlights.some(h => h.toLowerCase().includes("kid")) ? "⭐⭐⭐⭐⭐" : "⭐⭐⭐⭐"}
              icon={Users}
              type="text"
            />
          </div>

          <Separator />

          {/* Key Insights */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 rounded-lg bg-purple-50 border border-purple-200 p-3">
              <div className="font-semibold text-sm text-purple-900">Why This Option</div>
              <p className="text-sm text-purple-800">{hotel1.whyRecommended}</p>
            </div>
            <div className="space-y-2 rounded-lg bg-purple-50 border border-purple-200 p-3">
              <div className="font-semibold text-sm text-purple-900">Why This Option</div>
              <p className="text-sm text-purple-800">{hotel2.whyRecommended}</p>
            </div>
          </div>

          {/* Trade-offs */}
          {(hotel1.tradeoffs || hotel2.tradeoffs) && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 rounded-lg bg-amber-50 border border-amber-200 p-3">
                <div className="font-semibold text-sm text-amber-900">Trade-off</div>
                <p className="text-sm text-amber-800">{hotel1.tradeoffs || "No significant trade-offs"}</p>
              </div>
              <div className="space-y-2 rounded-lg bg-amber-50 border border-amber-200 p-3">
                <div className="font-semibold text-sm text-amber-900">Trade-off</div>
                <p className="text-sm text-amber-800">{hotel2.tradeoffs || "No significant trade-offs"}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() => { onSelect(hotel1.id); onClose(); }}>
              Select {hotel1.name.split(' ')[0]}
            </Button>
            <Button onClick={() => { onSelect(hotel2.id); onClose(); }}>
              Select {hotel2.name.split(' ')[0]}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
