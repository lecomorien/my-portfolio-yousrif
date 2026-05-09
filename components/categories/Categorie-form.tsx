"use client";

import { Categorie } from "@/lib/types/categories";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { CategoriesQuery } from "@/lib/queries/categories";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";

interface Props {
  category?: Categorie | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CategorieForm({ category, onClose, onSuccess }: Props) {
  const isEdit = !!category;

  const [formData, setFormData] = useState({
    title: category?.title || "",
    type: category?.type || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Le titre est requis";
    if (!formData.type.trim()) newErrors.type = "Le type est requise";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {

      if (isEdit && category?.id) {
        await CategoriesQuery.update(category.id, formData);
      } else {
        await CategoriesQuery.create(formData);
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
          {isEdit ? "Modifier la categorie pour les projets" : "Ajouter une categorie pour les projets"}
        </h3>
      </div>

      {/* Body scrollable */}
      <div className="p-4 sm:p-6 space-y-4 overflow-y-auto overflow-x-hidden">

        {/* Ligne titre + catégorie */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="min-w-0">
            <Label className="text-xs font-medium">Titre *</Label>
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
            <Label className="text-xs font-medium">Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez une type" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  
                    <SelectItem value="Project">Project</SelectItem>
                    <SelectItem value="Skill">Compétence</SelectItem>
                 
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-red-500 text-xs">{errors.type}</p>
            )}
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