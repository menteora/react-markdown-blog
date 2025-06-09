import type { IndexComponentProps } from '@wroud/vite-plugin-ssg';
import { Html, Head, Body } from '@wroud/vite-plugin-ssg/react/components';
import App from './App';

export default function Index(props: IndexComponentProps) {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>React Markdown Blog</title>
      </Head>
      <Body>
        <App />
      </Body>
    </Html>
  );
}
