"use client"

import { ProfileTitle } from "@/lib/types/profile_titles";
import { ProfileTitlesQuery } from "@/lib/queries/profile_titles"
import React, { useEffect, useMemo, useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import GestionListe from "@/components/gestion-liste";
import ProfileTitleTable from "@/components/profile_titles/ProfileTitle-table";
import ConfirmationModal from "@/components/confirmation-modal";
import ProfileTitleForm from "@/components/profile_titles/ProfileTitle-form";


export default function ProfileTitlePage(){
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [profileTitle, setProfileTitle] = useState<any[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [editingProfileTitle, setEditingProfileTitle] = useState<any | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const fetchProfileTitles = async() => {
        try{
            const data = await ProfileTitlesQuery.getAll();
            setProfileTitle(data);
        }catch(e){
            console.error("Erreur lors du chargement : ", e);
        }
    }

    useEffect(() =>{
        const loadData = async () => {
            fetchProfileTitles();
        }
        loadData();
    }, []);



    const handleDelete = async (id: string) => {
        try{
            await ProfileTitlesQuery.delete(id);
            fetchProfileTitles();
        }catch(e) {
            console.error("Erreur lors de la suppression : ", e);
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
                            <GestionListe<ProfileTitle>
                                titre="Liste des jobs actuels"
                                placeholderRecherche="Rechercher par titre, url..."
                                items={profileTitle}
                                paginatedItems={profileTitle}
                                search={search}
                                setSearch={setSearch}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalPages={fetchProfileTitles.length}
                                onAddClick={() => setIsAddModalOpen(true)}
                                renderTable={() =>(
                                    <ProfileTitleTable
                                        profileTitles ={profileTitle}
                                        onEdit={(soc_Link) => setEditingProfileTitle(soc_Link)}
                                        onDelete={(id) => setDeleteConfirmId(id)}
                                    />
                                )}
                                renderCreateUpdateModal={() =>
                                    (isAddModalOpen || editingProfileTitle) ? (
                                        <ProfileTitleForm
                                            profileTitle={editingProfileTitle}
                                            onClose={() => {
                                                setIsAddModalOpen(false);
                                                setEditingProfileTitle(null);
                                            }}
                                            onSuccess={fetchProfileTitles}
                                        />
                                    ) : null
                                }
                                renderDeleteConfirmModal={() => 
                                    deleteConfirmId ? (
                                        <ConfirmationModal
                                        title ="Supprimer ce job ?"
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