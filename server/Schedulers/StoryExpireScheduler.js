const cron = require('node-cron');
const { Story } = require('../database/Models/Stroy');

cron.schedule('* * * * *', async () => {
    console.log('running a task every minute');

    const currTime = new Date();
    const result = await Story.updateMany(
        { expiresAt: { $lte: currTime }, expired: false },
        { $set: { expired: true } }
    );
});