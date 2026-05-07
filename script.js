const models = {
  salmon: {
    category: "Sushi Drive 01",
    title: "鮭魚壽司車 THE 3",
    description: "以鮭魚的油脂光澤搭配 THE 3 的俐落車身比例，主打靈活入彎與日常通勤的俐落節奏。",
    flavor: "濃郁鮭魚",
    drive: "輕快精準",
    scene: "城市午餐",
    image: "assets/card-salmon.jpg",
    alt: "鮭魚壽司車 THE 3"
  },
  tuna: {
    category: "Sushi Drive 02",
    title: "鮪魚壽司車 THE 5",
    description: "鮪魚紅身像是運動化塗裝，搭配 THE 5 的穩定底盤，適合從晚餐聚會一路開到夜色裡。",
    flavor: "厚切鮪魚",
    drive: "沉穩有力",
    scene: "週末聚餐",
    image: "assets/card-tuna.jpg",
    alt: "鮪魚壽司車 THE 5"
  },
  flounder: {
    category: "Sushi Drive 03",
    title: "花枝壽司車 X5",
    description: "花枝白身帶出 X5 的俐落輪廓，口感清爽，設定上適合家庭出遊與長程移動。",
    flavor: "清甜花枝",
    drive: "舒適開闊",
    scene: "家庭出遊",
    image: "assets/card-flounder.jpg",
    alt: "花枝壽司車 X5"
  },
  tamago: {
    category: "Sushi Drive 04",
    title: "玉子燒壽司車 X7",
    description: "玉子燒的柔和金黃色搭配 X7 的大器車格，主打滿載歡聚、一路都很有派頭。",
    flavor: "香甜玉子",
    drive: "大器豪華",
    scene: "多人慶祝",
    image: "assets/card-tamago.jpg",
    alt: "玉子燒壽司車 X7"
  }
};

const rules = {
  period: {
    title: "2026.05.07 - 2026.06.30",
    body: "活動期間內於指定門市消費聯名餐點，即可參與壽司車集點任務。數量有限，贈完為止。"
  },
  points: {
    title: "消費集點，兌換聯名周邊",
    body: "單筆消費每滿 NT$300 可獲得 1 點，集滿指定點數即可兌換模型、貼紙組或餐墊。"
  },
  drive: {
    title: "BMW 試乘預約優惠",
    body: "於活動頁完成指定車款試乘登記，並至合作展示中心完成體驗，可獲得聯名餐點折抵券。"
  }
};

const stores = {
  taipei: [
    ["台北信義聯名店", "台北市信義區松壽路 18 號", "11:00 - 22:00"],
    ["南港車站店", "台北市南港區忠孝東路七段 369 號", "11:00 - 21:30"],
    ["板橋大遠百店", "新北市板橋區新站路 28 號", "11:00 - 22:00"]
  ],
  taichung: [
    ["台中旗艦聯名店", "台中市西屯區台灣大道三段 251 號", "11:00 - 22:00"],
    ["大魯閣新時代店", "台中市東區復興路四段 186 號", "11:00 - 21:30"],
    ["豐原太平洋店", "台中市豐原區復興路 2 號", "11:00 - 21:30"]
  ],
  kaohsiung: [
    ["高雄夢時代聯名店", "高雄市前鎮區中華五路 789 號", "11:00 - 22:00"],
    ["左營新光店", "高雄市左營區高鐵路 123 號", "11:00 - 21:30"],
    ["義享天地店", "高雄市鼓山區大順一路 115 號", "11:00 - 22:00"]
  ]
};

const cardButtons = document.querySelectorAll("[data-model]");
const detailImage = document.querySelector("#detail-image");
const detailCategory = document.querySelector("#detail-category");
const detailTitle = document.querySelector("#detail-title");
const detailDescription = document.querySelector("#detail-description");
const detailFlavor = document.querySelector("#detail-flavor");
const detailDrive = document.querySelector("#detail-drive");
const detailScene = document.querySelector("#detail-scene");
const toast = document.querySelector("[data-toast]");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2600);
}

