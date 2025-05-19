
export interface ReservoirData {
  reservoirName: string;
  waterLevel: number | null;
  timestamp: string;
  capacity?: number;
  percentFull?: number;
}
