export const APIRoutes = {
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
    games() {
        return '/games' as const;
    },
    gameCategories() {
        return '/games/categories' as const;
    },
    gameStatistics() {
        return '/games/statistics' as const;
    },
    game(gameIdOrSlug: string) {
        return `/games/${gameIdOrSlug}` as const;
    },
    gameItems(gameId: string) {
        return `/games/${gameId}/items` as const;
    },
    gameScores(gameId: string) {
        return `/games/${gameId}/scores` as const;
    },
    gameScore(gameId: string, scoreOrUserId: string) {
        return `/games/${gameId}/scores/${scoreOrUserId}` as const;
    },

    // Users
    users() {
        return '/users' as const;
    },
    user(userId: string | '@me') {
        return `/users/${userId}` as const;
    },
    userConnection(userId: string | '@me') {
        return `/users/${userId}/connection` as const;
    },

    // Users Games
    userGames(userId: string | '@me') {
        return `/users/${userId}/games` as const;
    },
    userGameCategories(userId: string | '@me') {
        return `/users/${userId}/games/categories` as const;
    },
    userGameStatistics(userId: string | '@me') {
        return `/users/${userId}/games/statistics` as const;
    },
    userGame(userId: string | '@me', gameId: string) {
        return `/users/${userId}/games/${gameId}` as const;
    },
    userScores(userId: string | '@me') {
        return `/users/${userId}/scores` as const;
    },
    userScore(userId: string | '@me', scoreOrGameId: string) {
        return `/users/${userId}/scores/${scoreOrGameId}` as const;
    },
    userScoreStatistics(userId: string | '@me') {
        return `/users/${userId}/scores/statistics` as const;
    },

    // Internal
    internalSitemap() {
        return '/internal/sitemap' as const;
    },
};

export const WebRoutes = {
    home() {
        return '/' as const;
    },

    // Auth
    login() {
        return '/login' as const;
    },
    loginCallback() {
        return '/login/callback' as const;
    },
    loginFailure() {
        return '/login/failure' as const;
    },

    // Discord
    discord() {
        return '/discord' as const;
    },
    discordSupport() {
        return '/discord/support' as const;
    },
    discordInvite() {
        return '/discord/invite' as const;
    },

    // Games
    games() {
        return '/games' as const;
    },
    game(gameSlug: string) {
        return `/games/${gameSlug}` as const;
    },
    playGame(gameSlug: string) {
        return `/games/${gameSlug}/play` as const;
    },
    previewGame(gameSlug: string) {
        return `/games/${gameSlug}/preview` as const;
    },
    createGame() {
        return '/games/create' as const;
    },

    // Users
    profile() {
        return '/profile' as const;
    },
    user(userId: string) {
        return `/users/${userId}` as const;
    },

    // Policies
    privacyPolicy() {
        return '/policies/privacy' as const;
    },
    termsOfUse() {
        return '/policies/terms' as const;
    },
    contactUs() {
        return '/contact' as const;
    },
};

export const CDNRoutes = {
    readFile() {
        return '/read' as const;
    },
    readDirectory() {
        return '/list' as const;
    },
    writeFile() {
        return '/write' as const;
    },
    deleteFile() {
        return '/delete' as const;
    },
};
