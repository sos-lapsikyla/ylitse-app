import React from 'react';
import RN from 'react-native';

import Card from '../../../components/Card';

import PasswordForm from './PasswordForm';
import MainForm from './MainForm';

export default () => {
  const [form, setForm] = React.useState<'Main' | 'Password'>('Main');
  const openPasswordForm = () => setForm('Password');
  const onClose = () => {
    setForm('Main');
  };
  return (
    <Card style={styles.card}>
      {form === 'Main' ? (
        <MainForm openPasswordForm={openPasswordForm} />
      ) : (
        <PasswordForm onClose={onClose} />
      )}
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
