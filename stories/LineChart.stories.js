import React from 'react';
import moment from 'moment';
import Select from 'react-select';
import isEqual from 'lodash.isequal';
import 'react-select/dist/react-select.css';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import { DataProvider, LineChart, Brush } from '../src';
import quandlLoader from './quandlLoader';

import {
  staticLoader,
  monoLoader,
  customAccessorLoader,
  liveLoader,
} from './loaders';

const staticBaseDomain = [Date.now() - 1000 * 60 * 60 * 24 * 30, Date.now()];
const liveBaseDomain = [Date.now() - 1000 * 30, Date.now()];
const CHART_HEIGHT = 500;

/* eslint-disable react/no-multi-comp */
storiesOf('LineChart', module)
  .addDecorator(story => (
    <div style={{ marginLeft: 'auto', marginRight: 'auto', width: '80%' }}>
      {story()}
    </div>
  ))
  .add(
    'Basic',
    withInfo()(() => (
      <DataProvider
        defaultLoader={staticLoader}
        baseDomain={staticBaseDomain}
        series={[{ id: 1, color: 'steelblue' }, { id: 2, color: 'maroon' }]}
      >
        <LineChart height={CHART_HEIGHT} />
      </DataProvider>
    ))
  )
  .add(
    'Multiple',
    withInfo()(() => (
      <React.Fragment>
        <DataProvider
          defaultLoader={staticLoader}
          baseDomain={staticBaseDomain}
          series={[
            { id: 1, color: 'steelblue' },
            { id: 2, color: 'maroon' },
            { id: 3, color: 'orange' },
          ]}
        >
          <LineChart height={CHART_HEIGHT} />
        </DataProvider>
        <DataProvider
          defaultLoader={staticLoader}
          baseDomain={staticBaseDomain}
          series={[
            { id: 1, color: 'steelblue' },
            { id: 2, color: 'maroon' },
            { id: 3, color: 'orange', hidden: true },
          ]}
        >
          <LineChart height={CHART_HEIGHT} />
        </DataProvider>
        <DataProvider
          defaultLoader={staticLoader}
          baseDomain={staticBaseDomain}
          series={[{ id: 1, color: 'steelblue' }, { id: 2, color: 'maroon' }]}
        >
          <LineChart height={CHART_HEIGHT} />
        </DataProvider>
      </React.Fragment>
    ))
  )
  .add(
    'Single-value in y axis',
    withInfo()(() => (
      <React.Fragment>
        <DataProvider
          baseDomain={staticBaseDomain}
          series={[
            { id: 1, color: 'steelblue', loader: monoLoader(0) },
            { id: 2, color: 'maroon', loader: monoLoader(0.5) },
            { id: 3, color: 'orange', loader: monoLoader(-0.5) },
          ]}
        >
          <LineChart height={CHART_HEIGHT} />
        </DataProvider>
      </React.Fragment>
    ))
  )
  .add(
    'Sized',
    withInfo()(() => (
      <div>
        <p>All of the components should be entirely contained in the red box</p>
        <div
          style={{
            width: `${CHART_HEIGHT}px`,
            height: `${CHART_HEIGHT}px`,
            border: '2px solid red',
          }}
        >
          <DataProvider
            defaultLoader={staticLoader}
            baseDomain={staticBaseDomain}
            series={[{ id: 1, color: 'steelblue' }, { id: 2, color: 'maroon' }]}
          >
            <LineChart />
          </DataProvider>
        </div>
      </div>
    ))
  )
  .add(
    'Full-size',
    withInfo()(() => (
      <div style={{ height: '100vh' }}>
        <DataProvider
          defaultLoader={staticLoader}
          baseDomain={staticBaseDomain}
          series={[{ id: 1, color: 'steelblue' }, { id: 2, color: 'maroon' }]}
        >
          <LineChart />
        </DataProvider>
      </div>
    ))
  )
  .add(
    'Resizing',
    withInfo()(() => {
      class ResizingChart extends React.Component {
        state = { width: CHART_HEIGHT, height: CHART_HEIGHT };

        toggleHide = key => {
          const { hiddenSeries } = this.state;
          this.setState({
            hiddenSeries: {
              ...hiddenSeries,
              [key]: !hiddenSeries[key],
            },
          });
        };

        render() {
          const { width, height } = this.state;
          const nextWidth =
            width === CHART_HEIGHT ? CHART_HEIGHT * 2 : CHART_HEIGHT;
          const nextHeight =
            height === CHART_HEIGHT ? CHART_HEIGHT * 2 : CHART_HEIGHT;
          return (
            <React.Fragment>
              <p>
                All of the components should be entirely contained in the red
                box
              </p>
              <button onClick={() => this.setState({ width: nextWidth })}>
                change to {nextWidth} pixels wide
              </button>
              <button onClick={() => this.setState({ height: nextHeight })}>
                change to {nextHeight} pixels high
              </button>
              <div
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                  border: '2px solid red',
                }}
              >
                <DataProvider
                  defaultLoader={staticLoader}
                  baseDomain={staticBaseDomain}
                  series={[
                    { id: 1, color: 'steelblue' },
                    { id: 2, color: 'maroon' },
                  ]}
                >
                  <LineChart />
                </DataProvider>
              </div>
            </React.Fragment>
          );
        }
      }
      return <ResizingChart />;
    })
  )
  .add(
    'Stretchy',
    withInfo()(() => (
      <React.Fragment>
        <p>The chart should resize with resizing the window</p>
        <div
          style={{
            width: '100%',
            height: 'calc(100vh - 100px)',
            border: '2px solid red',
          }}
        >
          <DataProvider
            defaultLoader={staticLoader}
            baseDomain={staticBaseDomain}
            series={[{ id: 1, color: 'steelblue' }, { id: 2, color: 'maroon' }]}
          >
            <LineChart />
          </DataProvider>
        </div>
      </React.Fragment>
    ))
  )
  .add(
    'Custom default accessors',
    withInfo()(() => (
      <DataProvider
        defaultLoader={customAccessorLoader}
        xAccessor={d => d[0]}
        yAccessor={d => d[1]}
        baseDomain={staticBaseDomain}
        series={[{ id: 1, color: 'steelblue' }, { id: 2, color: 'maroon' }]}
      >
        <LineChart height={CHART_HEIGHT} />
      </DataProvider>
    ))
  )
  .add(
    'min/max',
    withInfo()(() => {
      const y0Accessor = d => d[1] - 0.5;
      const y1Accessor = d => d[1] + 0.5;
      return (
        <DataProvider
          defaultLoader={customAccessorLoader}
          xAccessor={d => d[0]}
          yAccessor={d => d[1]}
          baseDomain={staticBaseDomain}
          series={[
            { id: 10, color: 'steelblue', y0Accessor, y1Accessor },
            { id: 2, color: 'maroon' },
          ]}
        >
          <LineChart height={CHART_HEIGHT} />
        </DataProvider>
      );
    })
  )
  .add(
    'min/max (step series)',
    withInfo()(() => {
      const y0Accessor = d => d[1] - 0.5;
      const y1Accessor = d => d[1] + 0.5;
      return (
        <DataProvider
          defaultLoader={customAccessorLoader}
          baseDomain={staticBaseDomain}
          xAccessor={d => d[0]}
          yAccessor={d => d[1]}
          series={[
            { id: 10, color: 'steelblue', y0Accessor, y1Accessor, step: true },
            { id: 2, color: 'maroon', step: true },
          ]}
        >
          <LineChart height={CHART_HEIGHT} />
        </DataProvider>
      );
    })
  )
  .add(
    'min/max with raw points',
    withInfo()(() => {
      const y0Accessor = d => d[1] - 0.5;
      const y1Accessor = d => d[1] + 0.5;
      return (
        <DataProvider
          defaultLoader={customAccessorLoader}
          xAccessor={d => d[0]}
          yAccessor={d => d[1]}
          baseDomain={staticBaseDomain}
          series={[
            { id: 10, color: 'steelblue', y0Accessor, y1Accessor },
            { id: 2, color: 'maroon', drawPoints: true },
          ]}
        >
          <LineChart height={CHART_HEIGHT} />
        </DataProvider>
      );
    })
  )
  .add(
    'Loading data from api',
    withInfo()(() => (
      <DataProvider
        defaultLoader={quandlLoader}
        baseDomain={[+moment().subtract(10, 'year'), +moment()]}
        series={[
          {
            id: 'COM/COFFEE_BRZL',
            color: 'steelblue',
          },
          {
            id: 'COM/COFFEE_CLMB',
            color: 'red',
          },
        ]}
        pointsPerSeries={100}
      >
        <LineChart height={CHART_HEIGHT} />
      </DataProvider>
    ))
  )
  .add(
    'Hide series',
    withInfo()(() => {
      class HiddenSeries extends React.Component {
        state = { hiddenSeries: {} };

        toggleHide = key => {
          const { hiddenSeries } = this.state;
          this.setState({
            hiddenSeries: {
              ...hiddenSeries,
              [key]: !hiddenSeries[key],
            },
          });
        };

        render() {
          const { hiddenSeries } = this.state;
          return (
            <React.Fragment>
              <DataProvider
                defaultLoader={staticLoader}
                baseDomain={staticBaseDomain}
                series={[
                  {
                    id: 1,
                    color: 'steelblue',
                    hidden: hiddenSeries[1],
                  },
                  {
                    id: 2,
                    color: 'maroon',
                    hidden: hiddenSeries[2],
                  },
                ]}
              >
                <LineChart height={CHART_HEIGHT} />
              </DataProvider>
              <button onClick={() => this.toggleHide(1)}>Hide series 1</button>
              <button onClick={() => this.toggleHide(2)}>Hide series 2</button>
            </React.Fragment>
          );
        }
      }
      return <HiddenSeries />;
    })
  )
  .add(
    'Specify y domain',
    withInfo()(() => {
      const staticDomain = [-2, 2];
      class SpecifyDomain extends React.Component {
        state = { yDomains: {} };

        setStaticDomain = key => {
          const { yDomains } = this.state;
          if (yDomains[key]) {
            const newYDomains = { ...yDomains };
            delete newYDomains[key];
            this.setState({ yDomains: newYDomains });
            action(`Removing static domain`)(key);
            return;
          }
          action(`Setting domain to DataProvider`)(key);
          this.setState({ yDomains: { ...yDomains, [key]: staticDomain } });
        };

        render() {
          const { yDomains } = this.state;
          return (
            <React.Fragment>
              <DataProvider
                defaultLoader={staticLoader}
                baseDomain={staticBaseDomain}
                series={[
                  { id: 1, color: 'steelblue', yDomain: yDomains[1] },
                  { id: 2, color: 'maroon', yDomain: yDomains[2] },
                ]}
              >
                <LineChart height={CHART_HEIGHT} />
              </DataProvider>
              <button onClick={() => this.setStaticDomain(1)}>
                Static series 1
              </button>
              <button onClick={() => this.setStaticDomain(2)}>
                Static series 2
              </button>
            </React.Fragment>
          );
        }
      }
      return <SpecifyDomain />;
    })
  )
  .add(
    'Annotations',
    withInfo()(() => {
      const series = staticLoader({
        id: 1,
        reason: 'MOUNTED',
        baseDomain: staticBaseDomain,
      }).data;
      const exampleAnnotations = [
        {
          id: 1,
          data: [series[40].timestamp, series[60].timestamp],
          color: 'black',
        },
      ];
      return (
        <DataProvider
          defaultLoader={staticLoader}
          baseDomain={staticBaseDomain}
          series={[{ id: 1, color: 'steelblue' }, { id: 2, color: 'maroon' }]}
        >
          <LineChart height={CHART_HEIGHT} annotations={exampleAnnotations} />
        </DataProvider>
      );
    })
  )
  .add(
    'Click events',
    withInfo()(() => {
      const series = staticLoader({
        id: 1,
        reason: 'MOUNTED',
        baseDomain: staticBaseDomain,
      }).data;
      const exampleAnnotations = [
        {
          id: 1,
          data: [series[40].timestamp, series[60].timestamp],
          color: 'black',
        },
      ];
      return (
        <DataProvider
          defaultLoader={staticLoader}
          baseDomain={staticBaseDomain}
          series={[{ id: 1, color: 'steelblue' }, { id: 2, color: 'maroon' }]}
        >
          <LineChart
            height={CHART_HEIGHT}
            annotations={exampleAnnotations}
            onClickAnnotation={annotation => {
              action('annotation click')(annotation);
            }}
            onClick={e => {
              action('chart click')(e);
            }}
          />
        </DataProvider>
      );
    })
  )
  .add(
    'Draw points',
    withInfo()(() => (
      <DataProvider
        defaultLoader={staticLoader}
        baseDomain={staticBaseDomain}
        pointsPerSeries={100}
        series={[
          { id: 1, color: 'steelblue' },
          { id: 2, color: 'maroon', drawPoints: true },
        ]}
      >
        <LineChart height={CHART_HEIGHT} />
      </DataProvider>
    ))
  )
  .add(
    'Without context chart',
    withInfo()(() => (
      <DataProvider
        defaultLoader={staticLoader}
        baseDomain={staticBaseDomain}
        series={[{ id: 1, color: 'steelblue' }, { id: 2, color: 'maroon' }]}
      >
        <LineChart height={CHART_HEIGHT} contextChart={{ visible: false }} />
      </DataProvider>
    ))
  )
  .add(
    'Non-Zoomable',
    withInfo()(() => {
      class ZoomToggle extends React.Component {
        state = {
          zoomable: true,
          yZoomable: { 1: false, 2: false },
        };

        toggleZoom = id => {
          action('zoomed')(`${id} - ${!this.state.yZoomable[id]}`);
          this.setState({
            yZoomable: {
              ...this.state.yZoomable,
              [id]: !this.state.yZoomable[id],
            },
          });
        };

        render() {
          const { zoomable, yZoomable } = this.state;
          return (
            <React.Fragment>
              <DataProvider
                defaultLoader={staticLoader}
                baseDomain={staticBaseDomain}
                series={[
                  { id: 1, color: 'steelblue', zoomable: yZoomable[1] },
                  { id: 2, color: 'maroon', zoomable: yZoomable[2] },
                ]}
              >
                <LineChart height={CHART_HEIGHT} zoomable={zoomable} />
              </DataProvider>
              <button
                onClick={() =>
                  this.setState({ zoomable: !this.state.zoomable })
                }
              >
                Toggle x zoom [{zoomable ? 'on' : 'off'}]
              </button>
              <button onClick={() => this.toggleZoom(1)}>
                Toggle y1 zoom [{yZoomable[1] !== false ? 'on' : 'off'}]
              </button>
              <button onClick={() => this.toggleZoom(2)}>
                Toggle y2 zoom [{yZoomable[2] !== false ? 'on' : 'off'}]
              </button>
            </React.Fragment>
          );
        }
      }
      return <ZoomToggle />;
    })
  )
  .add(
    'Dynamic base domain',
    withInfo()(() => {
      class DynamicBaseDomain extends React.Component {
        state = {
          baseDomain: staticBaseDomain,
        };

        toggleBaseDomain = () => {
          const { baseDomain } = this.state;
          const newDomain = isEqual(baseDomain, staticBaseDomain)
            ? [
                staticBaseDomain[0] - 100000000 * 50,
                staticBaseDomain[1] + 100000000 * 50,
              ]
            : staticBaseDomain;
          this.setState({ baseDomain: newDomain });
        };

        render() {
          const { baseDomain } = this.state;
          return (
            <div>
              <button onClick={this.toggleBaseDomain}>
                {isEqual(baseDomain, staticBaseDomain)
                  ? 'Shrink baseDomain'
                  : 'Reset base domain'}
              </button>
              <DataProvider
                defaultLoader={staticLoader}
                series={[
                  { id: 1, color: 'steelblue' },
                  { id: 2, color: 'maroon' },
                ]}
                baseDomain={baseDomain}
              >
                <LineChart height={CHART_HEIGHT} />
              </DataProvider>
            </div>
          );
        }
      }
      return <DynamicBaseDomain />;
    })
  )
  .add(
    'Dynamic sub domain',
    withInfo()(() => {
      const subDomainFirst = [
        Date.now() - 1000 * 60 * 60 * 24 * 20,
        Date.now() - 1000 * 60 * 60 * 24 * 10,
      ];

      const subDomainSecond = [
        Date.now() - 1000 * 60 * 60 * 24 * 10,
        Date.now(),
      ];

      class CustomSubDomain extends React.Component {
        state = {
          isFirst: true,
        };

        render() {
          return (
            <React.Fragment>
              <button
                onClick={() => this.setState({ isFirst: !this.state.isFirst })}
              >
                {this.state.isFirst
                  ? `Switch subDomain`
                  : `Switch back subDomain`}
              </button>
              <DataProvider
                defaultLoader={staticLoader}
                baseDomain={staticBaseDomain}
                subDomain={
                  this.state.isFirst ? subDomainFirst : subDomainSecond
                }
                series={[
                  { id: 1, color: 'steelblue' },
                  { id: 2, color: 'maroon' },
                ]}
              >
                <LineChart height={CHART_HEIGHT} />
              </DataProvider>
            </React.Fragment>
          );
        }
      }
      return <CustomSubDomain />;
    })
  )
  .add(
    'Live loading',
    withInfo()(() => (
      <DataProvider
        defaultLoader={liveLoader}
        baseDomain={liveBaseDomain}
        updateInterval={33}
        yAxisWidth={50}
        series={[{ id: 1, color: 'steelblue' }, { id: 2, color: 'maroon' }]}
      >
        <LineChart height={CHART_HEIGHT} />
      </DataProvider>
    ))
  )
  .add(
    'Live loading and ruler',
    withInfo()(() => (
      <DataProvider
        defaultLoader={liveLoader}
        baseDomain={liveBaseDomain}
        updateInterval={33}
        yAxisWidth={50}
        series={[
          { id: 1, color: 'steelblue', name: 'name1' },
          { id: 2, color: 'maroon', name: 'name2' },
        ]}
      >
        <LineChart
          height={CHART_HEIGHT}
          crosshair={false}
          ruler={{
            visible: true,
            yLabel: point =>
              `${point.name}: ${Number.parseFloat(point.value).toFixed(3)}`,
            xLabel: point =>
              moment(point.timestamp).format('DD-MM-YYYY HH:mm:ss'),
          }}
        />
      </DataProvider>
    ))
  )
  .add(
    'Enable/disable series',
    withInfo()(() => {
      const colors = {
        'COM/COFFEE_BRZL': 'steelblue',
        'COM/COFFEE_CLMB': 'maroon',
      };
      const options = [
        { value: 'COM/COFFEE_BRZL', label: 'Brazil coffe price' },
        { value: 'COM/COFFEE_CLMB', label: 'Columbia coffe price' },
      ];

      const baseDomain = [+moment().subtract(10, 'year'), +moment()];

      // eslint-disable-next-line
      class EnableDisableSeries extends React.Component {
        state = {
          series: [options[0]],
        };

        onChangeSeries = series => this.setState({ series });

        render() {
          const { series } = this.state;
          return (
            <React.Fragment>
              <Select
                multi
                value={series}
                options={options}
                onChange={this.onChangeSeries}
                style={{ marginBottom: '15px' }}
              />
              <DataProvider
                defaultLoader={quandlLoader}
                pointsPerSeries={100}
                baseDomain={baseDomain}
                series={series.map(s => ({
                  id: s.value,
                  color: colors[s.value],
                }))}
              >
                <LineChart height={CHART_HEIGHT} />
              </DataProvider>
            </React.Fragment>
          );
        }
      }
      return <EnableDisableSeries />;
    })
  )
  .add(
    'Custom context brush',
    withInfo()(() => {
      const width = 600;
      const height = 50;
      // eslint-disable-next-line
      class BrushComponent extends React.Component {
        state = {
          selection: [0, width],
        };

        onUpdateSelection = selection => {
          this.setState({
            selection,
          });
        };

        render() {
          const { selection } = this.state;
          return (
            <div>
              <svg width={width} height={height} stroke="#777">
                <Brush
                  height={height}
                  width={width}
                  selection={selection}
                  onUpdateSelection={this.onUpdateSelection}
                />
              </svg>
              <p>width: {width}</p>
              <p>
                selection: [{selection[0]}, {selection[1]}]
              </p>
            </div>
          );
        }
      }
      return <BrushComponent />;
    })
  );