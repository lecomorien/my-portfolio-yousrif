"use client"

import { SkillCategories } from "@/lib/types/skill_categories";
import { SkillCategoriesQuery } from "@/lib/queries/skill_categories"
import React, { useEffect, useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import GestionListe from "@/components/gestion-liste";
import CategorieSkillTable from "@/components/skill_categories/Categorie-skill-table";
import ConfirmationModal from "@/components/confirmation-modal";
import CategorieSkillForm from "@/components/skill_categories/Categorie-skill-form";


export default function CategoriesPage(){
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [skill_categories, setSkillCategories] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [editingSkillCategorie, setEditingSkillCategorie] = useState<any | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const fetchSkillCategories = async() => {
        try{
            const data = await SkillCategoriesQuery.getAll();
            setSkillCategories(data);
        }catch(e){
            console.error("Erreur lors du chargement des categories pour les skills  : ", e);
        }
    }

    useEffect(() =>{
        const loadData = async () => {
            fetchSkillCategories();
        }
        loadData();
    }, []);

    const handleDelete = async (id: string) => {
        try{
            await SkillCategoriesQuery.delete(id);
            fetchSkillCategories();
        }catch(e) {
            console.error("Erreur lors de la suppression du categorie : ", e);
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
                            <GestionListe<SkillCategories>
                                titre="Liste des catégories pour les skills"
                                placeholderRecherche="Rechercher par titre, type..."
                                items={skill_categories}
                                paginatedItems={skill_categories}
                                search={search}
                                setSearch={setSearch}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalPages={skill_categories.length}
                                onAddClick={() => setIsAddModalOpen(true)}
                                renderTable={() =>(
                                    <CategorieSkillTable
                                        skill_categories ={skill_categories}
                                        onEdit={(category) => setEditingSkillCategorie(category)}
                                        onDelete={(id) => setDeleteConfirmId(id)}
                                    />
                                )}
                                renderCreateUpdateModal={() =>
                                    (isAddModalOpen || editingSkillCategorie) ? (
                                        <CategorieSkillForm
                                            category_skill={editingSkillCategorie}
                                            onClose={() => {
                                                setIsAddModalOpen(false);
                                                setEditingSkillCategorie(null);
                                            }}
                                            onSuccess={fetchSkillCategories}
                                        />
                                    ) : null
                                }
                                renderDeleteConfirmModal={() => 
                                    deleteConfirmId ? (
                                        <ConfirmationModal
                                        title ="Supprimer cette catégorie ?"
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