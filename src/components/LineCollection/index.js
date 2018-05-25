import React from 'react';
import PropTypes from 'prop-types';
import { createYScale, createXScale } from '../../utils/scale-helpers';
import { seriesPropType } from '../../utils/proptypes';
import ScalerContext from '../../context/Scaler';
import Line from '../Line';

const LineCollection = props => {
  const { series, width, height, domain } = props;
  const xScale = createXScale(domain, width);
  const lines = series.filter(s => !s.hidden).map(s => {
    const yScale = createYScale(s.yDomain, height);
    return <Line key={s.id} {...s} xScale={xScale} yScale={yScale} />;
  });
  return (
    <g width={width} height={height}>
      <clipPath id="linechart-clip-path">
        <rect width={width} height={height} fill="none" />
      </clipPath>
      {lines}
    </g>
  );
};

LineCollection.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  series: seriesPropType,
  domain: PropTypes.arrayOf(PropTypes.number),
};

LineCollection.defaultProps = {
  series: [],
  domain: [0, 0],
};

export default LineCollection;

export const ScaledLineCollection = props => (
  <ScalerContext.Consumer>
    {({ subDomain, series }) => (
      <LineCollection {...props} series={series} domain={subDomain} />
    )}
  </ScalerContext.Consumer>
);