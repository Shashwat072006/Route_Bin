import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Check, MapPin } from "lucide-react";
import { Bin } from "./Dashboard";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BinListProps {
  bins: Bin[];
  onCollect: (binId: string) => void;
  onDelete: (binId: string) => void;
}

export const BinList = ({ bins, onCollect, onDelete }: BinListProps) => {
  const getStatusColor = (fillLevel: number, status: string) => {
    if (status === 'full' || fillLevel >= 90) return 'bg-error/10 text-error border-error/20';
    if (fillLevel >= 80) return 'bg-warning/10 text-warning border-warning/20';
    if (fillLevel >= 50) return 'bg-warning/20 text-warning border-warning/30';
    return 'bg-success/10 text-success border-success/20';
  };

  const getFillLevelColor = (fillLevel: number) => {
    if (fillLevel >= 90) return 'bg-error';
    if (fillLevel >= 80) return 'bg-warning';
    if (fillLevel >= 50) return 'bg-warning/70';
    return 'bg-success';
  };

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {bins.map((bin) => (
          <div
            key={bin.id}
            className="p-5 border rounded-xl hover:border-primary/50 transition-all hover:shadow-md bg-card"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold">{bin.location}</h4>
                </div>
                <Badge variant="outline" className={getStatusColor(bin.fill_level, bin.status)}>
                  {bin.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fill Level</span>
                <span className="font-medium">{bin.fill_level}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${getFillLevelColor(bin.fill_level)}`}
                  style={{ width: `${bin.fill_level}%` }}
                />
              </div>
            </div>

            <div className="text-xs text-muted-foreground mb-3">
              <div>Updated: {new Date(bin.last_updated).toLocaleString()}</div>
              {bin.last_collection && (
                <div>Last collected: {new Date(bin.last_collection).toLocaleString()}</div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="default"
                onClick={() => onCollect(bin.id)}
                className="flex-1"
              >
                <Check className="h-4 w-4 mr-1" />
                Mark Collected
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(bin.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};