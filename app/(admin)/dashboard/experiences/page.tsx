"use client"

import { Experience } from "@/lib/types/experience";
import { ExperiencesQuery } from "@/lib/queries/experience"
import React, { useEffect, useMemo, useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import GestionListe from "@/components/gestion-liste";
import ExperienceTable from "@/components/experiences/Experience-table";
import ConfirmationModal from "@/components/confirmation-modal";
import ExperienceForm from "@/components/experiences/Experience-form";


export default function ExperiencesPage(){
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [editingExperience, setEditingExperience] = useState<any | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const itemsPerPage = 10;

    const fetchExperiences = async() => {
        try{
            const data = await ExperiencesQuery.getAll();
            setExperiences(data);
        }catch(e){
            console.error("Erreur lors du chargement des experiences : ", e);
        }
    }

    useEffect(() =>{
        const loadData = async () => {
            fetchExperiences();
        }
        loadData();
    }, []);

    const filteredExperiences = useMemo(() => {
        return experiences.filter(
            (s) => 
                s.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
                s.company.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        );
    }, [experiences, search]);

    const paginatedExperiences = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredExperiences.slice(start, start + itemsPerPage);
    }, [filteredExperiences, currentPage]);

    const totalPages = Math.ceil(filteredExperiences.length / itemsPerPage);

    const handleDelete = async (id: string) => {
        try{
            await ExperiencesQuery.delete(id);
            fetchExperiences();
        }catch(e) {
            console.error("Erreur lors de la suppression: ", e);
        }
        setDeleteConfirmId(null);
    }

    const handleEdit = async (experience: Experience) => {
        const fullExperience = await ExperiencesQuery.getById(experience.id);
        setEditingExperience(fullExperience);
    };

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
                            <GestionListe<Experience>
                                titre="Liste des experiences"
                                placeholderRecherche="Rechercher par titre, compagnie..."
                                items={filteredExperiences}
                                paginatedItems={paginatedExperiences}
                                search={search}
                                setSearch={setSearch}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalPages={totalPages}
                                onAddClick={() => setIsAddModalOpen(true)}
                                renderTable={() =>(
                                    <ExperienceTable
                                        experiences ={paginatedExperiences}
                                        onEdit={(experience) => handleEdit(experience)}
                                        onDelete={(id) => setDeleteConfirmId(id)}
                                    />
                                )}
                                renderCreateUpdateModal={() =>
                                    (isAddModalOpen || editingExperience) ? (
                                        <ExperienceForm
                                            experience={editingExperience}
                                            onClose={() => {
                                                setIsAddModalOpen(false);
                                                setEditingExperience(null);
                                            }}
                                            onSuccess={fetchExperiences}
                                        />
                                    ) : null
                                }
                                renderDeleteConfirmModal={() => 
                                    deleteConfirmId ? (
                                        <ConfirmationModal
                                        title ="Supprimer cette expérience ?"
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