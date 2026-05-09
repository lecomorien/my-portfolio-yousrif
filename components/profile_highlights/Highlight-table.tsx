"use client"; // Client component pour interactivité

import { ProfileHighlights} from "@/lib/types/profile_highlights";
import { Button } from "../ui/button";
import { IconPencil, IconTrash } from "@tabler/icons-react";

interface Props {
    profileHighlights :ProfileHighlights[];
    onEdit : (profileHighlight : ProfileHighlights) => void;
    onDelete : (id : string ) => void;
}

export default function HighlightTable({profileHighlights, onEdit, onDelete} : Props) {

  return (
    <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm text-left">
          <thead 
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:text-primary-foreground min-w-8 duration-200 ease-linear"
          >
            <tr className="border-b">
              <th className="px-4 py-2">Icon</th>
              <th className="px-4 py-2">Text</th>
              <th className="px-4 py-2">Position</th>
              <th className="px-4 py-2">Statut</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {profileHighlights.map((prof) => (
              <tr key={prof.id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{prof.icon}</td>
                <td className="px-4 py-2">{prof.text}</td>
                <td className="px-4 py-2">{prof.position}</td>
                <td className="px-4 py-2">{prof.is_active}</td>
                <td className="px-4 py-2 text-right space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(prof)}>
                    <IconPencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(prof.id)}>
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