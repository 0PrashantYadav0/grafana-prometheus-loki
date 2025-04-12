const timeTakingProcess = async () => {
    const randomTime = Math.floor(Math.random() * 2500) + 1;

    const randomChance = Math.random();
    if (randomChance < 0.01) {
        throw new Error('An error occurred during the process');
    }
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(randomTime);
        }, randomTime);
    });
}

module.exports = {
    timeTakingProcess
}
