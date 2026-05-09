"use client"
import SectionHeading from '@/components/Helper/SectionHeading'
import { SkillCategories } from '@/lib/types/skill_categories'
import { SkillCategoriesQuery } from '@/lib/queries/skill_categories'
import React, { useEffect, useState } from 'react'

const Skills = () => {
    const [skill_categories, setSkillCategories] = useState<SkillCategories[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimate(true);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchSkillCategories = async () => {
            try {
            const data = await SkillCategoriesQuery.getAll();
            setSkillCategories(data);
            } catch (error) {
            console.error("Erreur chargement:", error);
            }
        };

        fetchSkillCategories();
    }, []);
    

    const filteredSkillCategories = skill_categories.filter(skill_cat =>
        activeCategory === "all" ||
        skill_cat.title?.toLowerCase() === activeCategory
    );
    const filteredSkills = filteredSkillCategories.flatMap(cat => cat.skills);
    
    return (
        <div id="skills" className='py-16 bg-gray-100 dark:bg-gray-950'>

            <SectionHeading
                title_1='Technical'
                title_2='skills'
                description="Technologies I've been working with recently"
            />

            {/* CONTAINER */}
            <div className="space-y-12 w-[80%] mx-auto">


                {/* CATEGORIES */}
                <div 
                    data-aos="fade-up"
                    data-aos-delay="100"
                    className="flex flex-wrap justify-center gap-4 mb-12"
                >
                    {["all", ...skill_categories.map(cat => cat.title.toLowerCase())].map((category) => (
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

                {/* FLATTEN + FILTER SKILLS */}
                {/* CONTENT */}
                {filteredSkills.length === 0 ? (
                    <div
                        data-aos="fade-up"
                        ta-aos-delay="200" 
                        className="text-center text-muted-foreground py-20"
                    >
                        <p className="text-lg font-medium">
                            No skills found for this category
                        </p>
                        <p className="text-sm mt-2">
                            Try another category or come back later.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                        {filteredSkills
                        .map((skill, index) => (
                            <div
                                key={index}
                                data-aos="fade-up"
                                data-aos-delay={index * 80}
                                data-aos-duration="600"
                                data-aos-once="true"
                                data-aos-anchor-placement="top-bottom"
                                className="group relative p-[1px] rounded-xl bg-gradient-to-br from-purple-600/30 to-transparent hover:from-purple-600/60 transition-all duration-300"
                            >
                                <div className="bg-card dark:bg-gray-900 rounded-xl p-5 h-full">

                                    {/* HEADER */}
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-base tracking-wide">
                                            {skill.name}
                                        </h3>

                                        <span className="text-xs font-medium text-muted-foreground group-hover:text-purple-500 transition">
                                            {skill.level}%
                                        </span>
                                    </div>

                                    {/* PROGRESS */}
                                    <div className="relative w-full h-2 rounded-full bg-secondary/40 overflow-hidden">

                                        {/* Glow */}
                                        <div
                                            className="absolute inset-0 blur-sm opacity-40 bg-purple-700"
                                            style={{
                                                transform: animate ? `scaleX(${skill.level / 100})` : "scaleX(0)"
                                            }}
                                        />

                                        {/* Bar */}
                                        <div
                                            className="relative h-2 rounded-full bg-purple-700 transition-all duration-700"
                                            style={{ width: animate ? `${skill.level}%` : "0%" }}
                                        />
                                    </div>

                                </div>
                            </div>
                        ))}

                    </div>
                )}
            </div>
         </div>
    );

}

export default Skills
