import type { CategoryConfig } from '../types/category';
export function SelectionValue({ category, ids }: { category: CategoryConfig; ids: string[] }) {
  return <span className="selection-value">{ids.map((id, index) => {
    const option = category.options.find(item => item.id === id);
    return option ? <span className="value-item" key={`${id}-${index}`}>
      {index > 0 && <span className="multiply">×</span>}
      {option.swatch && <i className="swatch" style={{ background: option.swatch }} />}{option.label}
    </span> : null;
  })}</span>;
}
