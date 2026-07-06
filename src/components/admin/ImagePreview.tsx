"use client"

import { useState, useRef, useCallback } from "react"
import { ImageIcon } from "lucide-react"

interface PreviewItem {
  id: string
  preview: string
  name: string
}

export function ImagePreview() {
  const [previews, setPreviews] = useState<PreviewItem[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const mapped = files.map((f) => ({
      id: crypto.randomUUID(),
      preview: URL.createObjectURL(f),
      name: f.name,
    }))
    setPreviews((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.preview))
      return mapped
    })
  }, [])

  const triggerInput = useCallback(() => {
    inputRef.current?.click()
  }, [])

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        name="images"
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
      />

      {previews.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-3">
          {previews.map((p) => (
            <div key={p.id} className="h-24 w-24 overflow-hidden rounded-lg border bg-gray-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.preview}
                alt={p.name}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={triggerInput}
        className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 transition-colors hover:border-blue-400 hover:text-blue-600"
      >
        <ImageIcon className="h-4 w-4" />
        {previews.length === 0 ? "Seleccionar imágenes" : "Cambiar imágenes"}
      </button>
      <p className="mt-2 text-xs text-gray-400">JPEG, PNG o WebP. Máximo 5MB por imagen.</p>
    </div>
  )
}
