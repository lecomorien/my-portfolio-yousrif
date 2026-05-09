"use client"; // Client component pour interactivité

import { SkillCategories } from "@/lib/types/skill_categories";
import { Button } from "../ui/button";
import { IconPencil, IconTrash } from "@tabler/icons-react";

interface Props {
    skill_categories : SkillCategories[];
    onEdit : (skill_category : SkillCategories) => void;
    onDelete : (id : string ) => void;
}

export default function CategorieSkillTable({skill_categories, onEdit, onDelete} : Props) {

  return (
    <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm text-left">
          <thead 
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:text-primary-foreground min-w-8 duration-200 ease-linear"
          >
            <tr className="border-b">
              <th className="px-4 py-2">Titre</th>
              <th className="px-4 py-2">Ordre</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {skill_categories.map((skill_cat) => (
              <tr key={skill_cat.id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{skill_cat.title}</td>
                <td className="px-4 py-2">{skill_cat.order}</td>
                <td className="px-4 py-2 text-right space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(skill_cat)}>
                    <IconPencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(skill_cat.id)}>
                    <IconTrash className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
}