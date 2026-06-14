const DATA = {"assets": [{"name": "Gold", "group": "Precious Metals", "unitType": "грам", "quantity": 500.0, "currentValue": 67290.709, "low4yValue": 97786.858, "base4yValue": 139695.511, "high4yValue": 181604.165, "sourceQuantityNote": "Количество 500 г от source filename / integrated workbook", "baseUnitPrice": 134.581418}, {"name": "Silver", "group": "Precious Metals", "unitType": "грам", "quantity": 4100.0, "currentValue": 7638.109, "low4yValue": 8618.842, "base4yValue": 13901.359, "high4yValue": 19183.875, "sourceQuantityNote": "Количество 4100 г от source filename / integrated workbook", "baseUnitPrice": 1.8629534146}, {"name": "onemarkets BlackRock Global Equity Dynamic Opportunities", "group": "Funds", "unitType": "дял", "quantity": 12.975767769264312, "currentValue": 2083.0, "low4yValue": 26826.446, "base4yValue": 32405.121, "high4yValue": 36503.446, "sourceQuantityNote": "Изведено количество = 2083 € / NAV 160.53 € = 12.9758 дяла", "baseUnitPrice": 160.53}, {"name": "onemarkets J.P. Morgan US Equities Fund", "group": "Funds", "unitType": "дял", "quantity": 14.268702717848138, "currentValue": 2037.0, "low4yValue": 26777.962, "base4yValue": 32333.821, "high4yValue": 36409.33, "sourceQuantityNote": "Изведено количество = 2037 € / NAV 142.76 € = 14.2687 дяла", "baseUnitPrice": 142.76}, {"name": "AMUNDI FUNDS ASIA EQUITY FOCUS - A EUR (C)", "group": "Funds", "unitType": "дял", "quantity": 12.843520048055263, "currentValue": 3421.0, "low4yValue": 6293.699, "base4yValue": 8220.228, "high4yValue": 10027.746, "sourceQuantityNote": "Изведено количество = 3421 € / NAV 266.36 € = 12.8435 дяла", "baseUnitPrice": 266.36}, {"name": "AMUNDI FUNDS CHINA EQUITY - A EUR (C)", "group": "Funds", "unitType": "дял", "quantity": 170.6529713866471, "currentValue": 2326.0, "low4yValue": 4914.7, "base4yValue": 6522.947, "high4yValue": 7983.159, "sourceQuantityNote": "Изведено количество = 2326 € / NAV 13.63 € = 170.6530 дяла", "baseUnitPrice": 13.63}, {"name": "AMUNDI FUNDS US PIONEER FUND - A EUR (C)", "group": "Funds", "unitType": "дял", "quantity": 213.26566328316414, "currentValue": 6093.0, "low4yValue": 11345.838, "base4yValue": 15344.173, "high4yValue": 19134.55, "sourceQuantityNote": "Изведено количество = 6093 € / NAV 28.57 € = 213.2657 дяла", "baseUnitPrice": 28.57}, {"name": "Solana", "group": "Crypto", "unitType": "SOL", "quantity": 155.0, "currentValue": 10447.0, "low4yValue": 25575.0, "base4yValue": 44175.0, "high4yValue": 80600.0, "special": "solana", "sourceQuantityNote": "Количество 155 SOL от Solana_Position_155SOL", "baseUnitPrice": 67.4}], "solHorizonPrices": {"month": {"low": 58.0, "base": 67.4, "high": 88.0}, "q1": {"low": 64.0, "base": 74.0, "high": 98.0}, "q2": {"low": 70.0, "base": 82.0, "high": 115.0}, "q3": {"low": 75.0, "base": 89.0, "high": 130.0}, "q4": {"low": 80.0, "base": 96.0, "high": 145.0}, "y1": {"low": 82.0, "base": 105.0, "high": 165.0}, "y2": {"low": 95.0, "base": 148.0, "high": 240.0}, "y3": {"low": 130.0, "base": 215.0, "high": 360.0}, "y4": {"low": 165.0, "base": 285.0, "high": 520.0}}, "horizons": [{"key": "month", "title": "1 месец"}, {"key": "q1", "title": "Q1"}, {"key": "q2", "title": "Q2"}, {"key": "q3", "title": "Q3"}, {"key": "q4", "title": "Q4"}, {"key": "y1", "title": "1 година"}, {"key": "y2", "title": "2 години"}, {"key": "y3", "title": "3 години"}, {"key": "y4", "title": "4 години"}], "note": "Можеш да променяш и количеството, и цената за единица за всяка инвестиция. Gold = 500 г, Silver = 4100 г и Solana = 155 SOL са директно от workbook-а. Количествата за фондовете са изведени по формулата текуща стойност / NAV и остават редактирани ръчно при нужда.", "solanaInvestedCost": 14500.0};
const STORAGE_KEY = 'investment-forecast-unit-price-store-v2';
let selectedScenario = 'base';

