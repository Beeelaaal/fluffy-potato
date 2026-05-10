declare module '*.css';

declare module '@react-three/fiber' {
  export * from '@react-three/fiber/dist/declarations/src/index';
}

import { ThreeElements } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }

  namespace React.JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}
