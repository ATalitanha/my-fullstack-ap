import theme from "@/lib/theme";
import BackMenu from "../backMenu";
import ThemeToggle from "../ThemeToggle";

const Header = () => {
    return(
        <header className={`fixed w-full flex justify-between p-4 h-16 top-0 z-10 ${theme}`}>
        <BackMenu/>
        <ThemeToggle />
      </header>
    );
};

export default Header;