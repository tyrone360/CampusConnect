
"use strict";

/* ========================================
   CAMPUSCONNECT - MAIN JAVASCRIPT
======================================== */

/* 1. EVENT INFORMATION */

const events = [
    {
        id: "study",
        title: "Study Group Meetup",
        category: "academic",
        date: "22 October 2026",
        location: "Learning Commons",
        description:
            "Join fellow students for a collaborative study session. Share ideas, discuss difficult topics, and prepare for upcoming assessments together."
    },
    {
        id: "workshop",
        title: "Academic Skills Workshop",
        category: "academic",
        date: "29 October 2026",
        location: "Student Learning Centre",
        description:
            "Improve your academic skills through practical activities focused on time management, research, note-taking, and effective study techniques."
    },
    {
        id: "groupwork",
        title: "Group Assignment Workshop",
        category: "academic",
        date: "3 November 2026",
        location: "Campus Library",
        description:
            "Learn how to organise group assignments, divide responsibilities, communicate effectively, and work together to complete academic projects."
    },
    {
        id: "presentations",
        title: "Presentation Skills Session",
        category: "academic",
        date: "10 November 2026",
        location: "Lecture Hall 2",
        description:
            "Build confidence in public speaking and learn practical techniques for preparing and delivering clear, engaging academic presentations."
    },
    {
        id: "examprep",
        title: "Exam Preparation Workshop",
        category: "academic",
        date: "17 November 2026",
        location: "Student Learning Centre",
        description:
            "Explore revision strategies, study planning, and time-management techniques to help you prepare effectively for examinations."
    },
    {
        id: "digitalskills",
        title: "Digital Skills and Research",
        category: "academic",
        date: "24 November 2026",
        location: "Computer Lab",
        description:
            "Discover useful digital tools and research techniques that can help you find information, organise your work, and complete academic tasks."
    },
    {
        id: "football",
        title: "Campus Football Day",
        category: "sports",
        date: "24 October 2026",
        location: "Main Sports Field",
        description:
            "Enjoy a day of campus football, teamwork, and friendly competition. Students can participate, support their teams, and meet other sports enthusiasts."
    },
    {
        id: "athletics",
        title: "Campus Athletics Day",
        category: "sports",
        date: "31 October 2026",
        location: "Athletics Track",
        description:
            "Take part in a campus athletics event featuring running activities and opportunities to support fellow students."
    },
    {
        id: "teamsports",
        title: "Team Sports Meetup",
        category: "sports",
        date: "7 November 2026",
        location: "Campus Recreation Area",
        description:
            "Meet other students through casual team sports and recreational activities. All experience levels are welcome."
    },
    {
        id: "meetup",
        title: "Student Social Meetup",
        category: "social",
        date: "27 October 2026",
        location: "Student Centre",
        description:
            "Connect with fellow students in a relaxed environment, make new friends, and share your campus experiences."
    },
    {
        id: "celebration",
        title: "Campus Celebration",
        category: "social",
        date: "5 November 2026",
        location: "Campus Courtyard",
        description:
            "Come together with the campus community for a social gathering where students can connect and enjoy activities together."
    },
    {
        id: "connections",
        title: "Make New Connections",
        category: "social",
        date: "12 November 2026",
        location: "Campus Common Room",
        description:
            "Meet students from different courses, exchange ideas, and build connections that can make campus life more enjoyable."
    }
];


/* 2. LOCAL STORAGE */

const STORAGE_KEY = "campusConnectRegisteredEvents";

function getRegisteredEvents() {
    try {
        const savedEvents = localStorage.getItem(STORAGE_KEY);

        if (!savedEvents) {
            return [];
        }

        const parsedEvents = JSON.parse(savedEvents);

        if (!Array.isArray(parsedEvents)) {
            return [];
        }

        // Keep only valid event IDs and remove duplicates.
        return [...new Set(
            parsedEvents.filter(id =>
                events.some(event => event.id === id)
            )
        )];
    } catch (error) {
        console.error("Could not load registered events:", error);
        return [];
    }
}

let registeredEvents = getRegisteredEvents();

function saveRegisteredEvents() {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(registeredEvents)
        );

        return true;
    } catch (error) {
        console.error("Could not save registered events:", error);

        showMessage(
            "Your changes could not be saved. Please check your browser storage settings.",
            "error"
        );

        return false;
    }
}


/* 3. GENERAL ELEMENTS */

const searchInput = document.getElementById("event-search");
const filterSelect = document.getElementById("event-filter");
const registeredEventsContainer =
    document.getElementById("registered-events");
const registrationMessage =
    document.getElementById("registration-message");
const noEventsMessage = document.getElementById("no-events");


/* 4. STATUS MESSAGES */

