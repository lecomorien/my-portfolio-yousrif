"use client";

import { ProfileStats } from "@/lib/types/profile_stats";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ProfileStatsQuery } from "@/lib/queries/profile_stats";
import { Label } from "../ui/label";

interface Props {
  profileStats?: ProfileStats | null;
  profileId: string; // IMPORTANT
  onClose: () => void;
  onSuccess: () => void;
}

export default function StatsForm({ profileStats, profileId, onClose, onSuccess }: Props) {
  const isEdit = !!profileStats;
  
    const [formData, setFormData] = useState({
      label: profileStats?.label || "",
      value: profileStats?.value || "",
      position: profileStats?.position || 0,
      is_active: profileStats?.is_active ?? true,
    });
  
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
  
  
    // Preview des nouvelles images
    useEffect(() => {
      document.getElementById("label")?.focus();
      
    }, []);
  
    const validate = () => {
      const newErrors: Record<string, string> = {};
  
      if (!formData.label.trim()) newErrors.icon = "Label requis";
      if (!formData.value.trim()) newErrors.text = "Valeur requise";
  
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;
  
      setIsLoading(true);
  
      try {
        await ProfileStatsQuery.upsertStats(
          {
            ...formData,
            profile_id: profileId,
            id: profileStats?.id,
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
              {isEdit ? "Modifier un stat" : "Ajouter un stat"}
            </h3>
          </div>
  
          {/* Body */}
          <div className="p-6 space-y-4 overflow-y-auto">
            <div>
              <Label>Label *</Label>
              <input
                id="label"
                className="w-full mt-1 px-3 py-2 border rounded-lg"
                placeholder="ex: Experience, projects..."
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
              />
              {errors.label && (
                <p className="text-red-500 text-xs">{errors.label}</p>
              )}
            </div>
  
            <div>
              <Label>Valeur *</Label>
              <input
                className="w-full mt-1 px-3 py-2 border rounded-lg"
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: e.target.value })
                }
              />
              {errors.value && (
                <p className="text-red-500 text-xs">{errors.value}</p>
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