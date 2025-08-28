import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: ReactNode;
  trend: "up" | "down";
}

export const StatsCard = ({ title, value, change, icon, trend }: StatsCardProps) => {
  return (
    <Card className="hover:shadow-card transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
            {title}
          </h3>
          <div className="text-muted-foreground">
            {icon}
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold text-foreground">
              {value}
            </div>
            <div className="flex items-center text-xs">
              {trend === "up" ? (
                <TrendingUp className="w-3 h-3 text-success mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 text-destructive mr-1" />
              )}
              <span className={trend === "up" ? "text-success" : "text-destructive"}>
                {change}
              </span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};