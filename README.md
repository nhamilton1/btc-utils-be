API Documentions:

CAGR:

[GET] /api/historic_prices/:date_string? - returns an array filled with cagr objects:

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
