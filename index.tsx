import type { IndexComponentProps } from '@wroud/vite-plugin-ssg';
import { Html, Head, Body } from '@wroud/vite-plugin-ssg/react/components';
import App from './App';
import { createAppConfig } from '@wroud/vite-plugin-ssg/app';
import { posts } from './data/posts';
import { pages } from './data/pages';

function Index(_: IndexComponentProps) {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>React Markdown Blog</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{__html: `tailwind.config={theme:{extend:{colors:{primary:{50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',300:'#93c5fd',400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',800:'#1e40af',900:'#1e3a8a',950:'#172554'}}}}}`}} />
      </Head>
      <Body className="bg-gray-100 text-gray-900 antialiased">
        <div id="root">
          <App />
        </div>
      </Body>
    </Html>
  );
}

export default createAppConfig(Index, {
  onRoutesPrerender() {
    const routes = ['/', '/tags'];
    for (const slug of Object.keys(posts)) {
      routes.push(`/post/${slug}`);
    }
    const tagSet = new Set<string>();
    Object.values(posts).forEach(p => p.tags.forEach(t => tagSet.add(t)));
    for (const tag of tagSet) {
      routes.push(`/tags/${encodeURIComponent(tag)}`);
    }
    for (const slug of Object.keys(pages)) {
      routes.push(`/page/${slug}`);
    }
    return routes;
  }
});

