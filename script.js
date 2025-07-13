
let finalTableData = [];
let currentSortKey = "";
let sortAsc = true;

function playClickSound() {
  const sound = document.getElementById("clickSound");
  if (sound) {
    sound.pause();
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }
}

function updateFullSymbol() {
  const symbol = document.getElementById("symbol").value;
  document.getElementById("fullSymbolDisplay").textContent = symbol;
}

function changeQty(delta) {
  const qty = document.getElementById("quantity");
  const lotSize = parseInt(document.getElementById("lotSize").value) || 1;
  let value = parseInt(qty.value) || 1;
  value = Math.max(1, value + delta);
  qty.value = value;
  document.getElementById("lotsDisplay").textContent = Math.ceil(value / lotSize);
}

function updateLots() {
  const qty = parseInt(document.getElementById("quantity").value) || 1;
  const lotSize = parseInt(document.getElementById("lotSize").value) || 1;
  document.getElementById("lotsDisplay").textContent = Math.ceil(qty / lotSize);
}

function handleAddClick() {
  playClickSound();
  const wrapper = document.getElementById("addTableWrapper");
  if (wrapper.style.display === "none") wrapper.style.display = "block";

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${getVal("exchange")}</td>
    <td>${getVal("orderType")}</td>
    <td>${getVal("symbol")}</td>
    <td>-</td>
    <td>-</td>
    <td>${getVal("clientCode")}</td>
    <td>${getVal("quantity")}</td>
    <td>${getVal("ltp")}</td>
    <td>${getVal("buySell")}</td>
    <td>${getVal("entryPrice")}</td>
    <td>${getVal("target")}</td>
    <td>${getVal("stopLoss")}</td>
    <td>${getVal("investment")}</td>
    <td>
      <div class="button-group">
        <button class="edit-btn" onclick="enableEdit(this)">Edit</button>
        <button class="delete-btn" onclick="this.closest('tr').remove()">Delete</button>
      </div>
    </td>
  `;
  document.getElementById("orderTableBody").appendChild(row);
  document.getElementById("submitBtnWrapper").style.display = "block";
}

function getVal(id) {
  return document.getElementById(id)?.value || '';
}

function submitAll() {
  playClickSound();
  alert("Submitted order(s).");
  document.getElementById("orderTableBody").innerHTML = "";
  document.getElementById("addTableWrapper").style.display = "none";
  document.getElementById("submitBtnWrapper").style.display = "none";
  generateFinalTable();
}

function enableEdit(btn) {
  playClickSound();
  const row = btn.closest("tr");
  const cells = row.querySelectorAll("td");
  const original = [];

  for (let i = 0; i < cells.length - 1; i++) {
    const val = cells[i].textContent.trim();
    original.push(val);
    cells[i].innerHTML = `<input type="text" value="${val}" class="edit-input">`;
  }

  cells[cells.length - 1].innerHTML = `
    <div class="button-group">
      <button class="update-btn" onclick="updateRow(this)">Update</button>
      <button class="clear-btn" onclick='cancelEdit(this, ${JSON.stringify(original)})'>Clear</button>
    </div>
  `;
}

function updateRow(btn) {
  playClickSound();
  const row = btn.closest("tr");
  const cells = row.querySelectorAll("td");
  for (let i = 0; i < cells.length - 1; i++) {
    const input = cells[i].querySelector("input");
    cells[i].textContent = input ? input.value : '';
  }
  cells[cells.length - 1].innerHTML = `
    <div class="button-group">
      <button class="edit-btn" onclick="enableEdit(this)">Edit</button>
      <button class="delete-btn" onclick="this.closest('tr').remove()">Delete</button>
    </div>
  `;
}

function cancelEdit(btn, values) {
  playClickSound();
  const row = btn.closest("tr");
  const cells = row.querySelectorAll("td");
  for (let i = 0; i < values.length; i++) {
    cells[i].textContent = values[i];
  }
  cells[cells.length - 1].innerHTML = `
    <div class="button-group">
      <button class="edit-btn" onclick="enableEdit(this)">Edit</button>
      <button class="delete-btn" onclick="this.closest('tr').remove()">Delete</button>
    </div>
  `;
}

function generateFinalTable() {
  playClickSound();
  const section = document.getElementById("finalTableSection");
  section.style.display = "block";
  finalTableData = [];

  const symbols = ["LODNA", "NIFTY25JULFUT", "IEX", "M&M", "BAJFINANCE"];
  const buySell = ["BUY", "SELL"];
  const statusList = ["Triggered", "", "Booked"];
  for (let i = 0; i < 20; i++) {
    const uid = 250 + i;
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const clientcode = "T497" + Math.floor(Math.random() * 1000);
    const buysell = buySell[Math.floor(Math.random() * buySell.length)];
    const qty = Math.floor(Math.random() * 100 + 1);
    const price = (Math.random() * 1000 + 100).toFixed(2);
    const tgt = (parseFloat(price) + 50).toFixed(2);
    const sl = (parseFloat(price) - 20).toFixed(2);
    const inv = (qty * parseFloat(price)).toFixed(2);
    const statusEntry = statusList[Math.floor(Math.random() * statusList.length)];
    const statusExit = statusList[Math.floor(Math.random() * statusList.length)];
    const dateNow = new Date().toISOString().slice(0, 19).replace("T", " ");

    finalTableData.push({
      uid, symbol, clientcode, buysell, inv, qty, price, tgt, sl,
      entryStatus: statusEntry,
      exitStatus: statusExit,
      lockTime: dateNow,
      entryTime: statusEntry ? dateNow : "",
      exitTime: statusExit === "Triggered" ? dateNow : "",
    });
  }
  renderFinalTable(finalTableData);
}

function renderFinalTable(data) {
  playClickSound();
  const tbody = document.getElementById("finalOrderTableBody");
  tbody.innerHTML = "";
  data.forEach(row => {
    tbody.innerHTML += `
      <tr>
        <td>${row.uid}</td>
        <td>${row.symbol}</td>
        <td>${row.clientcode}</td>
        <td>${row.buysell}</td>
        <td>${row.inv}</td>
        <td>${row.qty}</td>
        <td>${row.price}</td>
        <td>${row.tgt}</td>
        <td>${row.sl}</td>
        <td>${row.entryStatus}</td>
        <td>${row.exitStatus}</td>
        <td>${row.lockTime}</td>
        <td>${row.entryTime}</td>
        <td>${row.exitTime}</td>
        <td>
          <div class="button-group">
            <button class="edit-btn" onclick="enableEdit(this)">Edit</button>
            <button class="delete-btn" onclick="this.closest('tr').remove()">Delete</button>
          </div>
        </td>
      </tr>
    `;
  });
}

function filterRows(type) {
  playClickSound();
  let filtered = [...finalTableData];
  if (type === "booked") {
    filtered = filtered.filter(r => r.entryStatus === "Triggered" && r.exitStatus === "Triggered");
  } else if (type === "triggered") {
    filtered = filtered.filter(r => r.entryStatus === "Triggered" && r.exitStatus === "");
  } else if (type === "preorder") {
    filtered = filtered.filter(r => r.entryStatus === "" && r.exitStatus === "");
  }
  renderFinalTable(filtered);
}

function sortTable(key) {
  sortAsc = key === currentSortKey ? !sortAsc : true;
  currentSortKey = key;
  const sorted = [...finalTableData].sort((a, b) => {
    if (!a[key]) return 1;
    if (!b[key]) return -1;
    return sortAsc
      ? a[key].toString().localeCompare(b[key].toString(), undefined, { numeric: true })
      : b[key].toString().localeCompare(a[key].toString(), undefined, { numeric: true });
  });
  renderFinalTable(sorted);
}
