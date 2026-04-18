export interface SplitTextVars {
  type?: string;
  linesClass?: string;
  wordsClass?: string;
  charsClass?: string;
}

export default class SplitText {
  constructor(target: string | Element | ArrayLike<string | Element>, vars?: SplitTextVars);

  chars: Element[];
  words: Element[];
  lines: Element[];

  revert(): void;
}
