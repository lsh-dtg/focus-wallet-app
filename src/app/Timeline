"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";

export type TimelineCategory =
  | "focus"
  | "study"
  | "work"
  | "meal"
  | "rest"
  | "distraction"
  | "etc";

export type TimelineEntry = {
  id: string;
  date: string;
  start: string;
  end: string;
  title: string;
  category: TimelineCategory;
  createdAt: number;
};

const CATEGORY: Record<
  TimelineCategory,
  { label: string; emoji: string }
> = {
  focus: { label: "집중", emoji: "🎯" },
  study: { label: "공부", emoji: "📚" },
  work: { label: "업무", emoji: "💼" },
  meal: { label: "식사", emoji: "🍚" },
  rest: { label: "휴식", emoji: "🛋️" },
  distraction: { label: "딴짓", emoji: "📱" },
  etc: { label: "기타", emoji: "📝" },
};

const STORAGE_KEY = "focus-wallet-timeline-v1";

const pad = (n: number) => String(n).padStart(2, "0");

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate()
  )}`;
};

const timeToMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const durationMinutes = (start: string, end: string) => {
  let diff = timeToMinutes(end) - timeToMinutes(start);

  if (diff < 0) {
    diff += 24 * 60;
  }

  return diff;
};

const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes}분`;

  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  return m ? `${h}시간 ${m}분` : `${h}시간`;
};

const loadEntries = (): TimelineEntry[] => {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];

    return parsed;
  } catch {
    return [];
  }
};

