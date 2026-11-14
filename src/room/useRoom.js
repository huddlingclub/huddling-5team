// 방 만들기, 입장, Presence, Broadcast를 담은 훅
// 게임 규칙을 모르고 protocol.js의 메시지만 주고받는다

import { useState, useRef, useCallback } from 'react';
import { supabase } from '#room/supabase.js';
import { EVENTS } from '#room/protocol.js';
import { CODE_CHARS, CODE_LENGTH, generateNickname } from '#game/constants.js';
import { STRINGS } from '#strings.js';

// 6자리 방 코드 생성
function generateCode() {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

// Presence 목록에서 플레이어 배열 추출 (joinedAt 순 정렬)
function presenceToPlayers(state) {
  const list = [];
  for (const presences of Object.values(state)) {
    for (const p of presences) {
      if (p.nickname) {
        list.push({ nickname: p.nickname, joinedAt: p.joinedAt });
      }
    }
  }
  list.sort((a, b) => a.joinedAt - b.joinedAt);
  return list;
}

// Presence 목록에서 호스트 정보 추출
function findHost(state) {
  for (const presences of Object.values(state)) {
    for (const p of presences) {
      if (p.role === 'host') return p;
    }
  }
  return null;
}

export function useRoom() {
  const [players, setPlayers] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | lobby | playing | finished
  const [roomCode, setRoomCode] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [error, setError] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(0);
  const [durationSec, setDurationSec] = useState(0);

  const channelRef = useRef(null);
  const nicknameRef = useRef('');

  // 채널 정리
  const cleanup = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  }, []);

  // 채널 구독 + Presence 동기화 설정
  function setupChannel(channel) {
    channelRef.current = channel;

    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      setPlayers(presenceToPlayers(state));

      const host = findHost(state);
      if (host) {
        if (host.maxPlayers) setMaxPlayers(host.maxPlayers);
        if (host.durationSec) setDurationSec(host.durationSec);
      }
    });

    // Broadcast: 게임 시작
    channel.on('broadcast', { event: EVENTS.START }, ({ payload }) => {
      setStatus('playing');
    });

    // Broadcast: 게임 종료
    channel.on('broadcast', { event: EVENTS.FINISHED }, ({ payload }) => {
      setStatus('finished');
    });
  }

  // 방 만들기
  const createRoom = useCallback(async (settings) => {
    if (!supabase) {
      setError('Supabase가 연결되지 않았습니다. .env.local을 확인하세요.');
      return;
    }

    setError('');
    const code = generateCode();
    const nickname = generateNickname();
    nicknameRef.current = nickname;

    const channel = supabase.channel(`room:${code}`);
    setupChannel(channel);

    await channel.subscribe(async (channelStatus) => {
      if (channelStatus === 'SUBSCRIBED') {
        await channel.track({
          role: 'host',
          status: 'lobby',
          maxPlayers: settings.maxPlayers,
          durationSec: settings.durationSec,
          nickname,
          joinedAt: Date.now(),
        });

        setRoomCode(code);
        setIsHost(true);
        setStatus('lobby');
        setMaxPlayers(settings.maxPlayers);
        setDurationSec(settings.durationSec);
      }
    });
  }, []);

  // 방 입장
  const joinRoom = useCallback(async (code) => {
    if (!supabase) {
      setError('Supabase가 연결되지 않았습니다. .env.local을 확인하세요.');
      return false;
    }

    setError('');
    const nickname = generateNickname();
    nicknameRef.current = nickname;

    const channel = supabase.channel(`room:${code}`);
    setupChannel(channel);

    return new Promise((resolve) => {
      channel.subscribe(async (channelStatus) => {
        if (channelStatus !== 'SUBSCRIBED') return;

        // 2초 대기 후 Presence 확인
        await new Promise((r) => setTimeout(r, 2000));

        const state = channel.presenceState();
        const host = findHost(state);

        // 호스트 존재 확인
        if (!host) {
          setError(STRINGS.ERROR_NO_ROOM);
          supabase.removeChannel(channel);
          channelRef.current = null;
          resolve(false);
          return;
        }

        // 게임 진행 여부 확인
        if (host.status !== 'lobby') {
          setError(STRINGS.ERROR_ALREADY_STARTED);
          supabase.removeChannel(channel);
          channelRef.current = null;
          resolve(false);
          return;
        }

        // 인원 확인
        const currentPlayers = presenceToPlayers(state);
        if (currentPlayers.length >= host.maxPlayers) {
          setError(STRINGS.ERROR_ROOM_FULL);
          supabase.removeChannel(channel);
          channelRef.current = null;
          resolve(false);
          return;
        }

        // 입장
        await channel.track({
          nickname,
          joinedAt: Date.now(),
        });

        setRoomCode(code);
        setIsHost(false);
        setStatus('lobby');
        setMaxPlayers(host.maxPlayers);
        setDurationSec(host.durationSec);
        resolve(true);
      });
    });
  }, []);

  // 게임 시작 (호스트만)
  const startGame = useCallback(async () => {
    const channel = channelRef.current;
    if (!channel || !isHost) return;

    const now = Date.now();
    const startsAt = now + 4000; // 3초 카운트다운
    const endsAt = startsAt + durationSec * 1000;

    // Presence 업데이트
    await channel.track({
      role: 'host',
      status: 'playing',
      maxPlayers,
      durationSec,
      startsAt,
      endsAt,
      nickname: nicknameRef.current,
      joinedAt: players[0]?.joinedAt || Date.now(),
    });

    // Broadcast로 시작 알림
    await channel.send({
      type: 'broadcast',
      event: EVENTS.START,
      payload: { startsAt, endsAt },
    });

    setStatus('playing');
  }, [isHost, durationSec, maxPlayers, players]);

  // 점수 전송
  const sendScore = useCallback(async (score, maxLevel, alive) => {
    const channel = channelRef.current;
    if (!channel) return;

    await channel.send({
      type: 'broadcast',
      event: EVENTS.SCORE,
      payload: { nickname: nicknameRef.current, score, maxLevel, alive },
    });
  }, []);

  // 홈으로 돌아가기
  const leaveRoom = useCallback(() => {
    cleanup();
    setPlayers([]);
    setStatus('idle');
    setRoomCode('');
    setIsHost(false);
    setError('');
    setMaxPlayers(0);
    setDurationSec(0);
  }, [cleanup]);

  return {
    players,
    status,
    roomCode,
    isHost,
    error,
    maxPlayers,
    durationSec,
    createRoom,
    joinRoom,
    startGame,
    sendScore,
    leaveRoom,
  };
}
