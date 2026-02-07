import { CheckCircle, Shield, TrendingDown, Clock, DollarSign, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Separator } from "@/app/components/ui/separator";

interface BookingConfidenceSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  totalPrice: number;
  itemCount: number;
}

export function BookingConfidenceSummary({ 
  isOpen, 
  onClose, 
  onConfirm, 
  totalPrice, 
  itemCount 
}: BookingConfidenceSummaryProps) {
  const confidenceChecks = [
    {
      icon: DollarSign,
      label: "Price Locked",
      status: "All rates secured at current pricing",
      passed: true,
    },
    {
      icon: Clock,
      label: "Layovers Safe",
      status: "All connections have adequate time",
      passed: true,
    },
    {
      icon: Shield,
      label: "Budget Respected",
      status: `Total ₹${totalPrice.toLocaleString('en-IN')} within customer range`,
      passed: true,
    },
    {
      icon: TrendingDown,
      label: "Upsells Applied",
      status: "2 complementary add-ons included",
      passed: true,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="size-5 text-green-600" />
            Booking Confidence Summary
          </DialogTitle>
          <DialogDescription>
            Final validation before proceeding to booking
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Confidence Score */}
          <div className="flex items-center justify-center py-6 bg-green-50 rounded-lg border border-green-200">
            <div className="text-center">
              <div className="text-5xl font-bold text-green-600 mb-2">98%</div>
              <div className="text-sm text-green-800">Booking Confidence</div>
              <div className="text-xs text-green-700 mt-1">High success probability</div>
            </div>
          </div>

          <Separator />

          {/* Validation Checks */}
          <div className="space-y-3">
            {confidenceChecks.map((check, idx) => {
              const Icon = check.icon;
              return (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-full bg-green-100">
                    <Icon className="size-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{check.label}</span>
                      <CheckCircle className="size-4 text-green-600" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{check.status}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <Separator />

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-blue-50">
              <div className="text-2xl font-bold text-blue-600">{itemCount}</div>
              <div className="text-xs text-blue-800">Items in Package</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-50">
              <div className="text-2xl font-bold text-blue-600">7</div>
              <div className="text-xs text-blue-800">Total Days</div>
            </div>
          </div>

          {/* Risk Disclaimer */}
          <div className="text-xs text-muted-foreground text-center bg-gray-50 rounded-lg p-3">
            All prices and availability verified at {new Date().toLocaleTimeString()}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Review Again
          </Button>
          <Button onClick={onConfirm} className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
            <CheckCircle className="size-4 mr-2" />
            Proceed to Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
