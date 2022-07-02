const {Router} = require('express');
const {
    renderHome,
    renderIntroduce,
}=require('../controllers/index.controllers');
const router = Router();
router.get('/', renderHome);
router.get('/introduce', renderIntroduce);
module.exports = router;