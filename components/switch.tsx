import { Switch } from "@headlessui/react";

interface AppSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  symbol?: string;
}

export default function AppSwitch({
  checked,
  onChange,
  symbol,
}: AppSwitchProps) {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      className={`${checked ? "bg-green-500" : "bg-red-400"}
          relative inline-flex h-[28px] w-[52px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={`${checked ? "translate-x-6" : "translate-x-0"}
            pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
      >
        {symbol ?? null}
      </span>
    </Switch>
  );
}
