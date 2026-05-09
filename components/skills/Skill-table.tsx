"use client"; // Client component pour interactivité

import { Skill } from "@/lib/types/skills";
import { Button } from "../ui/button";
import { IconPencil, IconTrash } from "@tabler/icons-react";

interface Props {
    skills :Skill[];
    onEdit : (skill : Skill) => void;
    onDelete : (id : string ) => void;
}

export default function SkillTable({skills, onEdit, onDelete} : Props) {

  return (
    <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm text-left">
          <thead 
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:text-primary-foreground min-w-8 duration-200 ease-linear"
          >
            <tr className="border-b">
              <th className="px-4 py-2">Titre</th>
              <th className="px-4 py-2">Level</th>
              <th className="px-4 py-2">Catégorie</th>
              <th className="px-4 py-2">Icon</th>
              <th className="px-4 py-2">Ordre</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill) => (
              <tr key={skill.id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{skill.name}</td>
                <td className="px-4 py-2">{skill.level}</td>
                <td className="px-4 py-2">{skill.skill_categories?.title}</td>
                <td className="px-4 py-2">{skill.icon}</td>
                <td className="px-4 py-2">{skill.order}</td>
                <td className="px-4 py-2 text-right space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(skill)}>
                    <IconPencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(skill.id)}>
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