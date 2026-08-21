// ======================================================
// SSP BILLING SYSTEM
// CLEAN FINAL SCRIPT
// ======================================================

let currentBillNumber = 1;
let currentHistoryBill = null;
let isReprinting = false;


// ======================================================
// DOM READY
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("✅ SSP Billing Script Loaded");


    // ==================================================
    // ELEMENTS
    // ==================================================

    const billDate =
        document.getElementById("billDate");

    const billNumber =
        document.getElementById("billNumber");

    const designCharge =
        document.getElementById("designCharge");

    const addItemBtn =
        document.getElementById("addItemBtn");

    const itemBody =
        document.getElementById("itemBody");

    const billSearch =
        document.getElementById("billSearch");


    // ==================================================
    // AUTO DATE
    // ==================================================

    function setTodayDate() {

        if (!billDate) return;

        const today = new Date();

        const day =
            String(today.getDate()).padStart(2, "0");

        const month =
            String(today.getMonth() + 1).padStart(2, "0");

        const year =
            today.getFullYear();

        billDate.textContent =
            `${day}-${month}-${year}`;
    }


    // ==================================================
    // BILL NUMBER
    // ==================================================

    currentBillNumber =
        parseInt(
            localStorage.getItem("sspBillNumber")
        ) || 1;


    function showBillNumber() {

        if (!billNumber) return;

        billNumber.textContent =
            "SSP-" +
            String(currentBillNumber).padStart(4, "0");
    }


    // ==================================================
// CALCULATE TOTAL
// ==================================================

