import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import Modal from '#components/Modal.jsx';
import { Button } from '#components/ui/button.jsx';
import { STRINGS } from '#strings.js';
import { ROOM } from '#game/constants.js';

// 시간을 "N분", "N분 N초", "N초"로 포맷
function formatDuration(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m > 0 && s > 0) return `${m}${STRINGS.SETTING_UNIT_MINUTES} ${s}${STRINGS.SETTING_UNIT_SECONDS}`;
  if (m > 0) return `${m}${STRINGS.SETTING_UNIT_MINUTES}`;
  return `${s}${STRINGS.SETTING_UNIT_SECONDS}`;
}

// 방 설정 모달: 인원수, 제한 시간 스테퍼
export default function RoomSettingsModal({ open, onClose, onConfirm }) {
  const [maxPlayers, setMaxPlayers] = useState(ROOM.DEFAULT_PLAYERS);
  const [durationSec, setDurationSec] = useState(ROOM.DEFAULT_DURATION_SEC);

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

        {/* 제한 시간 스테퍼 */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-muted-foreground">{STRINGS.SETTING_DURATION}</span>
          <div className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-3 py-3">
            <Button
              variant="outline"
              size="icon"
              aria-label={STRINGS.SETTING_SHORTER}
              className="size-11"
              disabled={durationSec <= ROOM.MIN_DURATION_SEC}
              onClick={() => setDurationSec((v) => v - ROOM.DURATION_STEP_SEC)}
            >
              <Minus />
            </Button>
            <span className="text-xl font-semibold tabular-nums">
              {formatDuration(durationSec)}
            </span>
            <Button
              variant="outline"
              size="icon"
              aria-label={STRINGS.SETTING_LONGER}
              className="size-11"
              disabled={durationSec >= ROOM.MAX_DURATION_SEC}
              onClick={() => setDurationSec((v) => v + ROOM.DURATION_STEP_SEC)}
            >
              <Plus />
            </Button>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <Button
        className="w-full pixel-shadow h-13 text-base"
        onClick={() => onConfirm({ maxPlayers, durationSec })}
      >
        {STRINGS.SETTING_CONFIRM}
      </Button>
    </Modal>
  );
}
