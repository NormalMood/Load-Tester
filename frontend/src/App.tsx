import Header from './components/layout/Header/Header';
import AppRouter from './components/pages/AppRouter'
import Navbar from './components/ui/Navbar/Navbar';

function App() {
  return (
    <>
      <Header>
        <h1>Load Tester</h1>
        <Navbar />
      </Header>
      <AppRouter />
    </>
  );
}

export default App;
