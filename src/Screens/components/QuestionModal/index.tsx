import React from 'react';
import RN from 'react-native';
import { Answer, Question } from 'src/api/feedback';

import { lang } from '../../../localization';
import colors from '../colors';

import Card from '../Card';
import RangeQuestion from './Range';
import YesNoQuestion from './YesNo';
import { Title } from './Title';

type Props = {
  question: Question;
  onClose: () => void;
  onAnswer: (answer: Answer) => void;
};

export const borderRadius = 16;

const QuestionModal = ({ question, onClose, onAnswer }: Props) => {
  const handleAnswer = (value: number) => {
    const answer = { value, answer_id: question.answer_id };
    onAnswer(answer);
  };

  return (
    <RN.Modal animationType="fade" transparent={true} visible={true}>
      <RN.View style={styles.background}>
        <Card style={styles.card}>
          <Title title={question.titles[lang]} onClose={onClose} />

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
                onAnswer={handleAnswer}
              />
            ) : (
              <YesNoQuestion
                yesText={question.answer.yes.labels[lang]}
                yesValue={question.answer.yes.value}
                noText={question.answer.no.labels[lang]}
                noValue={question.answer.no.value}
                onAnswer={handleAnswer}
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
});

export default QuestionModal;
