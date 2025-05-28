import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, color }) => {
  return (
    <div className="card transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className={`p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4 ${color}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default FeatureCard;