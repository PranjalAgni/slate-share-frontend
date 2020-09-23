import React from 'react';
import SyncingEditor from './components/SyncingEditor';

const App: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <SyncingEditor />
    </div>
  );
};

export default App;
