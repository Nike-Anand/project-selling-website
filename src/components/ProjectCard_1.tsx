import React from 'react';
import { Star, Heart } from 'lucide-react';
import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={project.previewImage}
        alt={project.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
          <button className="p-1 hover:bg-gray-100 rounded-full">
            <Heart className="h-5 w-5 text-gray-400 hover:text-red-500" />
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{project.description}</p>
        <div className="mt-2 flex items-center">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="ml-1 text-sm text-gray-600">{project.rating}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {project.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-600"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">${project.price}</span>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}