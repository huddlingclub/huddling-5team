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
    <div className="flex w-full max-w-xs flex-col items-center gap-2">
      <div role="group" aria-label={STRINGS.THEME_LABEL} className="flex w-full gap-1 rounded-xl border border-border bg-card p-1">
        {modes.map(({ value, label, Icon }) => (
          <Button
            key={value}
            type="button"
            variant={preference === value ? 'secondary' : 'ghost'}
            aria-pressed={preference === value}
            onClick={() => selectTheme(value)}
            className="h-11 min-w-0 flex-1 gap-1.5 px-2"
          >
            <Icon aria-hidden="true" className="size-4" />
            {label}
          </Button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{STRINGS.THEME_SYSTEM_HINT}</p>
    </div>
  );
}