const dashboardView = document.getElementById('dashboardView');
const contentView = document.getElementById('contentView');
const navDashboard = document.getElementById('navDashboard');
const navUnits = document.getElementById('navUnits');
const navHorizons = document.getElementById('navHorizons');
const navSolana = document.getElementById('navSolana');
const resetBtn = document.getElementById('resetBtn');
const installBtn = document.getElementById('installBtn');

const fmtEuro = (v) => new Intl.NumberFormat('bg-BG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v) + ' €';
const fmtNum = (v) => new Intl.NumberFormat('bg-BG', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(v);
const colors = ['#1565C0','#2E7D32','#F9A825','#D32F2F','#6A1B9A','#00838F','#EF6C00','#455A64'];

function defaultStore() {
  return {
    qty: Object.fromEntries(DATA.assets.map(a => [a.name, a.quantity])),
    unitPrice: Object.fromEntries(DATA.assets.map(a => [a.name, a.baseUnitPrice])),
    prevUnitPrice: Object.fromEntries(DATA.assets.map(a => [a.name, a.baseUnitPrice]))
  };
}
function getStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStore();
    const p = JSON.parse(raw);
    const d = defaultStore();
    return { qty: {...d.qty, ...(p.qty||{})}, unitPrice: {...d.unitPrice, ...(p.unitPrice||{})}, prevUnitPrice: {...d.prevUnitPrice, ...(p.prevUnitPrice||{})} };
  } catch { return defaultStore(); }
}
function saveStore(store) { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); }
function resetStore() { localStorage.removeItem(STORAGE_KEY); }
function qtyOf(name) { return Number(getStore().qty[name]); }
function unitPriceOf(name) { return Number(getStore().unitPrice[name]); }
function prevUnitPriceOf(name) { return Number(getStore().prevUnitPrice[name]); }
function currentValueOf(asset) { return qtyOf(asset.name) * unitPriceOf(asset.name); }
function baseCurrentValueOf(asset) { return asset.quantity * asset.baseUnitPrice; }
function factorOf(asset) { return currentValueOf(asset) / (baseCurrentValueOf(asset) || 1); }
function unitDiffOf(name) { return unitPriceOf(name) - prevUnitPriceOf(name); }
function directionOf(name) { const d = unitDiffOf(name); return d > 0 ? 'up' : d < 0 ? 'down' : 'flat'; }
function totalCurrent() { return DATA.assets.reduce((acc, a) => acc + currentValueOf(a), 0); }
function scenarioSlices(horizonKey, scenarioKey) {
  return DATA.assets.map(asset => {
    let value = 0;
    const factor = factorOf(asset);
    if (horizonKey === 'y4') {
      value = asset[scenarioKey + '4yValue'] * factor;
    } else if (asset.special === 'solana') {
      const unitScale = unitPriceOf(asset.name) / asset.baseUnitPrice;
      const projectedUnitPrice = DATA.solHorizonPrices[horizonKey][scenarioKey] * unitScale;
      value = qtyOf(asset.name) * projectedUnitPrice;
    } else {
      value = currentValueOf(asset);
    }
    return { name: asset.name, value };
  });
}
function totalFor(hKey, sKey) { return scenarioSlices(hKey, sKey).reduce((a,b)=>a+b.value,0); }
function pieSvg(slices) {
  const total = slices.reduce((a,b)=>a+b.value,0) || 1; const cx=110, cy=110, r=100; let angle=-Math.PI/2;
  const parts = slices.map((s,i)=>{ const frac=s.value/total; const next=angle+frac*Math.PI*2; const x1=cx+Math.cos(angle)*r; const y1=cy+Math.sin(angle)*r; const x2=cx+Math.cos(next)*r; const y2=cy+Math.sin(next)*r; const large=frac>0.5?1:0; const path=`M ${cx} ${cy} L ${x1.toFixed(3)} ${y1.toFixed(3)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(3)} ${y2.toFixed(3)} Z`; angle=next; return `<path d="${path}" fill="${colors[i % colors.length]}"></path>`; }).join('');
  return `<svg class="pie-svg" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">${parts}</svg>`;
}
function legendMarkup(slices) { const total=slices.reduce((a,b)=>a+b.value,0)||1; return slices.map((s,i)=>{ const pct=s.value/total*100; return `<div class="legend-item"><span class="swatch" style="background:${colors[i % colors.length]}"></span><div><div>${s.name}</div><div class="note">${fmtEuro(s.value)} • ${pct.toFixed(1)}%</div></div></div>`; }).join(''); }
function dirHtml(name) { const d=directionOf(name); if(d==='up') return '<span class="dir up">↑</span>'; if(d==='down') return '<span class="dir down">↓</span>'; return '<span class="dir flat">→</span>'; }
function setNav(key) { [navDashboard,navUnits,navHorizons,navSolana].forEach(x=>x.classList.remove('active')); if(key==='dashboard')navDashboard.classList.add('active'); if(key==='units')navUnits.classList.add('active'); if(key==='horizons')navHorizons.classList.add('active'); if(key==='solana')navSolana.classList.add('active'); }

