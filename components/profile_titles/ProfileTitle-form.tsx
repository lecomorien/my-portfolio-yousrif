"use client";

import { ProfileTitle } from "@/lib/types/profile_titles";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ProfileTitlesQuery } from "@/lib/queries/profile_titles";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { SwitchField } from "../ui/switch-field";

interface Props {
  profileTitle?: ProfileTitle | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProfileTitleForm({ profileTitle, onClose, onSuccess }: Props) {
  const isEdit = !!profileTitle;

  const [formData, setFormData] = useState({
    title: profileTitle?.title || "",
    position: profileTitle?.position || 0,
    is_active: profileTitle?.is_active ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Preview des nouvelles images
  useEffect(() => {
    document.getElementById("name")?.focus();
    
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.href = "Le titre est requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {

      if (isEdit && profileTitle?.id) {
        await ProfileTitlesQuery.update(profileTitle.id, formData);
      } else {
        await ProfileTitlesQuery.create(formData);
      }

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
      className="
        bg-white rounded-2xl w-full max-w-lg shadow-2xl
        max-h-[90vh] flex flex-col
      "
    >

      {/* Header */}
      <div className="p-4 sm:p-6 border-b shrink-0">
        <h3 className="text-lg sm:text-2xl font-semibold">
          {isEdit ? "Modifier le job actuel" : "Ajouter un job actuel"}
        </h3>
      </div>

      {/* Body scrollable */}
      <div className="p-4 sm:p-6 space-y-4 overflow-y-auto overflow-x-hidden">

        {/* Ligne titre + catégorie */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="min-w-0">
            <Label htmlFor="title" className="text-xs font-medium">Titre *</Label>
            <Input
              type="text"
              className="w-full mt-1 px-3 py-2 text-sm border rounded-lg"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            {errors.title && (
              <p className="text-red-500 text-xs">{errors.title}</p>
            )}
          </div>

          <div className="min-w-0">
            <Label htmlFor="position" className="text-xs font-medium">Position</Label>
            <Input
              type="text"
              className="w-full mt-1 px-3 py-2 text-sm border rounded-lg"
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: Number(e.target.value) })
              }
            />
          </div>
          <SwitchField
                      label="Actif"
                      checked={formData.is_active}
                      onChange={(value) =>
                        setFormData({ ...formData, is_active: value })
                      }
                    />
        </div>
        
      </div>

      {/* Footer fixé */}
      <div className="p-4 sm:p-6 border-t flex justify-end gap-3 shrink-0">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit">
          {isLoading ? "..." : isEdit ? "Modifier" : "Ajouter"}
        </Button>
      </div>
    </form>
  </div>
);
}