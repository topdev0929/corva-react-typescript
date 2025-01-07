import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import { get, set } from 'lodash';

import InfiniteScroll from 'react-infinite-scroller';

import grey from '@material-ui/core/colors/grey';

import LoadingIndicator from '~components/LoadingIndicator';

import styles from './styles.css';

const PAGE_NAME = 'generic_infiniteList';

const grey700 = grey['700'];

const INTERVAL_6_HOURS = 6 * 60 * 60 * 1000;
const PERIOD_LABELS = {
  newerThan12Hours: 'Last 12 hours',
  olderThan12Hours: 'Last 24 hours',
  olderThan1Days: 'Earlier this week',
  olderThan7Days: 'Older than 7 days',
  olderThan14Days: 'Older than 14 days',
  olderThan30Days: 'Older than 30 days',
};

class InfiniteList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isLoadingByScroll: false,

      periodDates: this.periodDates,
    };

    this.updatePeriodsIntervalId = null;
  }

  componentDidMount() {
    this.updatePeriodsIntervalId = setInterval(
      () => this.setState({ periodDates: this.periodDates }),
      INTERVAL_6_HOURS
    );
  }

  componentWillUnmount() {
    if (this.updatePeriodsIntervalId) {
      clearInterval(this.updatePeriodsIntervalId);
    }
  }

  get periodDates() {
    return {
      hoursAgo12: moment().subtract(12, 'hours'),
      daysAgo1: moment().subtract(1, 'days'),
      daysAgo7: moment().subtract(7, 'days'),
      daysAgo14: moment().subtract(14, 'days'),
      daysAgo30: moment().subtract(30, 'days'),
    };
  }

  // NOTE: 'react-infinite-scroller' has a bug that when scroll reaches threshold area, it starts
  // to fire loadMore on every scroll event - bottom, up. As a result multiple same request fired.
  //
  // We fix this preventing request that was fired by scroll before previous is finished.
  //
  // Issues:
  // https://github.com/CassetteRocks/react-infinite-scroller/issues/143
  loadItems = async () => {
    if (this.state.isLoadingByScroll) {
      return;
    }

    this.setState({ isLoadingByScroll: true });

    await this.props.loadItems();

    this.setState({ isLoadingByScroll: false });
  };

  renderNoItemsLabel() {
    return (
      <div
        data-testid={`${PAGE_NAME}_noItems`}
        key="c-infinite-list__empty"
        className={styles.cInfiniteListEmpty}
      >
        {this.props.noItemsFoundLabel}
      </div>
    );
  }

  renderPeriodSeparator(periodKey) {
    return (
      <div
        data-testid={`${PAGE_NAME}_periodLabel`}
        key={periodKey}
        className={styles.cInfiniteListPeriod}
        style={{ color: grey700 }}
      >
        {PERIOD_LABELS[periodKey]}
      </div>
    );
  }

  renderItems() {
    if (!this.props.divideByPeriods) {
      return this.props.items
        .map(item => this.props.renderItem(item))
        .unshift(this.props.headerComponent);
    }

    const { hoursAgo12, daysAgo1, daysAgo7, daysAgo14, daysAgo30 } = this.state.periodDates;

    const itemElsByPeriod = this.props.items.reduce(
      (result, item, index) => {
        let periodKey;
        const itemEl = this.props.renderItem(item, index);
        // NOTE: Backward compatibility for immutable objects in list
        const pathToCreatedAt = get(item, this.props.pathToCreatedAt);
        const itemAt = moment(pathToCreatedAt);

        if (itemAt >= hoursAgo12) {
          periodKey = 'newerThan12Hours';
        } else if (itemAt < hoursAgo12 && itemAt >= daysAgo1) {
          periodKey = 'olderThan12Hours';
        } else if (itemAt < daysAgo1 && itemAt >= daysAgo7) {
          periodKey = 'olderThan1Days';
        } else if (itemAt < daysAgo7 && itemAt >= daysAgo14) {
          periodKey = 'olderThan7Days';
        } else if (itemAt < daysAgo14 && itemAt >= daysAgo30) {
          periodKey = 'olderThan14Days';
        } else if (itemAt < daysAgo30) {
          periodKey = 'olderThan30Days';
        }

        return set(result, [periodKey, result[periodKey].length], itemEl);
      },
      {
        newerThan12Hours: [],
        olderThan12Hours: [],
        olderThan1Days: [],
        olderThan7Days: [],
        olderThan14Days: [],
        olderThan30Days: [],
      }
    );

    const itemElsWithPeriodEls = Object.keys(itemElsByPeriod).reduce((result, periodEls) => {
      if (itemElsByPeriod[periodEls].length === 0) return result.concat(itemElsByPeriod[periodEls]);

      return result.concat([this.renderPeriodSeparator(periodEls), ...itemElsByPeriod[periodEls]]);
    }, []);

    const itemElsWithPeriodElsWithHeaderEl = [this.props.headerComponent, ...itemElsWithPeriodEls];

    return itemElsWithPeriodElsWithHeaderEl;
  }

  render() {
    return (
      <div
        className={classNames(styles.cInfiniteList, this.props.infiniteClassName, {
          [styles.cInfiniteListOverflow]: !this.props.useWindow,
        })}
        style={{ height: this.props.infiniteContainerHeight }}
      >
        <InfiniteScroll
          loadMore={this.loadItems}
          hasMore={this.props.moreItemsMayExist && !this.props.showNoItemsFound}
          threshold={this.props.threshold} // NOTE: We should load infinite scroll next page before user get to bottom
          loader={<LoadingIndicator key="c-infinite-scroll__loader" fullscreen={false} />}
          useWindow={this.props.useWindow}
          initialLoad={this.props.initialLoad}
        >
          {this.renderItems()}
        </InfiniteScroll>

        {this.props.showNoItemsFound && this.renderNoItemsLabel()}
      </div>
    );
  }
}

InfiniteList.propTypes = {
  infiniteClassName: PropTypes.string,
  useWindow: PropTypes.bool,
  headerComponent: PropTypes.node,
  // NOTE: Backward compatibility with immutable;
  // Remove when get rid of immutablejs
  items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  showNoItemsFound: PropTypes.bool.isRequired,
  noItemsFoundLabel: PropTypes.string.isRequired,
  infiniteContainerHeight: PropTypes.number,
  moreItemsMayExist: PropTypes.bool.isRequired,
  pathToCreatedAt: PropTypes.arrayOf(PropTypes.string).isRequired,
  renderItem: PropTypes.func.isRequired,
  loadItems: PropTypes.func.isRequired,
  threshold: PropTypes.number,
  initialLoad: PropTypes.bool,
  divideByPeriods: PropTypes.bool,
};

InfiniteList.defaultProps = {
  infiniteClassName: null,
  useWindow: false,
  headerComponent: null,
  infiniteContainerHeight: null,
  threshold: 3000,
  initialLoad: true,
  divideByPeriods: true,
};

export default InfiniteList;