function showDashboard() {
  setNav('dashboard'); dashboardView.classList.remove('hidden'); contentView.classList.add('hidden');
  dashboardView.innerHTML = `
    <div class="grid" style="gap:16px">
      <section class="card">
        <h2 class="section-title">Dashboard</h2>
        <p class="muted">Можеш да променяш <strong>и количеството, и цената за единица</strong> за всяка инвестиция. Новата текуща стойност се смята автоматично и прогнозите се обновяват веднага.</p>
        <div class="grid grid-4">
          <div class="metric"><span>Текущ портфейл</span><strong>${fmtEuro(totalCurrent())}</strong></div>
          <div class="metric"><span>4Y Low</span><strong>${fmtEuro(totalFor('y4','low'))}</strong></div>
          <div class="metric"><span>4Y Base</span><strong>${fmtEuro(totalFor('y4','base'))}</strong></div>
          <div class="metric"><span>4Y High</span><strong>${fmtEuro(totalFor('y4','high'))}</strong></div>
        </div>
        <div class="grid grid-2" style="margin-top:12px"><button class="quick-btn" id="goUnits"><strong>Количество и цена</strong>Редактирай количество + цена за грам / дял / SOL</button><button class="quick-btn" id="goHorizons"><strong>Хоризонти</strong>1 месец, Q1, Q2, Q3, Q4, 1Y, 2Y, 3Y, 4Y</button></div>
      </section>
      <section class="card"><h2 class="section-title">Бързи бутони</h2><div class="quick-grid">${DATA.horizons.map(h => `<button class="quick-btn horizon-quick" data-key="${h.key}"><strong>${h.title}</strong>Base total: ${fmtEuro(totalFor(h.key,'base'))}</button>`).join('')}</div></section>
      <section class="card"><h2 class="section-title">Бележка</h2><p class="note">${DATA.note}</p></section>
    </div>`;
  document.getElementById('goUnits').addEventListener('click', showUnitsEditor);
  document.getElementById('goHorizons').addEventListener('click', showHorizonsList);
  dashboardView.querySelectorAll('.horizon-quick').forEach(btn=>btn.addEventListener('click',()=>openHorizon(btn.dataset.key)));
}

