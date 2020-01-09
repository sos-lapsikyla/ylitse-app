import React from 'react';
import { createAppContainer } from 'react-navigation';

import Onboarding from './Onboarding';

const AppContainer = createAppContainer(Onboarding);

export default () => <AppContainer />;
