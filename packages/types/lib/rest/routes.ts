export const Routes = {
    // Auth
    authLogin(provider: string) {
        return `/auth/${provider}/login` as const;
    },

    authCallback(provider: string) {
        return `/auth/${provider}/callback` as const;
    },

    authFailure(provider: string) {
        return `/auth/${provider}/failure` as const;
    },

    // Games
    categories() {
        return '/categories' as const;
    },

    games() {
        return '/games' as const;
    },

    game(gameId: string) {
        return `/games/${gameId}` as const;
    },

    gameItems(gameId: string) {
        return `/games/${gameId}/items` as const;
    },

    // User Games
    userCategories(userId: string | '@me') {
        return `/users/${userId}/categories` as const;
    },

    userGames(userId: string | '@me') {
        return `/users/${userId}/games` as const;
    },

    // Users
    users() {
        return '/users' as const;
    },

    user(userId: string | '@me') {
        return `/users/${userId}` as const;
    },

    // Connections
    userConnections(userId: string | '@me') {
        return `/users/${userId}/connections` as const;
    },

    userConnection(userId: string | '@me', connectionId: string) {
        return `/users/${userId}/connections/${connectionId}` as const;
    },

    // Scores
    gameScore(gameId: string) {
        return `/games/${gameId}/score` as const;
    },

    userScores(userId: string | '@me') {
        return `/users/${userId}/scores` as const;
    },

    userScore(userId: string | '@me', scoreId: string) {
        return `/users/${userId}/scores/${scoreId}` as const;
    },

    // Statistics
    gameStatistics(gameId: string | '@all') {
        return `/games/${gameId}/statistics` as const;
    },
};
