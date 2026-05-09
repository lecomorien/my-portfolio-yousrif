"use client"; // Client component pour interactivité

import { Project} from "@/lib/types/projects";
import { Button } from "../ui/button";
import { IconPencil, IconTrash } from "@tabler/icons-react";

interface Props {
    projects :Project[];
    onEdit : (project : Project) => void;
    onDelete : (id : string ) => void;
}

export default function ProjectTable({projects, onEdit, onDelete} : Props) {

  return (
    <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm text-left">
          <thead 
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:text-primary-foreground min-w-8 duration-200 ease-linear"
          >
            <tr className="border-b">
              <th className="px-4 py-2">Titre</th>
              <th className="px-4 py-2">Catégorie</th>
              <th className="px-4 py-2">Github</th>
              <th className="px-4 py-2">Position</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{p.title}</td>
                <td className="px-4 py-2">{p.categories?.title}</td>
                <td className="px-4 py-2">
                  {p.github_url ? (
                    <a href={p.github_url} target="_blank" className="text-blue-600">
                      Repo
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-2">{p.position}</td>
                <td className="px-4 py-2 text-right space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(p)}>
                    <IconPencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(p.id)}>
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