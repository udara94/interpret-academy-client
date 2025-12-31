"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { segmentsApi, SegmentItem, EnglishSegment, InterpretedSegmentItem } from "@/lib/api/segments-api";
import { dialogsApi, Dialog } from "@/lib/api/dialogs-api";
import { useMembership } from "@/lib/hooks/use-membership";
import { ROUTES } from "@/lib/routes";
import Link from "next/link";
import PremiumAccessModal from "@/components/ui/PremiumAccessModal";

export default function DialogDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { hasActiveMembership } = useMembership();
  const dialogId = params?.id as string;
  
  const [segments, setSegments] = useState<SegmentItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogTitle, setDialogTitle] = useState<string>("");
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [isAudioActive, setIsAudioActive] = useState(false); // Track if audio has sound (not silent)
  const [repeatCounts, setRepeatCounts] = useState<Record<number, number>>({}); // Track repeat count per segment
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (dialogId) {
      loadDialog();
    }
  }, [dialogId, hasActiveMembership]);

  const loadDialog = async () => {
    if (!dialogId) return;
    
    setIsLoading(true);
    
    try {
      const response = await dialogsApi.getDialogById(dialogId);
      
      if ("statusCode" in response && response.statusCode >= 400) {
        const errorResponse = response as any;
        setDialogTitle("");
        setDialog(null);
        setError(errorResponse.message || "Failed to load dialog");
        setIsLoading(false);
        return;
      }
      
      const dialogData = response as Dialog;
      setDialog(dialogData);
      setDialogTitle(dialogData.title || "");
      
      // Check if user needs premium access
      // Only show modal if dialog is premium AND user doesn't have active membership
      if (!dialogData.isFree && !hasActiveMembership) {
        setShowPremiumModal(true);
        setIsLoading(false);
        return;
      }
      
      // If user has access, load segments
      await loadSegments();
    } catch (error: any) {
      console.error("Load dialog error:", error);
      setDialogTitle("");
      setDialog(null);
      setError("An error occurred while loading the dialog");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Reset state when segment changes
    setIsPlaying(false);
    setHasPlayed(false);
    setIsTextExpanded(false);
    setAudioProgress(0);
    setIsAudioActive(false);
    
    // Cleanup audio context and source node when segment changes
    // Disconnect source node first if it exists
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.disconnect();
      } catch (e) {
        // Ignore disconnect errors
      }
      sourceNodeRef.current = null;
    }
    
    // Disconnect other nodes
    if (analyserRef.current) {
      try {
        analyserRef.current.disconnect();
      } catch (e) {
        // Ignore disconnect errors
      }
      analyserRef.current = null;
    }
    
    if (gainNodeRef.current) {
      try {
        gainNodeRef.current.disconnect();
      } catch (e) {
        // Ignore disconnect errors
      }
      gainNodeRef.current = null;
    }
    
    // Close and recreate audio context for each segment
    // This ensures a fresh context for the new audio element
    if (audioContextRef.current) {
      try {
        if (audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close().catch(() => {});
        }
      } catch (e) {
        // Ignore close errors
      }
      audioContextRef.current = null;
    }
    
    dataArrayRef.current = null;
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, [currentIndex]);

  useEffect(() => {
    // Cleanup animation frame on unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const loadSegments = async () => {
    if (!dialogId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await segmentsApi.getSegmentsByDialog(dialogId);

      if ("statusCode" in response && response.statusCode >= 400) {
        const errorResponse = response as any;
        
        if (response.statusCode === 400 && errorResponse.message?.includes("Language not selected")) {
          // Note: We don't redirect to language select here - that's only done during login/registration
          // If language is missing, just show an error message
          setError("Please select a language in your profile to view this dialog");
          toast.warning("Please select a language in your profile");
          setSegments([]);
          return;
        }
        
        if (response.statusCode === 404) {
          toast.error("Dialog not found");
          router.push(ROUTES.DASHBOARD.DIALOGS);
          return;
        }
        
        setError(errorResponse.message || "Failed to load segments");
        toast.error(errorResponse.message || "Failed to load segments");
        setSegments([]);
        return;
      }

      const segmentsResponse = response as { data: SegmentItem[]; count: number };
      
      if (!segmentsResponse.data || !Array.isArray(segmentsResponse.data)) {
        setError("Invalid response format");
        setSegments([]);
        return;
      }

      setSegments(segmentsResponse.data);
      
      if (segmentsResponse.data.length === 0) {
        toast.info("No segments available for this dialog");
      }
    } catch (error: any) {
      console.error("Load segments error:", error);
      setError("An error occurred while loading segments");
      toast.error("An error occurred while loading segments");
      setSegments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const setupAudioAnalysis = () => {
    // Don't setup if audio element doesn't exist
    if (!audioRef.current) return false;
    
    // Always clean up existing nodes first since audio element is recreated with key prop
    // This ensures we start fresh for each new audio element
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.disconnect();
      } catch (e) {
        // Ignore disconnect errors
      }
      sourceNodeRef.current = null;
    }
    
    if (analyserRef.current) {
      try {
        analyserRef.current.disconnect();
      } catch (e) {
        // Ignore disconnect errors
      }
      analyserRef.current = null;
    }
    
    if (gainNodeRef.current) {
      try {
        gainNodeRef.current.disconnect();
      } catch (e) {
        // Ignore disconnect errors
      }
      gainNodeRef.current = null;
    }
    
    try {
      // Create AudioContext
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        console.warn('Web Audio API not supported');
        return false;
      }
      
      // Create new context if needed
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new AudioContextClass();
      }
      
      // Create analyser node
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.8;
      
      // Create data array for frequency data
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
      
      // Create a gain node to ensure audio passes through
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.gain.value = 1.0; // Full volume
      
      // Connect audio element to analyser
      // Note: createMediaElementSource can only be called once per audio element
      // If the audio element is already connected, this will throw an error
      // It disconnects the audio element from its default output
      // Check if audio element is already connected by trying to create source
      try {
        sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
      } catch (error: any) {
        // If error is about already connected, we can't use Web Audio API for this element
        if (error.message && error.message.includes('already connected')) {
          console.warn('Audio element already connected, skipping Web Audio API setup');
          // Cleanup what we created
          if (analyserRef.current) {
            try { analyserRef.current.disconnect(); } catch (e) {}
            analyserRef.current = null;
          }
          if (gainNodeRef.current) {
            try { gainNodeRef.current.disconnect(); } catch (e) {}
            gainNodeRef.current = null;
          }
          return false;
        }
        throw error; // Re-throw if it's a different error
      }
      
      // Connect source to analyser (for analysis)
      sourceNodeRef.current.connect(analyserRef.current);
      
      // Connect analyser to gain node
      analyserRef.current.connect(gainNodeRef.current);
      
      // Connect gain node to destination (this ensures audio plays)
      gainNodeRef.current.connect(audioContextRef.current.destination);
      
      return true;
    } catch (error) {
      console.error('Error setting up audio analysis:', error);
      // Cleanup on error
      if (sourceNodeRef.current) {
        try {
          sourceNodeRef.current.disconnect();
        } catch (e) {
          // Ignore disconnect errors
        }
        sourceNodeRef.current = null;
      }
      if (analyserRef.current) {
        try {
          analyserRef.current.disconnect();
        } catch (e) {
          // Ignore disconnect errors
        }
        analyserRef.current = null;
      }
      if (gainNodeRef.current) {
        try {
          gainNodeRef.current.disconnect();
        } catch (e) {
          // Ignore disconnect errors
        }
        gainNodeRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
      audioContextRef.current = null;
      dataArrayRef.current = null;
      return false;
    }
  };

  const analyzeAudioLevels = () => {
    if (!analyserRef.current || !dataArrayRef.current) return;
    
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    
    // Calculate average volume
    let sum = 0;
    for (let i = 0; i < dataArrayRef.current.length; i++) {
      sum += dataArrayRef.current[i];
    }
    const average = sum / dataArrayRef.current.length;
    
    // Threshold: if average is above 10, there's sound (adjust as needed)
    const threshold = 10;
    setIsAudioActive(average > threshold);
    
    // Continue analyzing if audio is playing
    if (audioRef.current && !audioRef.current.paused && !audioRef.current.ended) {
      animationFrameRef.current = requestAnimationFrame(analyzeAudioLevels);
    }
  };

  const handlePlay = async () => {
    if (!audioRef.current || isPlaying) return; // Disable if already playing
    
    if (hasPlayed && !isPlaying) {
      // If segment was already played and not currently playing
      // Check if audio is paused (not ended) to resume, or ended to restart
      const isPaused = audioRef.current.paused && !audioRef.current.ended;
      
      if (isPaused) {
        // Resume from paused position
        try {
          // Resume audio context if suspended
          if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
          }
          
          // Resume playback from current position
          await audioRef.current.play();
          setIsPlaying(true);
          
          // Start analyzing audio levels if analyser exists
          if (analyserRef.current) {
            analyzeAudioLevels();
          } else {
            setIsAudioActive(true); // Fallback glow
          }
          updateAudioProgress();
        } catch (error) {
          console.error('Error resuming audio:', error);
          toast.error('Failed to resume audio. Please try again.');
        }
        return; // Exit early to avoid incrementing repeat count
      }
      
      // Audio ended or at start - restart and increment repeat count
      // Increment repeat count for current segment
      setRepeatCounts((prev) => ({
        ...prev,
        [currentIndex]: (prev[currentIndex] || 0) + 1,
      }));
      
      try {
        // Resume audio context if suspended
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        
        // Reset and play audio
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
        setIsPlaying(true);
        setAudioProgress(0);
        
        // Start analyzing audio levels if analyser exists
        if (analyserRef.current) {
          analyzeAudioLevels();
        } else {
          setIsAudioActive(true); // Fallback glow
        }
        updateAudioProgress();
      } catch (error) {
        console.error('Error replaying audio:', error);
        toast.error('Failed to replay audio. Please try again.');
      }
    } else {
      // First time playing - setup audio analysis
      let analysisSetup = false;
      try {
        // Always try to setup since audio element is recreated with key prop
        analysisSetup = setupAudioAnalysis();
        
        // Resume audio context if suspended (required for audio to play)
        if (audioContextRef.current) {
          if (audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
          }
          // Ensure context is running
          if (audioContextRef.current.state !== 'running') {
            await audioContextRef.current.resume();
          }
        }
      } catch (analysisError) {
        console.warn('Audio analysis setup failed, audio will play without analysis:', analysisError);
        analysisSetup = false;
        // Cleanup failed analysis setup
        if (audioContextRef.current) {
          try {
            if (audioContextRef.current.state !== 'closed') {
              await audioContextRef.current.close();
            }
          } catch (e) {
            // Ignore close errors
          }
          audioContextRef.current = null;
          analyserRef.current = null;
          sourceNodeRef.current = null;
          gainNodeRef.current = null;
          dataArrayRef.current = null;
        }
      }
      
      // Play audio (this should work regardless of analysis setup)
      try {
        // If analysis failed, the audio element should still work normally
        await audioRef.current.play();
        setIsPlaying(true);
        
        // Start analyzing audio levels if analysis is available
        if (analysisSetup && analyserRef.current && audioContextRef.current?.state === 'running') {
          analyzeAudioLevels();
        } else {
          // If no analysis available, just show glow when playing
          setIsAudioActive(true);
        }
        updateAudioProgress();
      } catch (error) {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
        setIsAudioActive(false);
        toast.error('Failed to play audio. Please try again.');
      }
    }
  };

  const handleRepeat = async () => {
    if (!audioRef.current || !hasPlayed) return;
    
    // Increment repeat count for current segment
    setRepeatCounts((prev) => ({
      ...prev,
      [currentIndex]: (prev[currentIndex] || 0) + 1,
    }));
    
    try {
      // Setup audio analysis if not already done
      if (!audioContextRef.current) {
        setupAudioAnalysis();
      }
      
      // Resume audio context if suspended
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
      setIsPlaying(true);
      setAudioProgress(0);
      
      // Start analyzing audio levels
      if (analyserRef.current) {
        analyzeAudioLevels();
      }
      updateAudioProgress();
    } catch (error) {
      console.error('Error repeating audio:', error);
      toast.error('Failed to replay audio. Please try again.');
    }
  };

  const handleNext = () => {
    if (currentIndex < segments.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const updateAudioProgress = () => {
    if (!audioRef.current) return;
    
    const update = () => {
      if (audioRef.current) {
        const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setAudioProgress(isNaN(progress) ? 0 : progress);
        
        if (!audioRef.current.paused) {
          animationFrameRef.current = requestAnimationFrame(update);
        }
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(update);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setIsAudioActive(false);
    setHasPlayed(true);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setAudioProgress(0);
    
    // Don't cleanup audio context - keep it for reuse
    // Only cleanup if we're changing segments
  };

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setAudioProgress(isNaN(progress) ? 0 : progress);
    }
  };

  const handleAudioPlay = async () => {
    setIsPlaying(true);
    // Setup audio analysis if not already done
    if (!audioContextRef.current) {
      setupAudioAnalysis();
    }
    // Resume audio context if suspended
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      try {
        await audioContextRef.current.resume();
      } catch (error) {
        console.error('Error resuming audio context:', error);
      }
    }
    // Start analyzing audio levels
    if (analyserRef.current) {
      analyzeAudioLevels();
    }
  };

  const handleAudioPause = () => {
    setIsPlaying(false);
    setIsAudioActive(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const currentSegment = segments[currentIndex];
  const isEnglishSegment = currentSegment?.type === 'english';
  const isInterpretedSegment = currentSegment?.type === 'interpreted';
  const audioUrl = isEnglishSegment 
    ? (currentSegment as EnglishSegment).audioUrl 
    : isInterpretedSegment 
    ? (currentSegment as InterpretedSegmentItem).audioUrl 
    : null;


  const handleCloseModal = () => {
    setShowPremiumModal(false);
    router.push(ROUTES.DASHBOARD.DIALOGS);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#e3e5e6] to-[#ede0b0] dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900">
      <PremiumAccessModal
        isOpen={showPremiumModal}
        onClose={handleCloseModal}
        dialogTitle={dialogTitle}
      />
      
      {!showPremiumModal && (
        <div className="max-w-6xl mx-auto p-6 pt-20">
          <div className="mb-6">
            <Link
              href={ROUTES.DASHBOARD.DIALOGS}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-4 inline-flex items-center -ml-4"
            >
              <span className="mr-2">←</span> Back to Dialogs
            </Link>
            {dialogTitle && (
              <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mt-4">
                {dialogTitle}
              </h1>
            )}
          </div>
          
          {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="ml-4 text-secondary-600 dark:text-secondary-400">
              Loading segments...
            </p>
          </div>
        ) : error ? (
          <div className="card p-6 text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={loadSegments}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : segments.length === 0 ? (
          <div className="card p-6 text-center">
            <p className="text-secondary-600 dark:text-secondary-400">
              No segments available for this dialog at the moment.
            </p>
          </div>
        ) : currentSegment ? (
          <div className="card bg-white/60 dark:bg-secondary-800/60 backdrop-blur-sm p-4 rounded-2xl w-full h-full min-h-[70vh] flex items-center justify-center relative">
            <div className="flex flex-col items-center justify-center w-full">
              {/* Progress Indicator - At the top */}
              <div className="mb-6 text-sm font-medium text-secondary-600 dark:text-secondary-300">
                Segment {currentIndex + 1} of {segments.length}
              </div>

              {/* Animated Ball */}
              <div className="relative mb-8">
              <div
                className={`w-48 h-48 rounded-full transition-all duration-500 ${
                  isAudioActive
                    ? 'bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 shadow-2xl shadow-primary-500/50 scale-110'
                    : 'bg-gradient-to-br from-primary-200 via-primary-300 to-primary-400 shadow-lg scale-100'
                }`}
                style={{
                  animation: isAudioActive ? 'pulse-glow 2s ease-in-out infinite' : 'none',
                }}
              >
                {/* Glow effect only when audio is actively playing */}
                {isAudioActive && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-primary-400 opacity-30 animate-ping"></div>
                    <div className="absolute inset-0 rounded-full bg-primary-300 opacity-20 animate-pulse"></div>
                  </>
                )}
              </div>
              <style jsx>{`
                @keyframes pulse-glow {
                  0%, 100% {
                    box-shadow: 0 0 30px rgba(245, 158, 11, 0.6), 0 0 60px rgba(245, 158, 11, 0.4), 0 0 90px rgba(245, 158, 11, 0.2);
                  }
                  50% {
                    box-shadow: 0 0 40px rgba(245, 158, 11, 0.9), 0 0 80px rgba(245, 158, 11, 0.6), 0 0 120px rgba(245, 158, 11, 0.3);
                  }
                }
              `}</style>
            </div>

            {/* Segment Type Badge */}
            <div className="mb-4">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  isEnglishSegment
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                }`}
              >
                {isEnglishSegment ? 'English Segment' : 'Interpreted Segment'}
              </span>
            </div>

            {/* Audio Element (Hidden) - Key forces recreation for each segment */}
            {audioUrl && (
              <audio
                key={`audio-${currentSegment.id}-${currentIndex}`}
                ref={audioRef}
                src={audioUrl}
                crossOrigin="anonymous"
                onEnded={handleAudioEnded}
                onTimeUpdate={handleAudioTimeUpdate}
                onPlay={handleAudioPlay}
                onPause={handleAudioPause}
              />
            )}

            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-8 mt-8 relative">
              {/* Play Button */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handlePlay}
                  disabled={!audioUrl || isPlaying}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
                    audioUrl && !isPlaying
                      ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg hover:shadow-xl'
                      : 'bg-secondary-300 dark:bg-secondary-700 text-secondary-500 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </button>
                <span className="text-xs font-medium text-secondary-600 dark:text-secondary-400">
                  Play
                </span>
              </div>

              {/* Repeat Button */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handleRepeat}
                  disabled={!hasPlayed || !audioUrl}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
                    hasPlayed && audioUrl
                      ? 'bg-secondary-500 hover:bg-secondary-600 text-white shadow-lg hover:shadow-xl'
                      : 'bg-secondary-200 dark:bg-secondary-700 text-secondary-400 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <span className="text-xs font-medium text-secondary-600 dark:text-secondary-400">
                  Repeat
                </span>
              </div>

              {/* Hint Button - Bulb Icon */}
              <div className="relative flex flex-col items-center gap-2">
                <button
                  onClick={() => setIsTextExpanded(!isTextExpanded)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isTextExpanded
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg hover:shadow-xl'
                      : 'bg-yellow-100 dark:bg-yellow-900/50 hover:bg-yellow-200 dark:hover:bg-yellow-900 text-yellow-600 dark:text-yellow-400 shadow-md hover:shadow-lg'
                  }`}
                  aria-label="Show segment text hint"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z"/>
                  </svg>
                </button>
                <span className="text-xs font-medium text-secondary-600 dark:text-secondary-400">
                  Hint
                </span>
                
                {/* Hint Text - Expands horizontally from button */}
                {isTextExpanded && (
                  <div className="absolute left-full top-0 ml-4 w-80 max-w-[calc(100vw-8rem)] z-10 animate-slide-right">
                    <div className="card p-4 bg-white/95 dark:bg-secondary-800/95 backdrop-blur-md shadow-xl border border-primary-200 dark:border-primary-800 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
                          Segment Text
                        </span>
                        <button
                          onClick={() => setIsTextExpanded(false)}
                          className="text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors"
                          aria-label="Close hint"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-secondary-900 dark:text-white text-sm leading-relaxed">
                        {isEnglishSegment
                          ? (currentSegment as EnglishSegment).segmentText
                          : (currentSegment as InterpretedSegmentItem).segmentText}
                      </p>
                    </div>
                    {/* Arrow pointing left */}
                    <div className="absolute left-0 top-7 -translate-x-2 w-4 h-4 bg-white/95 dark:bg-secondary-800/95 border-l border-b border-primary-200 dark:border-primary-800 rotate-45"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Repeat Count Display */}
            {repeatCounts[currentIndex] > 0 && (
              <div className="mt-4 text-center">
                <span className="text-sm text-secondary-600 dark:text-secondary-400">
                  Repeated <span className="font-semibold text-primary-600 dark:text-primary-400">{repeatCounts[currentIndex]}</span> {repeatCounts[currentIndex] === 1 ? 'time' : 'times'}
                </span>
              </div>
            )}

            {/* Back Button - Positioned absolutely on the left, vertically centered */}
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
                currentIndex > 0
                  ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-secondary-200 dark:bg-secondary-700 text-secondary-400 cursor-not-allowed'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Button - Positioned absolutely on the right, vertically centered */}
            <button
              onClick={handleNext}
              disabled={currentIndex >= segments.length - 1}
              className={`absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
                currentIndex < segments.length - 1
                  ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-secondary-200 dark:bg-secondary-700 text-secondary-400 cursor-not-allowed'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            </div>
          </div>
        ) : null}
        </div>
      )}
    </div>
  );
}