function showUnitsEditor() {
  setNav('units'); dashboardView.classList.add('hidden'); contentView.classList.remove('hidden');
  contentView.innerHTML = `
    <section class="card">
      <div class="toolbar"><div><h2 class="section-title">Количество и цена за единица</h2><p class="muted">Променяй редактируемо и количеството, и цената за единица. Текущата стойност = количество × цена за единица.</p></div><button class="secondary-btn" id="backDashBtn">Към Dashboard</button></div>
      <div class="table-wrap">
        <div class="unit-row head-row"><div>Инвестиция</div><div>Количество</div><div>Предишна цена/ед.</div><div>Текуща цена/ед.</div><div>Разлика/ед.</div><div>Посока</div><div>Текуща стойност</div><div>Редакция</div></div>
        ${DATA.assets.map(a=>`<div class="unit-row"><div><strong>${a.name}</strong><div class="group">${a.group} • ${a.unitType}</div><div class="source-note">${a.sourceQuantityNote}</div></div><div><input type="number" min="0" step="0.0001" class="qty-input" data-name="${a.name}" value="${qtyOf(a.name)}" /></div><div><strong>${fmtEuro(prevUnitPriceOf(a.name))}</strong></div><div><strong>${fmtEuro(unitPriceOf(a.name))}</strong></div><div><strong class="${unitDiffOf(a.name)>0?'up':unitDiffOf(a.name)<0?'down':'flat'}">${fmtEuro(unitDiffOf(a.name))}</strong></div><div>${dirHtml(a.name)}</div><div><strong>${fmtEuro(currentValueOf(a))}</strong><div class="small">${fmtNum(qtyOf(a.name))} × ${fmtEuro(unitPriceOf(a.name))}</div></div><div><input type="number" min="0" step="0.0001" class="price-input" data-name="${a.name}" placeholder="Нова цена/ед." /><button class="primary save-price-btn" data-name="${a.name}" style="margin-top:8px;width:100%">Запази цена</button></div></div>`).join('')}
      </div>
      <p class="note" style="margin-top:12px">Редакцията на количество и цена веднага влияе на текущата стойност и на всички хоризонти.</p>
    </section>`;
  document.getElementById('backDashBtn').addEventListener('click', showDashboard);
  contentView.querySelectorAll('.qty-input').forEach(inp=>inp.addEventListener('change',()=>saveQty(inp.dataset.name, inp.value)));
  contentView.querySelectorAll('.save-price-btn').forEach(btn=>btn.addEventListener('click',()=>saveUnitPrice(btn.dataset.name)));
  contentView.querySelectorAll('.price-input').forEach(inp=>inp.addEventListener('keydown', e=>{ if(e.key==='Enter') saveUnitPrice(inp.dataset.name); }));
}
function saveQty(name, value) { const qty=Number(value); if(!Number.isFinite(qty)||qty<0) return; const s=getStore(); s.qty[name]=qty; saveStore(s); showUnitsEditor(); }
function saveUnitPrice(name) { const input = contentView.querySelector(`.price-input[data-name="${CSS.escape(name)}"]`); if(!input) return; const price=Number(input.value); if(!Number.isFinite(price)||price<0) return; const s=getStore(); s.prevUnitPrice[name]=s.unitPrice[name]; s.unitPrice[name]=price; saveStore(s); showUnitsEditor(); }

function showHorizonsList() {
  setNav('horizons'); dashboardView.classList.add('hidden'); contentView.classList.remove('hidden');
  contentView.innerHTML = `<section class="card"><div class="toolbar"><div><h2 class="section-title">Хоризонти</h2><p class="muted">Всички хоризонти вече използват редактираните количества и цени за единица.</p></div><button class="secondary-btn" id="backDashBtn">Към Dashboard</button></div><div class="quick-grid">${DATA.horizons.map(h=>`<button class="quick-btn horizon-open" data-key="${h.key}"><strong>${h.title}</strong>Base total: ${fmtEuro(totalFor(h.key,'base'))}</button>`).join('')}</div></section>`;
  document.getElementById('backDashBtn').addEventListener('click', showDashboard);
  contentView.querySelectorAll('.horizon-open').forEach(btn=>btn.addEventListener('click',()=>openHorizon(btn.dataset.key)));
}

