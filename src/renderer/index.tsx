import React from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  const [dbOk, setDbOk] = React.useState<any>(null);

  React.useEffect(() => {
    // @ts-ignore
    window.electron.invoke('db.test').then((r: any) => setDbOk(r));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>IMDB Crawler (dev)</h1>
      <pre>{JSON.stringify(dbOk, null, 2)}</pre>
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
