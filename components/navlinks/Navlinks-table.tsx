"use client"; // Client component pour interactivité

import { Navlinks} from "@/lib/types/navlinks";
import { Button } from "../ui/button";
import { IconPencil, IconTrash } from "@tabler/icons-react";

interface Props {
    navlinks :Navlinks[];
    onEdit : (navlink : Navlinks) => void;
    onDelete : (id : number ) => void;
}

  

  /* label text not null,
  url text not null,
  is_active boolean default true,
  position */

export default function NavlinksTable({navlinks, onEdit, onDelete} : Props) {

  return (
    <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm text-left">
          <thead 
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:text-primary-foreground min-w-8 duration-200 ease-linear"
          >
            <tr className="border-b">
              <th className="px-4 py-2">Label</th>
              <th className="px-4 py-2">Url</th>
              <th className="px-4 py-2">is_active</th>
              <th className="px-4 py-2">position</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {navlinks.map((nav) => (
              <tr key={nav.id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{nav.label}</td>
                <td className="px-4 py-2">{nav.url}</td>
                <td className="px-4 py-2">{nav.is_active}</td>
                <td className="px-4 py-2">{nav.position}</td>
                <td className="px-4 py-2 text-right space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(nav)}>
                    <IconPencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(nav.id)}>
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