function openHorizon(key) {
  setNav('horizons'); dashboardView.classList.add('hidden'); contentView.classList.remove('hidden');
  const h = DATA.horizons.find(x=>x.key===key); const tabs=[{id:'low',label:'Песимистичен'},{id:'base',label:'Основен'},{id:'high',label:'Оптимистичен'}];
  const slices=scenarioSlices(key, selectedScenario); const total=slices.reduce((a,b)=>a+b.value,0);
  contentView.innerHTML = `<section class="card"><div class="toolbar"><div><h2 class="section-title">${h.title}</h2><p class="muted">Промените в количество и цена за единица се отразяват автоматично тук.</p></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="secondary-btn" id="backHorizonsBtn">Всички хоризонти</button><button class="secondary-btn" id="backDashBtn">Dashboard</button></div></div><div class="tabs">${tabs.map(t=>`<button class="tab ${t.id===selectedScenario?'active':''}" data-tab="${t.id}">${t.label}</button>`).join('')}</div><div class="grid grid-2" style="margin-top:16px"><div class="metric"><span>Обща стойност</span><strong>${fmtEuro(total)}</strong></div><div class="metric"><span>Сценарий</span><strong>${tabs.find(t=>t.id===selectedScenario).label}</strong></div></div><div class="pie-grid" style="margin-top:16px"><div class="pie-card"><h3>${tabs.find(t=>t.id===selectedScenario).label}</h3><div class="pie-wrap"><div class="pie-box">${pieSvg(slices)}</div><div class="legend">${legendMarkup(slices)}</div></div></div></div><p class="note" style="margin-top:14px">${DATA.note}</p></section>`;
  document.getElementById('backDashBtn').addEventListener('click', showDashboard);
  document.getElementById('backHorizonsBtn').addEventListener('click', showHorizonsList);
  contentView.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>{ selectedScenario=btn.dataset.tab; openHorizon(key); }));
}

function showSolana() {
  setNav('solana'); dashboardView.classList.add('hidden'); contentView.classList.remove('hidden');
  const qty=qtyOf('Solana'), unit=unitPriceOf('Solana'), prev=prevUnitPriceOf('Solana');
  const monthBase=scenarioSlices('month','base').find(x=>x.name==='Solana').value; const y4Base=scenarioSlices('y4','base').find(x=>x.name==='Solana').value;
  contentView.innerHTML = `<section class="card"><div class="toolbar"><div><h2 class="section-title">Solana</h2><p class="muted">Можеш да редактираш и количеството SOL, и цената за 1 SOL.</p></div><button class="secondary-btn" id="backDashBtn">Към Dashboard</button></div><div class="grid grid-2"><div class="list-card"><div class="row"><span>Количество</span><strong>${fmtNum(qty)} SOL</strong></div><div class="row"><span>Предишна цена/SOL</span><strong>${fmtEuro(prev)}</strong></div><div class="row"><span>Текуща цена/SOL</span><strong>${fmtEuro(unit)}</strong></div><div class="row"><span>Текуща стойност</span><strong>${fmtEuro(qty*unit)}</strong></div><div class="row"><span>Текущ unrealized P/L</span><strong class="${qty*unit-DATA.solanaInvestedCost>=0?'up':'down'}">${fmtEuro(qty*unit - DATA.solanaInvestedCost)}</strong></div><div class="row"><span>1 месец (Base)</span><strong>${fmtEuro(monthBase)}</strong></div><div class="row"><span>4 години (Base)</span><strong>${fmtEuro(y4Base)}</strong></div></div><div class="card" style="background:#0f172a"><div class="note">${DATA.note}</div></div></div></section>`;
  document.getElementById('backDashBtn').addEventListener('click', showDashboard);
}

navDashboard.addEventListener('click', showDashboard);
navUnits.addEventListener('click', showUnitsEditor);
navHorizons.addEventListener('click', showHorizonsList);
navSolana.addEventListener('click', showSolana);
resetBtn.addEventListener('click', ()=>{ resetStore(); showDashboard(); });
showDashboard();

let deferredPrompt; window.addEventListener('beforeinstallprompt', (e)=>{ e.preventDefault(); deferredPrompt=e; installBtn.classList.remove('hidden'); }); installBtn?.addEventListener('click', async ()=>{ if(!deferredPrompt) return; deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt=null; installBtn.classList.add('hidden'); }); if('serviceWorker' in navigator) window.addEventListener('load', ()=>navigator.serviceWorker.register('./service-worker.js'));