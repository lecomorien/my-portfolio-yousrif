"use client";

import { SocialLinks } from "@/lib/types/social_links";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { SocialLinksQuery } from "@/lib/queries/social_links";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface Props {
  socialLink?: SocialLinks | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SocialLinkForm({ socialLink, onClose, onSuccess }: Props) {
  const isEdit = !!socialLink;

  
  const [formData, setFormData] = useState({
    href: socialLink?.href || "",
    label: socialLink?.label || "",
    position: socialLink?.position || 0,
    icon: socialLink?.icon || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Preview des nouvelles images
  useEffect(() => {
    document.getElementById("name")?.focus();
    
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.href.trim()) newErrors.href = "L'url est requis";
    if (!formData.label.trim()) newErrors.category = "Le label est requis";
    if (!formData.position) newErrors.position = "La position est requise";
    if (!formData.icon.trim()) newErrors.icon = "La valeur de l'icone est requise";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {

      if (isEdit && socialLink?.id) {
        await SocialLinksQuery.update(socialLink.id, formData);
      } else {
        await SocialLinksQuery.create(formData);
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
          {isEdit ? "Modifier le lien de communication" : "Ajouter un lien de communication"}
        </h3>
      </div>

      {/* Body scrollable */}
      <div className="p-4 sm:p-6 space-y-4 overflow-y-auto overflow-x-hidden">

        {/* Ligne titre + catégorie */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="min-w-0">
            <Label htmlFor="label" className="text-xs font-medium">Titre *</Label>
            <Input
              type="text"
              className="w-full mt-1 px-3 py-2 text-sm border rounded-lg"
              value={formData.label}
              onChange={(e) =>
                setFormData({ ...formData, label: e.target.value })
              }
            />
            {errors.label && (
              <p className="text-red-500 text-xs">{errors.label}</p>
            )}
          </div>

          <div className="min-w-0">
            <Label htmlFor="href" className="text-xs font-medium">Lien *</Label>
            <Input
              type="text"
              className="w-full mt-1 px-3 py-2 text-sm border rounded-lg"
              value={formData.href}
              onChange={(e) =>
                setFormData({ ...formData, href: e.target.value })
              }
            />
            {errors.href && (
              <p className="text-red-500 text-xs">{errors.href}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="min-w-0">
            <Label htmlFor="icon" className="text-xs font-medium">Icone *</Label>
            <Input
              type="text"
              className="w-full mt-1 px-3 py-2 text-sm border rounded-lg"
              value={formData.icon}
              onChange={(e) =>
                setFormData({ ...formData, icon: e.target.value })
              }
            />
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