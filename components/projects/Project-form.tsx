"use client";

import { Project, ProjectImage } from "@/lib/types/projects";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ProjectsQuery } from "@/lib/queries/projects";
import { CategoriesQuery } from "@/lib/queries/categories";
import { Categorie } from "@/lib/types/categories";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import TechMultiSelect from "@/components/techMulti-select";
import { MultiValue } from "react-select";

interface Props {
  project?: Project | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProjectForm({ project, onClose, onSuccess }: Props) {
  const isEdit = !!project;
  const supabase = createClient();
  type Option = {
    value: string;
    label: string;
  };

  const [techs, setTechs] = useState<Option[]>([]);

  const [formData, setFormData] = useState({
    title: project?.title || "",
    description: project?.description || "",
    category_id: project?.category_id || "",
    project_url: project?.project_url || "",
    github_url: project?.github_url || "",
    position: project?.position || 0,
    is_featured: project?.is_featured ?? true,
  });

  const [existingImages, setExistingImages] = useState<ProjectImage[]>(
    project?.project_images || []
  );
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Categorie[]>([]);

   // charger les categories au montage
  const fetchCategories = async () => {
      try {
        const data = await CategoriesQuery.getAll();
        setCategories(data);
      } catch (error) {
        console.error("Erreur lors du chargement des categories :", error);
      }
  };

  // Preview des nouvelles images
  useEffect(() => {

    document.getElementById("title")?.focus();
    const loadData = async () =>{
      fetchCategories();
    } 
    loadData();
    const urls = newImages.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    return () => urls.forEach((url) => URL.revokeObjectURL(url));

    
    
  }, [newImages]);

  useEffect(() => {
    if (project?.project_images) {
      setExistingImages(project.project_images);
    }
  }, [project]);

  useEffect(() => {
    console.log("PROJECT EDIT:", project);
    console.log("TECHS RAW:", project?.project_technologies);
    if (!project?.project_technologies) return;

    const mapped = project.project_technologies
      .filter((pt) => pt.technologies)
      .map((pt) => ({
        value: pt.technologies!.id,
        label: pt.technologies!.name,
      }));

    setTechs(mapped);
  }, [project]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Le titre est requis";
    if (!formData.category_id.trim()) newErrors.category = "La catégorie est requise";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageId: string) => {
    if (!confirm("Supprimer cette image définitivement ?")) return;

    try {
      await ProjectsQuery.deleteImage(imageId);
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer l'image");
    }
  };

  const uploadAndSaveNewImages = async (projectId: string) => {
    for (const file of newImages) {
      const cleanFileName = file.name
        .normalize("NFD") // enlève accents
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9.-]/g, "_");
      const filePath = `${projectId}/${Date.now()}-${cleanFileName}`;

      // Upload vers Storage
      const { error: uploadError } = await supabase.storage
        .from("projects")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error("Upload failed:", uploadError);
        continue;
      }

      // Récupérer l'URL publique
      const { data: urlData } = supabase.storage
        .from("projects")
        .getPublicUrl(filePath);

      // Enregistrer dans la table project_images
      await ProjectsQuery.addImage({
        project_id: projectId,
        image_url: urlData.publicUrl,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      let savedProject: Project;

      if (isEdit && project?.id) {
        savedProject = await ProjectsQuery.update(project.id, formData);
      } else {
        savedProject = await ProjectsQuery.create(formData);
      }

      // Upload des NOUVELLES images
      if (newImages.length > 0) {
        await uploadAndSaveNewImages(savedProject.id);
      }

      //technologies
      if (isEdit && project?.id) {
        await ProjectsQuery.clearTechnologies(project.id);
      }

      for (const tech of techs) {
        await ProjectsQuery.addTechnology(savedProject.id, tech.value);
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
            <Label htmlFor="category_id" className="text-xs font-medium">Catégorie *</Label>
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
                  {categories
                  .filter((cat) => cat.type === "Project")
                  .map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-red-500 text-xs">{errors.category}</p>
            )}
          </div>
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
          <Label className="text-xs font-medium mb-1 block">
            Technologies
          </Label>

          <TechMultiSelect value={techs} onChange={setTechs} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Project URL</Label>
            <Input
              value={formData.project_url}
              onChange={(e) =>
                setFormData({ ...formData, project_url: e.target.value })
              }
            />
          </div>

          <div>
            <Label className="text-xs">Github URL</Label>
            <Input
              value={formData.github_url}
              onChange={(e) =>
                setFormData({ ...formData, github_url: e.target.value })
              }
            />
          </div>
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
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_featured"
            checked={formData.is_featured}
            onChange={(e) =>
              setFormData({
                ...formData, 
                is_featured: e.target.checked,
              })
            }
            className="h-4 w-4"
          />

          <Label htmlFor="is_featured" className="text-xs font-medium">
            Projet mis en avant
          </Label>
        </div>

        {/* Images */}
        <div className="min-w-0">
          <Label htmlFor="fileInput" className="text-xs font-medium mb-2 block">Images</Label>

          <Label htmlFor="fileInput" className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:border-blue-500 transition">
            <Upload className="w-6 h-6 text-gray-400 mb-1" />
            <span className="text-xs">Ajouter</span>
            <Input
              id="fileInput"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleNewImages}
            />
          </Label>

          {previewUrls.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group rounded-lg overflow-hidden border">
                  <Image width={40} height={40} alt="" src={url} className="w-full aspect-square object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          {existingImages.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {existingImages.map((img) => (
                <div key={img.id} className="relative group rounded-lg overflow-hidden border">
                  <Image
                    src={img.image_url}
                    alt=""
                    width={200}
                    height={200}
                    className="w-full aspect-square object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img.id)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
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