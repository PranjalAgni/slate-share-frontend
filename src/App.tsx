import React from 'react';
import SyncingEditor from './components/SyncingEditor';
import AppRouter from './router/AppRouter';

const App: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h3>
        Share your notes instantly{' '}
        <span role="img" aria-labelledby="writing">
          ✍️
        </span>
      </h3>

      <div>
        <AppRouter />
      </div>
    </div>
  );
};

export default App;
