"use client";

import { Experience } from "@/lib/types/experience";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ExperiencesQuery } from "@/lib/queries/experience";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import TechMultiSelect from "@/components/techMulti-select";

interface Props {
  experience?: Experience | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ExperienceForm({ experience, onClose, onSuccess }: Props) {
  const isEdit = !!experience;
  type Option = {
    value: string;
    label: string;
  };

  const [techs, setTechs] = useState<Option[]>([]);

  const [formData, setFormData] = useState({
    title: experience?.title || "",
    company: experience?.company || "",
    period: experience?.period || "",
    description: experience?.description || "",
    position: experience?.position || 0,
    sort_at: experience?.sort_at || 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Preview des nouvelles images
  useEffect(() => {

    document.getElementById("title")?.focus();
    
  }, []);

  useEffect(() => {
    if (!experience?.experience_technologies) return;

    const mapped = experience.experience_technologies
      .filter((et) => et.technologies)
      .map((et) => ({
        value: et.technologies!.id,
        label: et.technologies!.name,
      }));

    setTechs(mapped);
  }, [experience]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Le titre est requis";
    if (!formData.company.trim()) newErrors.company = "La compagnie est requise";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      let savedExperience: Experience;

      if (isEdit && experience?.id) {
        savedExperience = await ExperiencesQuery.update(experience.id, formData);
      } else {
        savedExperience = await ExperiencesQuery.create(formData);
      }
      //technologies
      if (isEdit && experience?.id) {
        await ExperiencesQuery.clearTechnologies(experience.id);
      }

      for (const tech of techs) {
        await ExperiencesQuery.addTechnology(savedExperience.id, tech.value);
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
          {isEdit ? "Modifier l'expérience" : "Ajouter une expérience"}
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
            <Label htmlFor="company" className="text-xs font-medium">Société *</Label>
            <Input
              type="text"
              className="w-full mt-1 px-3 py-2 text-sm border rounded-lg"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
            />
            {errors.company && (
              <p className="text-red-500 text-xs">{errors.company}</p>
            )}
          </div>
          
        </div>

        <div className="min-w-0">
            <Label htmlFor="period" className="text-xs font-medium">Periode</Label>
            <Input
              type="text"
              className="w-full mt-1 px-3 py-2 text-sm border rounded-lg"
              value={formData.period}
              onChange={(e) =>
                setFormData({ ...formData, period: e.target.value })
              }
            />
        </div>

        {/* Description */}
        <div className="min-w-0">
          <Label htmlFor="description" className="text-xs font-medium">Description</Label>
          <Textarea
            className="w-full mt-1 px-3 py-2 text-sm border rounded-lg h-20 resize-none"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>
        <div className="min-w-0">
          <Label htmlFor="position" className="text-xs font-medium">Position</Label>
          <Input
              type="number"
              className="w-full mt-1 px-3 py-2 text-sm border rounded-lg"
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: Number(e.target.value) })
              }
            />
        </div>
        <div className="min-w-0">
          <Label htmlFor="sort_at" className="text-xs font-medium">Ordre</Label>
          <Input
              type="number"
              className="w-full mt-1 px-3 py-2 text-sm border rounded-lg"
              value={formData.sort_at}
              onChange={(e) =>
                setFormData({ ...formData, sort_at: Number(e.target.value) })
              }
            />
        </div>
        <div className="min-w-0">
          <Label className="text-xs font-medium mb-1 block">
            Technologies
          </Label>

          <TechMultiSelect value={techs} onChange={setTechs} />
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