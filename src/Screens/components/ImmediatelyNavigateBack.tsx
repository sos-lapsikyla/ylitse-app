import React from 'react';
import RN from 'react-native';

type Props = {
  goBack: () => void | undefined;
};

const ImmediatelyNavigateBack = ({ goBack }: Props) => {
  React.useEffect(goBack, []);
  return null;
};

export default ImmediatelyNavigateBack;
