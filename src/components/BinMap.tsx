import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { Bin } from "./Dashboard";
import { Button } from "./ui/button";
import { Navigation, X } from "lucide-react";
import { toast } from "sonner";

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface BinMapProps {
  bins: Bin[];
  onBinClick: (bin: Bin) => void;
}

export const BinMap = ({ bins, onBinClick }: BinMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const routingControlRef = useRef<any>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null);
  const [showRoutePanel, setShowRoutePanel] = useState(false);

  // Get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: [number, number] = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setUserLocation(location);
          
          // Add or update user location marker
          if (mapRef.current) {
            if (userMarkerRef.current) {
              userMarkerRef.current.setLatLng(location);
            } else {
              const userIcon = L.divIcon({
                className: "user-location-marker",
                html: `
                  <div style="
                    background-color: #3b82f6;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                  "></div>
                `,
                iconSize: [20, 20],
                iconAnchor: [10, 10],
              });
              
              userMarkerRef.current = L.marker(location, { icon: userIcon })
                .bindPopup("<strong>Your Location</strong>")
                .addTo(mapRef.current);
            }
            
            mapRef.current.setView(location, 13);
          }
          
          toast.success("Location detected successfully");
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Unable to detect your location. Please enable location services.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  // Calculate route to selected bin
  const showRouteToBin = (bin: Bin) => {
    if (!userLocation) {
      toast.error("Please enable your location first");
      getUserLocation();
      return;
    }

    if (!mapRef.current) return;

    // Remove existing route if any
    if (routingControlRef.current) {
      mapRef.current.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }

    setSelectedBin(bin);
    setShowRoutePanel(true);

    // Create routing control
    const routingControl = (L as any).Routing.control({
      waypoints: [
        L.latLng(userLocation[0], userLocation[1]),
        L.latLng(bin.latitude, bin.longitude),
      ],
      router: (L as any).Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
      }),
      routeWhileDragging: false,
      addWaypoints: false,
      lineOptions: {
        styles: [{ color: "#22c55e", weight: 6, opacity: 0.7 }],
      },
      createMarker: () => null, // Don't create default markers
      show: false, // Don't show the default control panel
    }).addTo(mapRef.current);

    routingControlRef.current = routingControl;

    // Listen for route found
    routingControl.on("routesfound", (e: any) => {
      const routes = e.routes;
      const summary = routes[0].summary;
      const distance = (summary.totalDistance / 1000).toFixed(2);
      const time = Math.round(summary.totalTime / 60);
      
      toast.success(`Route found: ${distance} km, ~${time} minutes`);
    });

    onBinClick(bin);
  };

  // Clear route
  const clearRoute = () => {
    if (routingControlRef.current && mapRef.current) {
      mapRef.current.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }
    setSelectedBin(null);
    setShowRoutePanel(false);
  };

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map centered on Chennai
    const map = L.map(mapContainerRef.current).setView([13.0827, 80.2707], 12);
    mapRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker && layer !== userMarkerRef.current) {
        mapRef.current!.removeLayer(layer);
      }
    });

    // Add new markers
    bins.forEach((bin) => {
      const fillLevel = bin.fill_level;
      let iconColor = "#22c55e"; // green
      if (fillLevel >= 80) iconColor = "#ef4444"; // red
      else if (fillLevel >= 50) iconColor = "#eab308"; // yellow

      const customIcon = L.divIcon({
        className: "custom-marker",
        html: `
          <div style="
            background-color: ${iconColor};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
            font-size: 12px;
            cursor: pointer;
            transition: transform 0.2s;
          ">
            ${fillLevel}%
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const popupContent = `
        <div style="min-width: 200px;">
          <h3 style="font-weight: bold; margin-bottom: 8px;">${bin.location}</h3>
          <p style="margin: 4px 0;"><strong>Fill Level:</strong> ${bin.fill_level}%</p>
          <p style="margin: 4px 0;"><strong>Status:</strong> ${bin.status}</p>
          <p style="margin: 4px 0; font-size: 12px; color: #666;">
            Last updated: ${new Date(bin.last_updated).toLocaleString()}
          </p>
          <button 
            id="route-btn-${bin.id}" 
            style="
              margin-top: 8px;
              padding: 6px 12px;
              background-color: #22c55e;
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-weight: 500;
              width: 100%;
            "
          >
            🗺️ Show Route
          </button>
        </div>
      `;

      const marker = L.marker([bin.latitude, bin.longitude], { icon: customIcon })
        .bindPopup(popupContent)
        .on("click", () => {
          // Wait for popup to open, then attach event listener
          setTimeout(() => {
            const routeBtn = document.getElementById(`route-btn-${bin.id}`);
            if (routeBtn) {
              routeBtn.onclick = (e) => {
                e.stopPropagation();
                showRouteToBin(bin);
              };
            }
          }, 100);
        });

      marker.addTo(mapRef.current!);
    });

    // Fit bounds to show all markers
    if (bins.length > 0 && !selectedBin) {
      const bounds = L.latLngBounds(bins.map(b => [b.latitude, b.longitude]));
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bins, onBinClick, selectedBin, userLocation]);

  return (
    <div className="relative">
      {/* Control Panel */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <Button
          onClick={getUserLocation}
          size="sm"
          className="shadow-lg bg-white text-primary hover:bg-white/90"
        >
          <Navigation className="h-4 w-4 mr-2" />
          My Location
        </Button>
        
        {showRoutePanel && selectedBin && (
          <div className="bg-white p-4 rounded-lg shadow-xl border border-primary/20 max-w-xs">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-sm">Route to {selectedBin.location}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearRoute}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Fill Level: <span className="font-semibold">{selectedBin.fill_level}%</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Follow the green route on the map
            </p>
          </div>
        )}
      </div>

      <div ref={mapContainerRef} className="h-[450px] w-full rounded-lg" />
    </div>
  );
};