import icon from "/icon.svg";
import "@/assets/tailwind.css";

function App() {
  return (
    <>
      <Navbar>
        <Navbar.Left>
          <Brand logo={icon} title="e6hancer" />
        </Navbar.Left>
        <Navbar.Right>
          <DarkModeToggle />
        </Navbar.Right>
      </Navbar>
    </>
  );
}

export default App;