function calculateTotal() {

    let printingTotal = 0;

    document
        .querySelectorAll(".item-row")
        .forEach(function (row) {

            const amount =
                row.querySelector(".amount");

            if (amount) {

                printingTotal +=
                    parseFloat(amount.value) || 0;
            }

        });


    const design =
        parseFloat(
            designCharge?.value
        ) || 0;


    const netTotal =
        printingTotal + design;


    const printingElement =
        document.getElementById("printingTotal");

    const designDisplay =
        document.getElementById("designChargeDisplay");

    const netElement =
        document.getElementById("netTotal");


    if (printingElement) {

        printingElement.textContent =
            printingTotal.toFixed(2);
    }


    if (designDisplay) {

        designDisplay.textContent =
            design.toFixed(2);
    }


    if (netElement) {

        netElement.textContent =
            netTotal.toFixed(2);
    }


    // ==================================================
    // UPDATE UPI QR CODE
    // ==================================================

    generateQRCode();


    console.log(
        "Printing Total:",
        printingTotal.toFixed(2)
    );


    console.log(
        "Design Charges:",
        design.toFixed(2)
    );


    console.log(
        "Net Total:",
        netTotal.toFixed(2)
    );
}


    // ==================================================
    // CALCULATE ROW
    // ==================================================

    function calculateRow(input) {

        const row =
            input.closest(".item-row");

        if (!row) return;


        const qtyInput =
            row.querySelector(".qty");

        const rateInput =
            row.querySelector(".rate");

        const amountInput =
            row.querySelector(".amount");


        if (
            !qtyInput ||
            !rateInput ||
            !amountInput
        ) {

            return;
        }


        const qty =
            parseFloat(qtyInput.value) || 0;

        const rate =
            parseFloat(rateInput.value) || 0;


        const amount =
            qty * rate;


        amountInput.value =
            amount.toFixed(2);


        calculateTotal();
    }


    // ==================================================
    // UPDATE SERIAL NUMBERS
    // ==================================================

    function updateSerialNumbers() {

        const rows =
            document.querySelectorAll(".item-row");


        rows.forEach(function (row, index) {

            const serial =
                row.querySelector(".serial");

            if (serial) {

                serial.textContent =
                    index + 1;
            }

        });
    }


    // ==================================================
    // ENTER - DESCRIPTION
    // ==================================================

    function handleDescriptionKey(event) {

        if (event.key !== "Enter") return;

        event.preventDefault();


        const row =
            event.target.closest(".item-row");

        if (!row) return;


        const qty =
            row.querySelector(".qty");

        if (qty) {

            qty.focus();
        }
    }


    // ==================================================
    // ENTER - QTY
    // ==================================================

    function handleQtyKey(event) {

        if (event.key !== "Enter") return;

        event.preventDefault();


        const row =
            event.target.closest(".item-row");

        if (!row) return;


        const rate =
            row.querySelector(".rate");

        if (rate) {

            rate.focus();
        }
    }


    // ==================================================
    // ENTER - RATE
    // ==================================================

    function handleRateKey(event) {

        if (event.key !== "Enter") return;

        event.preventDefault();


        calculateRow(event.target);


        const row =
            event.target.closest(".item-row");

        if (!row) return;


        const rows =
            document.querySelectorAll(".item-row");


        const lastRow =
            rows[rows.length - 1];


        if (
            row === lastRow &&
            addItemBtn
        ) {

            addItemBtn.click();
        }
    }


    // ==================================================
    // ADD ITEM
    // ==================================================

    if (addItemBtn && itemBody) {

        addItemBtn.addEventListener(
            "click",
            function () {

                const rows =
                    itemBody.querySelectorAll(".item-row");


                if (rows.length === 0) {

                    console.error(
                        "❌ No item row found"
                    );

                    return;
                }


                const firstRow =
                    rows[0];


                const newRow =
                    firstRow.cloneNode(true);


                newRow
                    .querySelectorAll("input")
                    .forEach(function (input) {

                        input.value = "";

                    });


                const amount =
                    newRow.querySelector(".amount");


                if (amount) {

                    amount.value = "0.00";
                }


                itemBody.appendChild(newRow);


                updateSerialNumbers();

                calculateTotal();


                const description =
                    newRow.querySelector(".description");


                if (description) {

                    description.focus();
                }


                console.log(
                    "✅ Add Item Working"
                );
            }
        );
    }


    // ==================================================
    // INPUT CALCULATION
    // ==================================================

    document.addEventListener(
        "input",
        function (event) {

            if (
                event.target.classList.contains("qty") ||
                event.target.classList.contains("rate")
            ) {

                calculateRow(event.target);
            }


            if (
                event.target.id === "designCharge"
            ) {

                calculateTotal();
            }

        }
    );


    // ==================================================
    // ENTER NAVIGATION
    // ==================================================

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.target.classList.contains(
                    "description"
                )
            ) {

                handleDescriptionKey(event);

            }

            else if (
                event.target.classList.contains(
                    "qty"
                )
            ) {

                handleQtyKey(event);

            }

            else if (
                event.target.classList.contains(
                    "rate"
                )
            ) {

                handleRateKey(event);

            }

        }
    );


    // ==================================================
    // SAVE BILL
    // ==================================================

    window.saveBill = function () {

        console.log(
            "💾 SAVE BILL STARTED"
        );


        // ------------------------------------------
        // BILL NUMBER
        // ------------------------------------------

        const billNo =
            billNumber
                ? billNumber.textContent.trim()
                : "";


        // ------------------------------------------
        // DATE
        // ------------------------------------------

        const date =
            billDate
                ? billDate.textContent.trim()
                : "";


        // ------------------------------------------
        // CUSTOMER
        // ------------------------------------------

        const customerNameElement =
            document.getElementById("customerName");

        const customerMobileElement =
            document.getElementById("customerMobile");


        const customerName =
            customerNameElement
                ? customerNameElement.value.trim()
                : "";


        const customerMobile =
            customerMobileElement
                ? customerMobileElement.value.trim()
                : "";


        // ------------------------------------------
        // ITEMS
        // ------------------------------------------

        const items = [];


        document
            .querySelectorAll(".item-row")
            .forEach(function (row) {

                const description =
                    row.querySelector(
                        ".description"
                    )?.value.trim() || "";


                const qty =
                    parseFloat(
                        row.querySelector(
                            ".qty"
                        )?.value
                    ) || 0;


                const rate =
                    parseFloat(
                        row.querySelector(
                            ".rate"
                        )?.value
                    ) || 0;


                const amount =
                    parseFloat(
                        row.querySelector(
                            ".amount"
                        )?.value
                    ) || 0;


                if (
                    description !== "" ||
                    qty > 0 ||
                    rate > 0
                ) {

                    items.push({

                        description:
                            description,

                        qty:
                            qty,

                        rate:
                            rate,

                        amount:
                            amount

                    });
                }

            });


        
        // ----------------------------------------------
// TOTALS
// ----------------------------------------------

let printing = 0;

items.forEach(function (item) {

    printing +=
        Number(item.amount) || 0;

});

const design =
    parseFloat(
        designCharge?.value
    ) || 0;

const net =
    printing + design;

        // ----------------------------------------------
// BILL DATA
// ----------------------------------------------

const billData = {

    billNo: billNo,

    billDate: date,

    customerName: customerName,

    customerMobile: customerMobile,

    items: items,

    printingTotal: printing,

    designCharge: design,

    netTotal: net

};


        // ------------------------------------------
        // GET EXISTING BILLS
        // ------------------------------------------

        let bills = [];


        try {

            bills =
                JSON.parse(
                    localStorage.getItem(
                        "sspBills"
                    )
                ) || [];

        } catch (error) {

            console.error(
                "❌ Bill History Error:",
                error
            );

            bills = [];
        }


        // ------------------------------------------
        // SAVE
        // ------------------------------------------

        bills.push(billData);


        localStorage.setItem(
            "sspBills",
            JSON.stringify(bills)
        );


        // ------------------------------------------
        // NEXT BILL NUMBER
        // ------------------------------------------

        currentBillNumber++;


        localStorage.setItem(
            "sspBillNumber",
            currentBillNumber
        );


        // ------------------------------------------
        // REFRESH HISTORY
        // ------------------------------------------

        loadBillHistory();


        // ------------------------------------------
        // PDF FILE NAME
        // ------------------------------------------

        const safeCustomerName =
            customerName
                ? customerName.replace(
                    /[\\/:*?"<>|]/g,
                    ""
                )
                : "Customer";


        document.title =
            billNo +
            " - " +
            safeCustomerName +
            " - " +
            date;


        // ------------------------------------------
        // SUCCESS
        // ------------------------------------------

       alert(
    "பில் வெற்றிகரமாக சேமிக்கப்பட்டது!\n\n" +
    "Bill No: " + billNo + "\n" +
    "Net Total: ₹" +
Number(net).toFixed(2)
);


        // ------------------------------------------
        // PRINT
        // ------------------------------------------

        window.print();


        // ------------------------------------------
        // SHOW NEXT BILL NUMBER
        // ------------------------------------------

        showBillNumber();

    };


    // ==================================================
    // LOAD BILL HISTORY
    // ==================================================

    window.loadBillHistory =
        function (searchText = "") {

            const historyList =
                document.getElementById(
                    "billHistoryList"
                );


            if (!historyList) return;


            let bills = [];


            try {

                bills =
                    JSON.parse(
                        localStorage.getItem(
                            "sspBills"
                        )
                    ) || [];

            } catch (error) {

                console.error(
                    "❌ Bill History Error:",
                    error
                );

                bills = [];
            }


            historyList.innerHTML = "";


            const search =
                String(searchText)
                    .trim()
                    .toLowerCase();


            if (search !== "") {

                bills =
                    bills.filter(
                        function (bill) {

                            return (

                                String(
                                    bill.billNo || ""
                                )
                                .toLowerCase()
                                .includes(search)

                                ||

                                String(
                                    bill.customerName || ""
                                )
                                .toLowerCase()
                                .includes(search)

                                ||

                                String(
                                    bill.customerMobile || ""
                                )
                                .toLowerCase()
                                .includes(search)

                            );

                        }
                    );
            }


            if (bills.length === 0) {

                historyList.innerHTML =
                    "<p>No bills found.</p>";

                return;
            }


            bills
                .slice()
                .reverse()
                .forEach(function (bill) {

                    const div =
                        document.createElement(
                            "div"
                        );


                    div.className =
                        "history-item";


                    div.innerHTML = `

                        <strong>
                            ${escapeHTML(
                                bill.billNo || ""
                            )}
                        </strong>

                        <br>

                        Date:
                        ${escapeHTML(
                            bill.billDate ||
                            bill.date ||
                            ""
                        )}

                        <br>

                        Customer:
                        ${escapeHTML(
                            bill.customerName ||
                            "N/A"
                        )}

                        <br>

                        Mobile:
                        ${escapeHTML(
                            bill.customerMobile ||
                            "N/A"
                        )}

                        <br>

                        Net Total:
                        <strong>
                            ₹${Number(
                                bill.netTotal || 0
                            ).toFixed(2)}
                        </strong>

                        <br><br>

                        <button
                            type="button"
                            class="history-reprint-btn"
                        >
                            🖨️ Reprint
                        </button>

                    `;


                    div.addEventListener(
                        "click",
                        function (event) {

                            if (
                                event.target.closest(
                                    ".history-reprint-btn"
                                )
                            ) {

                                return;
                            }


                            showBillDetails(bill);

                        }
                    );


                    const reprintButton =
                        div.querySelector(
                            ".history-reprint-btn"
                        );


                    if (reprintButton) {

                        reprintButton.addEventListener(
                            "click",
                            function (event) {

                                event.stopPropagation();

                                reprintBill(bill);

                            }
                        );
                    }


                    historyList.appendChild(div);

                });


            console.log(
                "📋 History Results:",
                bills.length
            );
        };


    // ==================================================
    // BILL SEARCH
    // ==================================================

    if (billSearch) {

        billSearch.addEventListener(
            "input",
            function () {

                loadBillHistory(
                    billSearch.value
                );

            }
        );
    }


    // ==================================================
    // SHOW BILL DETAILS
    // ==================================================

    window.showBillDetails =
        function (bill) {

            currentHistoryBill =
                bill;


            let itemsText = "";


            if (
                bill.items &&
                bill.items.length
            ) {

                bill.items.forEach(
                    function (item, index) {

                        itemsText +=

                            (index + 1) +
                            ". " +
                            item.description +

                            " | Qty: " +
                            item.qty +

                            " | Rate: ₹" +
                            Number(
                                item.rate || 0
                            ).toFixed(2) +

                            " | Amount: ₹" +
                            Number(
                                item.amount || 0
                            ).toFixed(2) +

                            "\n";

                    }
                );

            } else {

                itemsText =
                    "No items";
            }


            alert(

                "========== BILL DETAILS ==========\n\n" +

                "Bill No: " +
                (bill.billNo || "") +

                "\nDate: " +
                (
                    bill.billDate ||
                    bill.date ||
                    ""
                ) +

                "\nCustomer: " +
                (bill.customerName || "N/A") +

                "\nMobile: " +
                (bill.customerMobile || "N/A") +

                "\n\nITEMS\n" +

                itemsText +

                "\nPrinting Total: ₹" +
                Number(
                    bill.printingTotal || 0
                ).toFixed(2) +

                "\nDesign Charges: ₹" +
                Number(
                    bill.designCharge || 0
                ).toFixed(2) +

                "\nNet Total: ₹" +
                Number(
                    bill.netTotal || 0
                ).toFixed(2)

            );
        };


    // ==================================================
    // REPRINT BILL
    // ==================================================

    window.reprintBill =
        function (bill) {

            currentHistoryBill =
                bill;


            isReprinting = true;


            console.log(
                "🖨️ REPRINT BILL:",
                bill.billNo
            );


            loadBillIntoCurrentBill(bill);


            setTimeout(
                function () {

                    const customerForFile =
                        bill.customerName
                            ? bill.customerName.replace(
                                /[\\/:*?"<>|]/g,
                                ""
                            )
                            : "Customer";


                    document.title =
                        bill.billNo +
                        " - " +
                        customerForFile;


                    window.print();

                },
                300
            );
        };


    // ==================================================
    // LOAD OLD BILL
    // ==================================================

    function loadBillIntoCurrentBill(bill) {

        // ------------------------------------------
        // BILL NUMBER
        // ------------------------------------------

        if (billNumber) {

            billNumber.textContent =
                bill.billNo || "";
        }


        // ------------------------------------------
        // DATE
        // ------------------------------------------

        if (billDate) {

            billDate.textContent =
                bill.billDate ||
                bill.date ||
                "";
        }


        // ------------------------------------------
        // CUSTOMER
        // ------------------------------------------

        const customerNameElement =
            document.getElementById(
                "customerName"
            );

        const customerMobileElement =
            document.getElementById(
                "customerMobile"
            );


        if (customerNameElement) {

            customerNameElement.value =
                bill.customerName || "";
        }


        if (customerMobileElement) {

            customerMobileElement.value =
                bill.customerMobile || "";
        }


        // ------------------------------------------
        // ITEMS
        // ------------------------------------------

        if (!itemBody) return;


        itemBody.innerHTML = "";


        if (
            bill.items &&
            bill.items.length > 0
        ) {

            bill.items.forEach(
                function (item, index) {

                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.className =
                        "item-row";


                    row.innerHTML = `

                        <td class="serial">
                            ${index + 1}
                        </td>

                        <td>
                            <input
                                type="text"
                                class="description"
                                value="${escapeAttribute(
                                    item.description || ""
                                )}"
                            >
                        </td>

                        <td>
                            <input
                                type="number"
                                class="qty"
                                value="${item.qty || ""}"
                            >
                        </td>

                        <td>
                            <input
                                type="number"
                                class="rate"
                                value="${item.rate || ""}"
                            >
                        </td>

                        <td>
                            <input
                                type="text"
                                class="amount amount-input"
                                value="${Number(
                                    item.amount || 0
                                ).toFixed(2)}"
                                readonly
                            >
                        </td>

                    `;


                    itemBody.appendChild(row);

                }
            );

        } else {

            createEmptyItemRow();

        }

// ----------------------------------------------
// DESIGN CHARGES
// ----------------------------------------------

if (designCharge) {

    designCharge.value =
        Number(bill.designCharge) || 0;

    console.log(
        "🖨️ Reprint Design Charge:",
        designCharge.value
    );
}


        updateSerialNumbers();

        calculateTotal();
    }


    // ==================================================
    // CREATE EMPTY ITEM ROW
    // ==================================================

    function createEmptyItemRow() {

        if (!itemBody) return;


        const row =
            document.createElement("tr");


        row.className =
            "item-row";


        row.innerHTML = `

            <td class="serial">
                1
            </td>

            <td>
                <input
                    type="text"
                    class="description"
                    placeholder="Item / Work"
                >
            </td>

            <td>
                <input
                    type="number"
                    class="qty"
                >
            </td>

            <td>
                <input
                    type="number"
                    class="rate"
                >
            </td>

            <td>
                <input
                    type="text"
                    class="amount amount-input"
                    value="0.00"
                    readonly
                >
            </td>

        `;


        itemBody.appendChild(row);
    }


    // ==================================================
    // ESCAPE HTML
    // ==================================================

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function escapeAttribute(value) {

        return escapeHTML(value);
    }


    // ==================================================
    // INITIAL START
    // ==================================================

    setTodayDate();

    showBillNumber();

    calculateTotal();

    updateSerialNumbers();

    loadBillHistory();


    // ==================================================
    // MAKE FUNCTIONS AVAILABLE
    // ==================================================

    window.calculateRow =
        calculateRow;

    window.calculateTotal =
        calculateTotal;

    window.updateSerialNumbers =
        updateSerialNumbers;

    window.handleDescriptionKey =
        handleDescriptionKey;

    window.handleQtyKey =
        handleQtyKey;

    window.handleRateKey =
        handleRateKey;


    console.log(
        "================================"
    );

    console.log(
        "🎉 SSP BILLING SYSTEM READY"
    );

    console.log(
        "================================"
    );

});


