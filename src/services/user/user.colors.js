const { User } = require('../../models');

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
};

const getRandomColor = async () => {
    const colors = [
        "#F54336", "#E91F63", "#9d27b0", "#683AB7",
        "#3F51B6", "#2196F3", "#04A9F5", "#01BCD4",
        "#009688", "#4CB051", "#8CC44B", "#CEDD3B",
        "#FFC107", "#FF9901", "#FF5723", "#795548",
        "#BCAB9A", "#9E9E9E", "#607E8B", "#000000"
    ];

    const users = await User.findAll({ attributes: ["color"] });

    const colorsObj = await users.reduce((acc, user) => {
        acc[user.color] = !acc[user.color] ? 1 : +acc[user.color] + 1;
        return acc;
    }, {});

    // Check colors which is not in BD
    const colorKeys = await Object.keys(colorsObj);
    const newColors = await colors.filter((color) => colorKeys.indexOf(color) === -1);

    // If color is not exist it add new color to color object
    if (newColors.length > 0) await newColors.forEach((newColor) => colorsObj[newColor] = 0);

    // Get min value in colors obj
    const countColorsArray = await Object.values(colorsObj);
    const minCountColors = Math.min(...countColorsArray);

    // Get arr of new colors
    const newColorsArr = [];
    for (let color in colorsObj) {
        if (colorsObj[color] === minCountColors) newColorsArr.push(color);
    }

    const randomInt = getRandomInt(0, newColorsArr.length);

    return newColorsArr[randomInt];
};

const saveRandomColors = async (users) => {
    await users.map((user, index) => {
        setTimeout(async () => {
            const color = await getRandomColor();
            await User.update({ color: color }, { where: { id: user.id } });
        }, 2000 * index);
    });
};



module.exports = {
    getRandomInt,
    getRandomColor,
    saveRandomColors
};
