"use client"; // Client component pour interactivité

import { ProfileStats} from "@/lib/types/profile_stats";
import { Button } from "../ui/button";
import { IconPencil, IconTrash } from "@tabler/icons-react";

interface Props {
    profileStats :ProfileStats[];
    onEdit : (profileStat : ProfileStats) => void;
    onDelete : (id : string ) => void;
}

export default function StatsTable({profileStats, onEdit, onDelete} : Props) {

  return (
    <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm text-left">
          <thead 
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:text-primary-foreground min-w-8 duration-200 ease-linear"
          >
            <tr className="border-b">
              <th className="px-4 py-2">Label</th>
              <th className="px-4 py-2">Valeur</th>
              <th className="px-4 py-2">Position</th>
              <th className="px-4 py-2">Statut</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {profileStats.map((stat) => (
              <tr key={stat.id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{stat.label}</td>
                <td className="px-4 py-2">{stat.value}</td>
                <td className="px-4 py-2">{stat.position}</td>
                <td className="px-4 py-2">{stat.is_active}</td>
                <td className="px-4 py-2 text-right space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(stat)}>
                    <IconPencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(stat.id)}>
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