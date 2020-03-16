import React from 'react';
import RN from 'react-native';

import Card from '../../../components/Card';

import PasswordForm from './PasswordForm';
import EmailForm from './EmailForm';
import MainForm from './MainForm';

export default () => {
  const [form, setForm] = React.useState<'Main' | 'Password' | 'Email'>('Main');
  const openPasswordForm = () => setForm('Password');
  const openEmailForm = () => setForm('Email');
  const onClose = () => {
    setForm('Main');
  };
  return (
    <Card style={styles.card}>
      {form === 'Main' ? (
        <MainForm
          openPasswordForm={openPasswordForm}
          openEmailForm={openEmailForm}
        />
      ) : form === 'Password' ? (
        <PasswordForm onClose={onClose} />
      ) : (
        <EmailForm onClose={onClose} />
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
