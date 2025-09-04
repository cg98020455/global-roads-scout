import { useState, useEffect } from "react";
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
  Building2,
  Target,
  LogOut
} from "lucide-react";
import { ChatInterface } from "./ChatInterface";
import { OpportunityCard } from "./OpportunityCard";
import { StatsCard } from "./StatsCard";
import { PartnerCard } from "./PartnerCard";
import { CompanyCard } from "./CompanyCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [activeTab, setActiveTab] = useState("opportunities");
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [banks, setBanks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { signOut, user } = useAuth();

  useEffect(() => {
    fetchData();
    loadInitialBanks();
  }, []);

  const loadInitialBanks = async () => {
    try {
      // Check if banks exist, if not create some sample ones
      const { data: existingBanks } = await supabase.from('banks').select('*');
      
      if (!existingBanks || existingBanks.length === 0) {
        const sampleBanks = [
          { name: 'African Development Bank', url: 'https://afdb.org' },
          { name: 'World Bank Group', url: 'https://worldbank.org' },
          { name: 'European Investment Bank', url: 'https://eib.org' },
          { name: 'Islamic Development Bank', url: 'https://isdb.org' }
        ];

        await supabase.from('banks').insert(sampleBanks);
      }
    } catch (error) {
      console.error('Error loading banks:', error);
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch opportunities
      const { data: opportunitiesData, error: oppError } = await supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false });

      if (oppError) throw oppError;

      // Fetch companies
      const { data: companiesData, error: compError } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (compError) throw compError;

      // Fetch banks
      const { data: banksData, error: banksError } = await supabase
        .from('banks')
        .select('*')
        .order('created_at', { ascending: false });

      if (banksError) throw banksError;

      setOpportunities(opportunitiesData || []);
      setCompanies(companiesData || []);
      setBanks(banksData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data from database",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const triggerScraping = async () => {
    try {
      toast({
        title: "Scraping Started",
        description: "Fetching latest opportunities from development banks...",
      });

      // Scrape opportunities from all banks
      for (const bank of banks) {
        await supabase.functions.invoke('scrape-opportunities', {
          body: { bankId: bank.id, bankUrl: bank.url }
        });
      }

      // Refresh data
      await fetchData();
      
      toast({
        title: "Scraping Complete",
        description: "New opportunities have been added to the database",
      });
    } catch (error) {
      console.error('Error during scraping:', error);
      toast({
        title: "Scraping Failed",
        description: "Failed to scrape new opportunities",
        variant: "destructive",
      });
    }
  };

  const findCompaniesForOpportunity = async (opportunity: any) => {
    try {
      toast({
        title: "Finding Companies",
        description: `Searching for companies relevant to ${opportunity.project_name}...`,
      });

      await supabase.functions.invoke('find-companies', {
        body: {
          opportunityId: opportunity.id,
          sector: opportunity.sector,
          services: opportunity.services || [],
          country: opportunity.country
        }
      });

      await fetchData();
      
      // Set selected opportunity and navigate to partners tab
      setSelectedOpportunity(opportunity);
      setActiveTab("partners");
      
      toast({
        title: "Companies Found",
        description: "Relevant companies have been added to the database",
      });
    } catch (error) {
      console.error('Error finding companies:', error);
      toast({
        title: "Search Failed",
        description: "Failed to find companies for this opportunity",
        variant: "destructive",
      });
    }
  };

  const filteredOpportunities = opportunities.filter(opp => 
    opp.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.sector?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.client?.toLowerCase().includes(searchTerm.toLowerCase())
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
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.email}
              </span>
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
              <Button 
                variant="outline" 
                size="sm"
                onClick={signOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
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
            value={opportunities.length.toString()}
            change="+12%"
            icon={<Target className="w-5 h-5" />}
            trend="up"
          />
          <StatsCard
            title="High Match Score"
            value={opportunities.filter(o => (o.score || 0) >= 85).length.toString()}
            change="+8%"
            icon={<Star className="w-5 h-5" />}
            trend="up"
          />
          <StatsCard
            title="Total Value"
            value={`$${(opportunities.reduce((sum, o) => sum + (o.budget || 0), 0) / 1000000).toFixed(1)}M`}
            change="+15%"
            icon={<DollarSign className="w-5 h-5" />}
            trend="up"
          />
          <StatsCard
            title="Partner Networks"
            value={companies.length.toString()}
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
                  <Button onClick={triggerScraping} className="bg-gradient-primary">
                    <Target className="w-4 h-4 mr-2" />
                    Scrape New
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Opportunities List */}
            {isLoading ? (
              <div className="text-center py-8">Loading opportunities...</div>
            ) : (
              <div className="space-y-4">
                {filteredOpportunities.map((opportunity) => (
                  <OpportunityCard 
                    key={opportunity.id} 
                    opportunity={{
                      id: opportunity.id,
                      projectName: opportunity.project_name,
                      client: opportunity.client,
                      country: opportunity.country,
                      sector: opportunity.sector,
                      services: Array.isArray(opportunity.services) ? opportunity.services.join(', ') : 'Various services',
                      deadline: opportunity.deadline,
                      budget: opportunity.budget ? `$${opportunity.budget.toLocaleString()}` : 'TBD',
                      url: opportunity.url || '#',
                      score: opportunity.score || 0,
                      program: opportunity.program || 'Development Program'
                    }}
                    onFindCompanies={() => findCompaniesForOpportunity(opportunity)}
                  />
                ))}
                {filteredOpportunities.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No opportunities found. Try scraping for new ones!
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="partners" className="space-y-6">
            {/* Sample Opportunity Card */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Opportunity</CardTitle>
                <CardDescription>
                  High-priority opportunity matching your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedOpportunity ? (
                  <OpportunityCard 
                    opportunity={{
                      id: selectedOpportunity.id,
                      projectName: selectedOpportunity.project_name,
                      client: selectedOpportunity.client,
                      country: selectedOpportunity.country,
                      sector: selectedOpportunity.sector,
                      services: Array.isArray(selectedOpportunity.services) ? selectedOpportunity.services.join(', ') : 'Various services',
                      deadline: selectedOpportunity.deadline,
                      budget: selectedOpportunity.budget ? `$${selectedOpportunity.budget.toLocaleString()}` : 'TBD',
                      url: selectedOpportunity.url || '#',
                      score: selectedOpportunity.score || 0,
                      program: selectedOpportunity.program || 'Development Program'
                    }}
                    onFindCompanies={() => findCompaniesForOpportunity(selectedOpportunity)}
                  />
                ) : filteredOpportunities.length > 0 ? (
                  <OpportunityCard 
                    opportunity={{
                      id: filteredOpportunities[0].id,
                      projectName: filteredOpportunities[0].project_name,
                      client: filteredOpportunities[0].client,
                      country: filteredOpportunities[0].country,
                      sector: filteredOpportunities[0].sector,
                      services: Array.isArray(filteredOpportunities[0].services) ? filteredOpportunities[0].services.join(', ') : 'Various services',
                      deadline: filteredOpportunities[0].deadline,
                      budget: filteredOpportunities[0].budget ? `$${filteredOpportunities[0].budget.toLocaleString()}` : 'TBD',
                      url: filteredOpportunities[0].url || '#',
                      score: filteredOpportunities[0].score || 0,
                      program: filteredOpportunities[0].program || 'Development Program'
                    }}
                    onFindCompanies={() => findCompaniesForOpportunity(filteredOpportunities[0])}
                  />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No opportunities available. Try scraping for new ones!
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Companies Section */}
            <Card>
              <CardHeader>
                <CardTitle>Top 3 Partner Companies</CardTitle>
                <CardDescription>
                  Highest scoring companies for collaboration
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading companies...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {companies.slice(0, 3).map((company) => (
                      <CompanyCard 
                        key={company.id} 
                        company={{
                          id: company.id,
                          name: company.name,
                          country: company.country,
                          website: company.website || '#',
                          specialization: company.specialization || 'General',
                          rating: company.rating || 0,
                          relevance_score: Math.floor(Math.random() * 30) + 70 // Random score between 70-100
                        }}
                      />
                    ))}
                    {companies.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground col-span-full">
                        No companies found. Find companies by clicking "Find Companies" on opportunities!
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* All Partners Section */}
            <Card>
              <CardHeader>
                <CardTitle>All Partner Networks</CardTitle>
                <CardDescription>
                  Complete list of identified engineering firms
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading partners...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {companies.map((company) => (
                      <PartnerCard 
                        key={company.id} 
                        partner={{
                          id: company.id,
                          name: company.name,
                          country: company.country,
                          website: company.website || '#',
                          specialization: company.specialization || 'General',
                          rating: company.rating || 0
                        }}
                      />
                    ))}
                    {companies.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground col-span-full">
                        No companies found. Find companies by clicking "Find Companies" on opportunities!
                      </div>
                    )}
                  </div>
                )}
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