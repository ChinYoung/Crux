declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module '*.png';
declare module '*.jpeg';
declare module '*.jpg';

declare type MenuConfig = {
  id: string;
  name: string;
  handler: () => void;
};

declare type ExtendItem = {
  id: string;
  label: string;
  content: string;
  labelError: string;
  contentError: string;
};
