Vue.createApp({
    data: () => ({
        title: "Vue 3",

        popups: {
            showBucketList: true,
            showTrip: false,
            showDashboard: false,
            showSignUp: false,
            showLogin: false,
            showAddTrip: false,
            showAddDream: false,
            showError: false,
        },

        loginForm: {
            email: "",
            password: "",

            emailError: "",
            passwordError: "",
        },

        signUpForm: {
            firstName: "",
            lastName: "",
            email: "",
            password1: "",
            password2: "",

            firstNameError: "",
            lastNameError: "",
            emailError: "",
            password1Error: "",
            password2Error: "",
        },

        newTripForm: {
            name: "",
            details: "",
            startDate: "",
            endDate: "",

            nameError: "",
            detailsError: "",
            startDateError: "",
            endDateError: "",
        },

        newDreamForm: {
            destination: "",
            notes: "",
            budget: "",

            destinationError: "",
            notesError: "",
            budgetError: "",
        },

        trips: [],

        dreams: [],

        errors: [],

        userNotification: "",

        selectedTrip: null,

        loggedIn: false,
    }),

    methods: {

        calculateDuration(startDate, endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const duration = Math.floor((end - start) / (1000 * 60 * 60 * 24));
            return duration;
        },

        toggleCompletedDream(dreamId) {

            const dream = this.dreams.find((dream) => dream._id === dreamId);
            dream.completed = !dream.completed;

            fetch(`/dreams/${dreamId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    completed: dream.completed,
                }),
            }).then((response) => {
                if (response.status === 200) {
                    this.loadDreams();
                } else {
                    console.error("Failed to update dream");
                }
            });
        },

        loadDreams() {
            fetch("/dreams")
                .then((response) => response.json())
                .then((data) => {
                    this.dreams = data;

                    // Format the budget to currency
                    for (let i = 0; i < this.dreams.length; i++) {
                        this.dreams[i].budget = new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                        }).format(this.dreams[i].budget);
                    }
                });
        },

        loadTrips() {
            fetch("/trips")
                .then((response) => response.json())
                .then((data) => {
                    this.trips = data;
                    for (let i = 0; i < this.trips.length; i++) {
                        // Format the date
                        this.trips[i].startDate = new Date(this.trips[i].startDate).toLocaleDateString();
                        this.trips[i].endDate = new Date(this.trips[i].endDate).toLocaleDateString();
                        this.trips[i].duration = this.calculateDuration(this.trips[i].startDate, this.trips[i].endDate);
                        this.trips[i].countDown = Math.floor((new Date(this.trips[i].startDate) - new Date()) / (1000 * 60 * 60 * 24)) + 1;
                    }
                });
        },

        /*---------------------------------
            VALIDATION
            ---------------------------------*/

        showErrorMessages(errors) {
            this.popups.showError = true;
            this.errors = errors;
        },

        handleCancelError() {
            this.popups.showError = false;
            this.errors = [];
        },

        handleCancelNotification() {
            this.userNotification = "";
        },

        validateNewDream() { 
            let isValid = true;

            if (this.newDreamForm.destination === "") {
                isValid = false;
                this.errors.push("Destination is required");
            }

            if (this.newDreamForm.notes === "") {
                isValid = false;
                this.errors.push("Notes are required");
            }

            if (this.newDreamForm.budget === "") {
                isValid = false;
                this.errors.push("Budget is required");
            }

            return isValid;
        },

        validateSignUp() { 
            let isValid = true;

            if (this.signUpForm.firstName === "") {
                isValid = false;
                this.errors.push("First Name is required");
            }

            if (this.signUpForm.lastName === "") {
                isValid = false;
                this.errors.push("Last name is required");
            }

            if (this.signUpForm.password1 === "") {
                isValid = false;
                this.errors.push("Password is required");
            }

            if (this.signUpForm.password2 === "") {
                isValid = false;
                this.errors.push("Password confirmation is required");
            }

            return isValid;
        },

        validateNewTrip() {
            let isValid = true;

            if (this.newTripForm.name === "") {
                isValid = false;
                this.errors.push("Name is required");
            }

            if (this.newTripForm.details === "") {
                isValid = false;
                this.errors.push("Details are required");
            }

            if (this.newTripForm.startDate === "") {
                isValid = false;
                this.errors.push("Start date is required");
            }

            if (this.newTripForm.endDate === "") {
                isValid = false;
                this.errors.push("End date is required");
            }

            console.log(isValid);
            return isValid;
        },

        validateLogin() {
            let isValid = true;

            if (this.loginForm.email === "") {
                isValid = false;
                this.errors.push("Email is required");
            }

            if (this.loginForm.password === "") {
                isValid = false;
                this.errors.push("Password is required");
            }

            console.log(isValid);
            return isValid;
        },

        showNotification(message) {
            this.userNotification = message;
        },

        handleCancelNotification() {
            this.userNotification = "";
        },

        handleCancelSignUp() {
            this.popups.showSignUp = false;
            this.signUpFirstName = "";
            this.signUpLastName = "";
            this.signUpEmail = "";
            this.signUpPassword1 = "";
            this.signUpPassword2 = "";
        },

        handleShowSignUp() {
            this.popups.showSignUp = true;
        },

        handleCancelLogin() {
            this.popups.showLogin = false;
            this.loginEmail = "";
            this.loginPassword = "";
        },

        handleShowLogin() {
            this.popups.showLogin = true;
        },

        showBucketListDetails() {
            this.popups.showBucketList = true;
            this.popups.showTrip = false;
            this.selectedTrip = null;
            this.trips.forEach((trip) => {
                {
                    trip.selected = false;
                }
            });
        },

        showTripDetails(tripId) {
            console.log(tripId);
            
            this.popups.showBucketList = false;
            this.trips.forEach((trip) => {
                if (trip._id === tripId) {
                    trip.selected = true;
                    this.selectedTrip = this.trips.find((trip) => trip._id === tripId);
                    this.popups.showTrip = true;
                } else {
                    trip.selected = false;
                }
            });
        },

        handleCancelAddTrip() {
            this.popups.showAddTrip = false;
            this.newTripForm.name = "";
            this.newTripForm.details = "";
            this.newTripForm.startDate = "";
            this.newTripForm.endDate = "";
        },

        handleShowAddTrip() {
            this.popups.showAddTrip = true;
        },

        handleShowAddDream() {
            this.popups.showAddDream = true;
        },

        handleCancelAddDream() {
            this.popups.showAddDream = false;
            this.newDreamForm.destination = "";
            this.newDreamForm.notes = "";
            this.newDreamForm.budget = "";
        },

        addTrip() {

            // Validate the form
            if (!this.validateNewTrip()) {
                this.showErrorMessages(this.errors);
                return;
            }

            // Send a POST request to the server
            fetch("/trips", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: this.newTripForm.name,
                    details: this.newTripForm.details,
                    startDate: this.newTripForm.startDate,
                    endDate: this.newTripForm.endDate,
                }),
            }).then((response) => {
                if (response.status === 201) {
                    this.loadTrips();
                    // Hide the form
                    this.handleCancelAddTrip();
                } else {
                    console.error("Failed to add trip");
                }
            });
        },

        addDream() {

            // Validate the form
            if (!this.validateNewDream()) {
                this.showErrorMessages(this.errors);
                return;
            }
            // Send a POST request to the server
            fetch("/dreams", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    destination: this.newDreamForm.destination,
                    completed: false,
                    notes: this.newDreamForm.notes,
                    budget: this.newDreamForm.budget,
                }),
            }).then((response) => {
                if (response.status === 201) {
                    this.loadDreams();
                    // Hide the form
                    this.handleCancelAddDream();
                } else {
                    console.error("Failed to add dream");
                }
            });
        },

        deleteDream(dreamId) {
            // Confirm the user wants to delete the dream
            if (!confirm("Are you sure you want to delete this dream?")) {
                return;
            }

            // Send a DELETE request to the server
            fetch(`/dreams/${dreamId}`, {
                method: "DELETE",
            }).then((response) => {
                if (response.status === 200) {
                    this.loadDreams();
                } else {
                    console.error("Failed to delete dream");
                }
            });
            this.loadDreams();
        },

        deleteTrip() {
            // Confirm the user wants to delete the trip
            if (!confirm("Are you sure you want to delete this trip?")) {
                return;
            }

            // Send a DELETE request to the server
            fetch(`/trips/${this.selectedTrip._id}`, {
                method: "DELETE",
            }).then((response) => {
                if (response.status === 200) {
                    this.loadTrips();
                } else {
                    console.error("Failed to delete trip");
                }
            });
        },

        login() {
            // Send a POST request to the server
            email = this.loginForm.email;
            password = this.loginForm.password;

            // Validate the form
            if (!this.validateLogin()) {
                this.showErrorMessages(this.errors);
                return;
            }

            fetch("/sessions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            }).then((response) => {

                // Clear the form
                this.loginForm.email = "";
                this.loginForm.password = "";

                if (response.status === 201) {
                    this.loggedIn = true;
                    // refresh the page
                    location.reload();
                } else {
                    console.error("Failed to login");
                    this.showNotification("Invalid email or password");
                }
            });
        },

        signUp() {
            firstName = this.signUpForm.firstName;
            lastName = this.signUpForm.lastName;
            email = this.signUpForm.email;
            password1 = this.signUpForm.password1;
            password2 = this.signUpForm.password2;

            // Validate the form
            if (!this.validateSignUp()) {
                this.showErrorMessages(this.errors);
                return;
            }
            // Send a POST request to the server
            fetch("/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    { 
                        firstName : firstName, 
                        lastName : lastName, 
                        email : email, 
                        password : password1,
                    }),
            }).then((response) => {

                // Clear the form
                this.popups.showSignUp = false;
                this.signUpForm.firstName = "";
                this.signUpForm.lastName = "";
                this.signUpForm.email = "";
                this.signUpForm.password1 = "";
                this.signUpForm.password2 = "";

                if (response.status === 201) {
                    this.loggedIn = true;
                } else  if (response.status === 409){
                    console.error("Failed to sign up");
                    this.showNotification("Email already exists");
                }
            });
        },

        logout() {

            fetch("/sessions", {
                method: "DELETE",
            }).then((response) => {
                if (response.status === 200) {
                    this.loggedIn = false;
                    // refresh the page
                    location.reload();
                } else {
                    console.error("Failed to logout");
                }
            });
        },

        checkSession() {
            fetch("/sessions")
                .then((response) => {
                    if (response.status === 200) {
                        this.loggedIn = true;
                        this.popups.showDashboard = true;
                    } else {
                        this.loggedIn = false;
                    }
                });
        }
    },

    created() {
        this.checkSession();
        this.loadDreams();
        this.loadTrips();
    },
}).mount("#app");
