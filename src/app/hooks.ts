import { throttle } from 'lodash-es';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export interface IViewportSize {
  width?: number;
  height?: number;
}
const defaultIViewportSize = {
  width: undefined,
  height: undefined,
};

export const useElementSize = (throttleTime = 250, el: HTMLElement | null) => {
  const [viewportSize, setViewportSize] =
    useState<IViewportSize>(defaultIViewportSize);

  useLayoutEffect(() => {
    let handleResize = () => {
      const { width, height } =
        el?.getBoundingClientRect() ?? defaultIViewportSize;
      setViewportSize({ width, height });
    };
    if (throttleTime) handleResize = throttle(handleResize, throttleTime);

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [throttleTime, el]);

  return viewportSize;
};

export function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
