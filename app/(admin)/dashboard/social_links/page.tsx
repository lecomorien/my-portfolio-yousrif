"use client"

import { SocialLinks } from "@/lib/types/social_links";
import { SocialLinksQuery } from "@/lib/queries/social_links"
import React, { useEffect, useMemo, useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import GestionListe from "@/components/gestion-liste";
import SocialLinkTable from "@/components/social_links/SocialLink-table";
import ConfirmationModal from "@/components/confirmation-modal";
import SocialLinkForm from "@/components/social_links/SocialLink-form";


export default function SocialLinkPage(){
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [socialLink, setSocialLink] = useState<any[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [editingSocialLink, setEditingSocialLink] = useState<any | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const fetchSocialLinks = async() => {
        try{
            const data = await SocialLinksQuery.getAll();
            setSocialLink(data);
        }catch(e){
            console.error("Erreur lors du chargement : ", e);
        }
    }

    useEffect(() =>{
        const loadData = async () => {
            fetchSocialLinks();
        }
        loadData();
    }, []);

    const filteredSocialLinks = useMemo(() => {
        return socialLink.filter(
            (s) => 
                s.label.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
                s.href.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        );
    }, [socialLink, search]);


    const handleDelete = async (id: string) => {
        try{
            await SocialLinksQuery.delete(id);
            fetchSocialLinks();
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
                            <GestionListe<SocialLinks>
                                titre="Liste des liens"
                                placeholderRecherche="Rechercher par titre, url..."
                                items={filteredSocialLinks}
                                paginatedItems={filteredSocialLinks}
                                search={search}
                                setSearch={setSearch}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalPages={filteredSocialLinks.length}
                                onAddClick={() => setIsAddModalOpen(true)}
                                renderTable={() =>(
                                    <SocialLinkTable
                                        socialLinks ={filteredSocialLinks}
                                        onEdit={(soc_Link) => setEditingSocialLink(soc_Link)}
                                        onDelete={(id) => setDeleteConfirmId(id)}
                                    />
                                )}
                                renderCreateUpdateModal={() =>
                                    (isAddModalOpen || editingSocialLink) ? (
                                        <SocialLinkForm
                                            socialLink={editingSocialLink}
                                            onClose={() => {
                                                setIsAddModalOpen(false);
                                                setEditingSocialLink(null);
                                            }}
                                            onSuccess={fetchSocialLinks}
                                        />
                                    ) : null
                                }
                                renderDeleteConfirmModal={() => 
                                    deleteConfirmId ? (
                                        <ConfirmationModal
                                        title ="Supprimer ce lien ?"
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