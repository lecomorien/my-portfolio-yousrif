"use client"

import { Skill } from "@/lib/types/skills";
import { SkillsQuery } from "@/lib/queries/skills"
import React, { useEffect, useMemo, useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import GestionListe from "@/components/gestion-liste";
import SkillTable from "@/components/skills/Skill-table";
import ConfirmationModal from "@/components/confirmation-modal";
import SkillForm from "@/components/skills/Skill-form";


export default function SkillsPage(){
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [skills, setSkills] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [editingSkill, setEditingSkill] = useState<any | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const itemsPerPage = 10;

    const fetchSkills = async() => {
        try{
            const data = await SkillsQuery.getAll();
            setSkills(data);
        }catch(e){
            console.error("Erreur lors du chargement des compétences : ", e);
        }
    }

    useEffect(() =>{
        const loadData = async () => {
            fetchSkills();
        }
        loadData();
    }, []);

    const filteredSkills = useMemo(() => {
        return skills.filter(
            (s) => 
                s.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
                s.category.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        );
    }, [skills, search]);

    const paginatedSkills = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredSkills.slice(start, start + itemsPerPage);
    }, [filteredSkills, currentPage]);

    const totalPages = Math.ceil(filteredSkills.length / itemsPerPage);

    const handleDelete = async (id: string) => {
        try{
            await SkillsQuery.delete(id);
            fetchSkills();
        }catch(e) {
            console.error("Erreur lors de la suppression du compétence : ", e);
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
                            <GestionListe<Skill>
                                titre="Liste des compétences"
                                placeholderRecherche="Rechercher par titre, catégorie..."
                                items={filteredSkills}
                                paginatedItems={paginatedSkills}
                                search={search}
                                setSearch={setSearch}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalPages={totalPages}
                                onAddClick={() => setIsAddModalOpen(true)}
                                renderTable={() =>(
                                    <SkillTable
                                        skills ={paginatedSkills}
                                        onEdit={(skill) => setEditingSkill(skill)}
                                        onDelete={(id) => setDeleteConfirmId(id)}
                                    />
                                )}
                                renderCreateUpdateModal={() =>
                                    (isAddModalOpen || editingSkill) ? (
                                        <SkillForm
                                            skill={editingSkill}
                                            onClose={() => {
                                                setIsAddModalOpen(false);
                                                setEditingSkill(null);
                                            }}
                                            onSuccess={fetchSkills}
                                        />
                                    ) : null
                                }
                                renderDeleteConfirmModal={() => 
                                    deleteConfirmId ? (
                                        <ConfirmationModal
                                        title ="Supprimer cette compétence ?"
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