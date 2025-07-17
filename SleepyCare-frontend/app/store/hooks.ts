import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store'; // ודאי שהנתיב לקובץ ה-store נכון

// השתמשי בגרסאות אלו ברחבי האפליקציה במקום ב-`useDispatch` ו-`useSelector` הרגילים
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;