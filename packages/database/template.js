const { User, Game } = require('./dist');

async function main() {
    const creator = await User.Model.findOne({ displayName: 'Apteryx' });

    return new Game.Model({
        creator: creator._id,
        title: 'Countries by Population',
        shortDescription: 'Which country has a higher population?',
        longDescription: 'Can you guess which country has a higher population? Find out in this edition of the classic Higher or Lower guessing game!',
        thumbnailUrl: 'https://blog.ons.gov.uk/wp-content/uploads/sites/6/2021/04/shutterstock_604150523-630x470.jpg',
        categories: ['Geography', 'Countries'],
        extraData: {
            valueVerb: 'has',
            valueNoun: 'people',
            higherText: 'More',
            lowerText: 'Less',
        }
    });
}

module.exports = main;
