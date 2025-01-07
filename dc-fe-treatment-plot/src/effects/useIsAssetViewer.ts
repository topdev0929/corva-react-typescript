import { useEffect, useState } from 'react';
import { getAsset } from '@corva/ui/clients/jsonApi';

export type Well = {
  asset_id: number;
  custom_properties?: {
    is_asset_viewer?: boolean;
  };
};

async function fetchWellsCustomProperties(assetId: number): Promise<boolean> {
  try {
    const asset = await getAsset(assetId, { fields: ['asset.custom_properties'] });
    return asset.data.attributes?.custom_properties?.is_asset_viewer || false;
  } catch (e) {
    console.error(e);
    return false;
  }
}

const useIsAssetViewer = ({ well, wells }: { well?: Well; wells?: Well[] }): boolean | null => {
  const [isAssetViewer, setIsAssetViewer] = useState<boolean | null>(null);

  useEffect(() => {
    async function resolveViewerProperty() {
      setIsAssetViewer(
        well
          ? await fetchWellsCustomProperties(well.asset_id)
          : wells.some(well => well.custom_properties?.is_asset_viewer)
      );
    }

    resolveViewerProperty();
  }, [well, wells]);

  return isAssetViewer;
};

export default useIsAssetViewer;
