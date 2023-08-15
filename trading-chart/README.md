# TradingView Charting Library and React (TypeScript) client application using Dexguru API

The earliest supported version of the charting library for these examples is `v23.043`.

## How to start

1. Check that you can view https://github.com/tradingview/charting_library/. If you do not have access then you can [request access to this repository here](https://www.tradingview.com/HTML5-stock-forex-bitcoin-charting-library/).
2. Install dependencies `yarn install`
3. Execute `copy_charting_library_files.sh` to copy charting library assets to `public` and `src` folders
4. You will need to update `udf-compatible-datafeed.ts` file in `public/datafeeds/udf/src` folder to support api-key header for datafeed requests to do so update a constructor method to receive a new parameter and pass it to Requester

```typescript
export class UDFCompatibleDatafeed extends UDFCompatibleDatafeedBase {
  public constructor(
    datafeedURL: string,
    apiKey: string,
    updateFrequency: number = 10 * 1000,
    limitedServerResponse?: LimitedResponseConfiguration
  ) {
    const requester = new Requester({ 'api-key': apiKey });
    const quotesProvider = new QuotesProvider(datafeedURL, requester);
    super(
      datafeedURL,
      quotesProvider,
      requester,
      updateFrequency,
      limitedServerResponse
    );
  }
}
```

5. You will need to rebuild `bundle.js` for datafeed by executing `yarn build` in `public/datafeeds/udf` folder
6. If you don't have it yet, get a Dexguru api-key at [Dexguru Developers Console](https://developers.dex.guru).
7. Update `TVChartContainer` component with your api key. It's recommended to use env variables (.env) and not compromise your api key
8. Execute `yarn start` to start the application

## What is Charting Library

Charting Library is a standalone solution for displaying charts. This free, downloadable library is hosted on your servers and is connected to your data feed to be used in your website or app. [Learn more and download](https://www.tradingview.com/HTML5-stock-forex-bitcoin-charting-library/).

## Where to find Dexguru API specification

[Dexguru Tradingview API](https://dexguru.readme.io/reference/get_tradingview_config_v1_tradingview_config_get)
