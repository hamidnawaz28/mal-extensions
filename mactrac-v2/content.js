// content.js — MacTrac (B/W) — ONBOARD ONLY ON BUTTON PRESS
// - Floating logo button (bottom-right) → when clicked: gatekeep (email→code) once, then open panel
// - Panel: daily log, calendar, settings, scan-on-demand
// - Background call: { type: "ANALYZE_CONTEXT", payload }
// - Manual Add overlay
// - Calendar shows daily totals + running weight estimate since start

(() => {
	// ─────────────────────────────────────────────────────────────────────────
	// Constants / IDs
	// ─────────────────────────────────────────────────────────────────────────
	const Z_MAX = 2147483647;

	const ID_BTN = "mactrac-btn";
	const ID_STYLE = "mactrac-style";

	const ID_HUD = "mactrac-loading-hud";
	const ID_HUD_IMG = "mactrac-loading-img";
	const ID_HUD_TEXT = "mactrac-loading-text";
	const K_SETTINGS = "mactrac_settings_v1";

	const ID_PANEL = "mactrac-panel";
	const ID_PANEL_CONTENT = "mactrac-panel-content";
	const ID_PANEL_CLOSE = "mactrac-panel-close";
	const ID_COUNTER = "showUsageCount";

	const ID_DATE = "mt-date";
	const ID_ADD_CURRENT = "mt-add-current";
	const ID_ADD_MANUAL = "mt-add-manual";
	const ID_CLEAR = "mt-clear";
	const ID_OPEN_CAL = "mt-open-cal";
	const ID_SCAN = "mt-scan";

	const ID_T_CAL = "mt-t-cal";
	const ID_T_PRO = "mt-t-pro";
	const ID_T_CAR = "mt-t-car";
	const ID_T_FAT = "mt-t-fat";
	const ID_LIST = "mt-log-list";

	const ID_CAL_OVERLAY = "mt-cal-overlay";
	const ID_CAL_MONTH = "mt-cal-month";
	const ID_CAL_GRID = "mt-cal-grid";

	const ID_SET_MAINT = "mt-set-maint";
	const ID_SET_DESIRED = "mt-set-desired";
	const ID_SET_START_DATE = "mt-set-start-date";
	const ID_SET_START_WEIGHT = "mt-set-start-weight";
	const ID_SET_UNIT = "mt-set-unit";
	const ID_SET_SAVE = "mt-set-save";

	// Manual Add overlay + inputs
	const ID_MANUAL_OVERLAY = "mt-manual-overlay";
	const ID_MN_NAME = "mt-mn-name";
	const ID_MN_CAL = "mt-mn-cal";
	const ID_MN_PRO = "mt-mn-pro";
	const ID_MN_CAR = "mt-mn-car";
	const ID_MN_FAT = "mt-mn-fat";
	const ID_MN_SAVE = "mt-mn-save";
	const ID_MN_CLOSE = "mt-mn-close";

	const K_LOG = "mactrac_log_v1";

	// Onboarding (one-time), ONLY when user clicks the bottom-right button
	const K_ONBOARDED = "mactrac_onboarded_v1";
	const K_TOKEN = "mactrac_token_v1";
	const API_BASE = "https://mactrac.onrender.com/api"; // for onboarding endpoints

	const ICON_PATH = "icons/mactrac-48.png";
	const iconURL = () => chrome.runtime.getURL(ICON_PATH);

	// Background API
	const SCAN_MESSAGE_TYPE = "ANALYZE_CONTEXT";
	const SCAN_TIMEOUT_MS = 25000;

	// State
	let lastResult = null;
	let lastContext = null;
	let calCurrent = new Date();
	let activeDateStr = null;

	let defaultUsageCount = 0;

	chrome.runtime.sendMessage({ type: "CHECK_USAGE_LIMIT" }, (resp) => {
		defaultUsageCount = Number(resp.remaining) || 0;
	});

	// ─────────────────────────────────────────────────────────────────────────
	// Utils
	// ─────────────────────────────────────────────────────────────────────────
	const log = (...a) => {
		try {
			console.log("[MacTrac]", ...a);
		} catch {}
	};
	const err = (...a) => {
		try {
			console.error("[MacTrac]", ...a);
		} catch {}
	};

	function todayStr(d = new Date()) {
		const t = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
		return t.toISOString().slice(0, 10);
	}
	const toNum = (v) => (v == null || v === "" ? 0 : Number(v) || 0);
	function fmt(n, dec = 0) {
		const x = Number(n);
		return (isFinite(x) ? x : 0).toFixed(dec);
	}

	// Storage helpers (async, chrome.storage)
	const getLocal = (keys) =>
		new Promise((res) => chrome.storage.local.get(keys, res));
	const setLocal = (obj) =>
		new Promise((res) => chrome.storage.local.set(obj, res));

	async function getDayItems(ds) {
		const res = await getLocal([K_LOG]);
		const L = res[K_LOG] || {};
		return Array.isArray(L[ds]) ? L[ds] : [];
	}
	async function setDayItems(ds, arr) {
		const res = await getLocal([K_LOG]);
		const L = res[K_LOG] || {};
		L[ds] = arr;
		await setLocal({ [K_LOG]: L });
	}
	async function loadLog() {
		const res = await getLocal([K_LOG]);
		return res[K_LOG] || {};
	}

	// Settings
	async function loadSettings() {
		const res = await getLocal([K_SETTINGS]);
		const d = res[K_SETTINGS] || {};
		const _toNum = (v) => (v == null || v === "" ? 0 : Number(v) || 0);
		const _todayStr = (d2 = new Date()) => {
			const t = new Date(d2.getTime() - d2.getTimezoneOffset() * 60000);
			return t.toISOString().slice(0, 10);
		};
		const maint = _toNum(d.maint) || 2000;
		return {
			maint,
			desired: _toNum(d.desired) || maint,
			startDate:
				d.startDate || _todayStr(new Date(new Date().getFullYear(), 0, 1)),
			startWeight: _toNum(d.startWeight) || 180,
			unit: d.unit === "kg" ? "kg" : "lb",
		};
	}
	async function saveSettings(s) {
		await setLocal({ [K_SETTINGS]: s });
	}

	// Shape background JSON into one item
	function resultToItem(r) {
		if (!r || typeof r !== "object") return null;
		const per = r.macros_per_serving || r.per_serving || r.per || {};
		const tot = r.macros_total || r.total || r.totals || {};
		const top = {
			calories: r.calories,
			protein_g: r.protein_g,
			carbs_g: r.carbs_g,
			fat_g: r.fat_g,
		};
		const hasTop = Object.values(top).some((v) => typeof v === "number");
		const src = per && Object.keys(per).length ? per : hasTop ? top : tot || {};
		const name =
			r.name || r.title || r.label || (r.is_recipe ? "Recipe" : "Item");
		return {
			name,
			calories: toNum(src.calories),
			protein: toNum(src.protein_g),
			carbs: toNum(src.carbs_g),
			fat: toNum(src.fat_g),
		};
	}
	function sumDay(items) {
		return items.reduce(
			(acc, it) => {
				acc.calories += toNum(it.calories);
				acc.protein += toNum(it.protein);
				acc.carbs += toNum(it.carbs);
				acc.fat += toNum(it.fat);
				return acc;
			},
			{ calories: 0, protein: 0, carbs: 0, fat: 0 }
		);
	}
	// Extract strict JSON from OpenAI chat completion envelopes (with code fences, etc.)
	function parseMaybeLLM(data) {
		// If it already looks like your schema, pass through
		if (
			data &&
			(data.macros_per_serving || data.macros_total || data.per || data.tot)
		)
			return data;

		// Handle OpenAI Chat Completions envelope
		const choice = data?.choices?.[0];
		let text = choice?.message?.content ?? choice?.delta?.content ?? null;
		if (typeof text !== "string") return data; // not an envelope; return as-is

		// Strip ``` blocks (```json ... ```)
		text = text.trim();
		if (text.startsWith("```")) {
			text = text
				.replace(/^```[a-zA-Z]*\s*/, "")
				.replace(/```$/, "")
				.trim();
		}

		// Try straight parse
		try {
			return JSON.parse(text);
		} catch {}

		// Lenient cleanup: smart quotes, trailing commas
		const cleaned = text
			.replace(/[\u2018\u2019]/g, "'")
			.replace(/[\u201C\u201D]/g, '"')
			.replace(/,\s*([}\]])/g, "$1");
		try {
			return JSON.parse(cleaned);
		} catch {}

		// Fallback: grab the first { ... } block
		const m = cleaned.match(/\{[\s\S]*\}/m);
		if (m) {
			try {
				return JSON.parse(m[0]);
			} catch {}
		}

		// If all else fails, return the original so UI can show an error/raw
		console.log({ data });
		return data;
	}

	// ─────────────────────────────────────────────────────────────────────────
	// Styles (B/W theme + overlays + panel)
	// ─────────────────────────────────────────────────────────────────────────
	function injectBaseStyles() {
		if (document.getElementById(ID_STYLE)) return;
		const style = document.createElement("style");
		style.id = ID_STYLE;
		style.textContent = `
      /* Floating Button */
      #${ID_BTN}{position:fixed;right:16px;bottom:16px;width:48px;height:48px;padding:0;border:0;border-radius:12px;background:transparent;cursor:pointer;z-index:${Z_MAX};line-height:0}
      #${ID_BTN} img{display:block;width:100%;height:100%;user-select:none;-webkit-user-drag:none;filter:drop-shadow(0 3px 10px rgba(0,0,0,.35))}

      /* HUD */
      #${ID_HUD}{position:fixed;left:50%;bottom:96px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:10px;padding:12px 14px;border-radius:12px;background:rgba(245, 243, 243, 0.85);color:#fff;font:14px/1.2 ui-sans-serif;z-index:${Z_MAX};opacity:0;transition:opacity .18s ease;pointer-events:none;box-shadow:0 8px 24px rgba(65, 63, 63, 0.35)}
      #${ID_HUD}[data-show="1"]{opacity:1}
      #${ID_HUD_IMG}{display:block;width:66px;height:66px;animation:mactrac-bounce .9s ease-in-out infinite;user-select:none;-webkit-user-drag:none}
      #${ID_HUD_TEXT}{color:#fff;font-weight:700;letter-spacing:.4px;text-shadow:0 1px 0 rgba(27, 25, 25, 0.98)}
      @keyframes mactrac-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}

      /* Panel */
       #${ID_PANEL}{
        position:fixed;top:0;right:0;
        width:min(480px,95vw);
       height:100vh;max-height:100vh; /* lock to viewport height */
        display:flex;flex-direction:column; /* flex column layout */
        background:#000;color:#ffd700;z-index:${Z_MAX};
        box-shadow:0 0 0 1px rgba(255, 255, 255, 0.99), -16px 0 32px rgba(238, 230, 230, 0.98);
        transform:translateX(100%);transition:transform .25s ease;
      }
      #${ID_PANEL}[data-open="1"]{transform:translateX(0)}
      #${ID_PANEL} header{position:relative;display:flex;flex-direction:column;align-items:center;gap:8px;padding:12px 14px;border-bottom:1px solid rgba(135, 135, 135, 0.99);background:linear-gradient(180deg,#060606,#000);text-align:center}
      #${ID_PANEL} header img{width:86px;height:86px;filter:drop-shadow(0 2px 8px rgba(65, 65, 65, 0.85))}
      #${ID_PANEL} header h1{margin:0;font:800 16px/1 ui-sans-serif;letter-spacing:.6px;text-transform:uppercase;color:#eaeaea;text-shadow:0 1px 0 rgba(114,114,114,.88), 0 0 8px rgba(255,255,255,.08)}
      #${ID_PANEL} header .date{font:700 12px/1 ui-sans-serif;color:#bbb;letter-spacing:.3px;text-transform:uppercase}
      #${ID_PANEL} header .row{display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:center;margin-top:4px}
      #${ID_PANEL_CONTENT}{
        padding:12px 14px;
        flex:1;                 /* take remaining space */
       min-height:0;           /* critical so it can shrink and scroll */
      overflow-y:auto;        /* scroll the content, not the page */
       -webkit-overflow-scrolling:touch; /* smoother on trackpads/touch */
      overscroll-behavior:contain;
     }
      #${ID_PANEL} header #${ID_PANEL_CLOSE}{position:absolute;top:8px;left:8px;background:transparent;border:none;color:#ffd700;font-size:16px;cursor:pointer}
	  #${ID_PANEL} header #${ID_COUNTER}{position:absolute;top:8px;right:8px;background:transparent;border:none;color:#ffd700;font-size:16px;cursor:pointer}

      /* Gothic Buttons */
      .mt-btn{--bd:rgba(255,255,255,.18);--bdh:rgba(255, 255, 255, 0.35);--bg:#0c0c0c;--bgh:#151515;--fg:#fff;
        background:var(--bg);color:var(--fg);border:1px solid var(--bd);border-radius:9px;padding:8px 12px;
        font:800 12px/1 ui-sans-serif;letter-spacing:.8px;text-transform:uppercase;cursor:pointer;
        box-shadow:inset 0 0 0 1px rgba(255,255,255,.04), 0 1px 0 rgba(255,255,255,.06);
        transition:background .15s ease,border-color .15s ease,transform .06s ease}
      .mt-btn:hover{background:var(--bgh);border-color:var(--bdh)}
      .mt-btn:active{transform:translateY(1px)}
      .mt-btn.ghost{background:transparent;border-color:rgba(255,255,255,.28)}
      .mt-btn.ghost:hover{background:#0a0a0a}

      /* Chips + list */
      .mt-chips{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:10px 0 24px}
      .mt-chip{background:#0f0f0f;border:1px solid #1a1a1a;border-radius:10px;padding:10px}
      .mt-chip b{display:block;font:800 11px/1 ui-sans-serif;color:#aaa;margin-bottom:6px;letter-spacing:.4px;text-transform:uppercase}
      .mt-chip span{font:700 14px/1 ui-sans-serif;color:#fff}

      .mt-section-title{margin:12px 0 6px;font:800 13px/1 ui-sans-serif;letter-spacing:.6px;color:#eee;text-transform:uppercase}
      .mt-list{list-style:none;padding:0;margin:0 -12px}
      .mt-item{background:#0f0f0f;border:1px solid #1a1a1a;border-radius:0;padding:12px;display:flex;justify-content:space-between;gap:2px;min-height:58px;width:100%}
      .mt-item .name{font-weight:700;letter-spacing:.3px}
      .mt-item .vals{opacity:.9}

      /* Calendar */
      #${ID_CAL_OVERLAY}{position:fixed;inset:0;background:rgba(255,255,255,1);z-index:${Z_MAX};display:none;align-items:center;justify-content:center;padding:20px}
      #${ID_CAL_OVERLAY}[data-open="1"]{display:flex}
      .mt-cal{background:#000;border:1px solid #e3e3e3ff;border-radius:12px;width:min(820px,95vw);max-height:90vh;overflow:auto;box-shadow:0 12px 40px rgba(255,255,255,.5)}
      .mt-cal header{display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid #ecebebff;background:linear-gradient(180deg,#070707,#000)}
      .mt-cal header h2{margin:0;font:800 14px/1 ui-sans-serif}
      .mt-cal header .spacer{flex:1}
      .mt-cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;padding:12px 14px}
      .mt-cal-cell{background:#0f0f0f;border:1px solid #1a1a1a;border-radius:10px;padding:8px;min-height:96px;display:flex;flex-direction:column}
      .mt-cal-cell .d{font:800 12px/1 ui-sans-serif;color:#aaa;margin-bottom:6px}
      .mt-cal-cell .kcal{font:700 13px/1 ui-sans-serif;color:#ffd700}
      .mt-cal-cell .wt{font:700 12px/1 ui-sans-serif;color:#bbb;margin-top:4px}
      .mt-cal-cell .goal{margin-top:auto;font:700 11px/1 ui-sans-serif;color:#9ad;opacity:.95}
      .mt-cal-cell .loss{font:700 11px/1 ui-sans-serif;color:#9f9;opacity:.95;margin-top:3px}

      /* Settings & Manual Add */
      .mt-settings{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;padding:0 14px 14px}
      .mt-settings label{display:flex;flex-direction:column;gap:6px;font:700 12px/1 ui-sans-serif;color:#ddd;letter-spacing:.3px;text-transform:uppercase}
      .mt-settings input,.mt-settings select{background:#0f0f0f;border:1px solid #1a1a1a;color:#fff;border-radius:8px;padding:8px 10px;font:700 13px/1 ui-sans-serif}
      .mt-settings .row{grid-column:1 / -1;display:flex;justify-content:flex-end}

      #${ID_MANUAL_OVERLAY}{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:${Z_MAX};display:none;align-items:center;justify-content:center;padding:20px}
      #${ID_MANUAL_OVERLAY}[data-open="1"]{display:flex}
      .mt-manual{background:#000;border:1px solid #1a1a1a;border-radius:12px;width:min(520px,95vw);max-height:90vh;overflow:auto;box-shadow:0 12px 40px rgba(0,0,0,.5)}
      .mt-manual header{display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid #1a1a1a;background:linear-gradient(180deg,#070707,#000)}
      .mt-manual header h3{margin:0;font:800 14px/1 ui-sans-serif}
      .mt-manual .spacer{flex:1}
      .mt-manual .body{padding:12px 14px}

      /* Onboarding */
      .mt-onb-overlay{position:fixed;inset:0;z-index:${Z_MAX};display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.65)}
      .mt-onb-card{width:min(440px,95vw);background:#000;border:1px solid #1a1a1a;border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,.5);padding:16px}
      .mt-onb-card h3{margin:0 0 10px;font:800 16px/1 ui-sans-serif;color:#eee;letter-spacing:.4px}
      .mt-onb-card label{display:block;margin:8px 0 4px;font:700 12px/1 ui-sans-serif;color:#ccc;text-transform:uppercase;letter-spacing:.3px}
      .mt-onb-card input{width:100%;box-sizing:border-box;background:#0f0f0f;border:1px solid #1a1a1a;color:#fff;border-radius:10px;padding:10px}
      .mt-onb-row{display:flex;gap:8px;margin-top:12px}
      .mt-onb-btn{background:#0c0c0c;color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:10px;padding:10px 12px;font:800 12px/1 ui-sans-serif;letter-spacing:.8px;cursor:pointer}
      .mt-onb-btn[disabled]{opacity:.6;cursor:not-allowed}
      .mt-onb-note{margin-top:8px;color:#aaa;font:12px/1.2 ui-sans-serif}
    `;
		(document.head || document.documentElement).appendChild(style);
	}

	// ─────────────────────────────────────────────────────────────────────────
	// One-time onboarding (email → code) — only when user clicks the button
	// ─────────────────────────────────────────────────────────────────────────
	async function gatekeepThen(fn) {
		// If already onboarded, just run the action
		const st = await getLocal([K_ONBOARDED]);
		if (st[K_ONBOARDED]) return void fn();

		// Otherwise, show onboarding overlay and then run the action
		await openOnboard();
		fn();
	}

	async function openOnboard() {
		injectBaseStyles();
		return new Promise((resolve) => {
			const overlay = document.createElement("div");
			overlay.className = "mt-onb-overlay";

			const card = document.createElement("div");
			card.className = "mt-onb-card";
			card.innerHTML = `
        <h3>Welcome to MacTrac</h3>
        <label>Email</label>
        <input id="mt-onb-email" type="email" placeholder="you@example.com" autocomplete="email" />
        <div class="mt-onb-row">
          <button id="mt-onb-send" class="mt-onb-btn">Send Code</button>
        </div>
        <div id="mt-onb-step2" style="display:none">
          <label>Enter Code</label>
          <input id="mt-onb-code" type="text" placeholder="6-digit code" inputmode="numeric" />
          <div class="mt-onb-row">
            <button id="mt-onb-verify" class="mt-onb-btn">Verify</button>
          </div>
        </div>
        <div class="mt-onb-note">You’ll only do this once on this browser.</div>
      `;

			overlay.appendChild(card);
			(document.body || document.documentElement).appendChild(overlay);

			const emailEl = card.querySelector("#mt-onb-email");
			const sendBtn = card.querySelector("#mt-onb-send");
			const step2 = card.querySelector("#mt-onb-step2");
			const codeEl = card.querySelector("#mt-onb-code");
			const verifyBtn = card.querySelector("#mt-onb-verify");

			const setBusy = (b) => {
				sendBtn.disabled = b;
				verifyBtn.disabled = b;
			};

			sendBtn.addEventListener("click", async () => {
				const email = (emailEl.value || "").trim();
				if (!email || !/@/.test(email)) {
					alert("Enter a valid email.");
					return;
				}
				try {
					setBusy(true);
					const r = await fetch(`${API_BASE}/auth/request-code`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ email }),
					});
					if (!r.ok) throw new Error(`Send failed (${r.status})`);
					step2.style.display = "";
					codeEl.focus();
				} catch (e) {
					alert("Could not send code. Try again.");
					err(e);
				} finally {
					setBusy(false);
				}
			});

			verifyBtn.addEventListener("click", async () => {
				const email = (emailEl.value || "").trim();
				const code = (codeEl.value || "").trim();
				if (!code) {
					alert("Enter the code from your email.");
					return;
				}
				try {
					setBusy(true);
					const r = await fetch(`${API_BASE}/auth/verify-code`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ email, code }),
					});
					if (!r.ok) {
						const t = await r.text().catch(() => "");
						throw new Error(t || `Verify failed (${r.status})`);
					}
					const j = await r.json();
					await setLocal({ [K_TOKEN]: j.token || "", [K_ONBOARDED]: true });
					overlay.remove();
					resolve(true);
				} catch (e) {
					alert("Incorrect or expired code. Request a new one.");
					err(e);
				} finally {
					setBusy(false);
				}
			});
		});
	}

	// ─────────────────────────────────────────────────────────────────────────
	// HUD
	// ─────────────────────────────────────────────────────────────────────────
	function showLoading(text = "Loading…") {
		if (document.getElementById(ID_HUD)) {
			setLoadingText(text);
			return;
		}
		injectBaseStyles();
		const hud = document.createElement("div");
		hud.id = ID_HUD;

		const img = new Image();
		img.id = ID_HUD_IMG;
		img.alt = "";
		img.width = 56;
		img.height = 56;
		img.src = iconURL();

		const label = document.createElement("div");
		label.id = ID_HUD_TEXT;
		label.textContent = text;

		hud.appendChild(img);
		hud.appendChild(label);
		(document.body || document.documentElement).appendChild(hud);
		requestAnimationFrame(() => {
			hud.dataset.show = "1";
		});
	}
	const setLoadingText = (t) => {
		const el = document.getElementById(ID_HUD_TEXT);
		if (el) el.textContent = t;
	};
	function hideLoading(delay = 200) {
		const hud = document.getElementById(ID_HUD);
		if (!hud) return;
		hud.dataset.show = "0";
		setTimeout(() => hud.remove(), delay);
	}

	// ─────────────────────────────────────────────────────────────────────────
	// Panel (header stacked: logo → title → date → buttons)
	// ─────────────────────────────────────────────────────────────────────────
	function ensurePanel() {
		let panel = document.getElementById(ID_PANEL);
		if (panel) return panel;

		injectBaseStyles();

		panel = document.createElement("aside");
		panel.id = ID_PANEL;

		const header = document.createElement("header");

		const logo = new Image();
		logo.src = iconURL();
		logo.alt = "";
		const title = document.createElement("h1");
		title.textContent = "Mac Trac";
		const dateSpan = document.createElement("div");
		dateSpan.id = ID_DATE;
		dateSpan.className = "date";

		// Buttons row under date
		const row = document.createElement("div");
		row.className = "row";
		const btnScan = button(ID_SCAN, "Scan");
		const btnCal = button(ID_OPEN_CAL, "Calendar");
		const btnAddCur = button(ID_ADD_CURRENT, "Add Current");
		const btnAddMan = button(ID_ADD_MANUAL, "Add Manual");
		const btnClr = button(ID_CLEAR, "Clear Day");
		const btnClose = button(ID_PANEL_CLOSE, "X", "ghost");

		const countWrap = document.createElement("span");
		countWrap.id = ID_COUNTER;
		countWrap.innerText = "Uses left: ";
		const showUsageCount = button("count", defaultUsageCount, "ghost");
		countWrap.append(showUsageCount);

		row.append(btnScan, btnCal, btnAddCur, btnAddMan, btnClr);
		header.appendChild(btnClose);
		header.appendChild(countWrap);

// Hide/show counter if paid status changes
try {
  var __mgr = window.extensionUsage;
  var __apply = function(st){ try { countWrap.style.display = (st && st.paid) ? "none" : ""; } catch(e){} };
  if (__mgr && typeof __mgr.getUserStatus === "function") { __apply(__mgr.getUserStatus()); }
  if (__mgr && typeof __mgr.addEventListener === "function") {
    __mgr.addEventListener("statusUpdate", __apply);
  }
} catch(e){}

		header.appendChild(logo);
		header.appendChild(title);
		header.appendChild(dateSpan);
		header.appendChild(row);

		const content = document.createElement("div");
		content.id = ID_PANEL_CONTENT;
		const intro = document.createElement("div");
		intro.className = "mt-section-title";
		intro.textContent = "Press Scan to analyze this page.";
		content.appendChild(intro);
		const intro2 = document.createElement("div");
		intro2.className = "mt-section-title";
		intro2.textContent =
			"TO BE MORE ACCURATE, MAKE SURE YOU HAVE NUTRITION FACTS OPEN";
		content.appendChild(intro2);
		const chips = document.createElement("div");
		chips.className = "mt-chips";
		chips.appendChild(chip(ID_T_CAL, "Calories"));
		chips.appendChild(chip(ID_T_PRO, "Protein (g)"));
		chips.appendChild(chip(ID_T_CAR, "Carbs (g)"));
		chips.appendChild(chip(ID_T_FAT, "Fat (g)"));

		const hList = sectionTitle("Today's Items");
		const list = document.createElement("ul");
		list.className = "mt-list";
		list.id = ID_LIST;

		content.append(chips, hList, list);

		panel.append(header, content);
		(document.body || document.documentElement).appendChild(panel);

		// actions
		var __closeEl = panel.querySelector("#" + ID_PANEL_CLOSE); if (__closeEl) { __closeEl.addEventListener("click", function(){ panel.removeAttribute("data-open"); }); }
		btnScan.addEventListener("click", async () => {
			
  try {
    // Ensure global manager exists
    var mgr = window.extensionUsage;
    if (!mgr && typeof ExtensionUsageManager === "function") {
      try { window.extensionUsage = new ExtensionUsageManager(); mgr = window.extensionUsage; } catch(e){}
    }

    if (mgr) {
      // get fresh status
      try { await mgr.refreshStatus(); } catch(_e){}

      // if subscribed: hide counter and run
      if (mgr.userStatus && mgr.userStatus.paid) {
        var cw = document.getElementById(ID_COUNTER);
        if (cw) { cw.style.display = "none"; }
        analyzePageWithHUD();
      } else {
        // free path with usage gate
        var result = await mgr.handleFeatureRequest("scanning");
        if (result && result.success) {
          // decrement UI counter if present
          try {
            var cntEl = document.getElementById("count");
            if (cntEl && typeof result.remaining === "number") {
              cntEl.innerText = result.remaining;
            }
          } catch(_e){}
          analyzePageWithHUD();
        } else {
          console.log("Daily limit or cancelled:", (result && (result.error || result)) || result);
        }
      }
    } else {
      // fallback: run anyway
      analyzePageWithHUD();
    }
  } catch (e) {
    console.error("Scan trigger failed:", e);
    analyzePageWithHUD();
  }
});
		btnCal.addEventListener("click", () => openCalendar(true));
		btnAddCur.addEventListener("click", onAddCurrent);
		btnAddMan.addEventListener("click", () => openManual(true));
		btnClr.addEventListener("click", onClearDay);

		updateDateLabel();
		renderDay().catch(() => {});
		setupCalendarOverlay();
		setupManualOverlay();

		return panel;
	}
	function openPanel() {
		const p = ensurePanel();
		p.setAttribute("data-open", "1");
		return p;
	}
	function button(id, text, kind = "") {
		const b = document.createElement("button");
		b.id = id;
		b.textContent = text;
		b.className = "mt-btn" + (kind ? " " + kind : "");
		return b;
	}
	function chip(id, label) {
		const d = document.createElement("div");
		d.className = "mt-chip";
		const b = document.createElement("b");
		b.textContent = label;
		const s = document.createElement("span");
		s.id = id;
		s.textContent = "—";
		d.appendChild(b);
		d.appendChild(s);
		return d;
	}
	function sectionTitle(text) {
		const h = document.createElement("div");
		h.className = "mt-section-title";
		h.textContent = text;
		return h;
	}

	function updateDateLabel(d = new Date()) {
		const el = document.getElementById(ID_DATE);
		if (!el) return;
		const dt = d.toLocaleDateString(undefined, {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
		el.textContent = dt;
	}

	// ─────────────────────────────────────────────────────────────────────────
	// Daily log rendering
	// ─────────────────────────────────────────────────────────────────────────
	async function renderDay(dStr = todayStr()) {
		activeDateStr = dStr;

		const items = await getDayItems(dStr);
		const totals = sumDay(items);

		setText(ID_T_CAL, `${fmt(totals.calories)} kcal`);
		setText(ID_T_PRO, `${fmt(totals.protein)} g`);
		setText(ID_T_CAR, `${fmt(totals.carbs)} g`);
		setText(ID_T_FAT, `${fmt(totals.fat)} g`);

		const list = document.getElementById(ID_LIST);
		if (!list) return;
		list.innerHTML = "";

		items.forEach((it, idx) => {
			const li = document.createElement("li");
			li.className = "mt-item";

			const left = document.createElement("div");
			const name = document.createElement("div");
			name.className = "name";
			name.textContent = it.name || "Item";
			const vals = document.createElement("div");
			vals.className = "vals";
			const parts = [];
			if (it.calories != null) parts.push(`${fmt(it.calories)} kcal`);
			if (it.protein != null) parts.push(`${fmt(it.protein)}g P`);
			if (it.carbs != null) parts.push(`${fmt(it.carbs)}g C`);
			if (it.fat != null) parts.push(`${fmt(it.fat)}g F`);
			vals.textContent = parts.join(" · ");
			left.appendChild(name);
			left.appendChild(vals);

			const del = document.createElement("button");
			del.textContent = "Remove";
			del.className = "mt-btn ghost";
			del.addEventListener("click", async () => {
				const arr = await getDayItems(dStr);
				arr.splice(idx, 1);
				await setDayItems(dStr, arr);
				await renderDay(dStr);
				await renderCalendar();
			});

			li.append(left, del);
			list.appendChild(li);
		});
	}
	function setText(id, text) {
		const el = document.getElementById(id);
		if (el) el.textContent = text;
	}

	async function onAddCurrent() {
		if (!lastResult) {
			alert("Nothing to add yet — scan first.");
			return;
		}
		const item = resultToItem(lastResult) || {
			name: "Item",
			calories: 0,
			protein: 0,
			carbs: 0,
			fat: 0,
		};
		const d = activeDateStr || todayStr();
		const arr = await getDayItems(d);
		arr.push(item);
		await setDayItems(d, arr);
		await renderDay(d);
		await renderCalendar();
	}
	async function onClearDay() {
		const d = activeDateStr || todayStr();
		if (!confirm(`Clear all entries for ${d}?`)) return;
		await setDayItems(d, []);
		await renderDay(d);
		await renderCalendar();
	}

	// ─────────────────────────────────────────────────────────────────────────
	// Calendar + Settings
	// ─────────────────────────────────────────────────────────────────────────
	function setupCalendarOverlay() {
		if (document.getElementById(ID_CAL_OVERLAY)) return;

		const overlay = document.createElement("div");
		overlay.id = ID_CAL_OVERLAY;

		const wrap = document.createElement("div");
		wrap.className = "mt-cal";

		const header = document.createElement("header");
		const prev = button("mt-cal-prev", "‹ Prev");
		const title = document.createElement("h2");
		title.id = ID_CAL_MONTH;
		const next = button("mt-cal-next", "Next ›");
		const space = document.createElement("div");
		space.className = "spacer";
		const close = button("mt-cal-close", "Close", "ghost");
		header.append(prev, title, next, space, close);

		const grid = document.createElement("div");
		grid.id = ID_CAL_GRID;
		grid.className = "mt-cal-grid";

		const settings = document.createElement("div");
		settings.className = "mt-settings";
		const sMaint = labeledInput(
			ID_SET_MAINT,
			"Maintenance (kcal/day)",
			"number"
		);
		const sDesired = labeledInput(
			ID_SET_DESIRED,
			"Desired Intake (kcal/day)",
			"number"
		);
		const sStartD = labeledInput(ID_SET_START_DATE, "Start Date", "date");
		const sStartW = labeledInput(ID_SET_START_WEIGHT, "Start Weight", "number");
		const sUnitL = document.createElement("label");
		sUnitL.textContent = "Unit";
		const sUnit = document.createElement("select");
		sUnit.id = ID_SET_UNIT;
		sUnit.innerHTML = `<option value="lb">lb</option><option value="kg">kg</option>`;
		sUnitL.appendChild(sUnit);
		const row = document.createElement("div");
		row.className = "row";
		const save = document.createElement("button");
		save.id = ID_SET_SAVE;
		save.textContent = "Save Settings";
		save.className = "mt-btn";
		row.appendChild(save);

		settings.append(sMaint, sDesired, sStartD, sStartW, sUnitL, row);

		wrap.append(header, grid, settings);

		overlay.appendChild(wrap);
		(document.body || document.documentElement).appendChild(overlay);

		prev.addEventListener("click", async () => {
			calCurrent.setMonth(calCurrent.getMonth() - 1);
			await renderCalendar();
		});
		next.addEventListener("click", async () => {
			calCurrent.setMonth(calCurrent.getMonth() + 1);
			await renderCalendar();
		});
		close.addEventListener("click", () => openCalendar(false));
		save.addEventListener("click", async () => {
			await saveSettingsFromInputs();
			await renderCalendar();
		});

		(async () => {
			await loadSettingsIntoInputs();
			await renderCalendar();
		})();
	}

	async function loadSettingsIntoInputs() {
		const s = await loadSettings();
		setInput(ID_SET_MAINT, s.maint);
		setInput(ID_SET_DESIRED, s.desired);
		setInput(ID_SET_START_DATE, s.startDate);
		setInput(ID_SET_START_WEIGHT, s.startWeight);
		setSelect(ID_SET_UNIT, s.unit);
	}
	async function saveSettingsFromInputs() {
		const s = await loadSettings();
		s.maint = toNum(getInput(ID_SET_MAINT)) || s.maint;
		const desiredIn = toNum(getInput(ID_SET_DESIRED));
		s.desired = desiredIn > 0 ? desiredIn : s.maint;
		s.startDate = getInput(ID_SET_START_DATE) || s.startDate;
		s.startWeight = toNum(getInput(ID_SET_START_WEIGHT)) || s.startWeight;
		const unit = getSelect(ID_SET_UNIT);
		s.unit = unit === "kg" ? "kg" : "lb";
		await saveSettings(s);
		alert("Settings saved.");
	}
	function setInput(id, v) {
		const el = document.getElementById(id);
		if (el) el.value = v;
	}
	function getInput(id) {
		const el = document.getElementById(id);
		return el ? el.value : "";
	}
	function setSelect(id, v) {
		const el = document.getElementById(id);
		if (el) el.value = v;
	}
	function getSelect(id) {
		const el = document.getElementById(id);
		return el ? el.value : "";
	}

	function openCalendar(open) {
		const el = document.getElementById(ID_CAL_OVERLAY);
		if (el) el.dataset.open = open ? "1" : "";
	}

	// Render Calendar
	async function renderCalendar() {
		const grid = document.getElementById(ID_CAL_GRID);
		const label = document.getElementById(ID_CAL_MONTH);
		if (!grid || !label) return;

		const year = calCurrent.getFullYear();
		const month = calCurrent.getMonth();
		const first = new Date(year, month, 1);
		const last = new Date(year, month + 1, 0);
		label.textContent = first.toLocaleDateString(undefined, {
			month: "long",
			year: "numeric",
		});

		const startPad = first.getDay();
		const totalDays = last.getDate();
		const cells = [];
		for (let i = 0; i < startPad; i++) cells.push(null);
		for (let d = 1; d <= totalDays; d++) cells.push(new Date(year, month, d));

		const s = await loadSettings();
		const logAll = await loadLog();
		const startDate = new Date(s.startDate || todayStr(new Date(year, 0, 1)));
		const calsPerUnit = s.unit === "kg" ? 7700 : 3500;

		const endWalk = new Date(year, month, totalDays);
		const walkEnd = new Date(Math.max(endWalk.getTime(), startDate.getTime()));
		let cumulativeDef = 0;
		const weightMap = new Map();

		const parseNumOrNaN = (v) => {
			if (v === null || v === undefined) return NaN;
			if (typeof v === "number") return v;
			const s = String(v).replace(/[^\d.\-]/g, "");
			const n = parseFloat(s);
			return Number.isFinite(n) ? n : NaN;
		};
		const dayKeysInRange = (startDate, endDate) => {
			const keys = [];
			const d = new Date(startDate);
			d.setHours(0, 0, 0, 0);
			const stop = new Date(endDate);
			stop.setHours(0, 0, 0, 0);
			for (; d <= stop; d.setDate(d.getDate() + 1)) keys.push(todayStr(d));
			return keys;
		};

		for (const key of dayKeysInRange(startDate, walkEnd)) {
			const items = logAll[key] || [];
			const tot = sumDay(items) || {};
			const calNum = parseNumOrNaN(tot.calories);
			const deficit = isNaN(calNum) ? 0 : s.maint - calNum;
			cumulativeDef += deficit;
			const deltaUnits = cumulativeDef / calsPerUnit;
			const w = s.startWeight - deltaUnits;

			weightMap.set(key, {
				kcal: isNaN(calNum) ? null : calNum,
				weight: Number.isFinite(w) ? +w.toFixed(2) : null,
				loss: Number.isFinite(deltaUnits) ? +deltaUnits.toFixed(2) : null,
			});
		}

		grid.innerHTML = "";
		cells.forEach((dateObj) => {
			const cell = document.createElement("div");
			cell.className = "mt-cal-cell";
			if (!dateObj) {
				grid.appendChild(cell);
				return;
			}

			const key = todayStr(dateObj);
			const baseItems = logAll[key] || [];
			const baseKcal = toNum(sumDay(baseItems).calories);

			const afterStart = dateObj >= startDate;
			const data = afterStart ? weightMap.get(key) || null : null;

			const dEl = document.createElement("div");
			dEl.className = "d";
			dEl.textContent = String(dateObj.getDate());
			const kcal = document.createElement("div");
			kcal.className = "kcal";
			kcal.textContent = `${fmt(baseKcal)} kcal`;

			cell.append(dEl, kcal);

			if (afterStart && data) {
				const wt = document.createElement("div");
				wt.className = "wt";
				wt.textContent = `${fmt(data.weight, 1)} ${s.unit}`;
				const loss = document.createElement("div");
				loss.className = "loss";
				const sign = data.loss > 0 ? "−" : data.loss < 0 ? "+" : "±";
				const abs = Math.abs(data.loss);
				loss.textContent = `${sign}${fmt(abs, 2)} ${s.unit} since start`;
				cell.append(wt, loss);
			}

			const goal = document.createElement("div");
			goal.className = "goal";
			goal.textContent = `Goal: ${fmt(s.desired)} kcal`;
			cell.appendChild(goal);

			cell.addEventListener("click", async () => {
				updateDateLabel(dateObj);
				await renderDay(todayStr(dateObj));
			});

			grid.appendChild(cell);
		});
	}

	// ─────────────────────────────────────────────────────────────────────────
	// Manual Add Overlay
	// ─────────────────────────────────────────────────────────────────────────
	function setupManualOverlay() {
		if (document.getElementById(ID_MANUAL_OVERLAY)) return;

		const overlay = document.createElement("div");
		overlay.id = ID_MANUAL_OVERLAY;

		const card = document.createElement("div");
		card.className = "mt-manual";

		const header = document.createElement("header");
		const h = document.createElement("h3");
		h.textContent = "Add Manual Entry";
		const space = document.createElement("div");
		space.className = "spacer";
		const close = button(ID_MN_CLOSE, "Close", "ghost");
		header.append(h, space, close);

		const body = document.createElement("div");
		body.className = "body";

		const grid = document.createElement("div");
		grid.className = "mt-settings";
		grid.append(
			labeledInput(ID_MN_NAME, "Name", "text"),
			labeledInput(ID_MN_CAL, "Calories", "number"),
			labeledInput(ID_MN_PRO, "Protein (g)", "number"),
			labeledInput(ID_MN_CAR, "Carbs (g)", "number"),
			labeledInput(ID_MN_FAT, "Fat (g)", "number")
		);

		const row = document.createElement("div");
		row.className = "row";
		const save = document.createElement("button");
		save.id = ID_MN_SAVE;
		save.textContent = "Add to Day";
		save.className = "mt-btn";
		row.appendChild(save);

		grid.appendChild(row);
		body.appendChild(grid);

		card.append(header, body);
		overlay.appendChild(card);
		(document.body || document.documentElement).appendChild(overlay);

		close.addEventListener("click", () => openManual(false));
		save.addEventListener("click", onSaveManual);
	}

	function openManual(open) {
		const el = document.getElementById(ID_MANUAL_OVERLAY);
		if (el) el.dataset.open = open ? "1" : "";
	}

	async function onSaveManual() {
		const name = (getInput(ID_MN_NAME) || "Item").trim();
		const calories = toNum(getInput(ID_MN_CAL));
		const protein = toNum(getInput(ID_MN_PRO));
		const carbs = toNum(getInput(ID_MN_CAR));
		const fat = toNum(getInput(ID_MN_FAT));

		const item = { name, calories, protein, carbs, fat };
		const d = activeDateStr || todayStr();
		const arr = await getDayItems(d);
		arr.push(item);
		await setDayItems(d, arr);
		await renderDay(d);
		await renderCalendar();

		setInput(ID_MN_NAME, "");
		setInput(ID_MN_CAL, "");
		setInput(ID_MN_PRO, "");
		setInput(ID_MN_CAR, "");
		setInput(ID_MN_FAT, "");
		openManual(false);
	}

	// ─────────────────────────────────────────────────────────────────────────
	// Scraping + Background call (scanner)
	// ─────────────────────────────────────────────────────────────────────────
	function collectContext() {
		const meta = {};
		document.querySelectorAll("meta[name],meta[property]").forEach((m) => {
			const k = m.getAttribute("name") || m.getAttribute("property");
			const v = m.getAttribute("content");
			if (k && v) meta[k] = v;
		});

		const recipe_meta = {
			servings: textNum(
				document.querySelector(
					'[itemprop="recipeYield"], .servings, .recipe-servings'
				)
			),
			servingSize: textClean(
				document.querySelector('[itemprop="servingSize"], .serving-size')
			),
		};

		const ingredients = Array.from(
			document.querySelectorAll(
				'[itemprop="recipeIngredient"], .ingredient, .ingredients li'
			)
		)
			.slice(0, 40)
			.map((el) => textClean(el))
			.filter(Boolean);

		const instructions_excerpt = Array.from(
			document.querySelectorAll(
				'[itemprop="recipeInstructions"], .instructions, .method, .steps'
			)
		)
			.map((el) => el.innerText || el.textContent || "")
			.join("\n")
			.slice(0, 1800);

		const nutrition_table_scrape = scrapeNutritionTable();

		const visible_text_excerpt = (document.body.innerText || "")
			.replace(/\s+/g, " ")
			.trim()
			.slice(0, 5000);

		return {
			url: location.href,
			meta,
			recipe_meta,
			ingredients,
			instructions_excerpt,
			nutrition_table_scrape,
			visible_text_excerpt,
		};
	}

	function textClean(el) {
		return ((el && (el.innerText || el.textContent || "")) || "").trim();
	}
	function textNum(el) {
		const t = textClean(el);
		const n = Number(String(t).replace(/[^\d.]/g, ""));
		return isFinite(n) ? n : null;
	}

	function normalizeResult(res) {
		if (!res || typeof res !== "object")
			return {
				per: {},
				tot: {},
				servings: null,
				servingSize: null,
				confidence: null,
				assumptions: [],
			};
		const per = res.macros_per_serving || res.per_serving || res.per || {};
		const tot = res.macros_total || res.total || res.totals || {};
		const top = {
			calories: res.calories,
			protein_g: res.protein_g,
			carbs_g: res.carbs_g,
			fat_g: res.fat_g,
		};
		const hasTop = Object.values(top).some((v) => typeof v === "number");
		return {
			per: per && Object.keys(per).length ? per : hasTop ? top : {},
			tot,
			servings: res.servings ?? res.servings_count ?? null,
			servingSize: res.serving_size ?? res.servingSize ?? null,
			confidence: res.confidence ?? null,
			assumptions: Array.isArray(res.assumptions) ? res.assumptions : [],
		};
	}

	function scrapeNutritionTable() {
		const CANDIDATE_SELECTORS = ["table", "section", "article", "div", "ul"];
		const KEYWORDS = [
			"nutrition",
			"nutritional",
			"calorie",
			"calories",
			"protein",
			"carb",
			"carbohydrate",
			"fat",
			"total fat",
		];
		const norm = (s) =>
			String(s || "")
				.replace(/\s+/g, " ")
				.replace(/\u00A0/g, " ")
				.trim();

		let best = null;
		for (const sel of CANDIDATE_SELECTORS) {
			for (const node of document.querySelectorAll(sel)) {
				const t = norm(node.textContent || "");
				if (!t) continue;
				if (KEYWORDS.some((k) => t.toLowerCase().includes(k))) {
					if (!best || t.length < best.text.length)
						best = { el: node, text: t };
				}
			}
		}
		if (!best) return {};

		const text = best.text;
		const mCalKcal = /calories[^0-9]{0,10}(\d{2,4})(?:\s*k?cal)?\b/i.exec(text);
		const mCalKJ = /(\d{3,5})\s*kJ\b/i.exec(text);
		const mProtein =
			/(protein|prot)[^0-9]{0,10}(\d{1,3}(?:\.\d+)?)\s*g\b/i.exec(text);
		const mCarbs =
			/(carb|carbohydrate)s?[^0-9]{0,10}(\d{1,3}(?:\.\d+)?)\s*g\b/i.exec(text);
		const mFat = /(total\s+fat|fat)[^0-9]{0,10}(\d{1,3}(?:\.\d+)?)\s*g\b/i.exec(
			text
		);

		const out = {};
		if (mCalKcal) out.calories = Number(mCalKcal[1]);
		else if (mCalKJ) {
			const kj = Number(mCalKJ[1]);
			if (Number.isFinite(kj)) out.calories = Math.round(kj / 4.184);
		}

		if (mProtein) out.protein_g = Number(mProtein[2]);
		if (mCarbs) out.carbs_g = Number(mCarbs[2]);
		if (mFat) out.fat_g = Number(mFat[2]);

		const kcal = out.calories;
		const saneGrams = (g) => Number.isFinite(g) && g >= 0 && g <= 250;

		if (out.protein_g === kcal || !saneGrams(out.protein_g))
			delete out.protein_g;
		if (out.carbs_g === kcal || !saneGrams(out.carbs_g)) delete out.carbs_g;
		if (out.fat_g === kcal || !saneGrams(out.fat_g)) delete out.fat_g;

		const vals = [out.protein_g, out.carbs_g, out.fat_g].filter(
			(v) => typeof v === "number"
		);
		if (vals.length && kcal != null && vals.every((v) => v === kcal)) {
			delete out.protein_g;
			delete out.carbs_g;
			delete out.fat_g;
		}
		if (out.calories != null) {
			const c = out.calories;
			if (!Number.isFinite(c) || c < 20 || c > 3000) delete out.calories;
		}
		return out;
	}

	function callBackgroundScan(payload, timeoutMs = SCAN_TIMEOUT_MS) {
		return new Promise((resolve, reject) => {
			console.log("Calling background scan with payload:", payload);
			let done = false;
			const t = setTimeout(() => {
				if (!done) {
					done = true;
					reject(new Error("Scan timed out."));
				}
			}, timeoutMs);

			try {
				console.log({ SCAN_MESSAGE_TYPE, payload });
				chrome.runtime.sendMessage(
					{ type: SCAN_MESSAGE_TYPE, payload },
					(resp) => {
						if (done) return;
						clearTimeout(t);

						if (chrome.runtime.lastError) {
							return reject(
								new Error(chrome.runtime.lastError.message || "Runtime error")
							);
						}
						if (!resp) return reject(new Error("No response from background."));
						console.log("Background scan response:", resp);
						const candidate = resp.result ?? resp.data ?? resp;
						if (!candidate || typeof candidate !== "object") {
							return reject(new Error("Unexpected background shape."));
						}
						resolve(parseMaybeLLM(candidate));
					}
				);
			} catch (e) {
				clearTimeout(t);
				reject(e);
			}
		});
	}

	// ─────────────────────────────────────────────────────────────────────────
	// Scan flow
	// ─────────────────────────────────────────────────────────────────────────
	async function analyzePageWithHUD() {
		openPanel();
		updateDateLabel(new Date());
		renderDay(todayStr()).catch(() => {});

		const c = document.getElementById(ID_PANEL_CONTENT);
		if (c)
			c.querySelectorAll(
				".mt-cards, details.mt-section-title, pre.mt-raw, .mt-section-title.scan-title"
			).forEach((n) => n.remove());

		showLoading("Loading…");
		try {
			setLoadingText("Preparing context…");
			lastContext = collectContext();

			setLoadingText("Analyzing…");
			const result = await callBackgroundScan(lastContext);

			lastResult = result;
			setLoadingText("Done");
			setTimeout(() => hideLoading(200), 300);
			renderResult(result, result?.model || "background");
		} catch (e) {
			err("Scan failed:", e);
			setLoadingText("Failed");
			setTimeout(() => hideLoading(800), 800);
			renderError(String(e?.message || e));
		}
	}

	function renderError(msg) {
		const c = document.getElementById(ID_PANEL_CONTENT);
		if (!c) return;
		const pre = document.createElement("pre");
		pre.textContent = "Scan failed:\n" + String(msg);
		pre.className = "mt-raw";
		pre.style.background = "#2a0000";
		pre.style.border = "1px solid #400";
		c.append(sectionTitle("Error"), pre);
	}

	function renderResult(res, modelName) {
		const c = document.getElementById(ID_PANEL_CONTENT);
		if (!c) return;

		const { per, tot, servings, servingSize, confidence, assumptions } =
			normalizeResult(res);

		const title = sectionTitle("Scan Result");
		title.classList.add("scan-title");
		c.appendChild(title);

		const wrap = document.createElement("div");
		wrap.className = "mt-cards";
		wrap.innerHTML = `
      <div class="mt-card">
        <div class="t">Per Serving</div>
        <div class="mt-macros" style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px">
          <div><span>Calories</span><b>${fmt(per.calories)}</b></div>
          <div><span>Protein</span><b>${fmt(per.protein_g)} g</b></div>
          <div><span>Carbs</span><b>${fmt(per.carbs_g)} g</b></div>
          <div><span>Fat</span><b>${fmt(per.fat_g)} g</b></div>
        </div>
        <div class="mt-note">
          ${servings ? `Servings: <b>${servings}</b>` : ""}${
			servingSize
				? ` &nbsp;|&nbsp; Size: <b>${escapeHtml(servingSize)}</b>`
				: ""
		}
        </div>
      </div>
      <div class="mt-card">
        <div class="mt-note">${
					confidence != null
						? `Confidence: <b>${Math.round(confidence * 100)}%</b>`
						: ""
				} <span style="opacity:.7">(${escapeHtml(
			modelName || "background"
		)})</span></div>
      </div>
    `;
		c.appendChild(wrap);

		const details = document.createElement("details");
		details.className = "mt-section-title";
		details.innerHTML = `<summary>Assumptions & Notes</summary>
      <ul style="margin:6px 0 0 14px">${
				assumptions.map((a) => `<li>${escapeHtml(a)}</li>`).join("") ||
				"<li>None provided.</li>"
			}</ul>`;
		c.appendChild(details);
	}

	function escapeHtml(s) {
		return String(s).replace(
			/[&<>"']/g,
			(m) =>
				({
					"&": "&amp;",
					"<": "&lt;",
					"&gt;": "&gt;",
					'"': "&quot;",
					"'": "&#39;",
				}[m])
		);
	}

	// ─────────────────────────────────────────────────────────────────────────
	// Floating button — gatekeep ONLY when clicked
	// ─────────────────────────────────────────────────────────────────────────
	function ensureButton() {
		if (document.getElementById(ID_BTN)) return;
		injectBaseStyles();
		const btn = document.createElement("button");
		btn.id = ID_BTN;
		btn.type = "button";
		btn.title = "Mac Trac";
		const img = new Image();
		img.alt = "";
		img.src = iconURL();
		btn.appendChild(img);

		// GATEKEEP HERE: only when the button is pressed
		btn.addEventListener("click", () => gatekeepThen(openPanel));

		(document.body || document.documentElement).appendChild(btn);
	}

	// ─────────────────────────────────────────────────────────────────────────
	// Panel helpers and init
	// ─────────────────────────────────────────────────────────────────────────
	function labeledInput(id, label, type = "text") {
		const L = document.createElement("label");
		L.textContent = label;
		const I = document.createElement("input");
		I.id = id;
		I.type = type;
		L.appendChild(I);
		return L;
	}

	function ready(fn) {
		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", fn, { once: true });
		} else {
			fn();
		}
	}

	function mountLoop() {
		let tries = 0;
		const maxTries = 20;
		const iv = setInterval(() => {
			ensureButton();
			if (document.getElementById(ID_BTN) || ++tries >= maxTries) {
				clearInterval(iv);
				const obs = new MutationObserver(() => {
					if (!document.getElementById(ID_BTN)) ensureButton();
				});
				obs.observe(document.documentElement, {
					childList: true,
					subtree: true,
				});
			}
		}, 200);
	}

	// ─────────────────────────────────────────────────────────────────────────
	// Init — NO onboarding on page load; only mount the button
	// ─────────────────────────────────────────────────────────────────────────
	ready(() => {
		try {
			mountLoop(); // just ensure the button is present
			log("Mac Trac ready (onboard only when button clicked).");
		} catch (e) {
			err("Init failed:", e);
		}
	});
})();
