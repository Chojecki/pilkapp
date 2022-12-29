import { Switch } from "@headlessui/react";

interface AppSwitchProps {
  checked: boolean;
  srOnlyLabel: string;
  onChange: (checked: boolean) => void;
  symbol?: string;
  disabled?: boolean;
}

export default function AppSwitch({
  checked,
  onChange,
  symbol,
  srOnlyLabel,
  disabled = false,
}: AppSwitchProps) {
  return (
    <Switch
      checked={checked}
      disabled={disabled}
      onChange={onChange}
      className={`${checked ? "bg-teal-500" : "bg-gray-400"}
          relative inline-flex h-[28px] w-[52px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
    >
      <span className="sr-only">{srOnlyLabel}</span>
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
