import React from 'react';

/**
 * A reusable card component with a title and content area.
 * @param {string} title - The title to display at the top of the card.
 * @param {React.ReactNode} children - The content to render inside the card.
 */
const Card = ({ title, children }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
      <div>
        {children}
      </div>
    </div>
  );
};

export default Card;
