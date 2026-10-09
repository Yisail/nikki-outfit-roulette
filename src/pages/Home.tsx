import { categories } from '../config/categories';
import { SelectionValue } from '../components/SelectionValue';
import type { Selection } from '../types/selection';
export function Home({ selection, navigate, finish, onResetCategory, onResetAll }: { selection: Selection; navigate: (path: string) => void; finish: () => void; onResetCategory: (id: string) => void; onResetAll: () => void }) {
  const count = categories.filter(category => selection[category.id]?.length).length;
  return <>
    <header className="home-header"><div className="brand-mark">✧</div><p className="eyebrow">NIKKI OUTFIT ROULETTE</p><h1>暖暖换装轮盘</h1><p className="subtitle">把今天的灵感，交给一点随机。</p></header>
    <section className="intro-card"><span className="intro-star">✶</span><div><h2>你的搭配，你来定义</h2><p>任选一个分类开始，灵感足够就出发。</p></div></section>
    <section className="category-section" aria-labelledby="selection-heading"><div className="section-heading"><h2 id="selection-heading">本次搭配</h2><span>{count ? `已选择 ${count} 项` : '自由选择 · 无需全选'}</span></div>
      <div className="category-list">{categories.map((category, index) => {
        const ids = selection[category.id] ?? [];
        return <div className="category-entry" key={category.id}><button className={`category-card ${ids.length ? 'selected' : ''}`} onClick={() => navigate(`/category/${category.id}`)}>
          <span className={`category-icon tone-${index % 3}`}>{category.icon}</span><span className="category-copy"><span className="category-title">{category.name}{ids.length > 0 && <span className="chosen-dot" aria-label="已选择" />}</span>
          {ids.length ? <SelectionValue category={category} ids={ids} /> : <span className="unselected">尚未选择<span className="category-description">{category.description}</span></span>}</span><span className="chevron">›</span>
        </button>{ids.length > 0 && <button className="category-reset" aria-label={`重置${category.name}`} onClick={() => onResetCategory(category.id)}>重置</button>}</div>;
      })}</div>
    </section>
    <p className="home-note">✧ &nbsp; 重新进入分类，随时换一个灵感</p>
    <footer className="action-area"><button className="primary" disabled={!count} onClick={finish}>完成搭配 <span>↗</span></button><p>{count ? '准备好了？开启你的今日搭配挑战' : '至少选择一个分类，开启搭配挑战'}</p><button className="text-button" onClick={onResetAll}>全部重置</button></footer>
    <div className="version">为每一种穿搭可能 · V1.0</div>
  </>;
}
