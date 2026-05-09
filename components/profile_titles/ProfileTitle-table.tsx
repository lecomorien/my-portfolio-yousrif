"use client"; // Client component pour interactivité

import { ProfileTitle } from "@/lib/types/profile_titles";
import { Button } from "../ui/button";
import { IconPencil, IconTrash } from "@tabler/icons-react";

interface Props {
    profileTitles :ProfileTitle[];
    onEdit : (profileTitle : ProfileTitle) => void;
    onDelete : (id : string ) => void;
}

export default function ProfileTitleTable({profileTitles, onEdit, onDelete} : Props) {

  return (
    <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm text-left">
          <thead 
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:text-primary-foreground min-w-8 duration-200 ease-linear"
          >
            <tr className="border-b">
              <th className="px-4 py-2">Titre</th>
              <th className="px-4 py-2">Position</th>
              <th className="px-4 py-2">is_active</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {profileTitles.map((prof_Title) => (
              <tr key={prof_Title.id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{prof_Title.title}</td>
                <td className="px-4 py-2">{prof_Title.position}</td>
                <td className="px-4 py-2">{prof_Title.is_active}</td>
                <td className="px-4 py-2 text-right space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(prof_Title)}>
                    <IconPencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(prof_Title.id)}>
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