"use client"; // Client component pour interactivité

import { Service} from "@/lib/types/services";
import { Button } from "../ui/button";
import { IconPencil, IconTrash } from "@tabler/icons-react";

interface Props {
    services :Service[];
    onEdit : (service : Service) => void;
    onDelete : (id : string ) => void;
}

export default function ServiceTable({services, onEdit, onDelete} : Props) {

  return (
    <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm text-left">
          <thead 
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:text-primary-foreground min-w-8 duration-200 ease-linear"
          >
            <tr className="border-b">
              <th className="px-4 py-2">Titre</th>
              <th className="px-4 py-2">description</th>
              <th className="px-4 py-2">icon</th>
              <th className="px-4 py-2">Etat</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((serv) => (
              <tr key={serv.id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{serv.title}</td>
                <td className="px-4 py-2">{serv.description}</td>
                <td className="px-4 py-2">{serv.icon}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      serv.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {serv.is_active ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td className="px-4 py-2 text-right space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(serv)}>
                    <IconPencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(serv.id)}>
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