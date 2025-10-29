import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Video,
  Camera,
  Upload,
  Play,
  Pause,
  RotateCcw,
  Send,
  Sparkles,
  Eye,
  EyeOff,
  Hash,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

const vibeSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters').max(280, 'Description must be less than 280 characters'),
  mood: z.string().min(1, 'Please select a mood'),
  tags: z.array(z.string()).min(1, 'Please add at least one tag'),
  isPrivate: z.boolean(),
  shareToCircles: z.array(z.string()),
});

type VibeFormData = z.infer<typeof vibeSchema>;

const moodOptions = [
  { value: 'excited', label: 'Excited', emoji: '🎉' },
  { value: 'peaceful', label: 'Peaceful', emoji: '🧘' },
  { value: 'creative', label: 'Creative', emoji: '🎨' },
  { value: 'adventurous', label: 'Adventurous', emoji: '🌟' },
  { value: 'thoughtful', label: 'Thoughtful', emoji: '💭' },
  { value: 'happy', label: 'Happy', emoji: '😊' },
  { value: 'motivated', label: 'Motivated', emoji: '🚀' },
  { value: 'curious', label: 'Curious', emoji: '🔍' },
];

const aiPrompts = [
  "What's something you learned today that excited you?",
  "Share a hobby or skill you're passionate about.",
  "What does friendship mean to you?",
  "Describe your ideal weekend adventure.",
  "What's a value that's important to you and why?",
  "Share something you're grateful for right now.",
  "What's a goal you're working toward?",
  "Describe a place that makes you feel peaceful.",
];

export function CreateVibe() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [step, setStep] = useState<'record' | 'preview' | 'details'>('record');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState(aiPrompts[0]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [tagInput, setTagInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    getValues,
  } = useForm<VibeFormData>({
    resolver: zodResolver(vibeSchema),
    defaultValues: {
      description: '',
      mood: '',
      tags: [],
      isPrivate: false,
      shareToCircles: [],
    },
  });

  const watchedTags = watch('tags');
  const watchedMood = watch('mood');

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 720, height: 1280, facingMode: 'user' },
        audio: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      addNotification({
        userId: user!.id,
        type: 'like',
        message: 'Unable to access camera. Please check permissions.',
        isRead: false,
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const startRecording = () => {
    if (!stream) return;

    chunksRef.current = [];
    mediaRecorderRef.current = new MediaRecorder(stream);
    
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setRecordedVideo(url);
      stopCamera();
      setStep('preview');
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
    
    // 15-second timer
    const timer = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 14) {
          stopRecording();
          clearInterval(timer);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingTime(0);
    }
  };

  const retakeVideo = () => {
    setRecordedVideo(null);
    setStep('record');
    startCamera();
  };

  const addTag = () => {
    if (tagInput.trim() && !watchedTags.includes(tagInput.trim())) {
      setValue('tags', [...watchedTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue('tags', watchedTags.filter(tag => tag !== tagToRemove));
  };

  const getNewPrompt = () => {
    const availablePrompts = aiPrompts.filter(prompt => prompt !== currentPrompt);
    const randomPrompt = availablePrompts[Math.floor(Math.random() * availablePrompts.length)];
    setCurrentPrompt(randomPrompt);
  };

  const onSubmit = async (data: VibeFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      addNotification({
        userId: user!.id,
        type: 'like',
        message: 'Your vibe has been shared successfully!',
        isRead: false,
      });

      navigate('/');
    } catch (error) {
      console.error('Error creating vibe:', error);
    }
  };

  React.useEffect(() => {
    if (step === 'record') {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [step]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4">
        {['record', 'preview', 'details'].map((s, index) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === s
                  ? 'bg-teal-500 text-white'
                  : index < ['record', 'preview', 'details'].indexOf(step)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              {index + 1}
            </div>
            {index < 2 && (
              <div
                className={`w-16 h-1 mx-2 ${
                  index < ['record', 'preview', 'details'].indexOf(step)
                    ? 'bg-green-500'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Record Video */}
      {step === 'record' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Create Your Vibe
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Share who you are in a 15-second authentic video
            </p>
          </div>

          {/* AI Prompt */}
          <div className="bg-gradient-to-r from-teal-500 to-orange-500 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                <span className="font-semibold">AI Prompt</span>
              </div>
              <Button variant="ghost" size="sm" onClick={getNewPrompt} className="text-white hover:bg-white/20">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-lg">{currentPrompt}</p>
          </div>

          {/* Video Preview */}
          <div className="relative">
            <div className="aspect-[9/16] max-w-sm mx-auto bg-gray-900 rounded-xl overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              
              {isRecording && (
                <div className="absolute inset-0 border-4 border-red-500 rounded-xl animate-pulse" />
              )}
              
              {isRecording && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Recording: {15 - recordingTime}s
                </div>
              )}
            </div>

            {/* Recording Controls */}
            <div className="flex justify-center mt-6">
              {!isRecording ? (
                <Button
                  onClick={startRecording}
                  variant="primary"
                  size="lg"
                  className="bg-red-500 hover:bg-red-600"
                  disabled={!stream}
                >
                  <Video className="w-5 h-5 mr-2" />
                  Start Recording
                </Button>
              ) : (
                <Button
                  onClick={stopRecording}
                  variant="primary"
                  size="lg"
                  className="bg-red-500 hover:bg-red-600"
                >
                  <Pause className="w-5 h-5 mr-2" />
                  Stop Recording
                </Button>
              )}
            </div>
          </div>

          {/* Upload Option */}
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Or upload an existing video
            </p>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Upload Video
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 2: Preview Video */}
      {step === 'preview' && recordedVideo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Preview Your Vibe
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Review your video before sharing
            </p>
          </div>

          <div className="aspect-[9/16] max-w-sm mx-auto bg-gray-900 rounded-xl overflow-hidden">
            <video
              src={recordedVideo}
              controls
              autoPlay
              loop
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={retakeVideo}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake Video
            </Button>
            <Button variant="primary" onClick={() => setStep('details')}>
              Looks Good
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Add Details */}
      {step === 'details' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Share Your Vibe
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Add some context to help people connect with you
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What's your vibe about?
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Share what makes this moment special..."
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* Mood Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                How are you feeling?
              </label>
              <div className="grid grid-cols-4 gap-2">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    type="button"
                    onClick={() => setValue('mood', mood.value)}
                    className={`p-3 rounded-lg border text-center transition-colors ${
                      watchedMood === mood.value
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-teal-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{mood.emoji}</div>
                    <div className="text-xs font-medium">{mood.label}</div>
                  </button>
                ))}
              </div>
              {errors.mood && (
                <p className="text-sm text-red-600 mt-1">{errors.mood.message}</p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Add tags to help people discover your vibe
              </label>
              <div className="flex space-x-2 mb-2">
                <div className="flex-1 relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-gray-100"
                    placeholder="Add a tag"
                  />
                </div>
                <Button type="button" onClick={addTag} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {watchedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="primary"
                    className="cursor-pointer"
                    onClick={() => removeTag(tag)}
                  >
                    #{tag} ×
                  </Badge>
                ))}
              </div>
              {errors.tags && (
                <p className="text-sm text-red-600 mt-1">{errors.tags.message}</p>
              )}
            </div>

            {/* Privacy Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('isPrivate')}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">Private Vibe</div>
                    <div className="text-sm text-gray-500">Only your friends can see this</div>
                  </div>
                </div>
                {watch('isPrivate') ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
              </div>
            </div>

            {/* Submit */}
            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setStep('preview')}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                isLoading={isSubmitting}
              >
                <Send className="w-4 h-4 mr-2" />
                Share Vibe
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}