function showMessage(message, type = "success") {
    if (!registrationMessage) {
        return;
    }

    registrationMessage.textContent = message;
    registrationMessage.className = `registration-message ${type}`;
    registrationMessage.hidden = false;
}

function clearMessage() {
    if (!registrationMessage) {
        return;
    }

    registrationMessage.textContent = "";
    registrationMessage.hidden = true;
}


/* 5. EVENT DETAILS POPUP */

const dialog = document.createElement("dialog");

dialog.className = "event-dialog";
dialog.setAttribute("aria-labelledby", "dialog-title");

dialog.innerHTML = `
    <div class="dialog-content">

        <button
            type="button"
            class="dialog-close"
            aria-label="Close event details"
        >&times;</button>

        <p id="dialog-category"></p>

        <h2 id="dialog-title"></h2>

        <p id="dialog-date"></p>

        <p id="dialog-location"></p>

        <p id="dialog-description"></p>

        <p id="dialog-status" aria-live="polite"></p>

        <button
            type="button"
            id="dialog-register"
            class="btn btn-primary"
        >
            Register for Event
        </button>

    </div>
`;

document.body.appendChild(dialog);

const dialogCategory = dialog.querySelector("#dialog-category");
const dialogTitle = dialog.querySelector("#dialog-title");
const dialogDate = dialog.querySelector("#dialog-date");
const dialogLocation = dialog.querySelector("#dialog-location");
const dialogDescription = dialog.querySelector("#dialog-description");
const dialogStatus = dialog.querySelector("#dialog-status");
const dialogRegisterButton =
    dialog.querySelector("#dialog-register");
const dialogCloseButton = dialog.querySelector(".dialog-close");

let currentEventId = null;


/* Open the event popup. */

function openEventDetails(eventId) {
    const event = events.find(item => item.id === eventId);

    if (!event) {
        return;
    }

    currentEventId = eventId;

    dialogCategory.textContent = event.category;
    dialogTitle.textContent = event.title;
    dialogDate.textContent = `Date: ${event.date}`;
    dialogLocation.textContent = `Location: ${event.location}`;
    dialogDescription.textContent = event.description;

    updateDialogRegistrationStatus();

    if (typeof dialog.showModal === "function") {
        if (!dialog.open) {
            dialog.showModal();
        }

        dialogCloseButton.focus();
    } else {
        // Fallback for browsers without native dialog support.
        alert(
            `${event.title}\n\n` +
            `Date: ${event.date}\n` +
            `Location: ${event.location}\n\n` +
            event.description
        );
    }
}


/* Update the popup registration button. */

function updateDialogRegistrationStatus() {
    if (!currentEventId) {
        return;
    }

    const isRegistered = registeredEvents.includes(currentEventId);

    if (isRegistered) {
        dialogRegisterButton.textContent = "Cancel Registration";
        dialogRegisterButton.classList.add("registered");
        dialogStatus.textContent = "You are registered for this event.";
    } else {
        dialogRegisterButton.textContent = "Register for Event";
        dialogRegisterButton.classList.remove("registered");
        dialogStatus.textContent = "You have not registered for this event.";
    }
}


/* Close the popup. */

dialogCloseButton.addEventListener("click", () => {
    dialog.close();
});

dialog.addEventListener("click", event => {
    // Close when the user clicks the dark backdrop.
    if (event.target === dialog) {
        dialog.close();
    }
});

dialog.addEventListener("close", () => {
    currentEventId = null;
});


/* 6. REGISTER OR CANCEL REGISTRATION */

function toggleRegistration(eventId) {
    const event = events.find(item => item.id === eventId);

    if (!event) {
        return;
    }

    const isRegistered = registeredEvents.includes(eventId);

    const updatedEvents = isRegistered
        ? registeredEvents.filter(id => id !== eventId)
        : [...registeredEvents, eventId];

    const previousEvents = registeredEvents;
    registeredEvents = updatedEvents;

    if (!saveRegisteredEvents()) {
        registeredEvents = previousEvents;
        return;
    }

    if (isRegistered) {
        showMessage(
            `Your registration for "${event.title}" has been cancelled.`,
            "success"
        );
    } else {
        showMessage(
            `You have successfully registered for "${event.title}"!`,
            "success"
        );
    }

    renderRegisteredEvents();
    updateAllEventButtons();
    updateDialogRegistrationStatus();
}


/* Popup registration button. */

dialogRegisterButton.addEventListener("click", () => {
    if (currentEventId) {
        toggleRegistration(currentEventId);
    }
});


/* 7. UPDATE EVENT CARD BUTTONS */

