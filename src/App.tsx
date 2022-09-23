import React, { useState } from 'react';
import { Provider } from 'react-redux';
import './App.scss';
import { store } from './app/store';
import Field from './features/tictactoe/Field';

const OFFSET = 70;
function App() {
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  return (
    <Provider store={store}>
      <div className='App'>
        <div className='arrow top' onClick={() => setOffsetY(offsetY + OFFSET)}>
          <i className='fa-solid fa-2x fa-arrow-up'></i>
        </div>
        <div
          className='arrow bottom'
          onClick={() => setOffsetY(offsetY - OFFSET)}>
          <i className='fa-solid fa-2x fa-arrow-down'></i>
        </div>
        <div
          className='arrow left'
          onClick={() => setOffsetX(offsetX + OFFSET)}>
          <i className='fa-solid fa-2x fa-arrow-left'></i>
        </div>
        <div
          className='arrow right'
          onClick={() => setOffsetX(offsetX - OFFSET)}>
          <i className='fa-solid fa-2x fa-arrow-right'></i>
        </div>
        <Field
          cellSize={50}
          overflowCells={3}
          xOffset={offsetX}
          yOffset={offsetY}></Field>
      </div>
    </Provider>
  );
}

export default App;
