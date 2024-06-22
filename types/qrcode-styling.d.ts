declare module 'qr-code-styling' {
    interface QRCodeStylingOptions {
      width?: number;
      height?: number;
      data: string;
      image?: string;
      dotsOptions?: {
        color?: string;
        type?: string;
      };
      backgroundOptions?: {
        color?: string;
      };
      imageOptions?: {
        crossOrigin?: string;
        margin?: number;
      };
      cornersSquareOptions?: {
        color?: string;
        type?: string;
      };
      cornersDotOptions?: {
        color?: string;
        type?: string;
      };
    }
  
    class QRCodeStyling {
      constructor(options: QRCodeStylingOptions);
      append(element: HTMLElement): void;
      download(fileName?: string): void;
    }
  
    export default QRCodeStyling;
  }
  