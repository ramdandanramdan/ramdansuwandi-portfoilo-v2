'use client';

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import 'react-easy-crop/react-easy-crop.css';
import type { Area, Point } from 'react-easy-crop';

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to load image'));
    image.src = url;
  });
}

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas to Blob failed'));
    }, 'image/jpeg', 0.92);
  });
}

interface AspectPreset {
  label: string;
  ratio: number | undefined;
  icon: string;
}

const PRESETS: AspectPreset[] = [
  { label: 'Free', ratio: undefined, icon: '◇' },
  { label: 'Square', ratio: 1 / 1, icon: '□' },
  { label: '3:4', ratio: 3 / 4, icon: '▯' },
  { label: '4:3', ratio: 4 / 3, icon: '▭' },
  { label: '9:16', ratio: 9 / 16, icon: '▯' },
  { label: '16:9', ratio: 16 / 9, icon: '▭' },
  { label: 'A4', ratio: 1 / 1.414, icon: '📄' },
];

interface ImageCropperProps {
  imageSrc: string;
  onCancel: () => void;
  onSave: (croppedFile: File) => void;
  onSaveBatch?: (croppedFiles: File[]) => void;
  aspect?: number;
  batchFiles?: File[];
}

export default function ImageCropper({ imageSrc, onCancel, onSave, onSaveBatch, aspect: defaultAspect, batchFiles }: ImageCropperProps) {
  const [selectedPreset, setSelectedPreset] = useState<number>(
    defaultAspect ? PRESETS.findIndex((p) => p.ratio === defaultAspect) : 0,
  );
  const aspect = selectedPreset >= 0 ? PRESETS[selectedPreset]?.ratio : defaultAspect;

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState('');
  const [currentSrc, setCurrentSrc] = useState(imageSrc);
  const [currentIdx, setCurrentIdx] = useState(0);

  const totalFiles = 1 + (batchFiles?.length || 0);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const saveSingle = useCallback(async (src: string) => {
    if (!croppedAreaPixels) return null;
    const blob = await getCroppedImg(src, croppedAreaPixels);
    return new File([blob], 'cropped.jpg', { type: 'image/jpeg' });
  }, [croppedAreaPixels]);

  const handleSaveOne = async () => {
    if (!croppedAreaPixels) return;
    setSaving(true);
    try {
      setProgress('Saving...');
      const file = await saveSingle(currentSrc);
      if (file) {
        onSave(file);
        URL.revokeObjectURL(currentSrc);
      }
      if (currentIdx < totalFiles - 1) {
        const nextIdx = currentIdx + 1;
        setCurrentIdx(nextIdx);
        if (nextIdx === 0) {
          setCurrentSrc(imageSrc);
        } else {
          setCurrentSrc(URL.createObjectURL(batchFiles![nextIdx - 1]));
        }
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
      } else {
        onCancel();
      }
      setProgress('');
      setSaving(false);
    } catch {
      setSaving(false);
      setProgress('');
    }
  };

  const handleApplyAll = async () => {
    if (!croppedAreaPixels) return;
    setSaving(true);

    const srcs: string[] = [imageSrc];
    const createdUrls: string[] = [];
    if (batchFiles) {
      for (const f of batchFiles) {
        const url = URL.createObjectURL(f);
        srcs.push(url);
        createdUrls.push(url);
      }
    }

    try {
      setProgress(`Processing 0/${totalFiles}...`);
      const promises = srcs.map((src, i) =>
        getCroppedImg(src, croppedAreaPixels!).then((blob) => {
          setProgress(`Processing ${i + 1}/${totalFiles}...`);
          return new File([blob], `cropped-${i}.jpg`, { type: 'image/jpeg' });
        })
      );

      const files = await Promise.all(promises);
      if (onSaveBatch !== undefined) {
        onSaveBatch(files);
      } else {
        for (const file of files) onSave(file);
      }
      for (const url of createdUrls) URL.revokeObjectURL(url);
      setProgress('');
      onCancel();
    } catch {
      for (const url of createdUrls) URL.revokeObjectURL(url);
      setSaving(false);
      setProgress('');
    }
  };

  const isLast = currentIdx === totalFiles - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[var(--dark-card)] rounded-2xl w-full max-w-3xl overflow-hidden border border-[var(--glass-border)]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--glass-border)]">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {totalFiles > 1
                ? `Crop Image ${currentIdx + 1} of ${totalFiles}`
                : 'Crop Image'}
            </h3>
            {totalFiles > 1 && (
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Crop once or apply to all</p>
            )}
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="relative w-full" style={{ height: '400px' }}>
          <Cropper
            image={currentSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="px-6 py-4 border-t border-[var(--glass-border)] space-y-3">
          {/* Aspect ratio presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-[var(--text-secondary)] mr-1">Ratio:</span>
            {PRESETS.map((p, i) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setSelectedPreset(i);
                  setCroppedAreaPixels(null);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                  selectedPreset === i
                    ? 'bg-[var(--electric-blue)] text-black'
                    : 'text-[var(--text-secondary)] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.08)]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--text-secondary)] w-12">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-[var(--electric-blue)]"
            />
          </div>

          {progress && (
            <div className="flex items-center gap-2 text-xs text-[var(--electric-blue)]">
              <div className="w-4 h-4 border-2 border-[var(--electric-blue)] border-t-transparent rounded-full animate-spin" />
              {progress}
            </div>
          )}

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
            >
              Cancel
            </button>

            {totalFiles > 1 && (
              <button
                type="button"
                onClick={handleApplyAll}
                disabled={saving}
                className="px-4 py-2 rounded-lg text-sm border border-[var(--electric-blue)]/30 text-[var(--electric-blue)] hover:bg-[var(--electric-blue)]/10 transition-all"
              >
                {saving && progress ? progress : `Apply Crop to All (${totalFiles})`}
              </button>
            )}

            <button
              type="button"
              onClick={handleSaveOne}
              disabled={saving}
              className="btn-primary text-sm"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  {progress || 'Saving...'}
                </span>
              ) : isLast && totalFiles > 1 ? (
                'Save Last'
              ) : (
                'Save & Next'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
