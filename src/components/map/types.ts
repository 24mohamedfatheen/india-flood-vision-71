
import { FloodData } from '../../data/floodData';
import L from 'leaflet';

export interface MapProps {
  selectedRegion: string;
}

export interface MapMarkerProps {
  data: FloodData;
  map: L.Map;
  selectedRegion: string;
  popupRef: React.MutableRefObject<L.Popup | null>;
}

export interface MapControlsProps {
  map: L.Map | null;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetView: () => void;
  toggleLayerVisibility: (layerId: string) => void;
}

export interface MapLegendProps {}

export interface MapPlaceholderProps {
  showMapboxTokenWarning?: boolean;
}

export interface MapAttributionProps {
  lastUpdate: string;
}