// ======================================================
// PRINT FINISHED
// ======================================================

window.addEventListener(
    "afterprint",
    function () {

        console.log(
            "🖨️ Print Finished"
        );


        if (isReprinting) {

            isReprinting = false;

            location.reload();

        }

    }
);

new QRCode(document.getElementById("qrcode"), {
    text: "SRINI SCREEN PRINTERS\n9095030858\nsriniprinter2004@gmail.com",
    width: 80,
    height: 80
});

// =====================================
// UPI PAYMENT QR CODE
// =====================================

function generateQRCode() {

    const qrElement = document.getElementById("qrcode");

    if (!qrElement) return;

    // Get Net Total
    const netTotalElement = document.getElementById("netTotal");

    let netTotal = 0;

    if (netTotalElement) {
        netTotal = parseFloat(
            netTotalElement.textContent.replace(/[₹,]/g, "")
        ) || 0;
    }

    // Clear old QR
    qrElement.innerHTML = "";

    // UPI Payment Link
    const upiId = "9095030858@sbi";
    const payeeName = "SRINI SCREEN PRINTERS";

    const upiURL =
        "upi://pay" +
        "?pa=" + encodeURIComponent(upiId) +
        "&pn=" + encodeURIComponent(payeeName) +
        "&am=" + netTotal.toFixed(2) +
        "&cu=INR";

    new QRCode(qrElement, {
        text: upiURL,
        width: 90,
        height: 90
    });
}

// =====================================
// GENERATE QR WHEN PAGE LOADS
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    generateQRCode();

});