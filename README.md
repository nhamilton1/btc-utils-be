API Documentions:

CAGR:

[GET] /api/historic_prices/:date_string? - returns an array filled with the cagr object(s):

```
[
  {
    btc_price: 0.0858
    date: "2010-07-18"
    gld_price: 115.73
    spy_price: 86.433136
  }
]
```

| Method | URL                                | Description                                       |
| ------ | ---------------------------------- | ------------------------------------------------- |
| [GET]  | /api/historic_prices/:date_string? | returns btc_price, date, gld_price, and spy_price |

example of date_string: ?startDate=2010-07-17&endDate=2022-01-12

normal distribution for mining pools:

[GET] /api/historic_prices/:date_string? - returns an array filled with noraml distribution object:

```
[
  {
    20220107: 8
    20220108: 8
    20220109: 5
    20220110: 8
    20220111: 5
    20220112: 3
    20220113: 3
  }
]
```

| Method | URL                        | Description                                                                                                                      |
| ------ | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [GET]  | /api/nd/pool_block_counter | returns ~30 days of amount of blocks found by the pool. The key is the date and the value is amount of blocks found on that date |

This information is coming from: btc.com <br/>
example: <br/>
https://btc.com/service/poolBlockCounterPerDay?start=20211201&end=20220113&pool=SlushPool <br/>
https://btc.com/service/poolBlockCounterPerDay?start=date_here&end=date_here&pool=pool_name_here <br/>

asic price data:

[GET] /api/asics/

```
[
  {
      "seller": "Kaboomracks",
      "asic": "Whatsminer M31S+ 82T 42 W/T",
      "th": "82T",
      "price": 5699,
      "date": "January 30th, 2022"
  },
  {
      "seller": "minefarmbuy",
      "asic": "M30S-PLUS-2-110T-31J",
      "th": "110th/s (+/- 5%)",
      "price": 11045,
      "date": "January 30th 2022"
  },
]
```

| Method | URL         | Description                                                                                                                                                                                                            |
| ------ | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [GET]  | /api/asics/ | returns the seller of the asic, the name of the asic with th, price, and the date. As for the date, with minefarmbuy, it just uses the date when it was first scraped. Kaboomracks uses the date of when it was posted |
