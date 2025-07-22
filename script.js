// Stores Final Table Data & Sorting State

let finalTableData = [];
let currentSortKey = "";
let sortAsc = true;

// Sound Effect for Button Clicks
function playClickSound() {
  const sound = document.getElementById("clickSound");
  if (sound) {
    sound.pause();
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }
}

// Updates Full Symbol when user selects symbol
function updateFullSymbol() {
  const symbol = document.getElementById("symbol").value;
  document.getElementById("fullSymbolDisplay").textContent = symbol;
}

// Changes Quantity with Lot Calculation
function changeQty(delta) {
  const exchange = document.getElementById("exchange").value;
  if (exchange === "NSE") return;

  const qty = document.getElementById("quantity");
  const lotSize = parseInt(document.getElementById("lotSize").value) || 1;
  let value = parseInt(qty.value) || 1;
  value = Math.max(1, value + delta);
  qty.value = value;
  document.getElementById("lotsDisplay").textContent = Math.ceil(value / lotSize);
}

// Updates Lots Display when Qty is changed manually
function updateLots() {
  const exchange = document.getElementById("exchange").value;
  if (exchange === "NSE") return;

  const qty = parseInt(document.getElementById("quantity").value) || 1;
  const lotSize = parseInt(document.getElementById("lotSize").value) || 1;
  document.getElementById("lotsDisplay").textContent = Math.ceil(qty / lotSize);
}

// On Page Load, Attach Exchange Change Handler
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById("exchange").addEventListener("change", handleExchangeChange);
  handleExchangeChange();
});

// Handles Enable/Disable of Fields Based on Exchange
function handleExchangeChange() {
  const exchange = document.getElementById("exchange").value;
  const lotSize = document.getElementById("lotSize");
  const lotsDisplay = document.getElementById("lotsDisplay");
  const strikePrice = document.getElementById("strikePrice");
  const expiryDate = document.getElementById("expiryDate");
  const orderType = document.getElementById("orderType");

  if (exchange === "NSE") {
    lotSize.disabled = true;
    lotSize.style.backgroundColor = "#e0e0e0";
    strikePrice.disabled = true;
    strikePrice.style.backgroundColor = "#e0e0e0";
    expiryDate.disabled = true;
    expiryDate.style.backgroundColor = "#e0e0e0";
    lotsDisplay.classList.add("disabled-box");

    orderType.innerHTML = "";
    const option = document.createElement("option");
    option.text = "EQ";
    orderType.add(option);
  } else {
    lotSize.disabled = false;
    lotSize.style.backgroundColor = "";
    strikePrice.disabled = false;
    strikePrice.style.backgroundColor = "";
    expiryDate.disabled = false;
    expiryDate.style.backgroundColor = "";
    lotsDisplay.classList.remove("disabled-box");

    orderType.innerHTML = "";
    ["FUT", "CE", "PE"].forEach(type => {
      const option = document.createElement("option");
      option.text = type;
      orderType.add(option);
    });
  }

  orderType.removeEventListener("change", handleOrderTypeChange);
  orderType.addEventListener("change", handleOrderTypeChange);
  handleOrderTypeChange();
}


// Adds Row to Temporary Table on Add Click
function handleAddClick() {
  playClickSound();
  const wrapper = document.getElementById("addTableWrapper");
  if (wrapper.style.display === "none") wrapper.style.display = "block";

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${getVal("exchange")}</td>
    <td>${getVal("orderType")}</td>
    <td>${getVal("symbol")}</td>
    <td>${getVal("strikePrice")}</td>
    <td>${getVal("expiryDate")}</td>
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
        <button class="delete-btn" onclick="confirmDelete(this)">Delete</button>
      </div>
    </td>
  `;
  document.getElementById("orderTableBody").appendChild(row);
  document.getElementById("submitBtnWrapper").style.display = "block";
}

// Helper to get Field Value
function getVal(id) {
  return document.getElementById(id)?.value || '';
}

// Handles Final Submission & Clears Preview Table
function submitAll() {
  playClickSound();
  alert("Submitted order(s).");
  document.getElementById("orderTableBody").innerHTML = "";
  document.getElementById("addTableWrapper").style.display = "none";
  document.getElementById("submitBtnWrapper").style.display = "none";
  document.getElementById("searchFilterWrapper").style.display = "flex";
  generateFinalTable();
}

// Enables Edit Mode on Row
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

// Updates Edited Row
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
      <button class="delete-btn" onclick="confirmDelete(this)">Delete</button>
    </div>
  `;
}

// Cancels Edit Mode
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
      <button class="delete-btn" onclick="confirmDelete(this)">Delete</button>
    </div>
  `;
}

// Generates Dummy Final Table Data
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

// Renders Final Table
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
            <button class="delete-btn" onclick="confirmDelete(this)">Delete</button>
          </div>
        </td>
      </tr>
    `;
  });
}

// Filters Rows Based on Status
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

// Sort Table Columns
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

// Search Symbol
function searchSymbol() {
  const searchValue = document.getElementById("searchInput").value.trim().toLowerCase();
  const filteredData = finalTableData.filter(item => item.symbol.toLowerCase().includes(searchValue));
  renderFinalTable(filteredData);
}

// Delete Confirmation
function confirmDelete(btn) {
  playClickSound();
  const row = btn.closest('tr');

  row.querySelector(".button-group").innerHTML = `
    <button class="confirm-yes" onclick="deleteRow(this)">Yes</button>
    <button class="confirm-no" onclick="cancelDelete(this)">No</button>
  `;
}

// Delete Row
function deleteRow(btn) {
  playClickSound();
  const row = btn.closest("tr");
  row.remove();
}

// Cancel Delete
function cancelDelete(btn) {
  playClickSound();
  const row = btn.closest("tr");

  row.querySelector(".button-group").innerHTML = `
    <button class="edit-btn" onclick="enableEdit(this)">Edit</button>
    <button class="delete-btn" onclick="confirmDelete(this)">Delete</button>
  `;
}

// Order Type Dependent Strike Price Handling
function handleOrderTypeChange() {
  const exchange = document.getElementById("exchange").value;
  const orderType = document.getElementById("orderType").value;
  const strikePrice = document.getElementById("strikePrice");

  if (exchange === "NSE") {
    strikePrice.disabled = true;
    strikePrice.style.backgroundColor = "#e0e0e0";
  } else if (exchange === "NFO" && orderType === "FUT") {
    strikePrice.disabled = true;
    strikePrice.style.backgroundColor = "#e0e0e0";
  } else {
    strikePrice.disabled = false;
    strikePrice.style.backgroundColor = "";
  }
}



