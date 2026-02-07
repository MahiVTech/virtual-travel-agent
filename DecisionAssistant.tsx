import { AlertTriangle, TrendingUp, AlertCircle, CheckCircle, Lightbulb, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";

export interface Alert {
  id: string;
  type: "warning" | "opportunity" | "info" | "success";
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface DecisionAssistantProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
}

export function DecisionAssistant({ alerts, onDismiss }: DecisionAssistantProps) {
  if (alerts.length === 0) {
    return (
      <Card className="sticky top-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="size-5" />
            Decision Assistant
          </CardTitle>
          <CardDescription>AI-powered alerts and suggestions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="size-12 mx-auto mb-3 text-green-500 opacity-50" />
            <p className="text-sm">All clear!</p>
            <p className="text-xs mt-1">No alerts at the moment</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getAlertConfig = (type: Alert["type"]) => {
    switch (type) {
      case "warning":
        return {
          icon: AlertTriangle,
          bg: "bg-red-50",
          border: "border-red-200",
          iconColor: "text-red-600",
          titleColor: "text-red-900",
        };
      case "opportunity":
        return {
          icon: TrendingUp,
          bg: "bg-green-50",
          border: "border-green-200",
          iconColor: "text-green-600",
          titleColor: "text-green-900",
        };
      case "info":
        return {
          icon: AlertCircle,
          bg: "bg-blue-50",
          border: "border-blue-200",
          iconColor: "text-blue-600",
          titleColor: "text-blue-900",
        };
      case "success":
        return {
          icon: CheckCircle,
          bg: "bg-green-50",
          border: "border-green-200",
          iconColor: "text-green-600",
          titleColor: "text-green-900",
        };
    }
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="size-5 text-yellow-600" />
            <CardTitle>Decision Assistant</CardTitle>
          </div>
          <Badge variant="secondary">{alerts.length}</Badge>
        </div>
        <CardDescription>Real-time insights to help you book better</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => {
          const config = getAlertConfig(alert.type);
          const Icon = config.icon;

          return (
            <div
              key={alert.id}
              className={`relative rounded-lg border p-4 ${config.bg} ${config.border}`}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 size-6 hover:bg-white/50"
                onClick={() => onDismiss(alert.id)}
              >
                <X className="size-3" />
              </Button>

              <div className="flex gap-3 pr-6">
                <Icon className={`size-5 shrink-0 mt-0.5 ${config.iconColor}`} />
                <div className="space-y-2 flex-1">
                  <div className={`font-semibold text-sm ${config.titleColor}`}>
                    {alert.title}
                  </div>
                  <p className="text-sm text-gray-700">{alert.message}</p>
                  {alert.action && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={alert.action.onClick}
                      className="mt-2 bg-white hover:bg-white/80"
                    >
                      {alert.action.label}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
