import '~/styles/index.global.css';
import '~/styles/reactVirtualized.global.css';
import '~/styles/emojiMart.global.css';
// TODO: Config loader to properly load url(path) converting them to base64 images
import '~/styles/mapbox.global.css';
import '~/styles/lightbox.global.css';
import '~/styles/generatedThemesVariables.global.css';

const isMac = navigator.platform.indexOf('Mac') > -1;
// NOTE: We don't want to replace or load any external styles for MacOS,
// just making scrollbar styles similar to MacOS on another platforms;
// eslint-disable-next-line
if (!isMac) import(/* webpackMode: "lazy" */ '~/styles/customScrollbars.global.css');
