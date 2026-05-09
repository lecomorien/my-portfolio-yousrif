"use client";

import { Skill } from "@/lib/types/skills";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { SkillsQuery } from "@/lib/queries/skills";
import { SkillCategoriesQuery } from "@/lib/queries/skill_categories";
import { SkillCategories } from "@/lib/types/skill_categories";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";

interface Props {
  skill?: Skill | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SkilltForm({ skill, onClose, onSuccess }: Props) {
  const isEdit = !!skill;

  const [formData, setFormData] = useState({
    name: skill?.name || "",
    level: skill?.level || 0,
    category_id: skill?.category_id || "",
    icon: skill?.icon || "",
    order: skill?.order ?? 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [skill_categories, setSkillCategories] = useState<SkillCategories[]>([]);

   // charger les categories au montage
  const fetchSkillCategories = async () => {
      try {
        const data = await SkillCategoriesQuery.getAll();
        setSkillCategories(data);
      } catch (error) {
        console.error("Erreur lors du chargement des categories pour les skills :", error);
      }
  };

  // Preview des nouvelles images
  useEffect(() => {
    document.getElementById("name")?.focus();
    const loadData = async () =>{
      fetchSkillCategories();
    } 
    loadData();
    
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Le titre est requis";
    if (!formData.category_id) newErrors.category = "La catégorie est requise";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {

      if (isEdit && skill?.id) {
        await SkillsQuery.update(skill.id, formData);
      } else {
        await SkillsQuery.create(formData);
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
            <Label htmlFor="name" className="text-xs font-medium">Titre *</Label>
            <Input
              type="text"
              className="w-full mt-1 px-3 py-2 text-sm border rounded-lg"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            {errors.title && (
              <p className="text-red-500 text-xs">{errors.name}</p>
            )}
          </div>

          <div className="min-w-0">
            <Label htmlFor="level" className="text-xs font-medium">Niveau *</Label>
            <Input
              type="text"
              className="w-full mt-1 px-3 py-2 text-sm border rounded-lg"
              value={formData.level}
              onChange={(e) =>
                setFormData({ ...formData, level: Number(e.target.value) })
              }
            />
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
            <Label htmlFor="category" className="text-xs font-medium">Catégorie *</Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) =>
                setFormData({ ...formData, category_id: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez une catégorie" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  {skill_categories
                  .map((skill_cat) => (
                    <SelectItem key={skill_cat.id} value={skill_cat.id}>
                      {skill_cat.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-red-500 text-xs">{errors.category}</p>
            )}
          </div>
          <div className="min-w-0">
            <Label htmlFor="icon" className="text-xs font-medium">Ordre</Label>
            <Input
              type="text"
              className="w-full mt-1 px-3 py-2 text-sm border rounded-lg"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order:Number(e.target.value) })
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