"use client"
import SectionHeading from '@/components/Helper/SectionHeading'
import React, { useEffect, useState } from 'react'
import { ProjectsQuery } from '@/lib/queries/projects'
import { Project } from '@/lib/types/projects'
import ProjectsCard from './Projects-card'
import { CategoriesQuery } from '@/lib/queries/categories'

const Projects = () => {

    const [projects, setProjects] = useState<Project[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [activeCategory, setActiveCategory] = useState("all");

    useEffect(() => {
        const fetchProjects = async () => {
            try{
                const data = await ProjectsQuery.getAll();
                setProjects(data);
            }catch(error) {
                console.error('Erreur chargement', error)
            }
        };
        fetchProjects();
    },[]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
            const data = await CategoriesQuery.getAll();

            // on récupère juste les noms
            const names = data.map((cat) => cat.title.toLowerCase());

            setCategories(names);
            } catch (error) {
            console.error("Erreur categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const filteredProjects = projects.filter(project =>
        activeCategory === "all" ||
        project.categories?.title?.toLowerCase() === activeCategory
    );

    const allCategories = ["all", ...categories];
    return (
        <div id="projects" className="py-16 bg-gray-100 dark:bg-gray-900"
        >
            <SectionHeading
                title_1='Features'
                title_2='Projects'
                description='A selection of my recent work and side projects'
            />
            <div className="flex flex-wrap justify-center gap-4 mb-12">
                {allCategories.map((category) => (
                    <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-5 py-2 rounded-full transition-colors duration-300 capitalize
                        ${activeCategory === category
                        ? "bg-primary text-white"
                        : "bg-secondary/70 hover:bg-secondary"
                        }`}
                    >
                    {category}
                    </button>
                ))}
            </div>
            {/* CONTENT */}
            {filteredProjects.length === 0 ? (
                <div className="text-center text-muted-foreground py-20">
                    <p className="text-lg font-medium">
                        No projects found for this category
                    </p>
                    <p className="text-sm mt-2">
                        Try another category or come back later.
                    </p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-[80%] mx-auto">
                    {filteredProjects .filter(project =>
                        activeCategory === "all" ||
                        project.categories?.title?.toLowerCase() === activeCategory
                    ).map((project, index) => {
                        const image = project.project_images?.[0]?.image_url || "/images/default.jpg";
                        const techStack = project.project_technologies
                            ?.flatMap((tech) => tech.technologies? [tech.technologies] : []) || [];
                        return (
                            <div
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                                data-aos-anchor-placement="top-center"  
                                key={project.id}
                            >
                                <ProjectsCard
                                    title={project.title}
                                    description={project.description || ""}
                                    image={image}
                                    techStack={techStack}
                                    demoUrl={project.project_url}
                                    githubUrl={project.github_url}
                                />
                            </div>
                        );
                        
                    })}
                </div>
            )}
        </div>
    )
}

export default Projects