const saveEntries = (entries: TimelineEntry[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

type Props = {
  entries: TimelineEntry[];
  onChange: (entries: TimelineEntry[]) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
};

export default function Timeline({
  entries,
  onChange,
  selectedDate,
  onDateChange,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("10:00");
  const [title, setTitle] = useState("");
  const [category, setCategory] =
    useState<TimelineCategory>("focus");

  const dayEntries = useMemo(
    () =>
      entries
        .filter((entry) => entry.date === selectedDate)
        .sort(
          (a, b) =>
            timeToMinutes(a.start) -
            timeToMinutes(b.start)
        ),
    [entries, selectedDate]
  );

  const totalMinutes = dayEntries.reduce(
    (sum, entry) =>
      sum + durationMinutes(entry.start, entry.end),
    0
  );

  const categoryTotals = useMemo(() => {
    const result: Record<TimelineCategory, number> = {
      focus: 0,
      study: 0,
      work: 0,
      meal: 0,
      rest: 0,
      distraction: 0,
      etc: 0,
    };

    dayEntries.forEach((entry) => {
      result[entry.category] += durationMinutes(
        entry.start,
        entry.end
      );
    });

    return result;
  }, [dayEntries]);

  function resetForm() {
    setStart("09:00");
    setEnd("10:00");
    setTitle("");
    setCategory("focus");
    setEditingId(null);
    setShowForm(false);
  }

  function openNewForm() {
    const now = new Date();

    const current = `${pad(
      now.getHours()
    )}:${pad(now.getMinutes())}`;

    const endDate = new Date(
      now.getTime() + 30 * 60 * 1000
    );

    const endTime = `${pad(
      endDate.getHours()
    )}:${pad(endDate.getMinutes())}`;

    setStart(current);
    setEnd(endTime);
    setTitle("");
    setCategory("focus");
    setEditingId(null);
    setShowForm(true);
  }

  function editEntry(entry: TimelineEntry) {
    setEditingId(entry.id);
    setStart(entry.start);
    setEnd(entry.end);
    setTitle(entry.title);
    setCategory(entry.category);
    setShowForm(true);
  }

  function saveEntry() {
    if (!title.trim()) {
      alert("무엇을 했는지 입력해주세요.");
      return;
    }

    if (start === end) {
      alert("시작 시간과 종료 시간이 같을 수 없습니다.");
      return;
    }

    if (editingId) {
      const next = entries.map((entry) =>
        entry.id === editingId
          ? {
              ...entry,
              start,
              end,
              title: title.trim(),
              category,
            }
          : entry
      );

      onChange(next);
      saveEntries(next);
      resetForm();
      return;
    }

    const newEntry: TimelineEntry = {
      id: `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`,
      date: selectedDate,
      start,
      end,
      title: title.trim(),
      category,
      createdAt: Date.now(),
    };

    const next = [...entries, newEntry];

    onChange(next);
    saveEntries(next);
    resetForm();
  }

  function deleteEntry(id: string) {
    if (!confirm("이 기록을 삭제할까요?")) return;

    const next = entries.filter(
      (entry) => entry.id !== id
    );

    onChange(next);
    saveEntries(next);
  }

  function moveDate(days: number) {
    const d = new Date(`${selectedDate}T00:00:00`);

    d.setDate(d.getDate() + days);

    onDateChange(
      `${d.getFullYear()}-${pad(
        d.getMonth() + 1
      )}-${pad(d.getDate())}`
    );
  }

  const isToday = selectedDate === todayKey();

  return (
    <section style={styles.card}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>
            🕐 오늘의 타임라인
          </h2>

          <div style={styles.dateRow}>
            <button
              onClick={() => moveDate(-1)}
              style={styles.dateButton}
            >
              ‹
            </button>

            <b>
              {new Date(
                `${selectedDate}T00:00:00`
              ).toLocaleDateString("ko-KR", {
                month: "long",
                day: "numeric",
                weekday: "short",
              })}
            </b>

            <button
              onClick={() => moveDate(1)}
              style={styles.dateButton}
            >
              ›
            </button>

            {!isToday && (
              <button
                onClick={() => onDateChange(todayKey())}
                style={styles.todayButton}
              >
                오늘
              </button>
            )}
          </div>
        </div>

        <button
          onClick={openNewForm}
          style={styles.primary}
        >
          ＋ 기록 추가
        </button>
      </div>

      <div style={styles.summary}>
        <div>
          <span style={styles.label}>기록된 시간</span>
          <b>{formatDuration(totalMinutes)}</b>
        </div>

        {(
          Object.keys(CATEGORY) as TimelineCategory[]
        ).map((key) => {
          const value = categoryTotals[key];

          if (!value) return null;

          return (
            <div key={key}>
              <span style={styles.label}>
                {CATEGORY[key].emoji}{" "}
                {CATEGORY[key].label}
              </span>

              <b>{formatDuration(value)}</b>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div style={styles.form}>
          <div style={styles.formTitle}>
            {editingId
              ? "기록 수정"
              : "새 기록 추가"}
          </div>

          <div style={styles.formGrid}>
            <label>
              시작
              <input
                type="time"
                value={start}
                onChange={(e) =>
                  setStart(e.target.value)
                }
                style={styles.input}
              />
            </label>

            <label>
              종료
              <input
                type="time"
                value={end}
                onChange={(e) =>
                  setEnd(e.target.value)
                }
                style={styles.input}
              />
            </label>
          </div>

          <label style={styles.field}>
            무엇을 했나요?
            <input
              type="text"
              value={title}
              placeholder="예: 오픽 공부"
              onChange={(e) =>
                setTitle(e.target.value)
              }
              style={styles.input}
              autoFocus
            />
          </label>

          <label style={styles.field}>
            카테고리
            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target
                    .value as TimelineCategory
                )
              }
              style={styles.input}
            >
              {(
                Object.keys(CATEGORY) as TimelineCategory[]
              ).map((key) => (
                <option key={key} value={key}>
                  {CATEGORY[key].emoji}{" "}
                  {CATEGORY[key].label}
                </option>
              ))}
            </select>
          </label>

          <div style={styles.formActions}>
            <button
              onClick={resetForm}
              style={styles.secondary}
            >
              취소
            </button>

            <button
              onClick={saveEntry}
              style={styles.primary}
            >
              저장
            </button>
          </div>
        </div>
      )}

      {!dayEntries.length ? (
        <div style={styles.empty}>
          <div style={{ fontSize: 34 }}>📝</div>
          <b>아직 기록이 없어요.</b>
          <span>
            오늘 무엇을 했는지 시간별로 남겨보세요.
          </span>
        </div>
      ) : (
        <div style={styles.timeline}>
          {dayEntries.map((entry) => {
            const categoryInfo =
              CATEGORY[entry.category];

            const minutes = durationMinutes(
              entry.start,
              entry.end
            );

            return (
              <div
                key={entry.id}
                style={styles.entry}
              >
                <div style={styles.time}>
                  {entry.start}
                  <span>↓</span>
                  {entry.end}
                </div>

                <div
                  style={{
                    ...styles.dot,
                    background:
                      entry.category === "distraction"
                        ? "#ef6b73"
                        : "#6c63ff",
                  }}
                />

                <div style={styles.entryBody}>
                  <div style={styles.entryTop}>
                    <div>
                      <span style={styles.category}>
                        {categoryInfo.emoji}{" "}
                        {categoryInfo.label}
                      </span>

                      <b style={styles.entryTitle}>
                        {entry.title}
                      </b>
                    </div>

                    <span style={styles.duration}>
                      {formatDuration(minutes)}
                    </span>
                  </div>

                  <div style={styles.entryActions}>
                    <button
                      onClick={() =>
                        editEntry(entry)
                      }
                      style={styles.textButton}
                    >
                      수정
                    </button>

                    <button
                      onClick={() =>
                        deleteEntry(entry.id)
                      }
                      style={{
                        ...styles.textButton,
                        color: "#c45b63",
                      }}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export { loadEntries, saveEntries };

const styles: Record<string, CSSProperties> = {
  card: {
    background: "#fff",
    border: "1px solid #e7eaf0",
    borderRadius: 22,
    padding: 22,
    boxShadow:
      "0 14px 35px rgba(39,46,67,.07)",
    marginBottom: 16,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },

  title: {
    margin: "0 0 8px",
    fontSize: 19,
  },

  dateRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#505766",
  },

  dateButton: {
    width: 30,
    height: 30,
    border: "1px solid #e1e4eb",
    borderRadius: 9,
    background: "#fff",
    cursor: "pointer",
    fontSize: 20,
  },

  todayButton: {
    border: 0,
    borderRadius: 9,
    padding: "6px 9px",
    background: "#f0efff",
    color: "#6259df",
    fontWeight: 800,
    cursor: "pointer",
  },

  primary: {
    border: 0,
    borderRadius: 12,
    padding: "10px 14px",
    background: "#6c63ff",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  secondary: {
    border: 0,
    borderRadius: 12,
    padding: "10px 14px",
    background: "#eef0f6",
    color: "#4c5361",
    fontWeight: 900,
    cursor: "pointer",
  },

  summary: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
  },

  label: {
    display: "block",
    color: "#858c99",
    fontSize: 11,
    marginBottom: 3,
  },

  summaryItem: {},

  form: {
    background: "#f7f7fb",
    borderRadius: 17,
    padding: 16,
    marginBottom: 18,
  },

  formTitle: {
    fontWeight: 950,
    marginBottom: 13,
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2,minmax(0,1fr))",
    gap: 10,
  },

  field: {
    display: "grid",
    gap: 6,
    marginTop: 10,
    fontSize: 12,
    fontWeight: 800,
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 11px",
    border: "1px solid #dfe3eb",
    borderRadius: 10,
    background: "#fff",
    fontSize: 14,
  },

  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 14,
  },

  empty: {
    padding: "30px 15px",
    borderRadius: 16,
    background: "#fafbfc",
    color: "#737b8c",
    display: "grid",
    justifyItems: "center",
    gap: 6,
    textAlign: "center",
  },

  timeline: {
    position: "relative",
    display: "grid",
    gap: 0,
  },

  entry: {
    display: "grid",
    gridTemplateColumns:
      "70px 18px minmax(0,1fr)",
    gap: 10,
    minHeight: 74,
  },

  time: {
    fontSize: 11,
    color: "#8a92a0",
    fontWeight: 800,
    textAlign: "right",
    paddingTop: 4,
    display: "grid",
    alignContent: "start",
    gap: 2,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    marginTop: 6,
    position: "relative",
    zIndex: 2,
  },

  entryBody: {
    borderBottom: "1px solid #eef0f4",
    paddingBottom: 12,
    marginBottom: 12,
  },

  entryTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
  },

  category: {
    display: "block",
    color: "#777f8e",
    fontSize: 11,
    marginBottom: 4,
  },

  entryTitle: {
    fontSize: 14,
    display: "block",
  },

  duration: {
    color: "#6c63ff",
    fontSize: 12,
    fontWeight: 900,
    whiteSpace: "nowrap",
  },

  entryActions: {
    display: "flex",
    gap: 8,
    marginTop: 7,
  },

  textButton: {
    border: 0,
    background: "transparent",
    padding: 0,
    color: "#6c63ff",
    fontSize: 11,
    fontWeight: 800,
    cursor: "pointer",
  },
};
