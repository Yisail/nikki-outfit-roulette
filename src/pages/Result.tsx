import { categories } from '../config/categories';
import { SelectionValue } from '../components/SelectionValue';
import type { Selection } from '../types/selection';
export function Result({ selection, onBack }: { selection: Selection; onBack: () => void }) {
  return <>
    <nav className="page-nav"><button className="back-button" aria-label="返回首页" onClick={onBack}>‹ <span>返回首页</span></button><span>灵感已就绪</span><span className="nav-star">✧</span></nav>
    <header className="page-heading result-heading"><div className="result-emblem">✶</div><p className="eyebrow">YOUR OUTFIT CHALLENGE</p><h1>今日搭配挑战</h1><p className="subtitle">让这几个关键词，开启一套新搭配。</p></header>
    <section className="result-ticket"><div className="ticket-label">本次灵感组合 <span>✧</span></div>{categories.filter(category => selection[category.id]?.length).map(category => <div className="result-row" key={category.id}><span className="result-category">{category.icon} &nbsp; {category.name}</span><SelectionValue category={category} ids={selection[category.id]} /></div>)}<div className="ticket-bottom">由一点随机，变成你的独一无二。</div></section>
    <footer className="action-area"><button className="primary" onClick={onBack}>返回首页 <span>↶</span></button><p>返回首页将清空本轮结果，开始新一轮搭配</p></footer>
    <div className="future-note"><span>✧</span><p>衣橱里的下一份惊喜<small>根据条件随机搭配 · 留待未来版本</small></p></div>
  </>;
}
