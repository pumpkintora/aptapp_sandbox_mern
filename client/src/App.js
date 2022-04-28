// router
import Router from './routes'
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
import axios from 'axios';
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
  // return (
  //   <div className="App">
  //     <Router>
  //       <Routes>
  //         <Route exact path="/">
  //           {auth ? <Homepage /> : <Login />}<Homepage />
  //         </Route>
  //         <Route path="/login"><Login /></Route>
  //         <Route path="/register"><Register /></Route>
  //       </Routes>

  //     </Router>

  //   </div>
  // );
}

export default App;