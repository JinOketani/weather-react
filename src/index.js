import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import WeatherPage from './Weather';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <WeatherPage/>,
  document.getElementById('root')
)
registerServiceWorker();