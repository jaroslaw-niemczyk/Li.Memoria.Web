import ReactDOM from 'react-dom';
import React from 'react';
import { Repeat } from './Component/Repeat/Repeat';

import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootswatch/dist/minty/bootstrap.min.css';

declare global {
  interface Window {
    renderRepeatComponent: () => void;
  }
}

window.renderRepeatComponent = (): void => {
  const repeat = document.getElementById('repeat');
  if (repeat) {
    ReactDOM.render(
      <React.StrictMode>
        <Repeat
          question={repeat.dataset.question || ''}
          answer={repeat.dataset.answer || ''}
          editUrl={repeat.dataset.editUrl || '#'}
        />
      </React.StrictMode>,
      document.getElementById('repeat'),
    );
  }
};
