// =====================================================
// GESTION DES VOISINS
// =====================================================

const neighbors = [];

let currentDoor = null;

// -----------------------------------------------------
// CRÉATION DES 56 PORTES
// 14 étages × 4 portes
// -----------------------------------------------------

for (let floor = 1; floor <= 14; floor++) {

    for (let doorNumber = 1; doorNumber <= 4; doorNumber++) {

        const door = (floor - 1) * 4 + doorNumber;

        neighbors.push({
            floor: floor,
            door: door,
            name: "",
            firstName: "",
            payment: "unpaid"
        });

    }
}

// -----------------------------------------------------
// ELEMENTS HTML
// -----------------------------------------------------

const table = document.getElementById("neighborsTable");

const searchInput = document.getElementById("searchInput");

const floorFilter = document.getElementById("floorFilter");

const paymentFilter = document.getElementById("paymentFilter");

const totalResidents = document.getElementById("totalResidents");

const paidCount = document.getElementById("paidCount");

const unpaidCount = document.getElementById("unpaidCount");

const emptyMessage = document.getElementById("emptyMessage");

const modal = document.getElementById("modal");

const closeModal = document.getElementById("closeModal");

const modalDoor = document.getElementById("modalDoor");

const nameInput = document.getElementById("nameInput");

const firstNameInput = document.getElementById("firstNameInput");

const paymentInput = document.getElementById("paymentInput");

const saveButton = document.getElementById("saveButton");


// -----------------------------------------------------
// AFFICHER LA LISTE
// -----------------------------------------------------

function displayNeighbors() {

    const search = searchInput.value.toLowerCase().trim();

    const selectedFloor = floorFilter.value;

    const selectedPayment = paymentFilter.value;

    table.innerHTML = "";

    let visibleCount = 0;

    neighbors.forEach((neighbor) => {

        // Recherche

        const searchText =
            `${neighbor.door} ${neighbor.name} ${neighbor.firstName}`.toLowerCase();

        if (search && !searchText.includes(search)) {
            return;
        }

        // Filtre étage

        if (
            selectedFloor !== "all" &&
            neighbor.floor !== Number(selectedFloor)
        ) {
            return;
        }

        // Filtre paiement

        if (
            selectedPayment !== "all" &&
            neighbor.payment !== selectedPayment
        ) {
            return;
        }

        visibleCount++;

        const row = document.createElement("tr");

        const paymentHTML =
            neighbor.payment === "paid"
                ? `<span class="payment paid">✅ Payé</span>`
                : `<span class="payment unpaid">❌ Non payé</span>`;

        row.innerHTML = `

            <td>${neighbor.floor}</td>

            <td>
                <strong>Porte ${neighbor.door}</strong>
            </td>

            <td>
                ${neighbor.name || "<span style='color:#999'>Non renseigné</span>"}
            </td>

            <td>
                ${neighbor.firstName || "<span style='color:#999'>Non renseigné</span>"}
            </td>

            <td>
                ${paymentHTML}
            </td>

            <td>
                <button
                    class="edit-button"
                    onclick="editNeighbor(${neighbor.door})">
                    ✏️ Modifier
                </button>
            </td>

        `;

        table.appendChild(row);

    });

    // Message vide

    emptyMessage.style.display =
        visibleCount === 0 ? "block" : "none";

    updateStats();
}


// -----------------------------------------------------
// STATISTIQUES
// -----------------------------------------------------

function updateStats() {

    const paid = neighbors.filter(
        neighbor => neighbor.payment === "paid"
    ).length;

    const unpaid = neighbors.filter(
        neighbor => neighbor.payment === "unpaid"
    ).length;

    totalResidents.textContent = neighbors.length;

    paidCount.textContent = paid;

    unpaidCount.textContent = unpaid;
}


// -----------------------------------------------------
// OUVRIR MODIFICATION
// -----------------------------------------------------

function editNeighbor(door) {

    const neighbor = neighbors.find(
        item => item.door === door
    );

    if (!neighbor) return;

    currentDoor = door;

    modalDoor.textContent =
        `Étage ${neighbor.floor} — Porte ${neighbor.door}`;

    nameInput.value = neighbor.name;

    firstNameInput.value = neighbor.firstName;

    paymentInput.value = neighbor.payment;

    modal.classList.add("active");
}


// -----------------------------------------------------
// ENREGISTRER
// -----------------------------------------------------

saveButton.addEventListener("click", () => {

    const neighbor = neighbors.find(
        item => item.door === currentDoor
    );

    if (!neighbor) return;

    neighbor.name = nameInput.value.trim();

    neighbor.firstName = firstNameInput.value.trim();

    neighbor.payment = paymentInput.value;

    modal.classList.remove("active");

    displayNeighbors();

});


// -----------------------------------------------------
// FERMER MODAL
// -----------------------------------------------------

closeModal.addEventListener("click", () => {

    modal.classList.remove("active");

});


// Fermer en cliquant à l'extérieur

modal.addEventListener("click", (event) => {

    if (event.target === modal) {
        modal.classList.remove("active");
    }

});


// -----------------------------------------------------
// RECHERCHE ET FILTRES
// -----------------------------------------------------

searchInput.addEventListener(
    "input",
    displayNeighbors
);

floorFilter.addEventListener(
    "change",
    displayNeighbors
);

paymentFilter.addEventListener(
    "change",
    displayNeighbors
);


// -----------------------------------------------------
// PREMIER AFFICHAGE
// -----------------------------------------------------

displayNeighbors();