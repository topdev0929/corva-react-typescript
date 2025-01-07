import { DevCenterEmbeddedApp } from '@corva/ui/components';
import { Insight } from '@/entities/insight';
import styles from './index.module.css';

type Props = {
  insight: Insight;
  currentUser: any;
  appId: number;
};

export const AppPreview = ({ insight, currentUser, appId }: Props) => {
  return (
    <>
      {insight.app && (
        <DevCenterEmbeddedApp
          appContainerClassName={styles.embeddedAppContainer}
          appId={appId}
          app={{
            // @ts-ignore
            app: insight.app.app,
            settings: { ...insight.settings, displayCommentLineAt: insight.datetime },
            package: insight.app.package,
            view: 'preview',
          }}
          coordinates={{}}
          timestamp={String(insight.timestamp)}
          time={insight.timestamp}
          currentUser={currentUser}
        />
      )}
    </>
  );
};
