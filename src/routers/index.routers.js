const {Router} = require('express');
const {
    renderIndex,
}=require('../controllers/index.controllers');
const router = Router();
router.get('/', renderIndex);
module.exports = router;