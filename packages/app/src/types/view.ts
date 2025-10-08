import type { BookDoc } from "@/lib/document";
import type { BookNote, BookSearchConfig, BookSearchResult } from "@/types/book";

export interface FoliateView extends HTMLElement {
  open: (book: BookDoc) => Promise<void>;
  close: () => void;
  init: (options: { lastLocation: string }) => void;
  goTo: (href: string) => void;
  goToFraction: (fraction: number) => void;
  prev: (distance?: number) => void;
  next: (distance?: number) => void;
  goLeft: () => void;
  goRight: () => void;
  getCFI: (index: number, range: Range) => string;
  resolveCFI: (cfi: string) => { index: number; anchor: (doc: Document) => Range };
  addAnnotation: (note: BookNote, remove?: boolean) => { index: number; label: string };
  search: (config: BookSearchConfig) => AsyncGenerator<BookSearchResult | string, void, void>;
  clearSearch: () => void;
  setSearchIndicator: (type: string, options: any) => void;
  select: (target: string | number | { fraction: number }) => void;
  deselect: () => void;
  book: BookDoc;
  language: {
    locale?: string;
    isCJK?: boolean;
  };
  history: {
    canGoBack: boolean;
    canGoForward: boolean;
    back: () => void;
    forward: () => void;
    clear: () => void;
  };
  renderer: {
    scrolled?: boolean;
    size: number; // current page height
    viewSize: number; // whole document view height
    start: number;
    end: number;
    page: number;
    pages: number;
    containerPosition: number;
    sideProp: "width" | "height";
    setAttribute: (name: string, value: string | number) => void;
    removeAttribute: (name: string) => void;
    next: () => Promise<void>;
    prev: () => Promise<void>;
    nextSection?: () => Promise<void>;
    prevSection?: () => Promise<void>;
    goTo?: (params: { index: number; anchor: number }) => void;
    setStyles?: (css: string) => void;
    getContents: () => { doc: Document; index?: number; overlayer?: unknown }[];
    scrollToAnchor: (anchor: number | Range) => void;
    addEventListener: (type: string, listener: EventListener, option?: AddEventListenerOptions) => void;
    removeEventListener: (type: string, listener: EventListener) => void;
  };
}

export const wrappedFoliateView = (originalView: FoliateView): FoliateView => {
  const originalAddAnnotation = originalView.addAnnotation.bind(originalView);
  originalView.addAnnotation = (note: BookNote, remove = false) => {
    // transform BookNote to foliate annotation
    const annotation = {
      value: note.cfi,
      ...note,
    };
    return originalAddAnnotation(annotation, remove);
  };

  const originalSetSearchIndicator = (originalView as any).setSearchIndicator?.bind(originalView);
  if (originalSetSearchIndicator) {
    originalView.setSearchIndicator = (type: string, options: any) => {
      originalSetSearchIndicator(type, options);
    };
  } else {
    originalView.setSearchIndicator = () => {
      console.warn("setSearchIndicator method not available in underlying view");
    };
  }

  return originalView;
};
