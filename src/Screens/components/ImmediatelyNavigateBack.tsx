import React from 'react';

type Props = {
  goBack: () => void | undefined;
};

const ImmediatelyNavigateBack = ({ goBack }: Props) => {
  React.useEffect(goBack, []);

  return null;
};

export default ImmediatelyNavigateBack;
