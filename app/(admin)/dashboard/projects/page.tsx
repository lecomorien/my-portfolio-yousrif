"use client"

import { Project } from "@/lib/types/projects";
import { ProjectsQuery } from "@/lib/queries/projects"
import React, { useEffect, useMemo, useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import GestionListe from "@/components/gestion-liste";
import ProjectTable from "@/components/projects/Project-table";
import ConfirmationModal from "@/components/confirmation-modal";
import ProjectForm from "@/components/projects/Project-form";


export default function ProjectsPage(){
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [projects, setProjects] = useState<any/* Project */[]>([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [editingProject, setEditingProject] = useState<any/* Project */ | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const itemsPerPage = 10;

    const fetchProjects = async() => {
        try{
            const data = await ProjectsQuery.getAllAdmin();
            setProjects(data);
        }catch(e){
            console.error("Erreur lors du chargement des projets : ", e);
        }
    }

    useEffect(() =>{
        const loadData = async () => {
            fetchProjects();
        }
        loadData();
    }, []);

    const filteredProjects = useMemo(() => {
        return projects.filter(
            (s) => 
                s.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
                s.category.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        );
    }, [projects, search]);

    const paginatedProjects = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredProjects.slice(start, start + itemsPerPage);
    }, [filteredProjects, currentPage]);

    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

    const handleDelete = async (id: string) => {
        try{
            await ProjectsQuery.delete(id);
            fetchProjects();
        }catch(e) {
            console.error("Erreur lors de la suppression du projet : ", e);
        }
        setDeleteConfirmId(null);
    }

    const handleEdit = async (project: Project) => {
        const fullProject = await ProjectsQuery.getById(project.id);
        setEditingProject(fullProject);
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
                            <GestionListe<Project>
                                titre="Liste des projets"
                                placeholderRecherche="Rechercher par titre, catégorie..."
                                items={filteredProjects}
                                paginatedItems={paginatedProjects}
                                search={search}
                                setSearch={setSearch}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalPages={totalPages}
                                onAddClick={() => setIsAddModalOpen(true)}
                                renderTable={() =>(
                                    <ProjectTable
                                        projects ={paginatedProjects}
                                        onEdit={(project) => handleEdit(project)}
                                        onDelete={(id) => setDeleteConfirmId(id)}
                                    />
                                )}
                                renderCreateUpdateModal={() =>
                                    (isAddModalOpen || editingProject) ? (
                                        <ProjectForm
                                            project={editingProject}
                                            onClose={() => {
                                                setIsAddModalOpen(false);
                                                setEditingProject(null);
                                            }}
                                            onSuccess={fetchProjects}
                                        />
                                    ) : null
                                }
                                renderDeleteConfirmModal={() => 
                                    deleteConfirmId ? (
                                        <ConfirmationModal
                                        title ="Supprimer ce projet ?"
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