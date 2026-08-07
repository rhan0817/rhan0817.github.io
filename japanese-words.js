// 每日日文單字 — 選字邏輯 + 通知提醒
const WORDS_PER_DAY = 20;
const NOTIFY_HOUR = 9;
const NOTIFY_MINUTE = 0;
const SHUFFLE_SEED = 42;
const STORAGE_KEY_LAST_NOTIFIED = "jpwords_last_notified_date";

// 固定種子的簡易 PRNG（mulberry32），確保每個人在同一天看到同一組單字
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle(array, seed) {
  const rand = mulberry32(seed);
  const result = array.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function todayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function daysSinceEpoch(date = new Date()) {
  const midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor(midnight.getTime() / 86400000);
}

const wordOrder = seededShuffle(JAPANESE_WORDS.map((_, i) => i), SHUFFLE_SEED);

function getWordsForDay(date = new Date()) {
  const total = wordOrder.length;
  const cycleLength = Math.ceil(total / WORDS_PER_DAY);
  const dayIndex = daysSinceEpoch(date) % cycleLength;
  const start = dayIndex * WORDS_PER_DAY;
  const indices = [];
  for (let i = 0; i < WORDS_PER_DAY; i++) {
    indices.push(wordOrder[(start + i) % total]);
  }
  return indices.map((i) => JAPANESE_WORDS[i]);
}

function renderWords(words) {
  const grid = document.querySelector("#word-grid");
  grid.innerHTML = words
    .map(
      (w, i) => `
        <article class="word-card">
          <div class="word-card-head">
            <span class="word-index">${String(i + 1).padStart(2, "0")}</span>
            <span class="word-category">${w.category}</span>
          </div>
          <p class="word-kanji">${w.kanji}</p>
          <p class="word-kana">${w.kana}</p>
          <p class="word-romaji">${w.romaji}</p>
          <p class="word-zh">${w.zh}</p>
          <div class="word-example">
            <p class="example-jp">${w.example.jp}</p>
            <p class="example-romaji">${w.example.romaji}</p>
            <p class="example-zh">${w.example.zh}</p>
          </div>
        </article>
      `
    )
    .join("");
}

function updateMeta(date) {
  document.querySelector("#today-date").textContent = date.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long"
  });
}

function buildNotificationBody(words) {
  const preview = words
    .slice(0, 5)
    .map((w) => `${w.kanji}（${w.zh}）`)
    .join("、");
  return `今天的 20 個新單字已經準備好了：${preview}...`;
}

function showDailyNotification(words) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  new Notification("每日日文單字 📖", {
    body: buildNotificationBody(words),
    tag: "daily-japanese-words"
  });
  localStorage.setItem(STORAGE_KEY_LAST_NOTIFIED, todayKey());
}

function maybeNotify(words) {
  const now = new Date();
  const alreadyNotifiedToday = localStorage.getItem(STORAGE_KEY_LAST_NOTIFIED) === todayKey(now);
  if (alreadyNotifiedToday) return;
  const afterNotifyTime =
    now.getHours() > NOTIFY_HOUR || (now.getHours() === NOTIFY_HOUR && now.getMinutes() >= NOTIFY_MINUTE);
  if (afterNotifyTime) {
    showDailyNotification(words);
  }
}

function setPermissionStatus() {
  const statusEl = document.querySelector("#notify-status");
  const button = document.querySelector("#notify-toggle");
  if (!("Notification" in window)) {
    statusEl.textContent = "此瀏覽器不支援通知功能。";
    button.disabled = true;
    return;
  }
  if (Notification.permission === "granted") {
    statusEl.textContent = "已開啟每日 9:00 提醒（需保持此分頁開啟）。";
    button.textContent = "提醒已開啟";
    button.disabled = true;
  } else if (Notification.permission === "denied") {
    statusEl.textContent = "通知權限已被封鎖，請於瀏覽器設定中手動開啟。";
    button.disabled = true;
  } else {
    statusEl.textContent = "尚未開啟提醒。點擊按鈕以允許瀏覽器通知。";
    button.textContent = "開啟每日提醒";
    button.disabled = false;
  }
}

function init() {
  const today = new Date();
  const words = getWordsForDay(today);
  updateMeta(today);
  renderWords(words);
  setPermissionStatus();

  document.querySelector("#notify-toggle").addEventListener("click", async () => {
    if (!("Notification" in window)) return;
    await Notification.requestPermission();
    setPermissionStatus();
  });

  document.querySelector("#notify-test").addEventListener("click", () => {
    if (!("Notification" in window) || Notification.permission !== "granted") {
      alert("請先開啟通知權限。");
      return;
    }
    new Notification("每日日文單字 📖（測試）", {
      body: buildNotificationBody(words),
      tag: "daily-japanese-words-test"
    });
  });

  maybeNotify(words);
  // 頁面保持開啟時，每分鐘檢查一次是否到了 9:00 提醒時間
  setInterval(() => maybeNotify(getWordsForDay(new Date())), 60 * 1000);
}

init();
