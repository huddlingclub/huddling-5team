import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import Modal from '#components/Modal.jsx';
import { Button } from '#components/ui/button.jsx';
import { STRINGS } from '#strings.js';
import { OBSTACLE, ROOM } from '#game/constants.js';

export default function RoomSettingsModal({ open, onClose, onConfirm }) {
  const [maxPlayers, setMaxPlayers] = useState(ROOM.DEFAULT_PLAYERS);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={STRINGS.SETTING_MODAL_TITLE}
      titleClassName="text-lg font-bold"
      description={STRINGS.SETTING_MODAL_DESCRIPTION}
      descriptionClassName="text-base"
      contentClassName="cafe-panel max-h-[90svh] overflow-y-auto bg-card p-6"
    >
      <div className="flex flex-col gap-5 py-5">
        {/* 인원수 스테퍼 */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-muted-foreground">{STRINGS.SETTING_PLAYERS}</span>
          <div className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-3 py-3">
            <Button
              variant="outline"
              size="icon"
              aria-label={STRINGS.SETTING_FEWER}
              className="size-11"
              disabled={maxPlayers <= ROOM.MIN_PLAYERS}
              onClick={() => setMaxPlayers((v) => v - 1)}
            >
              <Minus />
            </Button>
            <span className="text-xl font-semibold tabular-nums">
              {maxPlayers}{STRINGS.SETTING_UNIT_PLAYERS}
            </span>
            <Button
              variant="outline"
              size="icon"
              aria-label={STRINGS.SETTING_MORE}
              className="size-11"
              disabled={maxPlayers >= ROOM.MAX_PLAYERS}
              onClick={() => setMaxPlayers((v) => v + 1)}
            >
              <Plus />
            </Button>
          </div>
        </div>

        <dl className="flex items-center justify-between gap-3 border-t pt-4">
          <dt className="text-sm text-muted-foreground">{STRINGS.SETTING_DURATION}</dt>
          <dd className="font-semibold">{STRINGS.SETTING_FIXED_DURATION(ROOM.DURATION_SEC / 60)}</dd>
        </dl>
        <p className="text-sm text-muted-foreground">
          {STRINGS.SETTING_EVENT_OBSTACLE(OBSTACLE.EVENT_DROP_INTERVAL_SEC)}
        </p>
      </div>

      {/* 하단 버튼 */}
      <Button
        className="w-full pixel-shadow h-13 text-base"
        onClick={() => onConfirm({ maxPlayers, durationSec: ROOM.DURATION_SEC })}
      >
        {STRINGS.SETTING_CONFIRM}
      </Button>
    </Modal>
  );
}
