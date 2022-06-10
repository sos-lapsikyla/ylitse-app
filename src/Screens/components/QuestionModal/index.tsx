import React from 'react';
import RN from 'react-native';
import { Question } from 'src/api/feedback';

import { lang } from '../../../localization';
import colors from '../colors';
import fonts from '../fonts';

import Card from '../Card';
import RangeQuestion from './Range';
import YesNoQuestion from './YesNo';

type Props = { question: Question };

const borderRadius = 16;

const QuestionModal = ({ question }: Props) => {
  return (
    <RN.Modal animationType="fade" transparent={true} visible={true}>
      <RN.View style={styles.background}>
        <Card style={styles.card}>
          <RN.View style={styles.titleContainer}>
            <RN.Image
              style={styles.close}
              source={require('../../images/close.svg')}
            />
            <RN.Text style={styles.titleText}>{question.titles[lang]}</RN.Text>
          </RN.View>
          <RN.View style={styles.questionContent}>
            {question.answer.type === 'range' ? (
              <RangeQuestion
                defaultValue={
                  (question.answer.max.value + question.answer.min.value) / 2
                }
                minText={question.answer.min.labels[lang]}
                maxText={question.answer.max.labels[lang]}
                valueRange={[
                  question.answer.min.value,
                  question.answer.max.value,
                ]}
              />
            ) : (
              <YesNoQuestion
                yesText={question.answer.yes.labels[lang]}
                yesValue={question.answer.yes.value}
                noText={question.answer.no.labels[lang]}
                noValue={question.answer.no.value}
              />
            )}
          </RN.View>
        </Card>
      </RN.View>
    </RN.Modal>
  );
};

const styles = RN.StyleSheet.create({
  background: {
    backgroundColor: colors.transparentBlack,
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
  },
  card: {
    marginHorizontal: 8,
    borderRadius,
  },
  questionContent: {
    padding: 24,
  },
  titleContainer: {
    borderRadius,
    flexDirection: 'column',
    backgroundColor: colors.blue,
  },
  titleText: {
    ...fonts.large,
    textAlign: 'center',
    paddingHorizontal: 40,
    paddingBottom: 24,
  },
  close: {
    alignSelf: 'flex-end',
    marginRight: 12,
    marginTop: 12,
  },
});

export default QuestionModal;
