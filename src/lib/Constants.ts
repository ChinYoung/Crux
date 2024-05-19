export type PredefinedColor = {
  id: string;
  backgroundColor: string;
  textColor: string;
};

export const PredefinedColorList: { dark: PredefinedColor[]; light: PredefinedColor[] } = {
  dark: [
    {
      id: '8j_UKwbBUVTGT6F5Q_bpt',
      backgroundColor: '#003366',
      textColor: 'white',
    },
    {
      id: 'e_-UXVXnEYJTTMTciPX-M',
      backgroundColor: '#666699',
      textColor: 'white',
    },
  ],
  light: [
    {
      id: '5JU8S1aRyAzTc_iBmgaSY',
      backgroundColor: '#3399CC',
      textColor: 'black',
    },
    {
      id: '7_wF9YOkS1WGNvAtVwYjr',
      backgroundColor: '#99CCFF',
      textColor: 'black',
    },
  ],
};
