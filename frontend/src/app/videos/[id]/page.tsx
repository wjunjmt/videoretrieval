"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

// ... (type definitions updated to include new fields)
type Detection = {
  id: number;
  object_id: number;
  box_x1: number;
  box_y1: number;
  box_x2: number;
  box_y2: number;
  object_type: 'person' | 'car';
  attributes: { license_plate?: string };
};

// ... (other types remain the same)

export default function VideoDetailPage() {
  const params = useParams();
  const id = params.id;
  const [video, setVideo] = useState<VideoDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState<number | null>(null);
  const [trajectory, setTrajectory] = useState<TrajectoryPoint[] | null>(null);
  const [selectedObject, setSelectedObject] = useState<number | null>(null);

  // ... (fetchVideoDetails and useEffect remain the same)

  const handleAnalyze = async (frameId: number) => {
    setIsAnalyzing(frameId);
    try {
      await fetch(`/api/frames/${frameId}/analyze`, { method: 'POST' });
      pollForDetections(frameId);
    } catch (error) {
      console.error("Analysis trigger error:", error);
      setIsAnalyzing(null);
    }
  };

  const pollForDetections = (frameId: number) => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/frames/${frameId}/detections`);
      if(res.ok) {
        const detections = await res.json();
        if (detections && detections.length > 0) {
          clearInterval(interval);
          setVideo(prev => prev ? ({
            ...prev,
            frames: prev.frames.map(f => f.id === frameId ? { ...f, detections } : f)
          }) : null);
          setIsAnalyzing(null);
        }
      }
    }, 3000);
  };

  // ... (handleTrackObject remains the same)

  if (isLoading) return <div className="text-white p-8">Loading...</div>;
  if (!video) return <div className="text-white p-8">Video not found.</div>;

  return (
    <div className="bg-background-dark text-white min-h-screen p-8 grid grid-cols-3 gap-6">
      <div className="col-span-2">
        {/* ... (video player and title) */}
        <div className="bg-[#1A1C23]/60 rounded-lg p-5 border border-white/10">
          <h2 className="text-[22px] font-bold mb-4">Keyframes & Analysis</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {video.frames.map((frame) => (
              <div key={frame.id} className="group flex flex-col gap-2">
                <div className="relative">
                  <img src={`/${frame.image_path}`} alt={`Frame ${frame.id}`} className="aspect-video rounded-md object-cover"/>
                  {frame.detections?.map(det => {
                    const borderColor = det.object_type === 'person' ? 'border-green-400' : 'border-yellow-400';
                    const bgColor = det.object_type === 'person' ? 'bg-green-400' : 'bg-yellow-400';
                    const plate = det.attributes?.license_plate;

                    return (
                      <div
                        key={det.id}
                        className={`absolute border-2 ${borderColor} hover:bg-opacity-20 cursor-pointer`}
                        style={{ left: `${det.box_x1 / 16}%`, top: `${det.box_y1 / 9}%`, width: `${(det.box_x2 - det.box_x1) / 16}%`, height: `${(det.box_y2 - det.box_y1) / 9}%` }}
                        onClick={() => handleTrackObject(det.object_id)}
                      >
                        <span className={`text-xs ${bgColor} text-black p-1 rounded-sm absolute -top-6 left-0`}>
                          {det.object_type === 'car' && plate ? `${plate}` : `ID: ${det.object_id}`}
                        </span>
                      </div>
                    )
                  })}
                </div>
                <button onClick={() => handleAnalyze(frame.id)} disabled={!!isAnalyzing} className="bg-primary/80 h-10 text-white text-sm font-bold py-2 rounded-lg hover:bg-primary disabled:opacity-50">
                  {isAnalyzing === frame.id ? 'Analyzing...' : `Analyze Frame`}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* ... (trajectory panel) */}
    </div>
  );
}
