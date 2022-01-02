import axios from "axios"

export const fetchPoolBlockCounterPerDay = async ({ queryKey }) => {
    // eslint-disable-next-line no-unused-vars
    const [ _, poolName ] = queryKey
    try { 
        const res = await axios.get("http://localhost:5000/pool_block_counter", { params: { pool: poolName } })
        return res.data.data
    } catch (error) { 
        console.log(error) 
    }
}
