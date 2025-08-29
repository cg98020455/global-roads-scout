import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  DollarSign, 
  ExternalLink, 
  MapPin, 
  Star,
  Building2,
  Clock,
  Users
} from "lucide-react";

interface Opportunity {
  id: string;
  projectName: string;
  client: string;
  country: string;
  sector: string;
  services: string;
  deadline: string;
  budget: string;
  url: string;
  score: number;
  program: string;
}

interface OpportunityCardProps {
  opportunity: Opportunity;
  onFindCompanies?: () => void;
}

export const OpportunityCard = ({ opportunity, onFindCompanies }: OpportunityCardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return "success";
    if (score >= 70) return "warning";
    return "destructive";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 85) return "default";
    if (score >= 70) return "secondary";
    return "destructive";
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Due Today";
    if (diffDays === 1) return "Due Tomorrow";
    if (diffDays <= 7) return `${diffDays} days left`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
              {opportunity.projectName}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {opportunity.client}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {opportunity.country}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getScoreBadgeVariant(opportunity.score)} className="font-semibold">
              <Star className="w-3 h-3 mr-1" />
              {opportunity.score}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <Badge variant="outline" className="mb-2">
            {opportunity.sector}
          </Badge>
          <p className="text-sm text-muted-foreground">
            {opportunity.services}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-success" />
            <span className="font-medium">{opportunity.budget}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-warning" />
            <span>{formatDeadline(opportunity.deadline)}</span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Program: {opportunity.program}
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button variant="outline" size="sm" asChild>
            <a href={opportunity.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Details
            </a>
          </Button>
          <div className="flex gap-2">
            {onFindCompanies && (
              <Button variant="secondary" size="sm" onClick={onFindCompanies}>
                <Users className="w-4 h-4 mr-2" />
                Find Companies
              </Button>
            )}
            <Button size="sm" className="bg-gradient-primary">
              Save Opportunity
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};