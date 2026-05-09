"use client"

import { ProfileStats } from "@/lib/types/profile_stats";
import { ProfileStatsQuery } from "@/lib/queries/profile_stats"
import { ProfilesQuery } from "@/lib/queries/profiles"
import React, { useEffect, useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import GestionListe from "@/components/gestion-liste";
import StatsTable from "@/components/profile_stats/Stats-table";
import ConfirmationModal from "@/components/confirmation-modal";
import StatsForm from "@/components/profile_stats/Stats-form";


export default function HighlightsPage(){
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [stat, setStat] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [editingStat, setEditingStat] = useState<any | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [profileId, setProfileId] = useState<string >();

    const fetchStats = async() => {
        try{
            const data = await ProfileStatsQuery.getAll();
            setStat(data);
        }catch(e){
            console.error("Erreur lors du chargement : ", e);
        }
    }

    useEffect(() =>{
        const loadData = async () => {
            fetchStats();
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
            await ProfileStatsQuery.delete(id);
            fetchStats();
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
                            <GestionListe<ProfileStats>
                                titre="Liste des stats"
                                placeholderRecherche="Rechercher par titre, catégorie..."
                                items={stat}
                                paginatedItems={stat}
                                search={search}
                                setSearch={setSearch}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalPages={stat.length}
                                onAddClick={() => setIsAddModalOpen(true)}
                                renderTable={() =>(
                                    <StatsTable
                                        profileStats ={stat}
                                        onEdit={(stat) => setEditingStat(stat)}
                                        onDelete={(id) => setDeleteConfirmId(id)}
                                    />
                                )}
                                renderCreateUpdateModal={() =>
                                    (isAddModalOpen || editingStat) ? (
                                        <StatsForm
                                            profileStats={editingStat}
                                            profileId={profileId || ""}
                                            onClose={() => {
                                                setIsAddModalOpen(false);
                                                setEditingStat(null);
                                            }}
                                            onSuccess={fetchStats}
                                        />
                                    ) : null
                                }
                                renderDeleteConfirmModal={() => 
                                    deleteConfirmId ? (
                                        <ConfirmationModal
                                        title ="Supprimer ce stat ?"
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