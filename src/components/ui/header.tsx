// components/ui/header.tsx
import theme from "@/lib/theme";
import BackMenu from "../backMenu";
import ThemeToggle from "../ThemeToggle";

const Header = () => {
    return(
        <header dir="ltr" className={`fixed w-full flex justify-between p-4 h-16 top-0 z-50  bg-transparent `}>
          <BackMenu/>
          <ThemeToggle />
        </header>
    );
};

export default Header;