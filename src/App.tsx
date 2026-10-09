import { useEffect, useRef, useState } from 'react';
import { categories, getCategory } from './config/categories';
import { Home } from './pages/Home';
import { CategoryPage } from './pages/CategoryPage';
import { Result } from './pages/Result';
import { createInitialState, loadSelection, saveSelection } from './storage/selectionStorage';
import type { SavedState } from './types/selection';
export default function App() {
  const [state, setState] = useState(loadSelection);
  const [path, setPath] = useState(() => window.location.hash.slice(1) || '/');
  const [storageFailed, setStorageFailed] = useState(false);
  const stateRef = useRef(state);
  const routeRef = useRef(path);
  // 在同一次操作中提交页面状态与缓存，避免导航或刷新落在保存之前。
  const updateState = (update: (previous: SavedState) => SavedState) => {
    const next = update(stateRef.current);
    stateRef.current = next;
    setState(next);
    setStorageFailed(!saveSelection(next));
  };
  const resetRound = () => updateState(() => createInitialState());
  const resetCategory = (id: string) => updateState(previous => {
    const draftSelection = { ...previous.draftSelection };
    const modeSelections = { ...previous.modeSelections };
    delete draftSelection[id];
    delete modeSelections[id];
    return { ...previous, draftSelection, modeSelections, finalSelection: null };
  });
  const navigate = (next: string) => { window.location.hash = next; };
  useEffect(() => {
    const update = () => {
      const next = window.location.hash.slice(1) || '/';
      // 同时覆盖页面按钮与浏览器返回，防止上一轮结果被历史路由恢复。
      if (routeRef.current === '/result' && next !== '/result') resetRound();
      routeRef.current = next;
      setPath(next);
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  const category = path.startsWith('/category/') ? getCategory(path.slice('/category/'.length)) : undefined;
  const finish = () => {
    if (!categories.some(item => state.draftSelection[item.id]?.length)) return;
    updateState(previous => ({ ...previous, finalSelection: structuredClone(previous.draftSelection) }));
    navigate('/result');
  };
  return <main className="app-shell">
    {category ? <CategoryPage key={category.id} category={category} saved={state.draftSelection[category.id] ?? []} savedModes={state.modeSelections?.[category.id] ?? {}} drawCount={state.drawCounts[category.id] ?? category.defaultDrawCount}
      onCountChange={count => updateState(previous => ({ ...previous, drawCounts: { ...previous.drawCounts, [category.id]: count } }))}
      onConfirm={ids => { updateState(previous => ({
        ...previous,
        draftSelection: { ...previous.draftSelection, [category.id]: [...ids] },
        ...(category.preserveModeResults ? { modeSelections: {
          ...previous.modeSelections,
          [category.id]: {
            // 将已有的确认结果迁入对应模式，兼容旧版保存数据。
            ...(previous.draftSelection[category.id]?.length ? { [previous.draftSelection[category.id].length]: [...previous.draftSelection[category.id]] } : {}),
            ...previous.modeSelections?.[category.id],
            [ids.length]: [...ids],
          },
        } } : {}),
      })); navigate('/'); }}
      onReset={() => resetCategory(category.id)}
      onBack={() => navigate('/')} />
      : path === '/result' && state.finalSelection && Object.keys(state.finalSelection).length ? <Result selection={state.finalSelection} onBack={() => navigate('/')} />
      : <Home selection={state.draftSelection} navigate={navigate} finish={finish} onResetCategory={resetCategory} onResetAll={resetRound} />}
    {storageFailed && <p className="storage-notice" role="status">浏览器暂时无法保存本地数据，刷新后可能丢失。</p>}
  </main>;
}
