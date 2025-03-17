'use client';
import { ArrowRight } from 'lucide-react';

export default function RequestTypeCard({ type, onClick }) {
  return (
    <div 
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
      onClick={onClick}
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-4`}>
        <div className="text-white">
          {type.icon}
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{type.title}</h3>
      <p className="text-gray-600 mb-4">{type.description}</p>
      
      <button className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 group">
        Select
        <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
      </button>
    </div>
  );
} 