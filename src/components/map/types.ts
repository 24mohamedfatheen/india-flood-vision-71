
import { FloodData } from '../../data/floodData';
import mapboxgl from 'mapbox-gl';

export interface MapProps {
  selectedRegion: string;
}

export interface MapMarkerProps {
  data: FloodData;
  map: mapboxgl.Map;
  selectedRegion: string;
  popupRef: React.MutableRefObject<mapboxgl.Popup | null>;
}

export interface MapControlsProps {
  map: mapboxgl.Map | null;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetView: () => void;
  toggleLayerVisibility: (layerId: string) => void;
}

export interface MapLegendProps {}

export interface MapPlaceholderProps {
  showMapboxTokenWarning: boolean;
}

export interface MapAttributionProps {
  lastUpdate: string;
}