function selectModel(key, shouldScroll = false) {
  const model = models[key];
  if (!model) return;

  cardButtons.forEach((button) => {
    const isCurrent = button.dataset.model === key;
    button.classList.toggle("is-active", isCurrent);
    button.setAttribute("aria-selected", String(isCurrent));
  });

  detailCategory.textContent = model.category;
  detailTitle.textContent = model.title;
  detailDescription.textContent = model.description;
  detailFlavor.textContent = model.flavor;
  detailDrive.textContent = model.drive;
  detailScene.textContent = model.scene;
  detailImage.src = model.image;
  detailImage.alt = model.alt;

  if (shouldScroll) {
    document.querySelector(".detail-panel").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

cardButtons.forEach((button) => {
  button.addEventListener("click", () => selectModel(button.dataset.model, true));
});

document.querySelector("[data-show-all]").addEventListener("click", () => {
  document.querySelector("#collection").scrollIntoView({ behavior: "smooth", block: "start" });
  showToast("四款壽司車都在這裡，點卡片可以切換細節。");
});

document.querySelector("[data-add-drive]").addEventListener("click", () => {
  showToast(`${detailTitle.textContent} 已加入試乘清單。`);
});

document.querySelectorAll("[data-product]").forEach((button) => {
  button.addEventListener("click", () => {
    showToast(`${button.dataset.product} 已加入收藏。`);
  });
});

document.querySelectorAll("[data-perk]").forEach((button) => {
  button.addEventListener("click", () => {
    showToast(`${button.dataset.perk}資訊已更新在活動區塊。`);
    document.querySelector("#rules").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll("[data-rule-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    const content = rules[button.dataset.ruleTab];
    document.querySelectorAll("[data-rule-tab]").forEach((tab) => {
      const isCurrent = tab === button;
      tab.classList.toggle("is-active", isCurrent);
      tab.setAttribute("aria-selected", String(isCurrent));
    });
    document.querySelector("#rule-panel").innerHTML = `<h3>${content.title}</h3><p>${content.body}</p>`;
  });
});

function renderStores(city) {
  const list = document.querySelector("#store-list");
  list.innerHTML = stores[city]
    .map(
      ([name, address, hours]) => `
        <article class="store-item">
          <h3>${name}</h3>
          <p>${address}</p>
          <p>${hours}</p>
          <button type="button" data-store="${name}">選擇門市</button>
        </article>
      `
    )
    .join("");

  list.querySelectorAll("[data-store]").forEach((button) => {
    button.addEventListener("click", () => showToast(`${button.dataset.store} 已設為訂位門市。`));
  });
}

document.querySelectorAll("[data-city]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-city]").forEach((item) => item.classList.toggle("is-active", item === button));
    renderStores(button.dataset.city);
  });
});

function openModal(id) {
  const dialog = document.querySelector(`#${id}-modal`);
  if (!dialog) return;

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }

  document.body.classList.add("modal-open");
}

function closeModal(dialog) {
  if (!dialog) return;
  if (typeof dialog.close === "function") {
    dialog.close();
  } else {
    dialog.removeAttribute("open");
  }
  document.body.classList.remove("modal-open");
}

document.querySelectorAll("[data-open-modal]").forEach((button) => {
  button.addEventListener("click", () => openModal(button.dataset.openModal));
});

document.querySelectorAll(".modal").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeModal(dialog);
  });
  dialog.addEventListener("close", () => document.body.classList.remove("modal-open"));
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", () => closeModal(button.closest("dialog")));
});

document.querySelector("[data-booking-form]").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const name = new FormData(form).get("name") || "貴賓";
  closeModal(form.closest("dialog"));
  form.reset();
  showToast(`${name}，訂位資訊已送出。`);
});

const dateInput = document.querySelector('input[type="date"]');
if (dateInput) {
  const today = new Date();
  const offset = today.getTimezoneOffset() * 60000;
  dateInput.min = new Date(today.getTime() - offset).toISOString().slice(0, 10);
}

const menuToggle = document.querySelector("[data-menu-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
menuToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const navLinks = [...document.querySelectorAll(".main-nav a")];
const observedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const observer = new IntersectionObserver(
  (entries) => {
    const current = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!current) return;

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${current.target.id}`);
    });
  },
  { rootMargin: "-30% 0px -55% 0px", threshold: [0.1, 0.4, 0.7] }
);

observedSections.forEach((section) => observer.observe(section));
renderStores("taipei");
