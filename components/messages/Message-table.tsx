"use client"; // Client component pour interactivité

import { Message} from "@/lib/types/messages";
import { Button } from "../ui/button";
import { IconPencil, IconTrash } from "@tabler/icons-react";

interface Props {
    messages :Message[];
    onEdit : (message : Message) => void;
    onDelete : (id : string ) => void;
}

export default function MessageTable({messages, onEdit, onDelete} : Props) {

  return (
    <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm text-left">
          <thead 
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:text-primary-foreground min-w-8 duration-200 ease-linear"
          >
            <tr className="border-b">
              <th className="px-4 py-2">Nom & prénom</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Objet</th>
              <th className="px-4 py-2">Message</th>
              <th className="px-4 py-2">Etat</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((mess) => (
              <tr key={mess.id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{mess.name}</td>
                <td className="px-4 py-2">{mess.email}</td>
                <td className="px-4 py-2">{mess.subject}</td>
                <td className="px-4 py-2">{mess.message}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      mess.is_read
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {mess.is_read ? "Lu" : "Pas lu"}
                  </span>
                </td>
                <td className="px-4 py-2 text-right space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(mess)}>
                    <IconPencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(mess.id)}>
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