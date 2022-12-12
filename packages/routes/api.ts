export const Routes = {
    // Auth
    discordLogin() {
        return '/auth/discord/login' as const;
    },

    discordCallback() {
        return '/auth/discord/callback' as const;
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

    // Users
    users() {
        return '/users' as const;
    },

    user(userId: string | '@me') {
        return `/users/${userId}` as const;
    },

    userConnections(userId: string | '@me') {
        return `/users/${userId}/connections` as const;
    },

    userConnection(userId: string | '@me', connectionId: string) {
        return `/users/${userId}/connections/${connectionId}` as const;
    },
};
