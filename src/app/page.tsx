"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

type Day = {
  date: string;
  focusSec: number;
  earned: number;
  restSec: number;
  sessions: number;
};

type Pass = {
  id: number;
  minutes: number;
  cost: number;
  remainingSec: number;
};

type State = {
  goalMin: number;
  balance: number;
  today: Day;
  days: Day[];
  passes: Pass[];
  focusStartedAt: number | null;
  restStartedAt: number | null;
  restPassId: number | null;
  restRemainingAtStart: number;
  combo: number;
  streak: number;
  lastFocusDate: string | null;
};
