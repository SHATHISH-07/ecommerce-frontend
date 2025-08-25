import { Switch } from "./ui/switch";
import { useTheme } from "../hooks/useThemeHook";

function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Switch
      checked={theme === "dark"}
      onCheckedChange={toggleTheme}
      theme={theme}
      className="cursor-pointer"
    />
  );
}

export default DarkModeToggle;
