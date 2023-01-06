const readingTime = (body) => {
    const wpm = 225;
    const textLength = body.trim().split(/\s+/).length;
    const minutes = Math.ceil(textLength / wpm);
    return `${minutes} minutes`;
};

module.exports = {readingTime};