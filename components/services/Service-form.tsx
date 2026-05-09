"use client";

import { Service } from "@/lib/types/services";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { ServicesQuery } from "@/lib/queries/services";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { SwitchField } from "../ui/switch-field";

interface Props {
  service?: Service | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ServiceForm({ service, onClose, onSuccess }: Props) {
  const isEdit = !!service;

  const [formData, setFormData] = useState({
    title: service?.title || "",
    description: service?.description || "",
    icon: service?.icon || "",
    is_active: service?.is_active || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Le titre est requis";
    if (!formData.description.trim()) newErrors.description = "Tu dois donner une description";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {

      if (isEdit && service?.id) {
        await ServicesQuery.update(service.id, formData);
      } else {
        await ServicesQuery.create(formData);
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
      className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col"
    >
      {/* Header */}
      <div className="p-4 sm:p-6 border-b shrink-0">
        <h3 className="text-lg sm:text-2xl font-semibold">
          {isEdit ? "Modifier la catégorie" : "Ajouter une catégorie"}
        </h3>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-6 space-y-4 overflow-y-auto overflow-x-hidden">

        {/* Titre */}
        <div className="min-w-0">
          <Label className="text-xs font-medium">Titre *</Label>
          <Input
            type="text"
            className="w-full mt-1 px-3 py-2 text-sm rounded-lg"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          {errors.title && (
            <p className="text-red-500 text-xs">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div className="min-w-0">
          <Label className="text-xs font-medium">Description *</Label>
          <Textarea
            className="w-full mt-1 px-3 py-2 text-sm rounded-lg h-24 resize-none"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          {errors.description && (
            <p className="text-red-500 text-xs">{errors.description}</p>
          )}
        </div>

        {/* Icon + Switch */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
          <div className="min-w-0">
            <Label className="text-xs font-medium">Icon</Label>
            <Input
              type="text"
              className="w-full mt-1 px-3 py-2 text-sm rounded-lg"
              value={formData.icon}
              onChange={(e) =>
                setFormData({ ...formData, icon: e.target.value })
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

      {/* Footer */}
      <div className="p-4 sm:p-6 border-t flex justify-end gap-3 shrink-0">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "..." : isEdit ? "Modifier" : "Ajouter"}
        </Button>
      </div>
    </form>
  </div>
);
}