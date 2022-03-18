import axios from 'axios'
import moment from 'moment'
import * as express from "express";

const router = express.Router()

router.get('/sanity_test', (req, res) => {
    res.json('sanity test')
})

router.get('/pool_block_counter', async (req, res, next) => {
    let poolName = req.query.pool || 'SlushPool'
    let prev = moment().subtract(1, "months").startOf("months").toDate().toISOString()
    const [pyyyy, pmm, pdd] = prev.split(/T|:|-/)
    let dd:string = String(new Date().getDate()).padStart(2, '0');
    let mm:string = String(new Date().getMonth() + 1).padStart(2, '0'); //January is 0
    let yyyy:number = new Date().getFullYear();
    let today = yyyy + mm + dd;
    let lastMonth = pyyyy + pmm + pdd;
    try {
        const response = await axios.get(`https://btc.com/service/poolBlockCounterPerDay?start=${lastMonth}&end=${today}&pool=${poolName}`)
        res.status(200).json(response.data)
    } catch (err) {
        next(err)
    }
})

export {router as normalDistRouter}