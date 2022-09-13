// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}
