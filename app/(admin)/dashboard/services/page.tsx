"use client"

import { Service } from "@/lib/types/services";
import { ServicesQuery } from "@/lib/queries/services"
import React, { useEffect, useMemo, useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import GestionListe from "@/components/gestion-liste";
import ServiceTable from "@/components/services/Service-table";
import ConfirmationModal from "@/components/confirmation-modal";
import ServiceForm from "@/components/services/Service-form";


export default function ServicesPage(){
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [services, setServices] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [editingService, setEditingService] = useState<any/* Service */ | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const itemsPerPage = 10;

    const fetchServices = async() => {
        try{
            const data = await ServicesQuery.getAll();
            setServices(data);
        }catch(e){
            console.error("Erreur lors du chargement des projets : ", e);
        }
    }

    useEffect(() =>{
        const loadData = async () => {
            fetchServices();
        }
        loadData();
    }, []);

    const filteredServices = useMemo(() => {
        return services.filter(
            (s) => 
                s.title.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        );
    }, [services, search]);

    const paginatedServices = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredServices.slice(start, start + itemsPerPage);
    }, [filteredServices, currentPage]);

    const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

    const handleDelete = async (id: string) => {
        try{
            await ServicesQuery.delete(id);
            fetchServices();
        }catch(e) {
            console.error("Erreur lors de la suppression du service : ", e);
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
                            <GestionListe<Service>
                                titre="Liste des projets"
                                placeholderRecherche="Rechercher par titre..."
                                items={filteredServices}
                                paginatedItems={paginatedServices}
                                search={search}
                                setSearch={setSearch}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalPages={totalPages}
                                onAddClick={() => setIsAddModalOpen(true)}
                                renderTable={() =>(
                                    <ServiceTable
                                        services ={paginatedServices}
                                        onEdit={(service) => setEditingService(service)}
                                        onDelete={(id) => setDeleteConfirmId(id)}
                                    />
                                )}
                                renderCreateUpdateModal={() =>
                                    (isAddModalOpen || editingService) ? (
                                        <ServiceForm
                                            service={editingService}
                                            onClose={() => {
                                                setIsAddModalOpen(false);
                                                setEditingService(null);
                                            }}
                                            onSuccess={fetchServices}
                                        />
                                    ) : null
                                }
                                renderDeleteConfirmModal={() => 
                                    deleteConfirmId ? (
                                        <ConfirmationModal
                                        title ="Supprimer ce service ?"
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