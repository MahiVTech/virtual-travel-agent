import { useState } from "react";
import { Send, Sparkles, RotateCcw, Mic } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";

interface CustomerQueryInputProps {
  onAnalyze: (query: string) => void;
  isProcessing: boolean;
}

const EXAMPLE_QUERIES = [
  "Family trip to Dubai in December, kids friendly, budget around 1.5L",
  "Honeymoon package to Maldives, 5 days, luxury resort with water villa",
  "Solo backpacking trip to Thailand for 10 days, budget travel, adventure activities",
  "Business trip to Singapore, 3 days, hotel near CBD, meetings and networking",
];

export function CustomerQueryInput({ onAnalyze, isProcessing }: CustomerQueryInputProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = () => {
    if (query.trim()) {
      onAnalyze(query.trim());
    }
  };

  const loadExample = (example: string) => {
    setQuery(example);
  };

  const handleReset = () => {
    setQuery("");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-5 text-purple-600" />
              Customer Query
            </CardTitle>
            <CardDescription>
              Understands budget, preferences & intent automatically
            </CardDescription>
          </div>
          {query && (
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw className="size-4 mr-2" />
              Reset
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <Textarea
              placeholder="Example: Family trip to Dubai in December, kids friendly, budget around 1.5L"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-24 resize-none pr-12"
              disabled={isProcessing}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-2 right-2 text-muted-foreground hover:text-purple-600"
              title="Voice input"
            >
              <Mic className="size-5" />
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {query.length} characters
            </span>
            <Button
              onClick={handleSubmit}
              disabled={!query.trim() || isProcessing}
              className="gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  Analyze Query
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Quick Examples</div>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_QUERIES.map((example, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="cursor-pointer hover:bg-accent transition-colors px-3 py-1.5 text-xs"
                onClick={() => loadExample(example)}
              >
                {example.split(',')[0]}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}