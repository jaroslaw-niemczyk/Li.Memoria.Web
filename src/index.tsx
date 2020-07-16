import ReactDOM from 'react-dom';
import React from 'react';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootswatch/dist/minty/bootstrap.min.css';
import { RepeatQuestion } from './Component/RepeatQuestion/RepeatQuestion';
import { RepeatQuestions } from './Component/RepeatQuestions/RepeatQuestions';

declare global {
  interface Window {
    renderRepeatQuestionComponent: () => void;
    renderRepeatQuestionsComponent: () => void;
  }
}

window.renderRepeatQuestionComponent = (): void => {
  const repeat = document.getElementById('repeat');
  if (repeat) {
    ReactDOM.render(
      <React.StrictMode>
        <RepeatQuestion
          question={repeat.dataset.question || ''}
          answer={repeat.dataset.answer || ''}
          editUrl={repeat.dataset.editUrl || '#'}
        />
      </React.StrictMode>,
      document.getElementById('repeat'),
    );
  }
};
window.renderRepeatQuestionsComponent = (): void => {
  const repeat = document.getElementById('repeat');
  if (repeat) {
    ReactDOM.render(
      <React.StrictMode>
        <RepeatQuestions
          getQuestionsUrl={repeat.dataset.getQuestionsUrl || ''}
          saveRepeatAfterDaysUrl={repeat.dataset.saveRepeatAfterDaysUrl || ''}
          switchQuestionAsAnswer={Boolean(repeat.dataset.switchQuestionAsAnswer)}
        />
      </React.StrictMode>,
      document.getElementById('repeat'),
    );
  }
};
