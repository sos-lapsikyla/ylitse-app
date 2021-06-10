import React from 'react';
import RN from 'react-native';

import Card from '../../../components/Card';

import MainForm from './MainForm';

type Props = {
  navigateToPassword: () => void | undefined;
  navigateToEmail: () => void | undefined;
};

export default ({ navigateToPassword, navigateToEmail }: Props) => {
  return (
    <Card style={styles.card}>
      <MainForm
        openPasswordForm={navigateToPassword}
        openEmailForm={navigateToEmail}
      />
    </Card>
  );
};

const styles = RN.StyleSheet.create({
  card: {
    padding: 24,
    paddingBottom: 32,
    marginBottom: 32,
  },
});
