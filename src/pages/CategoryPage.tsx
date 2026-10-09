import { useCallback, useState } from 'react';
import { SlotMachine } from '../components/SlotMachine';
import { drawRandom } from '../core/random';
import type { CategoryConfig } from '../types/category';
interface Props { category: CategoryConfig; saved: string[]; savedModes: Record<string, string[]>; drawCount: number; onCountChange: (count: number) => void; onConfirm: (ids: string[]) => void; onBack: () => void; onReset: () => void }
export function CategoryPage({ category, saved, savedModes, drawCount, onCountChange, onConfirm, onBack, onReset }: Props) {
  const restoreMode = (count: number) => savedModes[count] ?? (saved.length === count ? saved : []);
  const [result, setResult] = useState(() => category.preserveModeResults ? restoreMode(drawCount) : saved.length === drawCount ? saved : []);
  const [spinningIndices, setSpinningIndices] = useState<number[]>([]);
  const [spinId, setSpinId] = useState(0);
  const settle = useCallback(() => setSpinId(0), []);
  const spinning = spinId > 0;
  const effectiveMax = Math.min(category.maxDrawCount, category.allowDuplicates ? category.maxDrawCount : category.options.length);
  const shake = () => {
    setResult(drawRandom(category.options, drawCount, category.allowDuplicates).map(option => option.id));
    setSpinningIndices(Array.from({ length: drawCount }, (_, index) => index));
    setSpinId(value => value + 1);
  };
  const redrawOne = (index: number) => {
    const otherIds = result.filter((_, position) => position !== index);
    const pool = category.allowDuplicates ? category.options : category.options.filter(option => !otherIds.includes(option.id));
    const [drawn] = drawRandom(pool, 1, category.allowDuplicates);
    if (!drawn) return;
    setResult(previous => previous.map((id, position) => position === index ? drawn.id : id));
    setSpinningIndices([index]);
    setSpinId(value => value + 1);
  };
  return <>
    <nav className="page-nav"><button className="back-button" aria-label="返回" onClick={onBack}>‹ <span>返回</span></button><span>寻找搭配灵感</span><span className="nav-star">✧</span></nav>
    <header className="page-heading"><p className="eyebrow">A LITTLE SURPRISE</p><h1>{category.name}</h1><p className="subtitle">{category.description}</p></header>
    <SlotMachine options={category.options} drawCount={drawCount} result={result} spinId={spinId} spinningIndices={spinningIndices} onSettled={settle} />
    {category.allowIndividualRedraw && drawCount > 1 && result.length === drawCount && <div className="individual-redraw">{result.map((_, index) => <button key={index} className="shake-button" disabled={spinning} onClick={() => redrawOne(index)}>重抽第 {index + 1} 个</button>)}</div>}
    <p className="slot-hint">{spinning ? '灵感正在赶来的路上…' : result.length ? '这份灵感，与你的今天合拍吗？' : '轻轻一摇，邂逅你的搭配关键词'}</p>
    <div className="draw-actions">
      <button className="shake-button" disabled={spinning || category.options.length === 0} onClick={shake}><span className={spinning ? 'shake-symbol spinning' : 'shake-symbol'}>⤨</span>{spinning ? '抽取中…' : result.length ? '再摇一次' : '摇一摇'}</button>
      <button className="reset-button" onClick={() => { setSpinId(0); setSpinningIndices([]); setResult([]); onReset(); }}><span aria-hidden="true">↺</span>重置</button>
    </div>
    {effectiveMax > category.minDrawCount && <fieldset className="draw-count"><legend>抽取数量</legend><div className="segmented">{Array.from({ length: effectiveMax - category.minDrawCount + 1 }, (_, index) => category.minDrawCount + index).map(count => <button key={count} aria-pressed={drawCount === count} disabled={spinning} className={drawCount === count ? 'active' : ''} onClick={() => { if (drawCount !== count) { onCountChange(count); setResult(category.preserveModeResults ? restoreMode(count) : []); } }}>{category.drawCountLabels?.[count] ?? `${count} 项`}</button>)}</div></fieldset>}
    {category.preserveModeResults && <p className="slot-hint">双风格不分主次 · 切换模式可恢复该模式已确认的结果</p>}
    <footer className="action-area category-actions"><button className="primary" disabled={spinning || !result.length} onClick={() => onConfirm(result)}>使用这个结果 <span>✓</span></button><p>确认后加入本次搭配</p></footer>
  </>;
}
