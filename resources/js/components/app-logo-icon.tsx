import { SVGAttributes } from 'react';
import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img src="/images/423716193_122100729734197999_6164029439040549086_n.png" alt="App Logo" {...props} />
    );
}
