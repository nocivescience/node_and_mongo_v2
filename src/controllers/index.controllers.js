const express = require('express');
const renderIndex = (req, res) => {
    res.render('index')
};
module.exports = {
    renderIndex,
}