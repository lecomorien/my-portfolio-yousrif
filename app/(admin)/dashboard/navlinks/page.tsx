"use client"

import { Navlinks } from "@/lib/types/navlinks";
import { NavlinksQuery } from "@/lib/queries/navlinks"
import React, { useEffect, useMemo, useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import GestionListe from "@/components/gestion-liste";
import NavlinksTable from "@/components/navlinks/Navlinks-table";
import ConfirmationModal from "@/components/confirmation-modal";
import NavlinksForm from "@/components/navlinks/Navlinks-form";


export default function NavlinksPage(){
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [navlinks, setNavlinks] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [editingNavlink, setEditingNavlinks] = useState<any | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

    const itemsPerPage = 10;

    const fetchNavlinks = async() => {
        try{
            const data = await NavlinksQuery.getAll();
            setNavlinks(data);
        }catch(e){
            console.error("Erreur lors du chargement des navs : ", e);
        }
    }

    useEffect(() =>{
        const loadData = async () => {
            fetchNavlinks();
        }
        loadData();
    }, []);

    const filteredNavlinks = useMemo(() => {
        return navlinks.filter(
            (s) => 
                s.label.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        );
    }, [navlinks, search]);

    const paginatedNavlinks = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredNavlinks.slice(start, start + itemsPerPage);
    }, [filteredNavlinks, currentPage]);

    const totalPages = Math.ceil(filteredNavlinks.length / itemsPerPage);

    const handleDelete = async (id: number) => {
        try{
            await NavlinksQuery.delete(id);
            fetchNavlinks();
        }catch(e) {
            console.error("Erreur lors de la suppression du nav : ", e);
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
                            <GestionListe<Navlinks>
                                titre="Liste des projets"
                                placeholderRecherche="Rechercher par titre, catégorie..."
                                items={filteredNavlinks}
                                paginatedItems={paginatedNavlinks}
                                search={search}
                                setSearch={setSearch}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalPages={totalPages}
                                onAddClick={() => setIsAddModalOpen(true)}
                                renderTable={() =>(
                                    <NavlinksTable
                                        navlinks ={paginatedNavlinks}
                                        onEdit={(project) => setEditingNavlinks(project)}
                                        onDelete={(id) => setDeleteConfirmId(id)}
                                    />
                                )}
                                renderCreateUpdateModal={() =>
                                    (isAddModalOpen || editingNavlink) ? (
                                        <NavlinksForm
                                            navlinks={editingNavlink}
                                            onClose={() => {
                                                setIsAddModalOpen(false);
                                                setEditingNavlinks(null);
                                            }}
                                            onSuccess={fetchNavlinks}
                                        />
                                    ) : null
                                }
                                renderDeleteConfirmModal={() => 
                                    deleteConfirmId ? (
                                        <ConfirmationModal
                                        title ="Supprimer ce nav ?"
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