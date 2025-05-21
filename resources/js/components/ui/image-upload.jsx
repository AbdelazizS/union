import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export function ImageUpload({ value, onChange, disabled, className }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          onChange(reader.result);
        };
        reader.readAsDataURL(file);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".bmp", ".tiff", ".ico"],
    },
    maxFiles: 1,
    disabled,
  });

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange("");
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed rounded-lg p-4 transition-colors",
        isDragActive ? "border-primary" : "border-muted-foreground/25",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <input {...getInputProps()} />
      {value ? (
        <div className="relative aspect-video">
          <img
            src={value}
            alt="Upload"
            className="object-cover w-full h-full rounded-lg"
          />
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 py-8 cursor-pointer">
          <ImagePlus className="h-10 w-10 text-muted-foreground" />
          <div className="text-sm text-muted-foreground text-center">
            {isDragActive ? (
              <p>Drop the image here</p>
            ) : (
              <p>Drag & drop an image, or click to select</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 