"use client"; // Client component pour interactivité

import { Experience} from "@/lib/types/experience";
import { Button } from "../ui/button";
import { IconPencil, IconTrash } from "@tabler/icons-react";

interface Props {
    experiences :Experience[];
    onEdit : (experience : Experience) => void;
    onDelete : (id : string ) => void;
}

export default function ExperienceTable({experiences, onEdit, onDelete} : Props) {

  return (
    <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm text-left">
          <thead 
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:text-primary-foreground min-w-8 duration-200 ease-linear"
          >
            <tr className="border-b">
              <th className="px-4 py-2">Titre</th>
              <th className="px-4 py-2">Société</th>
              <th className="px-4 py-2">Période</th>
              {/* <th className="px-4 py-2">description</th> */}
              <th className="px-4 py-2">Position</th>
              <th className="px-4 py-2">Ordre</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {experiences.map((exp) => (
              <tr key={exp.id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{exp.title}</td>
                <td className="px-4 py-2">{exp.company}</td>
                <td className="px-4 py-2">{exp.period }</td>
               {/*  <td className="px-4 py-2">{exp.description }</td> */}
                <td className="px-4 py-2">{exp.position }</td>
                <td className="px-4 py-2">{exp.sort_at }</td>
                <td className="px-4 py-2 text-right space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(exp)}>
                    <IconPencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(exp.id)}>
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