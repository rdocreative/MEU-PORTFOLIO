"use client";

import React from 'react';
import ProjectCard from './ProjectCard';

const PROJECTS = [
  {
    title: "E-commerce Premium",
    description: "Uma plataforma completa de vendas com foco em performance e experiência do usuário mobile-first.",
    tags: ["React", "Next.js", "Stripe"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Fintech Dashboard",
    description: "Visualização de dados complexos de forma simples e intuitiva para gestão financeira.",
    tags: ["TypeScript", "Recharts", "Tailwind"],
    image: "https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "AI Social Platform",
    description: "Rede social integrada com modelos de IA para geração de conteúdo dinâmico.",
    tags: ["OpenAI", "Node.js", "React"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"
  }
];

const Projects = () => {
  return (
    <section id="projects" className="py-24 px-4 container mx-auto">
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Projetos em Destaque</h2>
        <p className="text-muted-foreground">Uma seleção de trabalhos recentes que demonstram meu processo criativo.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PROJECTS.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
    </section>
  );
};

export default Projects;