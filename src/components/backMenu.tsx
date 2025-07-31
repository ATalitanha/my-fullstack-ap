import { ArrowLeft } from "lucide-react";

const BackMenu = () => {
    return (
        <a href="/">
            <button
            className="border border-white/20 dark:border-black/30 dark:bg-gray-800/80 bg-gray-100/20 
        hover:bg-gray-700/80 dark:hover:bg-white/10 p-2 rounded-xs transition"
        >
            <ArrowLeft className="w-5 h-5 dark:text-gray-200"/>
        </button>
        </a>
    );
};

export default BackMenu;