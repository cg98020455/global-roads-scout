import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Send, 
  Bot, 
  User,
  TrendingUp,
  Lightbulb,
  Search,
  FileText
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: string;
}

const sampleQuestions = [
  "Show me high-scoring opportunities in Kenya",
  "What transport projects are available this month?",
  "Find opportunities with budgets over $5M",
  "Generate today's executive summary"
];

const mockMessages: Message[] = [
  {
    id: "1",
    content: "Hello! I'm your AI assistant for opportunity intelligence. I can help you query opportunities, generate reports, and provide insights. What would you like to know?",
    sender: "ai",
    timestamp: new Date().toISOString()
  }
];

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(inputValue),
        sender: "ai",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const getAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("kenya")) {
      return "I found 3 high-scoring opportunities in Kenya:\n\n1. **East Africa Transport Corridor Development** (92% match)\n   - Client: African Development Bank\n   - Budget: $2.5M - $5.0M\n   - Focus: Highway design, traffic studies\n\n2. **Nairobi Urban Mobility Study** (88% match)\n   - Client: World Bank\n   - Budget: $1.8M - $3.2M\n   - Focus: Urban transport planning\n\nWould you like more details on any of these?";
    }
    
    if (lowerQuery.includes("transport")) {
      return "Currently tracking 12 transport infrastructure opportunities across Africa and Middle East. Here are the highlights:\n\n• **5 highway projects** (avg. score: 84%)\n• **3 railway initiatives** (avg. score: 76%)\n• **4 urban mobility studies** (avg. score: 89%)\n\nTotal estimated value: $47.3M\n\nWhich category interests you most?";
    }
    
    if (lowerQuery.includes("budget") || lowerQuery.includes("5m")) {
      return "Found 6 opportunities with budgets exceeding $5M:\n\n• Sub-Saharan Railway Network ($10M-$15M) - 78% match\n• Middle East Highway Expansion ($8M-$12M) - 82% match\n• East Africa Transport Corridor ($2.5M-$5M) - 92% match\n\nThese represent $35M+ in potential project value. Shall I provide partnership recommendations?";
    }
    
    if (lowerQuery.includes("summary") || lowerQuery.includes("report")) {
      return "**Daily Intelligence Summary - " + new Date().toLocaleDateString() + "**\n\n📊 **Key Metrics:**\n• 47 active opportunities\n• 23 high-match projects (85%+)\n• $127.5M total pipeline value\n\n🎯 **Top Recommendations:**\n1. East Africa Transport Corridor (92% - deadline Dec 15)\n2. Middle East Urban Mobility (87% - deadline Nov 30)\n3. Nigeria Railway Expansion (78% - deadline Dec 20)\n\n🤝 **New Partners Identified:** 8 firms across target regions\n\nFull Excel report ready for download.";
    }
    
    return "I understand you're looking for information about opportunities. I can help you with:\n\n• Searching opportunities by country, sector, or budget\n• Generating compatibility scores and recommendations\n• Identifying local partners\n• Creating custom reports\n• Filtering by deadlines and programs\n\nWhat specific information would you like to explore?";
  };

  const handleQuestionClick = (question: string) => {
    setInputValue(question);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chat Interface */}
      <div className="lg:col-span-2">
        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              AI Opportunity Assistant
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.sender === "ai" && (
                      <Avatar className="w-8 h-8 bg-gradient-primary">
                        <AvatarFallback>
                          <Bot className="w-4 h-4 text-primary-foreground" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-muted"
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </div>
                      <div className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    {message.sender === "user" && (
                      <Avatar className="w-8 h-8 bg-secondary">
                        <AvatarFallback>
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8 bg-gradient-primary">
                      <AvatarFallback>
                        <Bot className="w-4 h-4 text-primary-foreground animate-pulse" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg px-4 py-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="flex gap-2 mt-4">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about opportunities, generate reports, or get insights..."
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={isLoading || !inputValue.trim()}
                className="bg-gradient-primary"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Quick Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sampleQuestions.map((question, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-left h-auto p-3 text-sm"
                onClick={() => handleQuestionClick(question)}
              >
                {question}
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              AI Capabilities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <Search className="w-4 h-4 text-primary mt-1" />
              <div>
                <div className="font-medium">Smart Search</div>
                <div className="text-muted-foreground">Query opportunities by any criteria</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="w-4 h-4 text-primary mt-1" />
              <div>
                <div className="font-medium">Report Generation</div>
                <div className="text-muted-foreground">Create custom Excel reports</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="w-4 h-4 text-primary mt-1" />
              <div>
                <div className="font-medium">Compatibility Scoring</div>
                <div className="text-muted-foreground">AI-powered opportunity ranking</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};