import { Settings, Info, BarChart3, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Switch } from "@/app/components/ui/switch";
import { Separator } from "@/app/components/ui/separator";
import { Button } from "@/app/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/app/components/ui/sheet";

interface AgentControls {
  budgetSensitivity: "low" | "medium" | "high";
  preferenceWeight: "location" | "price" | "experience";
  riskTolerance: "conservative" | "balanced" | "aggressive";
  upsellMode: "soft" | "recommended" | "maximize";
  showAlternatives: boolean;
  autoOptimize: boolean;
}

interface AgentControlPanelProps {
  isOpen: boolean;
  onClose: () => void;
  controls: AgentControls;
  onControlsChange: (controls: AgentControls) => void;
}

export function AgentControlPanel({ isOpen, onClose, controls, onControlsChange }: AgentControlPanelProps) {
  const updateControl = <K extends keyof AgentControls>(key: K, value: AgentControls[K]) => {
    onControlsChange({ ...controls, [key]: value });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="size-5" />
            Agent Controls
          </SheetTitle>
          <SheetDescription>
            Configure how the copilot assists your booking decisions
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Budget Sensitivity */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base">Budget Sensitivity</Label>
              <Info className="size-4 text-muted-foreground" />
            </div>
            <RadioGroup
              value={controls.budgetSensitivity}
              onValueChange={(value) => updateControl("budgetSensitivity", value as AgentControls["budgetSensitivity"])}
            >
              <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-accent cursor-pointer">
                <RadioGroupItem value="low" id="budget-low" />
                <Label htmlFor="budget-low" className="flex-1 cursor-pointer">
                  <div className="font-medium">Low</div>
                  <div className="text-sm text-muted-foreground">Show premium options first</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-accent cursor-pointer">
                <RadioGroupItem value="medium" id="budget-medium" />
                <Label htmlFor="budget-medium" className="flex-1 cursor-pointer">
                  <div className="font-medium">Medium</div>
                  <div className="text-sm text-muted-foreground">Balance value and quality</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-accent cursor-pointer">
                <RadioGroupItem value="high" id="budget-high" />
                <Label htmlFor="budget-high" className="flex-1 cursor-pointer">
                  <div className="font-medium">High</div>
                  <div className="text-sm text-muted-foreground">Strictly within budget</div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Preference Weight */}
          <div className="space-y-3">
            <Label className="text-base">Optimize For</Label>
            <RadioGroup
              value={controls.preferenceWeight}
              onValueChange={(value) => updateControl("preferenceWeight", value as AgentControls["preferenceWeight"])}
            >
              <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-accent cursor-pointer">
                <RadioGroupItem value="location" id="pref-location" />
                <Label htmlFor="pref-location" className="flex-1 cursor-pointer">
                  <div className="font-medium">Location</div>
                  <div className="text-sm text-muted-foreground">Proximity to attractions</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-accent cursor-pointer">
                <RadioGroupItem value="price" id="pref-price" />
                <Label htmlFor="pref-price" className="flex-1 cursor-pointer">
                  <div className="font-medium">Price</div>
                  <div className="text-sm text-muted-foreground">Best value deals</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-accent cursor-pointer">
                <RadioGroupItem value="experience" id="pref-experience" />
                <Label htmlFor="pref-experience" className="flex-1 cursor-pointer">
                  <div className="font-medium">Experience</div>
                  <div className="text-sm text-muted-foreground">Premium amenities</div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Upsell Mode */}
          <div className="space-y-3">
            <Label className="text-base">Upsell Strategy</Label>
            <RadioGroup
              value={controls.upsellMode}
              onValueChange={(value) => updateControl("upsellMode", value as AgentControls["upsellMode"])}
            >
              <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-accent cursor-pointer">
                <RadioGroupItem value="soft" id="upsell-soft" />
                <Label htmlFor="upsell-soft" className="flex-1 cursor-pointer">
                  <div className="font-medium">Soft</div>
                  <div className="text-sm text-muted-foreground">Minimal suggestions</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-accent cursor-pointer">
                <RadioGroupItem value="recommended" id="upsell-recommended" />
                <Label htmlFor="upsell-recommended" className="flex-1 cursor-pointer">
                  <div className="font-medium">Recommended</div>
                  <div className="text-sm text-muted-foreground">Smart opportunities</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-accent cursor-pointer">
                <RadioGroupItem value="maximize" id="upsell-maximize" />
                <Label htmlFor="upsell-maximize" className="flex-1 cursor-pointer">
                  <div className="font-medium">Maximize</div>
                  <div className="text-sm text-muted-foreground">All valid add-ons</div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Toggle Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-alternatives">Show Alternatives</Label>
                <div className="text-sm text-muted-foreground">Include backup options</div>
              </div>
              <Switch
                id="show-alternatives"
                checked={controls.showAlternatives}
                onCheckedChange={(checked) => updateControl("showAlternatives", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-optimize">Auto-Optimize</Label>
                <div className="text-sm text-muted-foreground">Route & timing optimization</div>
              </div>
              <Switch
                id="auto-optimize"
                checked={controls.autoOptimize}
                onCheckedChange={(checked) => updateControl("autoOptimize", checked)}
              />
            </div>
          </div>

          <Separator />

          {/* Stats Preview */}
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 space-y-2">
            <div className="flex items-center gap-2 text-blue-900">
              <BarChart3 className="size-4" />
              <span className="text-sm font-semibold">Current Settings Impact</span>
            </div>
            <div className="space-y-1 text-sm text-blue-800">
              <div className="flex justify-between">
                <span>Expected recommendations:</span>
                <span className="font-medium">5-7 options</span>
              </div>
              <div className="flex justify-between">
                <span>Avg. booking time:</span>
                <span className="font-medium">8 min saved</span>
              </div>
              <div className="flex justify-between">
                <span>Upsell conversion:</span>
                <span className="font-medium">~32%</span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
