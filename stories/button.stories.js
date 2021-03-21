// components/example.stories.js

import startCase from 'lodash/startCase';
import ButtonBasic from './resources/components/Button/Basic/index.pug';
import './resources/components/Button/Basic/styles.sass';

export default {
  title: 'Button',
};

export const Basic = () => {
  // setup properties
  const props = { label: 'This is a Button' };

  return ButtonBasic({ props, startCase });
};
