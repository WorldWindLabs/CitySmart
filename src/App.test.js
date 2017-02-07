import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

console.log("I'm in app.test.js")

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});
