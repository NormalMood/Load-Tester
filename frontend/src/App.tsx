import Header from './components/layout/Header/Header';
import AppRouter from './components/pages/AppRouter'
import Navbar from './components/ui/Navbar/Navbar';

function App() {
  return (
    <>
      <Header>
        <span id='app-name'>Load Tester</span>
        <Navbar />
      </Header>
      <AppRouter />
    </>
  );
}

export default App;
