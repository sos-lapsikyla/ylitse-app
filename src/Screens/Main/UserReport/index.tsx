import React from 'react';
import RN from 'react-native';

import * as ReactRedux from 'react-redux';

import { StackScreenProps } from '@react-navigation/stack';
import { StackRoutes } from '../..';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Title } from './Title';
import TitledContainer from 'src/Screens/components/TitledContainer';
import colors from 'src/Screens/components/colors';
import Button from 'src/Screens/components/Button';
import InputField from 'src/Screens/components/NamedInputField';

export type UserReportRoute = {
  'Main/UserReport': { reportedId: string };
};

type Props = StackScreenProps<StackRoutes, 'Main/UserReport'>;

const UserReport = ({ navigation, route }: Props) => {
  const reportedId = route.params?.reportedId;
  const dispatch = ReactRedux.useDispatch();
  const [description, setDescription] = React.useState('');

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleReport = () => {
    dispatch({
      type: 'userReport/start',
      payload: {
        reportedId,
        description,
        contactEmail: 'asd@moi.fi',
        contactPhone: '0447766444',
        reportedMessageId: 'jsL8mJ_9hAbbs68jJsh4D4NDzPKD_K-fEnUX07PTLpY',
      },
    });
  };

  return (
    <TitledContainer
      TitleComponent={<Title onBack={handleBackPress} />}
      color={colors.blue}
    >
      <SafeAreaView style={styles.container}>
        <InputField
          name="main.userreport.description.label"
          multiline
          onChangeText={setDescription}
        />
        <Button
          onPress={handleReport}
          messageId="main.userreport.send.button"
          disabled={description.length === 0}
        />
      </SafeAreaView>
    </TitledContainer>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default UserReport;
