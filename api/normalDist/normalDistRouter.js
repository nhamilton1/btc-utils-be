const axios = require('axios')
const express = require('express')
const router = express.Router()
const moment = require('moment')

router.get('/', (req, res) => {
    res.json('sanity test')
})

router.get('/pool_block_counter', async (req, res, next) => {
    let poolName = req.query.pool || 'SlushPool'
    let today = new Date();
    let lastMonth = new Date();
    let prev = moment().subtract(1, "months").startOf("months").toDate().toISOString()
    // const prev = new Date(new Date().setDate(0)).toISOString();
    const [pyyyy, pmm, pdd] = prev.split(/T|:|-/)
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    today = yyyy + mm + dd;
    lastMonth = pyyyy + pmm + pdd;
    try {
        const response = await axios.get(`https://btc.com/service/poolBlockCounterPerDay?start=${lastMonth}&end=${today}&pool=${poolName}`)
        res.status(200).json(response.data)
    } catch (err) {
        next(err)
    }
})

module.exports = router