import React from 'react';
import { Routes, Route } from 'react-router-dom'; // فقط Routes و Route
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CaseDetail from './pages/CaseDetail';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* فقط Routes هنا */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/case/:id" element={<CaseDetail />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;


































































// import React from 'react';
 // import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
 // import { ThemeProvider, createTheme } from '@mui/material/styles';
 // import CssBaseline from '@mui/material/CssBaseline';
 // import Login from './pages/Login';
 // import Dashboard from './pages/Dashboard';
 // import CaseDetail from './pages/CaseDetail';
 // 
 // const theme = createTheme({
 //   palette: {
 //     primary: {
 //       main: '#1976d2',
 //     },
 //     secondary: {
 //       main: '#dc004e',
 //     },
 //   },
 // });
 // 
 // function App() {
 //   return (
 //     <ThemeProvider theme={theme}>
 //       <CssBaseline />
 //       <Router>
 //         <Routes>
 //           <Route path="/" element={<Login />} />
 //           <Route path="/login" element={<Login />} />
 //           <Route path="/dashboard" element={<Dashboard />} />
 //           <Route path="/case/:id" element={<CaseDetail />} />
 //         </Routes>
 //       </Router>
 //     </ThemeProvider>
 //   );
 // }
 // 
 // export default App;
 // 
