const DARK_THEME_ATTRIBUTE = 'data-corva-theme-dark';
const LIGHT_THEME_ATTRIBUTE = 'data-corva-theme-light';

export const setThemeVariables = isDarkTheme => {
  document.body.removeAttribute(isDarkTheme ? LIGHT_THEME_ATTRIBUTE : DARK_THEME_ATTRIBUTE);
  document.body.setAttribute(isDarkTheme ? DARK_THEME_ATTRIBUTE : LIGHT_THEME_ATTRIBUTE, '');
};
