// src/components/bento/BentoGrid.jsx
// Asymmetric bento grid wrapper. Children (BentoCard) opt into spans via
// className, e.g. className="md:row-span-2".
export function BentoGrid({ children, className = "" }) {
  return (
    <div className={`grid grid-cols-1 gap-5 md:grid-cols-3 md:grid-rows-2 ${className}`}>
      {children}
    </div>
  );
}

export default BentoGrid;
