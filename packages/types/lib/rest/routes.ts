export const Routes = {
    // Auth
    discordLogin() {
        return '/auth/discord/login' as const;
    },

    discordCallback() {
        return '/auth/discord/callback' as const;
    },

    githubLogin() {
        return '/auth/github/login' as const;
    },

    githubCallback() {
        return '/auth/github/callback' as const;
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

    userGame(userId: string | '@me', gameId: string) {
        return `/users/${userId}/games/${gameId}` as const;
    },

    userGameItems(userId: string | '@me', gameId: string) {
        return `/users/${userId}/games/${gameId}/items` as const;
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
    userScores(userId: string | '@me') {
        return `/users/${userId}/scores` as const;
    },

    userScore(userId: string | '@me', scoreId: string) {
        return `/users/${userId}/scores/${scoreId}` as const;
    },
};
