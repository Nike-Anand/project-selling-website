import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="w-64 bg-white p-4 border-r min-h-screen">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Categories</h3>
          <div className="space-y-2">
            {['Web Development', 'AI', 'IoT', 'Cybersecurity', 'Blockchain'].map((category) => (
              <label key={category} className="flex items-center">
                <input type="checkbox" className="rounded text-indigo-600" />
                <span className="ml-2 text-sm">{category}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Price Range</h3>
          <input
            type="range"
            min="0"
            max="1000"
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>$0</span>
            <span>$1000</span>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Difficulty Level</h3>
          <div className="space-y-2">
            {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
              <label key={level} className="flex items-center">
                <input type="checkbox" className="rounded text-indigo-600" />
                <span className="ml-2 text-sm">{level}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Technologies</h3>
          <div className="space-y-2">
            {['React', 'Python', 'Java', 'Node.js', 'TypeScript'].map((tech) => (
              <label key={tech} className="flex items-center">
                <input type="checkbox" className="rounded text-indigo-600" />
                <span className="ml-2 text-sm">{tech}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}