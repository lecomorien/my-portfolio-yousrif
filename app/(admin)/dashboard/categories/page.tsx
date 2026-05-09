"use client"

import { Categorie } from "@/lib/types/categories";
import { CategoriesQuery } from "@/lib/queries/categories"
import React, { useEffect, useMemo, useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import GestionListe from "@/components/gestion-liste";
import CategorieTable from "@/components/categories/Categorie-table";
import ConfirmationModal from "@/components/confirmation-modal";
import CategorieForm from "@/components/categories/Categorie-form";


export default function CategoriesPage(){
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [categories, setCategories] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [editingCategorie, setEditingCategorie] = useState<any | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const itemsPerPage = 10;

    const fetchCategories = async() => {
        try{
            const data = await CategoriesQuery.getAll();
            setCategories(data);
        }catch(e){
            console.error("Erreur lors du chargement des projets : ", e);
        }
    }

    useEffect(() =>{
        const loadData = async () => {
            fetchCategories();
        }
        loadData();
    }, []);

    const filteredCategories = useMemo(() => {
        return categories.filter(
            (s) => 
                s.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
                s.type.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        );
    }, [categories, search]);

    const paginatedCategories = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredCategories.slice(start, start + itemsPerPage);
    }, [filteredCategories, currentPage]);

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

    const handleDelete = async (id: string) => {
        try{
            await CategoriesQuery.delete(id);
            fetchCategories();
        }catch(e) {
            console.error("Erreur lors de la suppression du projet : ", e);
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
                            <GestionListe<Categorie>
                                titre="Liste des catégories"
                                placeholderRecherche="Rechercher par titre, type..."
                                items={filteredCategories}
                                paginatedItems={paginatedCategories}
                                search={search}
                                setSearch={setSearch}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalPages={totalPages}
                                onAddClick={() => setIsAddModalOpen(true)}
                                renderTable={() =>(
                                    <CategorieTable
                                        categories ={paginatedCategories}
                                        onEdit={(category) => setEditingCategorie(category)}
                                        onDelete={(id) => setDeleteConfirmId(id)}
                                    />
                                )}
                                renderCreateUpdateModal={() =>
                                    (isAddModalOpen || editingCategorie) ? (
                                        <CategorieForm
                                            category={editingCategorie}
                                            onClose={() => {
                                                setIsAddModalOpen(false);
                                                setEditingCategorie(null);
                                            }}
                                            onSuccess={fetchCategories}
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