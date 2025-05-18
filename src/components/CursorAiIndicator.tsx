
import React, { useState, useEffect } from 'react';
import { fetchAiModelInfo } from '../services/cursorAiService';
import { CloudRain, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

const CursorAiIndicator: React.FC = () => {
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [modelInfo, setModelInfo] = useState<{ version: string; accuracy: number } | null>(null);

  const checkConnection = React.useCallback(async () => {
    setStatus('checking');
    try {
      const info = await fetchAiModelInfo();
      setModelInfo({
        version: info.version,
        accuracy: info.accuracy
      });
      setStatus('connected');
    } catch (error) {
      console.error('Failed to connect to Cursor AI:', error);
      setStatus('disconnected');
    }
  }, []);

  useEffect(() => {
    checkConnection();
    
    // Check connection periodically
    const interval = setInterval(() => {
      checkConnection();
    }, 5 * 60 * 1000); // Check every 5 minutes
    
    return () => clearInterval(interval);
  }, [checkConnection]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`h-7 gap-1 px-2 text-xs ${
              status === 'connected' ? 'text-green-600' : 
              status === 'disconnected' ? 'text-red-600' : 
              'text-muted-foreground'
            }`}
            onClick={checkConnection}
          >
            {status === 'connected' ? (
              <>
                <CloudRain className="h-3.5 w-3.5" />
                <span>Cursor AI</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              </>
            ) : status === 'disconnected' ? (
              <>
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>AI Disconnected</span>
              </>
            ) : (
              <>
                <CloudRain className="h-3.5 w-3.5" />
                <span>Checking...</span>
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {status === 'connected' && modelInfo ? (
            <div className="text-xs">
              <p className="font-semibold">Connected to Cursor AI</p>
              <p>Model: {modelInfo.version}</p>
              <p>Accuracy: {modelInfo.accuracy}%</p>
            </div>
          ) : status === 'disconnected' ? (
            <p className="text-xs">Cursor AI connection failed. Click to retry.</p>
          ) : (
            <p className="text-xs">Checking Cursor AI connection...</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CursorAiIndicator;
