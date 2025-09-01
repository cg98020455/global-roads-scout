import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ExternalLink, 
  MapPin, 
  Star,
  Building2
} from "lucide-react";

interface Company {
  id: string;
  name: string;
  country: string;
  website: string;
  specialization: string;
  rating: number;
  relevance_score?: number;
}

interface CompanyCardProps {
  company: Company;
}

export const CompanyCard = ({ company }: CompanyCardProps) => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= rating ? "text-warning fill-warning" : "text-muted-foreground"
            }`}
          />
        ))}
        <span className="text-xs text-muted-foreground ml-1">({rating})</span>
      </div>
    );
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 85) return "default";
    if (score >= 70) return "secondary";
    return "destructive";
  };

  return (
    <Card className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base mb-1 group-hover:text-primary transition-colors">
              {company.name}
            </CardTitle>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-3 h-3" />
              {company.country}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-muted-foreground" />
            {company.relevance_score && (
              <Badge variant={getScoreBadgeVariant(company.relevance_score)} className="text-xs font-semibold">
                {company.relevance_score}%
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <Badge variant="secondary" className="text-xs">
            {company.specialization}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          {renderStars(company.rating)}
        </div>

        <Button variant="outline" size="sm" className="w-full" asChild>
          <a href={company.website} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-3 h-3 mr-2" />
            Visit Website
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};