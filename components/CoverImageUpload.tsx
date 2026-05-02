"use client";
import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

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
        <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm group">
          <img src={value} alt="Cover" className="w-full h-48 object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-3 right-3 bg-black/70 hover:bg-black text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm transition"
          >
            Hapus
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-all"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Mengunggah...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl">🖼️</span>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Klik untuk unggah gambar sampul</p>
              <p className="text-xs text-gray-400">PNG, JPG, WebP — maks 5MB</p>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

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