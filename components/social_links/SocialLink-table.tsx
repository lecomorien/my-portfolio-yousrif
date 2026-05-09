"use client"; // Client component pour interactivité

import { SocialLinks } from "@/lib/types/social_links";
import { Button } from "../ui/button";
import { IconPencil, IconTrash } from "@tabler/icons-react";

interface Props {
    socialLinks :SocialLinks[];
    onEdit : (socialLink : SocialLinks) => void;
    onDelete : (id : string ) => void;
}

export default function SocialLinkTable({socialLinks, onEdit, onDelete} : Props) {

  return (
    <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm text-left">
          <thead 
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:text-primary-foreground min-w-8 duration-200 ease-linear"
          >
            <tr className="border-b">
              <th className="px-4 py-2">Titre</th>
              <th className="px-4 py-2">Lien</th>
              <th className="px-4 py-2">Icon</th>
              <th className="px-4 py-2">Position</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {socialLinks.map((soc_Link) => (
              <tr key={soc_Link.id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{soc_Link.label}</td>
                <td className="px-4 py-2">{soc_Link.href}</td>
                <td className="px-4 py-2">{soc_Link.icon}</td>
                <td className="px-4 py-2">{soc_Link.position}</td>
                <td className="px-4 py-2 text-right space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(soc_Link)}>
                    <IconPencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(soc_Link.id)}>
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