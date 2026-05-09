"use client";

import { Message } from "@/lib/types/messages";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { MessagesQuery } from "@/lib/queries/messages";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { SwitchField } from "../ui/switch-field";

interface Props {
  message?: Message | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MessageForm({ message, onClose, onSuccess }: Props) {
  const isEdit = !!message;

  const [formData, setFormData] = useState({
    name: message?.name || "",
    email: message?.email || "",
    subject: message?.subject || "",
    message: message?.message || "",
    is_read: message?.is_read || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Le nom et prénom sont requis";
    if (!formData.email.trim()) newErrors.description = "L'email est requis";
    if (!formData.subject.trim()) newErrors.title = "L'objet est requis";
    if (!formData.message.trim()) newErrors.message = "Le message est requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {

      if (isEdit && message?.id) {
        await MessagesQuery.update(message.id, formData);
      } else {
        await MessagesQuery.create(formData);
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

        {/* Nom et prénom */}
        <div className="min-w-0">
          <Label className="text-xs font-medium">Nom et prénom *</Label>
          <Input
            type="text"
            className="w-full mt-1 px-3 py-2 text-sm rounded-lg"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name}</p>
          )}
        </div>

        {/* email */}
        <div className="min-w-0">
          <Label className="text-xs font-medium">Email *</Label>
          <Textarea
            className="w-full mt-1 px-3 py-2 text-sm rounded-lg h-24 resize-none"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email}</p>
          )}
        </div>

        {/* Icon + Switch */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
          <div className="min-w-0">
            <Label className="text-xs font-medium">Objet</Label>
            <Input
              type="text"
              className="w-full mt-1 px-3 py-2 text-sm rounded-lg"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
            />
            {errors.subject && (
              <p className="text-red-500 text-xs">{errors.subject}</p>
            )}
          </div>
          <div className="min-w-0">
            <Label className="text-xs font-medium">Message</Label>
            <Input
              type="text"
              className="w-full mt-1 px-3 py-2 text-sm rounded-lg"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            />
            {errors.message && (
              <p className="text-red-500 text-xs">{errors.message}</p>
            )}
          </div>

          <SwitchField
            label="Lu"
            checked={formData.is_read}
            onChange={(value) =>
              setFormData({ ...formData, is_read: value })
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