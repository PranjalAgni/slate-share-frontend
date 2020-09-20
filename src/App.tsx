import React from 'react';
import SyncingEditor from './components/SyncingEditor';

const App: React.FC = () => {
  return (
    <div>
      <SyncingEditor />
      <br />
      <SyncingEditor />
      <br />
      <SyncingEditor />
    </div>
  );
};

export default App;
