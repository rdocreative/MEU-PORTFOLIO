"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github } from 'lucide-react';

interface ProjectProps {
  title: string;
  description: string;
  tags: string[];
  image: string;
}

const ProjectCard = ({ title, description, tags, image }: ProjectProps) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group relative overflow-hidden rounded-3xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-xl"
    >
      <div className="aspect-video overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-2">
            {tags.map(tag => (
              <Badge key={tag} variant="secondary" className="rounded-md font-normal">{tag}</Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="text-muted-foreground hover:text-foreground transition-colors"><Github size={18} /></button>
            <button className="text-muted-foreground hover:text-foreground transition-colors"><ExternalLink size={18} /></button>
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default ProjectCard;