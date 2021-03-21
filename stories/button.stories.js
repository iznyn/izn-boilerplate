// components/example.stories.js
import ButtonPrimary from '../resources/components/Button/Primary/index.pug';
import '../resources/components/Button/styles.scss';
import '../resources/components/Button/Primary/styles.scss';

export default {
  title: 'Button',
};

export const Basic = () => {
  // setup properties
  const props = { label: 'This is a Button', size: 'lg' };

  return ButtonPrimary({ props });
};
