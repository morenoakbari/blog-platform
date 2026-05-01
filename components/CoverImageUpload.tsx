"use client";
import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

type Props = {
  value: string;
  onChange: (url: string) => void;
};

export default function CoverImageUpload({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File terlalu besar. Maksimal 5MB.");
      return;
    }

    setUploading(true);
    setError("");

    const ext = file.name.split(".").pop();
    const fileName = `cover-${Date.now()}.${ext}`;

    const { data, error: uploadError } = await supabase.storage
      .from("covers")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      setError("Gagal upload. Coba lagi.");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("covers").getPublicUrl(data.path);
    onChange(urlData.publicUrl);
    setUploading(false);
  };

  const handleRemove = () => {
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-gray-200">
          <img src={value} alt="Cover" className="w-full h-48 object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-md hover:bg-black transition-colors"
          >
            Remove
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-5 h-5 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
              <p className="text-sm text-gray-400">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <p className="text-2xl">🖼️</p>
              <p className="text-sm font-medium text-gray-600">Click to upload cover image</p>
              <p className="text-xs text-gray-300">PNG, JPG, WebP — max 5MB</p>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}