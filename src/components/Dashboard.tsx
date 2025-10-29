import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash2, MapPin, Recycle, AlertTriangle, TrendingUp } from "lucide-react";
import { BinMap } from "./BinMap";
import { BinList } from "./BinList";
import { Analytics } from "./Analytics";
import { HeroSection } from "./HeroSection";

export interface Bin {
  id: string;
  location: string;
  latitude: number;
  longitude: number;
  fill_level: number;
  status: string;
  capacity: number;
  last_updated: string;
  last_collection: string | null;
  created_at: string;
}

export const Dashboard = () => {
  const [bins, setBins] = useState<Bin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBins();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('bins-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bins'
        },
        () => {
          fetchBins();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchBins = async () => {
    try {
      const { data, error } = await supabase
        .from('bins')
        .select('*')
        .order('fill_level', { ascending: false });

      if (error) throw error;
      setBins(data || []);
    } catch (error) {
      console.error('Error fetching bins:', error);
      toast.error('Failed to fetch bins');
    } finally {
      setLoading(false);
    }
  };

  const handleCollect = async (binId: string) => {
    try {
      const { error } = await supabase
        .from('bins')
        .update({
          fill_level: 0,
          status: 'operational',
          last_collection: new Date().toISOString()
        })
        .eq('id', binId);

      if (error) throw error;
      toast.success('Bin marked as collected');
    } catch (error) {
      console.error('Error collecting bin:', error);
      toast.error('Failed to mark bin as collected');
    }
  };

  const handleDelete = async (binId: string) => {
    try {
      const { error } = await supabase
        .from('bins')
        .delete()
        .eq('id', binId);

      if (error) throw error;
      toast.success('Bin deleted successfully');
    } catch (error) {
      console.error('Error deleting bin:', error);
      toast.error('Failed to delete bin');
    }
  };

  const totalBins = bins.length;
  const fullBins = bins.filter(b => b.fill_level >= 80).length;
  const avgFillLevel = bins.length > 0
    ? Math.round(bins.reduce((sum, b) => sum + b.fill_level, 0) / bins.length)
    : 0;
  const urgentBins = bins.filter(b => b.fill_level >= 90 || b.status === 'full').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection onBinAdded={fetchBins} />

      {/* Stats Cards */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 -mt-20 relative z-20">
          <Card className="shadow-xl border-primary/20 hover:shadow-2xl transition-all hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bins</CardTitle>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{totalBins}</div>
              <p className="text-xs text-muted-foreground mt-1">Active monitoring points</p>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-primary/20 hover:shadow-2xl transition-all hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Fill Level</CardTitle>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgFillLevel}%</div>
              <p className="text-xs text-muted-foreground mt-1">Across all bins</p>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-warning/20 hover:shadow-2xl transition-all hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Full Bins</CardTitle>
              <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{fullBins}</div>
              <p className="text-xs text-muted-foreground mt-1">≥80% capacity</p>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-error/20 hover:shadow-2xl transition-all hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgent Collection</CardTitle>
              <div className="h-10 w-10 rounded-xl bg-error/10 flex items-center justify-center animate-pulse-glow">
                <MapPin className="h-5 w-5 text-error" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-error">{urgentBins}</div>
              <p className="text-xs text-muted-foreground mt-1">Needs immediate attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="col-span-1 shadow-lg border-primary/10 hover:shadow-xl transition-shadow overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Bin Locations
              </CardTitle>
              <CardDescription>Interactive map showing all waste bins across Chennai</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <BinMap bins={bins} onBinClick={() => {}} />
            </CardContent>
          </Card>

          <Card className="col-span-1 shadow-lg border-primary/10 hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-primary" />
                Bin Status
              </CardTitle>
              <CardDescription>Monitor and manage all bins in real-time</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <BinList bins={bins} onCollect={handleCollect} onDelete={handleDelete} />
            </CardContent>
          </Card>
        </div>

        {/* Analytics */}
        <Analytics bins={bins} />
      </div>
    </div>
  );
};