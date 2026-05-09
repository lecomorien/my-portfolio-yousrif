"use client"

import { Message } from "@/lib/types/messages";
import { MessagesQuery } from "@/lib/queries/messages"
import React, { useEffect, useMemo, useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import GestionListe from "@/components/gestion-liste";
import MessageTable from "@/components/messages/Message-table";
import ConfirmationModal from "@/components/confirmation-modal";
import MessageForm from "@/components/messages/Message-form";


export default function MessagesPage(){
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [messages, setMessages] = useState<any/* Message */[]>([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [editingMessage, setEditingMessage] = useState<any/* Message */ | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const itemsPerPage = 10;

    const fetchMessages = async() => {
        try{
            const data = await MessagesQuery.getAll();
            setMessages(data);
        }catch(e){
            console.error("Erreur lors du chargement des projets : ", e);
        }
    }

    useEffect(() =>{
        const loadData = async () => {
            fetchMessages();
        }
        loadData();
    }, []);

    const filteredMessages = useMemo(() => {
        return messages.filter(
            (s) => 
                s.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
                s.email.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        );
    }, [messages, search]);

    const paginatedMessages = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredMessages.slice(start, start + itemsPerPage);
    }, [filteredMessages, currentPage]);

    const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);

    const handleDelete = async (id: string) => {
        try{
            await MessagesQuery.delete(id);
            fetchMessages();
        }catch(e) {
            console.error("Erreur lors de la suppression du message : ", e);
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
                            <GestionListe<Message>
                                titre="Liste des message"
                                placeholderRecherche="Rechercher par nom, prénom, email..."
                                items={filteredMessages}
                                paginatedItems={paginatedMessages}
                                search={search}
                                setSearch={setSearch}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalPages={totalPages}
                                onAddClick={() => setIsAddModalOpen(true)}
                                renderTable={() =>(
                                    <MessageTable
                                        messages ={paginatedMessages}
                                        onEdit={(message) => setEditingMessage(message)}
                                        onDelete={(id) => setDeleteConfirmId(id)}
                                    />
                                )}
                                renderCreateUpdateModal={() =>
                                    (isAddModalOpen || editingMessage) ? (
                                        <MessageForm
                                            message={editingMessage}
                                            onClose={() => {
                                                setIsAddModalOpen(false);
                                                setEditingMessage(null);
                                            }}
                                            onSuccess={fetchMessages}
                                        />
                                    ) : null
                                }
                                renderDeleteConfirmModal={() => 
                                    deleteConfirmId ? (
                                        <ConfirmationModal
                                        title ="Supprimer ce message ?"
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