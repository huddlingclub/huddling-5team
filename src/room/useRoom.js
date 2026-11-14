// 방 만들기, 입장, Presence, Broadcast를 담은 훅
// 게임 규칙을 모르고 protocol.js의 메시지만 주고받는다

import { useState } from 'react';

export function useRoom() {
  const [players, setPlayers] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | lobby | playing | finished

  // TODO: Supabase Realtime 채널 연결, Presence/Broadcast 구현

  return {
    players,
    status,
    createRoom: () => {},
    joinRoom: () => {},
    sendScore: () => {},
    startGame: () => {},
  };
}
