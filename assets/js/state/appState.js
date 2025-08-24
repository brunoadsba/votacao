class AppState {
	constructor() {
		this.currentUser = null;
		this.isGuest = false;
		this.userVotes = {};
		this.subscribers = [];
	}

	setCurrentUser(user) {
		this.currentUser = user;
		this.notifySubscribers();
	}

	setGuestStatus(status) {
		this.isGuest = status;
		this.notifySubscribers();
	}

	setUserVotes(votes) {
		this.userVotes = { ...votes };
		this.notifySubscribers();
	}

	updateUserVote(ideaId, rating) {
		this.userVotes[ideaId] = rating;
		this.notifySubscribers();
	}

	resetUserVote(ideaId) {
		this.userVotes[ideaId] = 0;
		this.notifySubscribers();
	}

	getCurrentUser() {
		return this.currentUser;
	}

	getGuestStatus() {
		return this.isGuest;
	}

	getUserVotes() {
		return { ...this.userVotes };
	}

	subscribe(callback) {
		this.subscribers.push(callback);
		return () => {
			const index = this.subscribers.indexOf(callback);
			if (index > -1) {
				this.subscribers.splice(index, 1);
			}
		};
	}

	notifySubscribers() {
		this.subscribers.forEach(callback => callback(this));
	}

	reset() {
		this.currentUser = null;
		this.isGuest = false;
		this.userVotes = {};
		this.notifySubscribers();
	}
}

export const appState = new AppState();
