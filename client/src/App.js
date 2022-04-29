// react 
import React from 'react';
// router
import Router from './routes'
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
import { setTokenHeader } from './api';
// import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';

if (localStorage.jwtToken) {
  setTokenHeader(localStorage.jwtToken);
  // verify token
  // if token invalid, force logout
}

function App() {
  return (
    <ThemeConfig>
      <ScrollToTop />
      <GlobalStyles />
      {/* <BaseOptionChartStyle /> */}
      <Router />
    </ThemeConfig>
  )
}

export default App;