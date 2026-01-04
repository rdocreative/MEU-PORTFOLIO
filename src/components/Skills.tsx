"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Palette, Globe, Zap, Database, Smartphone } from 'lucide-react';

const SKILLS = [
  { name: "Frontend", icon: <Code2 size={24} />, description: "React, Next.js, Vue" },
  { name: "Design UI/UX", icon: <Palette size={24} />, description: "Figma, Tailwind, Framer" },
  { name: "Backend", icon: <Database size={24} />, description: "Node.js, PostgreSQL, Prisma" },
  { name: "Web Hosting", icon: <Globe size={24} />, description: "Vercel, AWS, Docker" },
  { name: "Performance", icon: <Zap size={24} />, description: "Optimization, Core Web Vitals" },
  { name: "Mobile", icon: <Smartphone size={24} />, description: "React Native, Expo" },
];

const Skills = () => {
  return (
    <section id="skills" className="py-24 bg-muted/30 px-4">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Habilidades & Especialidades</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Construo soluções ponta a ponta utilizando as tecnologias mais modernas do mercado.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKILLS.map((skill, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="p-8 rounded-3xl bg-background border hover:border-primary/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                {skill.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{skill.name}</h3>
              <p className="text-muted-foreground">{skill.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;