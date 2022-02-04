const axios = require('axios')
const scheduler = async ()=> {
    try {
        const res = await axios.get('https://nd-deploy.herokuapp.com/api/asics/asics-scheduler')
        return res.data
      } catch (err) {
        console.error(err);
      }
}

scheduler()