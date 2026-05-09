"use client"

import { ProfileHighlights } from "@/lib/types/profile_highlights";
import { ProfileHighlightsQuery } from "@/lib/queries/profile_highlights"
import { ProfilesQuery } from "@/lib/queries/profiles"
import React, { useEffect, useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import GestionListe from "@/components/gestion-liste";
import HighlightTable from "@/components/profile_highlights/Highlight-table";
import ConfirmationModal from "@/components/confirmation-modal";
import HighlightForm from "@/components/profile_highlights/Highlight-form";


export default function HighlightsPage(){
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [highlight, setHighlight] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [editingHighlight, setEditingHighlight] = useState<any | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [profileId, setProfileId] = useState<string >();

    const fetchHighlights = async() => {
        try{
            const data = await ProfileHighlightsQuery.getAll();
            setHighlight(data);
        }catch(e){
            console.error("Erreur lors du chargement des navs : ", e);
        }
    }

    useEffect(() =>{
        const loadData = async () => {
            fetchHighlights();
        }
        loadData();
        const loadProfile = async () => {
        const profile = await ProfilesQuery.getFirst(); // à créer
            setProfileId(profile.id);
        };
        loadProfile();
    }, []);

    const handleDelete = async (id: string) => {
        try{
            await ProfileHighlightsQuery.delete(id);
            fetchHighlights();
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
                            <GestionListe<ProfileHighlights>
                                titre="Liste des highlights"
                                placeholderRecherche="Rechercher par titre, catégorie..."
                                items={highlight}
                                paginatedItems={highlight}
                                search={search}
                                setSearch={setSearch}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalPages={highlight.length}
                                onAddClick={() => setIsAddModalOpen(true)}
                                renderTable={() =>(
                                    <HighlightTable
                                        profileHighlights ={highlight}
                                        onEdit={(project) => setEditingHighlight(project)}
                                        onDelete={(id) => setDeleteConfirmId(id)}
                                    />
                                )}
                                renderCreateUpdateModal={() =>
                                    (isAddModalOpen || editingHighlight) ? (
                                        <HighlightForm
                                            profileHighlights={editingHighlight}
                                            profileId={profileId || ""}
                                            onClose={() => {
                                                setIsAddModalOpen(false);
                                                setEditingHighlight(null);
                                            }}
                                            onSuccess={fetchHighlights}
                                        />
                                    ) : null
                                }
                                renderDeleteConfirmModal={() => 
                                    deleteConfirmId ? (
                                        <ConfirmationModal
                                        title ="Supprimer ce highlight ?"
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