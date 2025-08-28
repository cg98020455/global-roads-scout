import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Download, 
  MessageSquare, 
  TrendingUp, 
  Globe, 
  Calendar,
  DollarSign,
  Users,
  Star,
  ExternalLink,
  Building2
} from "lucide-react";
import { ChatInterface } from "./ChatInterface";
import { OpportunityCard } from "./OpportunityCard";
import { StatsCard } from "./StatsCard";
import { PartnerCard } from "./PartnerCard";

// Mock data for demonstration
const mockOpportunities = [
  {
    id: "1",
    projectName: "East Africa Transport Corridor Development",
    client: "African Development Bank",
    country: "Kenya",
    sector: "Transport Infrastructure",
    services: "Highway design, traffic studies, environmental assessment",
    deadline: "2024-12-15",
    budget: "$2.5M - $5.0M",
    url: "https://afdb.org/opportunities/east-africa-transport",
    score: 92,
    program: "Africa Infrastructure Development Program"
  },
  {
    id: "2", 
    projectName: "Middle East Urban Mobility Assessment",
    client: "World Bank Group",
    country: "UAE",
    sector: "Urban Planning",
    services: "Transport planning, smart city solutions, feasibility studies",
    deadline: "2024-11-30",
    budget: "$1.2M - $3.0M", 
    url: "https://worldbank.org/opportunities/me-mobility",
    score: 87,
    program: "Urban Development Initiative"
  },
  {
    id: "3",
    projectName: "Sub-Saharan Railway Network Expansion",
    client: "European Investment Bank",
    country: "Nigeria",
    sector: "Railway Infrastructure",
    services: "Railway engineering, environmental impact assessment",
    deadline: "2024-12-20",
    budget: "$10M - $15M",
    url: "https://eib.org/opportunities/railway-expansion",
    score: 78,
    program: "Sustainable Transport Initiative"
  }
];

const mockPartners = [
  {
    id: "1",
    name: "Kenyan Engineering Solutions Ltd",
    country: "Kenya", 
    website: "https://kesolutions.co.ke",
    specialization: "Highway and bridge construction",
    rating: 4.5
  },
  {
    id: "2",
    name: "Emirates Infrastructure Group",
    country: "UAE",
    website: "https://emiratesinfra.ae", 
    specialization: "Smart city and urban planning",
    rating: 4.8
  },
  {
    id: "3",
    name: "Nigerian Transport Consultants",
    country: "Nigeria",
    website: "https://ntconsult.ng",
    specialization: "Railway and logistics planning", 
    rating: 4.2
  }
];

export const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [activeTab, setActiveTab] = useState("opportunities");

  const filteredOpportunities = mockOpportunities.filter(opp => 
    opp.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Global Roads Scout</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Opportunity Intelligence</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button 
                size="sm" 
                className="bg-gradient-primary"
                onClick={() => setActiveTab("chat")}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                AI Assistant
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Active Opportunities"
            value="47"
            change="+12%"
            icon={<Globe className="w-5 h-5" />}
            trend="up"
          />
          <StatsCard
            title="High Match Score"
            value="23"
            change="+8%"
            icon={<Star className="w-5 h-5" />}
            trend="up"
          />
          <StatsCard
            title="Total Value"
            value="$127.5M"
            change="+15%"
            icon={<DollarSign className="w-5 h-5" />}
            trend="up"
          />
          <StatsCard
            title="Partner Networks"
            value="156"
            change="+5%"
            icon={<Users className="w-5 h-5" />}
            trend="up"
          />
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="partners">Partners</TabsTrigger>
            <TabsTrigger value="chat">AI Assistant</TabsTrigger>
          </TabsList>

          <TabsContent value="opportunities" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Opportunity Discovery</CardTitle>
                <CardDescription>
                  Monitor and track development bank opportunities across Africa and Middle East
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search opportunities, countries, or sectors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Opportunities List */}
            <div className="space-y-4">
              {filteredOpportunities.map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="partners" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Local Partner Networks</CardTitle>
                <CardDescription>
                  Identified engineering firms for strategic partnerships
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockPartners.map((partner) => (
                    <PartnerCard key={partner.id} partner={partner} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <ChatInterface />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};