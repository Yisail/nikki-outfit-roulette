import { useEffect, useState } from 'react';
import type { CategoryOption } from '../types/category';
const ROW_HEIGHT = 76;
const SPIN_DURATION = 1300;
const STOP_GAP = 220;
interface Props { options: CategoryOption[]; drawCount: number; result: string[]; spinId: number; spinningIndices?: number[]; onSettled: () => void }
function Reel({ options, target, spinning, index }: { options: CategoryOption[]; target?: string; spinning: boolean; index: number }) {
  const [moving, setMoving] = useState(false);
  useEffect(() => {
    if (!spinning) return;
    // 先绘制初始位置，再启动 transition，避免首次抽取直接跳到终点。
    let nextFrame = 0;
    const frame = requestAnimationFrame(() => {
      nextFrame = requestAnimationFrame(() => setMoving(true));
    });
    return () => { cancelAnimationFrame(frame); cancelAnimationFrame(nextFrame); };
  }, [spinning]);
  const selected = options.find(option => option.id === target);
  // 展示序列固定循环；最终项由外部 Random Engine 决定。
  const items = spinning ? [...Array.from({ length: 20 }, (_, i) => options[(i + index * 3) % options.length]), selected].filter((item): item is CategoryOption => Boolean(item)) : [];
  return <div className="reel-window" aria-hidden="true">
    {spinning ? <div className="reel-strip" style={{
      transform: `translateY(-${moving ? (items.length - 1) * ROW_HEIGHT : 0}px)`,
      transition: moving ? `transform ${SPIN_DURATION + index * STOP_GAP}ms cubic-bezier(.12,.62,.15,1)` : 'none',
    }}>{items.map((item, i) => <div className="reel-item" key={i}>{item.swatch && <i className="slot-swatch" style={{ background: item.swatch }} />}<span>{item.label}</span></div>)}</div>
      : <div className="reel-item">{selected?.swatch && <i className="slot-swatch" style={{ background: selected.swatch }} />}<span>{selected?.label ?? '？'}</span></div>}
  </div>;
}
export function SlotMachine({ options, drawCount, result, spinId, spinningIndices, onSettled }: Props) {
  const spinning = spinId > 0;
  useEffect(() => {
    if (!spinning) return;
    const timer = window.setTimeout(onSettled, SPIN_DURATION + (drawCount - 1) * STOP_GAP + 160);
    return () => window.clearTimeout(timer);
  }, [spinId, spinning, drawCount, onSettled]);
  return <div className="slot-machine" aria-busy={spinning}>
    <div className="slot-top"><span /> INSPIRATION MACHINE <span /></div>
    <div className="reels">{Array.from({ length: drawCount }, (_, index) => {
      const reelSpinning = spinning && (!spinningIndices || spinningIndices.includes(index));
      return <Reel key={`${reelSpinning ? spinId : 0}-${index}`} options={options} target={result[index]} spinning={reelSpinning} index={index} />;
    })}</div>
    <div className="slot-bottom">✦ <span>一点随机，无限灵感</span> ✦</div>
    <span className="sr-only" role="status">{spinning ? '正在抽取' : result.length ? result.map(id => options.find(option => option.id === id)?.label).join(' × ') : '尚未抽取'}</span>
  </div>;
}
