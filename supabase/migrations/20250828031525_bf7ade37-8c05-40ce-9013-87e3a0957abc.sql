-- Create banks table
CREATE TABLE public.banks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert bank data
INSERT INTO public.banks (name, url) VALUES
('World Bank (WB)', 'https://projects.worldbank.org/en/projects-operations/projects-list?os=0'),
('African Development Bank (AfDB)', 'https://www.afdb.org/en/projects-and-operations/procurement'),
('European Investment Bank (EIB)', 'https://www.eib.org/en/projects/pipelines/index.htm'),
('Agence Française de Développement (AFD)', 'https://www.afd.fr/en/projects/list'),
('Islamic Development Bank (IsDB)', 'https://www.isdb.org/project-procurement/tenders'),
('Proparco', 'https://www.proparco.fr/en/our-projects'),
('KfW Development Bank (Germany)', 'https://www.kfw-entwicklungsbank.de/Internationale-Finanzierung/KfW-Entwicklungsbank/Projekte/Projektdatenbank/index.jsp'),
('United Nations Development Programme (UNDP)', 'https://procurement-notices.undp.org'),
('Asian Development Bank (ADB)', 'https://www.adb.org/projects/tenders'),
('European Bank for Reconstruction & Development (EBRD)', 'https://www.ebrd.com/home/what-we-do/projects.html#customtab-70eec7766a-item-4654c5d413-tab'),
('International Finance Corporation (IFC)', 'https://disclosures.ifc.org'),
('FMO (Netherlands)', 'https://www.fmo.nl/project-list'),
('Multilateral Investment Guarantee Agency (MIGA)', 'https://www.miga.org/projects/list'),
('Inter-American Development Bank (IDB)', 'https://www.iadb.org/en/projects'),
('DeBIT Database (UChicago)', 'https://debit.datascience.uchicago.edu/database');

-- Create opportunities table
CREATE TABLE public.opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_name TEXT NOT NULL,
  client TEXT,
  country TEXT,
  sector TEXT,
  services TEXT[],
  deadline DATE,
  budget BIGINT,
  url TEXT,
  score INTEGER DEFAULT 0,
  program TEXT,
  bank_id UUID REFERENCES public.banks(id),
  scraped_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create companies table
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT,
  website TEXT,
  specialization TEXT,
  rating DECIMAL(2,1),
  opportunity_id UUID REFERENCES public.opportunities(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create opportunity_companies junction table
CREATE TABLE public.opportunity_companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  relevance_score DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(opportunity_id, company_id)
);

-- Enable Row Level Security
ALTER TABLE public.banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_companies ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (no auth required for this demo)
CREATE POLICY "Banks are viewable by everyone" 
ON public.banks FOR SELECT USING (true);

CREATE POLICY "Opportunities are viewable by everyone" 
ON public.opportunities FOR SELECT USING (true);

CREATE POLICY "Opportunities are insertable by everyone" 
ON public.opportunities FOR INSERT WITH CHECK (true);

CREATE POLICY "Opportunities are updatable by everyone" 
ON public.opportunities FOR UPDATE USING (true);

CREATE POLICY "Companies are viewable by everyone" 
ON public.companies FOR SELECT USING (true);

CREATE POLICY "Companies are insertable by everyone" 
ON public.companies FOR INSERT WITH CHECK (true);

CREATE POLICY "Opportunity companies are viewable by everyone" 
ON public.opportunity_companies FOR SELECT USING (true);

CREATE POLICY "Opportunity companies are insertable by everyone" 
ON public.opportunity_companies FOR INSERT WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_opportunities_updated_at
BEFORE UPDATE ON public.opportunities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();