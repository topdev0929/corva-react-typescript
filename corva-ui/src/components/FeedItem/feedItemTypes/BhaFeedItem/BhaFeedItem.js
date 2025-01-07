import { useState, useEffect } from 'react';
import { shape, number, string, arrayOf } from 'prop-types';

import Info from './components/Info';
import BhaNumber from './components/BhaNumber';
import BhaSchematic from './components/BhaSchematic';
import NoData from './components/NoData';

import { loadDrillStringData } from '~/utils/bha';

import styles from './styles.css';

const PAGE_NAME = 'bhaActivity';

const BhaFeedItem = ({ feedItem, feedItem: { well, context, company_id: companyId } }) => {
  const [drillStringData, setDrillStringData] = useState([]);
  const [isShowDrillstringDetailDialog, setIsShowDrillstringDetailDialog] = useState(false);

  const handleShowDrillstringDetailDialog = () => setIsShowDrillstringDetailDialog(true);
  const handleHideDrillstringDetailDialog = () => setIsShowDrillstringDetailDialog(false);

  const wellId = well?.id;
  const bhaData = context?.bha?.data;
  const bhaIds = [bhaData?.id];

  const bitComponent = bhaData?.components?.find(component => component.family === 'bit') || {};

  const id = bhaData?.id || '-';

  async function handleFetchDrillStringData() {
    try {
      const response = await loadDrillStringData([{ _id: wellId, bha_ids: bhaIds }], companyId);
      setDrillStringData(response);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    handleFetchDrillStringData();
  }, []);

  return (
    <>
      <div className={styles.bhaFeedItemInfoWrapper}>
        <BhaNumber bhaId={id} pageName={PAGE_NAME} />
        <Info feedItem={feedItem} bitComponent={bitComponent} pageName={PAGE_NAME} />
      </div>

      {drillStringData.length > 0 ? (
        <BhaSchematic
          feedItem={feedItem}
          drillStringData={drillStringData}
          isShowDrillstringDetailDialog={isShowDrillstringDetailDialog}
          handleShowDrillstringDetailDialog={handleShowDrillstringDetailDialog}
          handleHideDrillstringDetailDialog={handleHideDrillstringDetailDialog}
        />
      ) : (
        <NoData pageName={PAGE_NAME} />
      )}
    </>
  );
};

BhaFeedItem.propTypes = {
  feedItem: shape({
    id: number.isRequired,
    type: string.isRequired,
    company_id: number.isRequired,
    context: shape({
      bha: shape({
        data: shape({
          id: number.isRequired,
          components: arrayOf(shape).isRequired,
          start_depth: number.isRequired,
        }).isRequired,
      }),
    }).isRequired,
    created_at: string.isRequired,
    well: shape({
      id: number.isRequired,
    }),
  }).isRequired,
};

export default BhaFeedItem;
