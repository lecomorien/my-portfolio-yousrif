"use client";

import { ProfileHighlights } from "@/lib/types/profile_highlights";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ProfileHighlightsQuery } from "@/lib/queries/profile_highlights";
import { Label } from "../ui/label";

interface Props {
  profileHighlights?: ProfileHighlights | null;
  profileId: string; // IMPORTANT
  onClose: () => void;
  onSuccess: () => void;
}

export default function HighlightForm({ profileHighlights, profileId, onClose, onSuccess }: Props) {
  const isEdit = !!profileHighlights;

  const [formData, setFormData] = useState({
    icon: profileHighlights?.icon || "",
    text: profileHighlights?.text || "",
    position: profileHighlights?.position || 0,
    is_active: profileHighlights?.is_active ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);


  // Preview des nouvelles images
  useEffect(() => {
    document.getElementById("icon")?.focus();
    
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.icon.trim()) newErrors.icon = "Icône requise";
    if (!formData.text.trim()) newErrors.text = "Texte requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      await ProfileHighlightsQuery.upsertHighlight(
        {
          ...formData,
          profile_id: profileId,
          id: profileHighlights?.id,
        },
      );

      onSuccess();
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde :", error);
      alert(error.message || "Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b">
          <h3 className="text-lg sm:text-2xl font-semibold">
            {isEdit ? "Modifier un highlight" : "Ajouter un highlight"}
          </h3>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <Label>Icône *</Label>
            <input
              id="icon"
              className="w-full mt-1 px-3 py-2 border rounded-lg"
              placeholder="ex: map-pin, briefcase..."
              value={formData.icon}
              onChange={(e) =>
                setFormData({ ...formData, icon: e.target.value })
              }
            />
            {errors.icon && (
              <p className="text-red-500 text-xs">{errors.icon}</p>
            )}
          </div>

          <div>
            <Label>Texte *</Label>
            <input
              className="w-full mt-1 px-3 py-2 border rounded-lg"
              value={formData.text}
              onChange={(e) =>
                setFormData({ ...formData, text: e.target.value })
              }
            />
            {errors.text && (
              <p className="text-red-500 text-xs">{errors.text}</p>
            )}
          </div>

          <div>
            <Label>Position</Label>
            <input
              type="number"
              className="w-full mt-1 px-3 py-2 border rounded-lg"
              value={formData.position}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  position: Number(e.target.value),
                })
              }
            />
          </div>
          <div className="min-w-0">
                      <Label htmlFor="is_active" className="text-xs font-medium">Statut</Label>
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) =>
                          setFormData({ ...formData, is_active: e.target.checked })
                        }
                      />
                    </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit">
            {isLoading ? "..." : isEdit ? "Modifier" : "Créer"}
          </Button>
        </div>
      </form>
    </div>
  );
}