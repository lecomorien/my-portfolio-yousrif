"use client";

import { Navlinks} from "@/lib/types/navlinks";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { NavlinksQuery } from "@/lib/queries/navlinks";
import { Label } from "../ui/label";

interface Props {
  navlinks?: Navlinks | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NavlinksForm({ navlinks, onClose, onSuccess }: Props) {
  const isEdit = !!navlinks;

  const [formData, setFormData] = useState({
    label: navlinks?.label || "",
    url: navlinks?.url || "",
    is_active: navlinks?.is_active ?? true,
    position: navlinks?.position ?? 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.getElementById("label")?.focus();
    
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.label.trim()) newErrors.title = "Le titre est requis";
    if (!formData.url.trim()) newErrors.category = "L'url est requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {

      if (isEdit && navlinks?.id) {
        await NavlinksQuery.update(navlinks.id, formData);
      } else {
        await NavlinksQuery.create(formData);
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
          {isEdit ? "Modifier le projet" : "Ajouter un projet"}
        </h3>
      </div>

      {/* Body scrollable */}
      <div className="p-4 sm:p-6 space-y-4 overflow-y-auto overflow-x-hidden">

        {/* Ligne titre + catégorie */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="min-w-0">
            <Label htmlFor="label" className="text-xs font-medium">Titre *</Label>
            <input
              type="text"
              className="w-full mt-1 px-3 py-2 text-sm border rounded-lg"
              value={formData.label}
              onChange={(e) =>
                setFormData({ ...formData, label: e.target.value })
              }
            />
            {errors.title && (
              <p className="text-red-500 text-xs">{errors.label}</p>
            )}
          </div>

          <div className="min-w-0">
            <Label htmlFor="url" className="text-xs font-medium">Url *</Label>
            <input
              type="text"
              className="w-full mt-1 px-3 py-2 text-sm border rounded-lg"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
            />
            {errors.title && (
              <p className="text-red-500 text-xs">{errors.url}</p>
            )}
          </div>
        </div>

        {/* Description */}
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

          <div className="min-w-0">
            <Label htmlFor="position" className="text-xs font-medium">Position </Label>
            <input
              type="text"
              className="w-full mt-1 px-3 py-2 text-sm border rounded-lg"
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: Number(e.target.value) })
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