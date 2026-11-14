import { Monitor, Moon, Sun } from 'lucide-react';
import { Button } from '#components/ui/button.jsx';
import { STRINGS } from '#strings.js';
import { useTheme } from '#theme/ThemeProvider.jsx';

export default function ThemeModeControl() {
  const { preference, selectTheme } = useTheme();
  const modes = [
    { value: 'light', label: STRINGS.THEME_LIGHT, Icon: Sun },
    { value: 'dark', label: STRINGS.THEME_DARK, Icon: Moon },
    { value: 'system', label: STRINGS.THEME_SYSTEM, Icon: Monitor },
  ];

  return (
    <div role="group" aria-label={STRINGS.THEME_LABEL} className="flex rounded-xl border border-border bg-card p-0.5 shadow-sm">
      {modes.map(({ value, label, Icon }) => (
        <Button
          key={value}
          type="button"
          variant={preference === value ? 'secondary' : 'ghost'}
          aria-pressed={preference === value}
          aria-label={label}
          title={label}
          onClick={() => selectTheme(value)}
          className="size-11 p-0"
        >
          <Icon aria-hidden="true" className="size-4" />
        </Button>
      ))}
    </div>
  );
}
