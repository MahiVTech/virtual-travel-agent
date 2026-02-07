import { Brain, Users, Calendar, DollarSign, MapPin, Star, CheckCircle2, Lightbulb } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";

interface IntentData {
  destination: string;
  dates: string;
  travelers: { adults: number; children: number };
  budget: string;
  preferences: string[];
  confidence: number;
}

interface IntentAnalysisProps {
  intent: IntentData | null;
}

export function IntentAnalysis({ intent }: IntentAnalysisProps) {
  if (!intent) return null;

  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="size-5 text-blue-600" />
          <CardTitle>Intent Analysis</CardTitle>
        </div>
        <CardDescription>Understanding customer needs automatically</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-start gap-3 rounded-lg bg-white p-3">
            <MapPin className="size-5 text-blue-600 mt-0.5" />
            <div>
              <div className="text-sm text-muted-foreground">Destination</div>
              <div className="font-medium">{intent.destination}</div>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-white p-3">
            <Calendar className="size-5 text-blue-600 mt-0.5" />
            <div>
              <div className="text-sm text-muted-foreground">Travel Period</div>
              <div className="font-medium">{intent.dates}</div>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-white p-3">
            <Users className="size-5 text-blue-600 mt-0.5" />
            <div>
              <div className="text-sm text-muted-foreground">Travelers</div>
              <div className="font-medium">
                {intent.travelers.adults} Adult{intent.travelers.adults > 1 ? 's' : ''}
                {intent.travelers.children > 0 && `, ${intent.travelers.children} Child${intent.travelers.children > 1 ? 'ren' : ''}`}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-white p-3">
            <DollarSign className="size-5 text-blue-600 mt-0.5" />
            <div>
              <div className="text-sm text-muted-foreground">Budget Range</div>
              <div className="font-medium">{intent.budget}</div>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-white p-3 sm:col-span-2">
            <Star className="size-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm text-muted-foreground mb-1.5">Key Preferences</div>
              <div className="flex flex-wrap gap-1.5">
                {intent.preferences.map((pref, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-blue-100 text-blue-700">
                    {pref}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* What Copilot Understood */}
        <div className="rounded-lg bg-purple-50 border border-purple-200 p-4">
          <div className="flex items-center gap-2 mb-3 text-purple-900">
            <Lightbulb className="size-4" />
            <span className="font-semibold text-sm">What Copilot Understood</span>
          </div>
          
          {/* Explicit Preferences */}
          <div className="space-y-2 mb-3">
            <div className="text-xs font-semibold text-purple-700 uppercase tracking-wide">Explicit Preferences</div>
            {intent.destination.includes("Kedarnath") || intent.destination.includes("Vaishno Devi") || intent.destination.includes("Tirupati") || intent.destination.includes("Amritsar") || intent.destination.includes("Badrinath") ? (
              <>
                <div className="flex items-start gap-2 text-sm text-purple-900">
                  <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-purple-600" />
                  <span>Pilgrimage / Spiritual travel to {intent.destination}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-purple-900">
                  <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-purple-600" />
                  <span>Darshan and temple visit priority</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-purple-900">
                  <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-purple-600" />
                  <span>Budget: {intent.budget}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-2 text-sm text-purple-900">
                  <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-purple-600" />
                  <span>{intent.travelers.children > 0 ? "Family-focused trip with children" : "Leisure travel"}</span>
                </div>
                {intent.preferences.some(p => p.toLowerCase().includes("honeymoon")) && (
                  <div className="flex items-start gap-2 text-sm text-purple-900">
                    <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-purple-600" />
                    <span>Honeymoon / romantic getaway</span>
                  </div>
                )}
                <div className="flex items-start gap-2 text-sm text-purple-900">
                  <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-purple-600" />
                  <span>Budget: {intent.budget} specified</span>
                </div>
              </>
            )}
          </div>

          <div className="border-t border-purple-300 my-3"></div>

          {/* Inferred Preferences */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-purple-700 uppercase tracking-wide">Inferred (High Confidence)</div>
            {intent.destination.includes("Kedarnath") || intent.destination.includes("Vaishno Devi") ? (
              <>
                <div className="flex items-start gap-2 text-sm text-purple-900">
                  <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-purple-600" />
                  <div className="flex-1">
                    <span>Helicopter option preferred for comfort</span>
                    <span className="text-xs text-purple-600 ml-2">(87% confidence)</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm text-purple-900">
                  <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-purple-600" />
                  <div className="flex-1">
                    <span>Weather-dependent travel - buffer day recommended</span>
                    <span className="text-xs text-purple-600 ml-2">(92% confidence)</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm text-purple-900">
                  <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-purple-600" />
                  <div className="flex-1">
                    <span>Interest in complete Char Dham package likely</span>
                    <span className="text-xs text-purple-600 ml-2">(76% confidence)</span>
                  </div>
                </div>
              </>
            ) : intent.destination.includes("Singapore") ? (
              <>
                <div className="flex items-start gap-2 text-sm text-purple-900">
                  <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-purple-600" />
                  <div className="flex-1">
                    <span>{intent.travelers.children > 0 ? "Universal Studios & family attractions priority" : "City sightseeing & shopping focus"}</span>
                    <span className="text-xs text-purple-600 ml-2">(91% confidence)</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm text-purple-900">
                  <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-purple-600" />
                  <div className="flex-1">
                    <span>Central location preferred for convenience</span>
                    <span className="text-xs text-purple-600 ml-2">(84% confidence)</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm text-purple-900">
                  <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-purple-600" />
                  <div className="flex-1">
                    <span>F1 season awareness - price sensitivity</span>
                    <span className="text-xs text-purple-600 ml-2">(79% confidence)</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-2 text-sm text-purple-900">
                  <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-purple-600" />
                  <div className="flex-1">
                    <span>{intent.travelers.children > 0 ? "Waterpark & beach access preferred" : "Beach or resort experience likely"}</span>
                    <span className="text-xs text-purple-600 ml-2">(89% confidence)</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm text-purple-900">
                  <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-purple-600" />
                  <div className="flex-1">
                    <span>Peak season pricing risk - December travel</span>
                    <span className="text-xs text-purple-600 ml-2">(94% confidence)</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm text-purple-900">
                  <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-purple-600" />
                  <div className="flex-1">
                    <span>{intent.travelers.children > 0 ? "Resort with kids club likely needed" : "Premium dining & experiences expected"}</span>
                    <span className="text-xs text-purple-600 ml-2">(82% confidence)</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-white p-3 border border-green-200">
          <div className="flex-1">
            <div className="text-sm text-muted-foreground">Confidence Score</div>
            <div className="text-sm">Analysis confidence based on query clarity</div>
          </div>
          <div className="relative size-12">
            <svg className="size-12 -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="4"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="#22c55e"
                strokeWidth="4"
                strokeDasharray={`${intent.confidence * 1.257} 125.7`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-green-600">
              {intent.confidence}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}