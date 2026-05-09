"use client";

import { Profile } from "@/lib/types/profiles";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ProfilesQuery } from "@/lib/queries/profiles";
import { Label } from "../ui/label";

interface Props {
  profile?: Profile | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProfileForm({ profile, onClose, onSuccess }: Props) {
  const isEdit = !!profile;

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    title: profile?.title || "",
    bio: profile?.bio || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    location: profile?.location || "",
    headline: profile?.headline || "",
    about: profile?.about || "",
    status_job: profile?.status_job || "",
  });

  const [avatarFile, setAvatarFile] = useState<File | undefined>();
  const [cvFile, setCvFile] = useState<File | undefined>();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);


  // Preview des nouvelles images
  useEffect(() => {
    document.getElementById("full_name")?.focus();
    
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) newErrors.full_name = "Nom requis";
    if (!formData.email.trim()) newErrors.email = "Email requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      await ProfilesQuery.upsertProfile(
        {
          ...formData,
          avatar_url: profile?.avatar_url || "",
          cv_url: profile?.cv_url || "",
        },
        avatarFile,
        cvFile,
        profile?.id
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
      className="
        bg-white rounded-2xl w-full max-w-lg shadow-2xl
        max-h-[90vh] flex flex-col
      "
    >
      {/* Header */}
      <div className="p-4 sm:p-6 border-b shrink-0">
        <h3 className="text-lg sm:text-2xl font-semibold">
          {isEdit ? "Modifier le profil" : "Ajouter un profil"}
        </h3>
      </div>

      {/* Body scrollable */}
      <div className="p-6 space-y-4 overflow-y-auto">

          <div>
            <Label>Nom complet *</Label>
            <input
              className="w-full mt-1 px-3 py-2 border rounded-lg"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
            />
            {errors.full_name && <p className="text-red-500 text-xs">{errors.full_name}</p>}
          </div>

          <div>
            <Label>Titre</Label>
            <input
              className="w-full mt-1 px-3 py-2 border rounded-lg"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Bio</Label>
            <textarea
              className="w-full mt-1 px-3 py-2 border rounded-lg"
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Email *</Label>
            <input
              type="email"
              className="w-full mt-1 px-3 py-2 border rounded-lg"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>

          <div>
            <Label>Téléphone</Label>
            <input
              className="w-full mt-1 px-3 py-2 border rounded-lg"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Localisation</Label>
            <input
              className="w-full mt-1 px-3 py-2 border rounded-lg"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Headline</Label>
            <input
              className="w-full mt-1 px-3 py-2 border rounded-lg"
              value={formData.headline}
              onChange={(e) =>
                setFormData({ ...formData, headline: e.target.value })
              }
            />
          </div>
          <div>
            <Label>About</Label>
            <textarea
              className="w-full mt-1 px-3 py-2 border rounded-lg"
              value={formData.about}
              onChange={(e) =>
                setFormData({ ...formData, about: e.target.value })
              }
            />
          </div> 
          <div>
            <Label>Status Job</Label>
            <input
              className="w-full mt-1 px-3 py-2 border rounded-lg"
              value={formData.status_job}
              onChange={(e) =>
                setFormData({ ...formData, status_job: e.target.value })
              }
            />
          </div>

          {/* Avatar */}
          <div>
            <Label>Avatar</Label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files?.[0])}
            />
          </div>

          {/* CV */}
          <div>
            <Label>CV</Label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setCvFile(e.target.files?.[0])}
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