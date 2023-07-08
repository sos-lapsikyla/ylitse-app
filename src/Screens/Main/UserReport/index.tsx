import React from 'react';
import RN from 'react-native';

import { StackScreenProps } from '@react-navigation/stack';
import { StackRoutes } from '../..';

import useLayout from 'src/lib/use-layout';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Title } from './Title';
import TitledContainer from 'src/Screens/components/TitledContainer';
import colors from 'src/Screens/components/colors';

export type UserReportRoute = {
  'Main/UserReport': { reportedId: string };
};

type Props = StackScreenProps<StackRoutes, 'Main/UserReport'>;

const UserReport = ({ navigation, route }: Props) => {
  const reportedId = route.params?.reportedId;
  const [_, onLayout] = useLayout();

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <TitledContainer
      onLayout={onLayout}
      TitleComponent={<Title onBack={handleBackPress} />}
      color={colors.blue}
    >
      <SafeAreaView style={styles.container}>
        <RN.Text>Report user with id: {reportedId} </RN.Text>
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
