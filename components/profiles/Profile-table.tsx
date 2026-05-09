"use client"; // Client component pour interactivité

import { Profile} from "@/lib/types/profiles";
import { Button } from "../ui/button";
import { IconPencil, IconTrash } from "@tabler/icons-react";

interface Props {
    profiles :Profile[];
    onEdit : (profile : Profile) => void;
    onDelete : (id : string ) => void;
}

export default function ProfileTable({profiles, onEdit, onDelete} : Props) {

  return (
    <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm text-left">
          <thead 
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:text-primary-foreground min-w-8 duration-200 ease-linear"
          >
            <tr className="border-b">
              <th className="px-4 py-2">Full name</th>
              <th className="px-4 py-2">titre</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Headline</th>
              <th className="px-4 py-2">About</th>
              <th className="px-4 py-2">Status Job</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((prof) => (
              <tr key={prof.id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{prof.full_name}</td>
                <td className="px-4 py-2">{prof.title}</td>
                <td className="px-4 py-2">{prof.email}</td>
                <td className="px-4 py-2">{prof.phone}</td>
                <td className="px-4 py-2">{prof.location}</td>
                <td className="px-4 py-2">{prof.headline}</td>
                <td className="px-4 py-2">{prof.about}</td>
                <td className="px-4 py-2">{prof.status_job}</td>
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