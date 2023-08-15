import { useEffect, useRef } from 'react';
import './index.css';
import {
  widget,
  ChartingLibraryWidgetOptions,
  ResolutionString,
} from '../../charting_library';
import * as React from 'react';

export interface ChartContainerProps {
  symbol: ChartingLibraryWidgetOptions['symbol'];
  interval: ChartingLibraryWidgetOptions['interval'];

  // BEWARE: no trailing slash is expected in feed URL
  datafeedUrl: string;
  libraryPath: ChartingLibraryWidgetOptions['library_path'];
  chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'];
  chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'];
  clientId: ChartingLibraryWidgetOptions['client_id'];
  userId: ChartingLibraryWidgetOptions['user_id'];
  fullscreen: ChartingLibraryWidgetOptions['fullscreen'];
  autosize: ChartingLibraryWidgetOptions['autosize'];
  studiesOverrides: ChartingLibraryWidgetOptions['studies_overrides'];
  container: ChartingLibraryWidgetOptions['container'];
}

export const TVChartContainer = () => {
  const chartContainerRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;

  const defaultProps: Omit<ChartContainerProps, 'container'> = {
    symbol: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2-eth_USD',
    interval: 'D' as ResolutionString,
    datafeedUrl: 'https://api.dev.dex.guru/v1/tradingview',
    libraryPath: '/charting_library/',
    chartsStorageUrl: 'https://saveload.tradingview.com',
    chartsStorageApiVersion: '1.1',
    clientId: 'tradingview.com',
    userId: 'public_user_id',
    fullscreen: false,
    autosize: true,
    studiesOverrides: {},
  };

  useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: defaultProps.symbol as string,
      // BEWARE: no trailing slash is expected in feed URL
      // tslint:disable-next-line:no-any
      datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(
        defaultProps.datafeedUrl,
        'V9qVzeBfjN6tlFL_1mlAiRP9CvRi2b0BhZKzu8KaSEk'
      ),
      interval:
        defaultProps.interval as ChartingLibraryWidgetOptions['interval'],
      container: chartContainerRef.current,
      library_path: defaultProps.libraryPath as string,

      locale: 'en',
      disabled_features: ['use_localstorage_for_settings'],
      enabled_features: ['study_templates'],
      charts_storage_url: defaultProps.chartsStorageUrl,
      charts_storage_api_version: defaultProps.chartsStorageApiVersion,
      client_id: defaultProps.clientId,
      user_id: defaultProps.userId,
      fullscreen: defaultProps.fullscreen,
      autosize: defaultProps.autosize,
      studies_overrides: defaultProps.studiesOverrides,
    };

    const tvWidget = new widget(widgetOptions);

    return () => {
      tvWidget.remove();
    };
  });

  return <div ref={chartContainerRef} className={'TVChartContainer'} />;
};
