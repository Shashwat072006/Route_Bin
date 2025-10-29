import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bin } from "./Dashboard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from "recharts";
import { Route, TrendingUp, Clock, AlertTriangle, Timer, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AnalyticsProps {
  bins: Bin[];
}

export const Analytics = ({ bins }: AnalyticsProps) => {
  // Fill level distribution
  const fillLevelData = [
    { name: '0-25%', value: bins.filter(b => b.fill_level < 25).length, color: '#22c55e' },
    { name: '25-50%', value: bins.filter(b => b.fill_level >= 25 && b.fill_level < 50).length, color: '#84cc16' },
    { name: '50-75%', value: bins.filter(b => b.fill_level >= 50 && b.fill_level < 75).length, color: '#eab308' },
    { name: '75-100%', value: bins.filter(b => b.fill_level >= 75).length, color: '#ef4444' },
  ];

  // Route optimization - prioritize bins by fill level
  const priorityBins = [...bins]
    .filter(b => b.fill_level >= 70)
    .sort((a, b) => b.fill_level - a.fill_level)
    .slice(0, 5);

  const routeData = priorityBins.map((bin, index) => ({
    name: bin.location,
    priority: 100 - (index * 10),
    fillLevel: bin.fill_level,
  }));

  // Enhanced overflow predictions with better logic
  const predictions = bins.map(bin => {
    const now = Date.now();
    const lastCollectionTime = bin.last_collection 
      ? new Date(bin.last_collection).getTime() 
      : now - (7 * 24 * 60 * 60 * 1000); // Default to 7 days ago if no collection data
    
    const hoursSinceCollection = Math.floor((now - lastCollectionTime) / (1000 * 60 * 60));
    
    // Calculate fill rate per hour (more accurate)
    const fillRate = hoursSinceCollection > 0 ? bin.fill_level / hoursSinceCollection : 0.5; // Default 0.5% per hour
    
    // Calculate hours until full
    const remainingCapacity = 100 - bin.fill_level;
    const hoursToFull = fillRate > 0 ? remainingCapacity / fillRate : Infinity;
    
    // Calculate estimated overflow date
    const estimatedOverflowDate = fillRate > 0 
      ? new Date(now + (hoursToFull * 60 * 60 * 1000))
      : null;
    
    // Priority calculation based on fill level and time to full
    let priority: 'critical' | 'high' | 'medium' | 'low' = 'low';
    if (bin.fill_level >= 90 || hoursToFull < 12) priority = 'critical';
    else if (bin.fill_level >= 75 || hoursToFull < 24) priority = 'high';
    else if (bin.fill_level >= 60 || hoursToFull < 48) priority = 'medium';
    
    return {
      ...bin,
      hoursToFull,
      fillRate,
      estimatedOverflowDate,
      priority,
      hoursSinceCollection,
    };
  })
  .filter(p => p.hoursToFull < Infinity && (p.hoursToFull < 72 || p.fill_level >= 60))
  .sort((a, b) => {
    // Sort by priority first, then by hours to full
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return a.hoursToFull - b.hoursToFull;
  })
  .slice(0, 8);

  // Timeline data for overflow visualization
  const timelineData = predictions.slice(0, 5).map(p => ({
    location: p.location.substring(0, 15) + (p.location.length > 15 ? '...' : ''),
    current: p.fill_level,
    predicted: 100,
    hours: Math.round(p.hoursToFull),
  }));

  // Format time remaining
  const formatTimeRemaining = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    if (hours < 24) return `${Math.round(hours)}h`;
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);
    return `${days}d ${remainingHours}h`;
  };

  // Get priority badge style
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-error text-error-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Fill Level Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Fill Level Distribution
          </CardTitle>
          <CardDescription>Current status across all bins</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={fillLevelData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {fillLevelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Optimal Collection Route */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5 text-primary" />
            Optimal Collection Route
          </CardTitle>
          <CardDescription>Prioritized by fill level and urgency</CardDescription>
        </CardHeader>
        <CardContent>
          {routeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={routeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="fillLevel" fill="hsl(var(--primary))" name="Fill Level %" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No bins require immediate collection
            </div>
          )}
        </CardContent>
      </Card>

      {/* Overflow Timeline Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-primary" />
            Overflow Timeline
          </CardTitle>
          <CardDescription>Projected fill levels for critical bins</CardDescription>
        </CardHeader>
        <CardContent>
          {timelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="location" />
                <YAxis domain={[0, 100]} label={{ value: 'Fill Level %', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="current" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Current Fill"
                  dot={{ fill: 'hsl(var(--primary))', r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="hsl(var(--error))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Predicted Full"
                  dot={{ fill: 'hsl(var(--error))', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              No overflow predictions available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Overflow Predictions */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Detailed Overflow Predictions
          </CardTitle>
          <CardDescription>
            Showing {predictions.length} bins requiring attention in the next 72 hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          {predictions.length > 0 ? (
            <div className="grid gap-4">
              {predictions.map((prediction) => (
                <div
                  key={prediction.id}
                  className="p-5 border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-r from-card to-card/50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-lg">{prediction.location}</h4>
                        <Badge className={getPriorityStyle(prediction.priority)}>
                          {prediction.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          <span>Fill Rate: {prediction.fillRate.toFixed(2)}%/hour</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Since Collection: {Math.round(prediction.hoursSinceCollection)}h</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className={`text-right ${
                        prediction.priority === 'critical' ? 'text-error' : 
                        prediction.priority === 'high' ? 'text-warning' : 
                        'text-primary'
                      }`}>
                        <div className="text-3xl font-bold">
                          {formatTimeRemaining(prediction.hoursToFull)}
                        </div>
                        <div className="text-xs uppercase tracking-wide">until full</div>
                      </div>
                      {prediction.estimatedOverflowDate && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{prediction.estimatedOverflowDate.toLocaleDateString()}</span>
                          <span>{prediction.estimatedOverflowDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Current Capacity</span>
                      <span className="font-medium">{prediction.fill_level}%</span>
                    </div>
                    <div className="relative w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          prediction.priority === 'critical' ? 'bg-error' :
                          prediction.priority === 'high' ? 'bg-warning' :
                          prediction.priority === 'medium' ? 'bg-primary' :
                          'bg-muted-foreground'
                        }`}
                        style={{ width: `${prediction.fill_level}%` }}
                      />
                      {/* Warning marker at 75% */}
                      <div className="absolute left-[75%] top-0 h-3 w-0.5 bg-card" />
                      {/* Critical marker at 90% */}
                      <div className="absolute left-[90%] top-0 h-3 w-0.5 bg-card" />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0%</span>
                      <span className="text-warning">75%</span>
                      <span className="text-error">90%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {prediction.priority === 'critical' && (
                    <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-error flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-error">
                        <strong>Immediate Action Required:</strong> This bin needs urgent collection to prevent overflow.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground text-lg">All bins are operating within safe capacity</p>
              <p className="text-muted-foreground/75 text-sm mt-1">No overflow predictions in the next 72 hours</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};