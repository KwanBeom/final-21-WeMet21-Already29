import Login from "./pages/Login/Login";
import { BrowserRouter } from "react-router-dom";
import GlobalStyle from "./style/GlobalStyle";

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Login />
    </BrowserRouter>
  );
}
export default App;
