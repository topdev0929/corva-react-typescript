import AppAnnotationFeedItem from '../feedItemTypes/AppAnnotationFeedItem';

const AppAnnotationHOC = props => {
  const feedItem = props.feedItem.toJS();

  return (
    <AppAnnotationFeedItem
      {...props}
      feedItem={{
        ...feedItem,
      }}
      currentUser={feedItem.currentUser}
    />
  );
};

AppAnnotationHOC.propTypes = AppAnnotationFeedItem.propTypes;

export default AppAnnotationHOC;
