import React from 'react';
import RN from 'react-native';
import { Question } from 'src/api/feedback';
import { lang } from '../../../localization';
import SliderModal from '../Slider/';
import YesNoModal from '../YesNoModal';

type Props = { question: Question };

const QuestionModal = ({ question }: Props) => {
  return question.answer.type === 'range' ? (
    <SliderModal
      onValueChange={() => console.log('hehee')}
      value={0}
      minText={question.answer.min.labels[lang]}
      maxText={question.answer.max.labels[lang]}
      valueRange={[question.answer.min.value, question.answer.max.value]}
    />
  ) : (
    <YesNoModal
      yesText={question.answer.options[0].labels[lang]}
      noText={question.answer.options[1].labels[lang]}
    />
  );
};

const styles = RN.StyleSheet.create({});

export default QuestionModal;
