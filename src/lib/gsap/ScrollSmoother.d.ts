export interface ScrollSmootherVars {
  wrapper?: string | Element;
  content?: string | Element;
  smooth?: number;
  speed?: number;
  effects?: boolean;
  autoResize?: boolean;
  ignoreMobileResize?: boolean;
}

export default class ScrollSmoother {
  static create(vars: ScrollSmootherVars): ScrollSmoother;
  static get(): ScrollSmoother;
  static refresh(soft?: boolean): void;

  scrollTop(value?: number): number;
  paused(value?: boolean): boolean;
  scrollTo(target: string | number | Element, smooth?: boolean, position?: string): void;
  progress: number;
}
