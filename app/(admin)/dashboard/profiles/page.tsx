"use client"

import { Profile } from "@/lib/types/profiles";
import { ProfilesQuery } from "@/lib/queries/profiles"
import React, { useEffect, useMemo, useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import GestionListe from "@/components/gestion-liste";
import ProfileTable from "@/components/profiles/Profile-table";
import ConfirmationModal from "@/components/confirmation-modal";
import ProfileForm from "@/components/profiles/Profile-form";


export default function ProfilesPage(){
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [profiles, setProfiles] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [editingProfile, setEditingProfile] = useState<any | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const fetchProfiles = async() => {
        try{
            const data = await ProfilesQuery.getAll();
            setProfiles(data);
        }catch(e){
            console.error("Erreur lors du chargement des profiles : ", e);
        }
    }

    useEffect(() =>{
        const loadData = async () => {
            fetchProfiles();
        }
        loadData();
    }, []);

    const handleDelete = async (id: string) => {
        try{
            await ProfilesQuery.delete(id);
            fetchProfiles();
        }catch(e) {
            console.error("Erreur lors de la suppression du profile : ", e);
        }
        setDeleteConfirmId(null);
    }

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width" : "calc(var(--spacing) * 72",
                    "--header-height" : "calc(var(--spacing) * 12"
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader/>
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <GestionListe<Profile>
                                titre="Liste des projets"
                                placeholderRecherche="Rechercher par titre, catégorie..."
                                items={profiles}
                                paginatedItems={profiles}
                                search={search}
                                setSearch={setSearch}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalPages={profiles.length}
                                onAddClick={() => setIsAddModalOpen(true)}
                                renderTable={() =>(
                                    <ProfileTable
                                        profiles ={profiles}
                                        onEdit={(profile) => setEditingProfile(profile)}
                                        onDelete={(id) => setDeleteConfirmId(id)}
                                    />
                                )}
                                renderCreateUpdateModal={() =>
                                    (isAddModalOpen || editingProfile) ? (
                                        <ProfileForm
                                            profile={editingProfile}
                                            onClose={() => {
                                                setIsAddModalOpen(false);
                                                setEditingProfile(null);
                                            }}
                                            onSuccess={fetchProfiles}
                                        />
                                    ) : null
                                }
                                renderDeleteConfirmModal={() => 
                                    deleteConfirmId ? (
                                        <ConfirmationModal
                                        title ="Supprimer ce profile ?"
                                        message ="Cette action est irréversible."
                                        onConfirm={() => handleDelete(deleteConfirmId)}
                                        onCancel = {() => setDeleteConfirmId(null)}
                                        />
                                    ) : null
                                }
                            />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}