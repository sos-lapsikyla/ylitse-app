import React from 'react';
import RN from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as mentorApi from '../../api/mentors';

import Message from './Message';
import { cardBorderRadius } from './Card';
import colors from './colors';
import fonts from './fonts';

type Props = {
  style?: RN.StyleProp<RN.ViewStyle>;
  mentor: mentorApi.Mentor;
  onPress?: () => void | undefined;
  safeArea?: boolean;
  withStatus?: boolean;
};

const SafeAreaWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <SafeAreaView style={styles.safeArea}>{children}</SafeAreaView>;

const MentorTitle: React.FC<Props> = ({
  onPress,
  style,
  mentor: { age, name, region, is_vacationing, status_message },
  safeArea,
  withStatus,
}) => {
  const Wrapper = safeArea ? SafeAreaWrapper : React.Fragment;

  const hasRegion = region.length > 0;

  return (
    <RN.View
      style={[
        styles.blob,
        { backgroundColor: is_vacationing ? colors.blueGray : colors.purple },
        style,
      ]}
    >
      <Wrapper>
        {!onPress ? null : (
          <RN.TouchableOpacity
            style={styles.chevronButton}
            onPress={onPress}
            testID={'components.mentorTitle.chevronLeft'}
          >
            <RN.Image
              source={require('../images/chevron-left.svg')}
              style={styles.chevronIcon}
            />
          </RN.TouchableOpacity>
        )}
        <RN.Image
          source={
            is_vacationing
              ? require('../images/umbrella-beach.svg')
              : require('../images/user.svg')
          }
          style={styles.userIcon}
        />
        <RN.View style={styles.column}>
          <RN.View style={styles.nameContainer}>
            <RN.Text style={styles.name} ellipsizeMode="tail" numberOfLines={1}>
              {name}
            </RN.Text>
          </RN.View>
          <RN.View style={styles.infoContainer}>
            <RN.Text style={styles.infoText}>
              <RN.Text>{age}</RN.Text>
              <Message id={'components.mentorCard.yearsAbbrev'} />
              {hasRegion && (
                <>
                  <RN.Text>{' | '}</RN.Text>
                  <RN.Text>{region}</RN.Text>
                </>
              )}
            </RN.Text>
          </RN.View>
          {withStatus ? (
            <RN.View style={styles.nameContainer}>
              <RN.Text
                style={styles.status}
                ellipsizeMode="tail"
                numberOfLines={1}
              >
                {status_message}
              </RN.Text>
            </RN.View>
          ) : null}
        </RN.View>
      </Wrapper>
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  safeArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  blob: {
    borderRadius: cardBorderRadius,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevronButton: {
    marginRight: 16,
    marginLeft: 0,
  },
  chevronIcon: {
    tintColor: colors.white,
    width: 40,
    height: 40,
  },
  userIcon: {
    tintColor: colors.white,
    marginBottom: 16,
    width: 48,
    height: 48,
  },
  column: {
    marginLeft: 16,
    marginRight: 16,
    flexDirection: 'column',
    justifyContent: 'center',
    flexGrow: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  name: {
    flex: 1,
    color: colors.white,
    ...fonts.regularBold,
  },
  status: {
    flex: 1,
    color: colors.white,
    ...fonts.small,
  },
  infoContainer: { flexGrow: 1, flexDirection: 'row', flexWrap: 'wrap' },
  infoText: {
    textAlign: 'left',
    flex: 1,
    color: colors.white,
    ...fonts.small,
  },
});

export default MentorTitle;
