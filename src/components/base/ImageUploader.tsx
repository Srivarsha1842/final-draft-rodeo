import { useRef, useState, useCallback } from 'react';

interface ImageUploaderProps {
  /** Current image URLs (data URLs or remote) */
  images: string[];
  onChange: (images: string[]) => void;
  label?: string;
  /** Allow uploading multiple files at once */
  multiple?: boolean;
  /** Aspect ratio hint to show in UI */
  aspectHint?: string;
}

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
const ACCEPTED_EXTENSIONS = '.png,.jpg,.jpeg,.webp,.svg';
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ImageUploader({
  images,
  onChange,
  label = 'Photos',
  multiple = true,
  aspectHint,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const list = images.length > 0 ? images : [];

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files);
    const newErrors: string[] = [];
    const valid: string[] = [];

    for (const file of arr) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        newErrors.push(`"${file.name}" — unsupported format. Use PNG, JPG, WebP or SVG.`);
        continue;
      }
      if (file.size > MAX_SIZE_BYTES) {
        newErrors.push(`"${file.name}" — exceeds ${MAX_SIZE_MB}MB limit.`);
        continue;
      }
      const dataUrl = await fileToDataUrl(file);
      valid.push(dataUrl);
    }

    setErrors(newErrors);
    if (valid.length > 0) {
      onChange(multiple ? [...list, ...valid] : [valid[0]]);
    }
  }, [list, multiple, onChange]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const remove = (idx: number) => onChange(list.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-stone-700">{label}</h4>
          <p className="text-xs text-stone-400 mt-0.5">
            Accepted: PNG, JPG, WebP, SVG &nbsp;·&nbsp; Max {MAX_SIZE_MB}MB per file
            {aspectHint && <> &nbsp;·&nbsp; {aspectHint}</>}
          </p>
        </div>
        {multiple && list.length > 0 && (
          <span className="text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">{list.length} file{list.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all ${
          dragging
            ? 'border-amber-400 bg-amber-50'
            : 'border-stone-200 hover:border-stone-400 hover:bg-stone-50'
        }`}
      >
        <div className="w-10 h-10 flex items-center justify-center bg-stone-100 rounded-xl">
          <i className="ri-upload-cloud-2-line text-stone-400 text-xl" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-stone-700">
            {dragging ? 'Drop files here' : 'Click to upload or drag & drop'}
          </p>
          <p className="text-xs text-stone-400 mt-0.5">PNG, JPG, WebP, SVG — max {MAX_SIZE_MB}MB each</p>
          {multiple && <p className="text-xs text-amber-600 mt-1 font-medium">You can select multiple files at once</p>}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS}
          multiple={multiple}
          onChange={onFileChange}
          className="hidden"
        />
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((err, i) => (
            <p key={i} className="flex items-start gap-1.5 text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
              <i className="ri-error-warning-line shrink-0 mt-0.5" />
              {err}
            </p>
          ))}
        </div>
      )}

      {/* Preview grid */}
      {list.length > 0 && (
        <div className={`grid gap-2 ${multiple ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5' : 'grid-cols-1'}`}>
          {list.map((src, idx) => (
            <div key={idx} className="relative group rounded-xl overflow-hidden bg-stone-100 border border-stone-200" style={{ aspectRatio: multiple ? '1 / 1' : '16 / 9' }}>
              {src.startsWith('data:image/svg') ? (
                <img src={src} alt="" className="w-full h-full object-contain p-2" />
              ) : (
                <img src={src} alt="" className="w-full h-full object-cover object-top" />
              )}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); remove(idx); }}
                className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <i className="ri-close-line text-xs" />
              </button>
              {idx === 0 && multiple && (
                <span className="absolute bottom-1 left-1 text-xs bg-stone-900/70 text-white px-1.5 py-0.5 rounded-md">Cover</span>
              )}
            </div>
          ))}
          {/* Add more */}
          {multiple && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex flex-col items-center justify-center border-2 border-dashed border-stone-200 rounded-xl hover:border-amber-400 hover:bg-amber-50 transition-all cursor-pointer"
              style={{ aspectRatio: '1 / 1' }}
            >
              <i className="ri-add-line text-stone-400 text-xl" />
              <span className="text-xs text-stone-400 mt-0.5">Add more</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