function updateAllEventButtons() {
    const detailButtons = document.querySelectorAll(
        ".details-btn[data-event]"
    );

    detailButtons.forEach(button => {
        const eventId = button.dataset.event;
        const event = events.find(item => item.id === eventId);

        if (!event) {
            return;
        }

        button.textContent = "View Details";
        button.setAttribute(
            "aria-label",
            `View details for ${event.title}`
        );

        const isRegistered = registeredEvents.includes(eventId);

        const card = button.closest(".event-card");

        if (card) {
            card.classList.toggle("is-registered", isRegistered);

            const status = card.querySelector(".event-registration-status");

            if (status) {
                status.textContent = isRegistered ? "Registered" : "";
                status.hidden = !isRegistered;
            }
        }
    });
}


/* 8. DISPLAY MY EVENTS */

function renderRegisteredEvents() {
    if (!registeredEventsContainer) {
        return;
    }

    registeredEventsContainer.innerHTML = "";

    if (registeredEvents.length === 0) {
        const emptyMessage = document.createElement("p");

        emptyMessage.className = "empty-events-message";
        emptyMessage.textContent =
            "You have not registered for any events yet. Explore the events above and register for the ones you like.";

        registeredEventsContainer.appendChild(emptyMessage);
        return;
    }

    registeredEvents.forEach(eventId => {
        const event = events.find(item => item.id === eventId);

        if (!event) {
            return;
        }

        const card = document.createElement("article");
        card.className = "registered-event-card";

        const information = document.createElement("div");
        information.className = "event-info";

        const title = document.createElement("h3");
        title.textContent = event.title;

        const category = document.createElement("p");
        category.textContent =
            `Category: ${capitalize(event.category)}`;

        const date = document.createElement("p");
        date.textContent = `Date: ${event.date}`;

        const location = document.createElement("p");
        location.textContent = `Location: ${event.location}`;

        const status = document.createElement("p");
        status.className = "event-registration-status";
        status.textContent = "Registered";

        information.append(
            title,
            category,
            date,
            location,
            status
        );

        const cancelButton = document.createElement("button");
        cancelButton.type = "button";
        cancelButton.className = "cancel-registration";
        cancelButton.textContent = "Cancel Registration";

        cancelButton.setAttribute(
            "aria-label",
            `Cancel registration for ${event.title}`
        );

        cancelButton.addEventListener("click", () => {
            toggleRegistration(event.id);
        });

        card.append(information, cancelButton);
        registeredEventsContainer.appendChild(card);
    });
}


/* 9. SEARCH AND CATEGORY FILTER */

function filterEvents() {
    const searchTerm = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    const selectedCategory = filterSelect
        ? filterSelect.value
        : "all";

    const eventCards = document.querySelectorAll(".event-card");

    let visibleEvents = 0;

    eventCards.forEach(card => {
        const eventId = card.querySelector("[data-event]")?.dataset.event;
        const event = events.find(item => item.id === eventId);

        if (!event) {
            card.hidden = true;
            return;
        }

        const searchableText = [
            event.title,
            event.category,
            event.date,
            event.location,
            event.description
        ].join(" ").toLowerCase();

        const matchesSearch = searchableText.includes(searchTerm);

        const matchesCategory =
            selectedCategory === "all" ||
            event.category === selectedCategory;

        const isVisible = matchesSearch && matchesCategory;

        card.hidden = !isVisible;

        if (isVisible) {
            visibleEvents++;
        }
    });

    // Hide category sections that have no visible event cards.
    const categorySections = document.querySelectorAll(".category-section");

    categorySections.forEach(section => {
        const cards = section.querySelectorAll(".event-card");

        const hasVisibleCard = Array.from(cards).some(card => !card.hidden);

        section.hidden = !hasVisibleCard;
    });

    // Show a message when no events match.
    if (noEventsMessage) {
        noEventsMessage.hidden = visibleEvents !== 0;
    }
}


/* 10. HELPER FUNCTION */

function capitalize(value) {
    if (!value) {
        return "";
    }

    return value.charAt(0).toUpperCase() + value.slice(1);
}


/* 11. EVENT LISTENERS */

document.addEventListener("click", event => {
    const detailsButton = event.target.closest(".details-btn[data-event]");

    if (detailsButton) {
        openEventDetails(detailsButton.dataset.event);
    }
});

if (searchInput) {
    searchInput.addEventListener("input", filterEvents);
}

if (filterSelect) {
    filterSelect.addEventListener("change", filterEvents);
}


/* 12. INITIALISE THE WEBSITE */

function initialiseCampusConnect() {
    clearMessage();
    renderRegisteredEvents();
    updateAllEventButtons();
    filterEvents();
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initialiseCampusConnect
    );
} else {
    initialiseCampusConnect();
}
