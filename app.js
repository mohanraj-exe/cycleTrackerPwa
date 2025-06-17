const newPeriodFormEl = document.getElementsByTagName("form")[0];
const startDateInputEl = document.getElementById("start-date");
const endDateInputEl = document.getElementById("end-date");

// Add the storage key as an app-wide constant
const STORAGE_KEY = "period-tracker";

// Listen to form submissions.
newPeriodFormEl.addEventListener("submit", (event) => {
    event.preventDefault();

    const startDate = startDateInputEl.value;
    const endDate = endDateInputEl.value;

    if (checkDatesInvalid(startDate, endDate)) {
        return;
    }

    // Store the new period in our client-side storage.
    storeNewPeriod(startDate, endDate);

    // Refresh the UI.
    renderPastPeriods();

    // Reset the form.
    newPeriodFormEl.reset();
});

// Function to check if dates are valid
function checkDatesInvalid(startDate, endDate) {
    if (!startDate || !endDate || startDate > endDate) {
        newPeriodFormEl.reset();

        return true;
    }

    return false;
}

// Function to store new period data
function storeNewPeriod(startDate, endDate) {
    // Get Data from localStorage.
    const periods = getAllStoredPeriods();

    // Add the new period object to the end of the array of period objects.
    periods.push({ startDate, endDate });

    // Sort the array so that periods are ordered by start date, from newest
    // to oldest.
    periods.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    // Store the updated array back in the storage.
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(periods));
}

// Function to fetch all stored period Data from the local storage
function getAllStoredPeriods() {

    // Get the string of period data from localStorage
    const data = window.localStorage.getItem(STORAGE_KEY);

    const periods = data ? JSON.parse(data) : [];

    return periods;
}

const pastPeriodContainer = document.getElementById("past-periods");

// Function to render past periods
function renderPastPeriods() {

    const periods = getAllStoredPeriods();

    // exit if there are no periods
    if (periods.length === 0) {
        return;
    }

    // Clear the list of past periods, since we're going to re-render it.
    pastPeriodContainer.textContent = "";

    const pastPeriodHeader = document.createElement("h2");
    pastPeriodHeader.textContent = "Past periods";

    const pastPeriodList = document.createElement("ul");

    // Loop over all periods and render them.
    periods.forEach((period) => {
        const periodEl = document.createElement("li");

        periodEl.textContent = `From ${formatDate(period.startDate,)} to ${formatDate(period.endDate)}`;
        pastPeriodList.appendChild(periodEl);
    });

    pastPeriodContainer.appendChild(pastPeriodHeader);
    pastPeriodContainer.appendChild(pastPeriodList);
}

// Function to Convert the date string to a Date object.
function formatDate(dateString) {

    const date = new Date(dateString);

    // Format the date into a locale-specific string.
    // include your locale for better user experience
    return date.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });
}