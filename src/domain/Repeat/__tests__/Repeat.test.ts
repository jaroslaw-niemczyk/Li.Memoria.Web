import { Repeat } from '../Repeat';

describe('Repeat', () => {
  const questions = [
    { question: 'q1', answer: 'a1', id: 1 },
    { question: 'q2', answer: 'a2', id: 2 },
    { question: 'q3', answer: 'a3', id: 3 },
  ];

  it('return proper structure of questions to repeat', () => {
    const repeat = new Repeat(questions);
    expect(repeat.questionsToRepeat.length).toEqual(3);

    repeat.questionsToRepeat.forEach((value, index) => {
      const id = index + 1;
      expect(repeat.questionsToRepeat[index].questionToRepeat.id).toEqual(id);
      expect(repeat.questionsToRepeat[index].questionToRepeat.answer).toEqual('a' + id);
      expect(repeat.questionsToRepeat[index].repeatQuestionAsQuestionAfterDays).toEqual(undefined);
      expect(repeat.questionsToRepeat[index].repeatQuestionAsAnswerAfterDays).toEqual(undefined);
      expect(repeat.questionsToRepeat[index].savedAnswer).toEqual(undefined);
    });
  });

  it('return current question to repeat', () => {
    let repeat = new Repeat(questions);
    expect(repeat.current()?.questionToRepeat.id).toEqual(1);

    repeat = new Repeat([]);
    expect(repeat.current()).toEqual(undefined);
  });

  it('return in the loop next question to repeat', () => {
    const repeat = new Repeat(questions);
    expect(repeat.next()?.questionToRepeat.id).toEqual(2);
    expect(repeat.next()?.questionToRepeat.id).toEqual(3);
    expect(repeat.next()?.questionToRepeat.id).toEqual(1);
    expect(repeat.next()?.questionToRepeat.id).toEqual(2);

    expect(repeat.setSaved().next()?.questionToRepeat.id).toEqual(3);
    expect(repeat.next()?.questionToRepeat.id).toEqual(1);
    expect(repeat.next()?.questionToRepeat.id).toEqual(3);

    expect(repeat.setSaved().next()?.questionToRepeat.id).toEqual(1);
    expect(repeat.next()?.questionToRepeat.id).toEqual(1);
    expect(repeat.next()?.questionToRepeat.id).toEqual(1);

    expect(repeat.setSaved().next()?.questionToRepeat.id).toEqual(undefined);
  });

  it('test that if switchQuestionAsAnswer is true, the answer and question are switching their place', () => {
    const repeat = new Repeat(questions, true);
    expect(repeat.setRepeatAfterDays('1').getQuestionToRepeat()?.question).toEqual(questions[0].answer);
    expect(repeat.getQuestionToRepeat()?.answer).toEqual(questions[0].question);
  });

  it('test that if switchQuestionAsAnswer is false, the answer and question are not switching their place', () => {
    const repeat = new Repeat(questions);
    expect(repeat.setRepeatAfterDays('1').getQuestionToRepeat()?.question).toEqual(questions[0].question);
    expect(repeat.getQuestionToRepeat()?.answer).toEqual(questions[0].answer);
  });

  it('test that if switchQuestionAsAnswer is false after one answer the save is allowed', () => {
    const repeat = new Repeat(questions);
    expect(repeat.setRepeatAfterDays('3').allowSave()).toEqual(true);
  });

  it('test that if switchQuestionAsAnswer is true after two answers the save is allowed', () => {
    const repeat = new Repeat(questions, true);
    expect(repeat.setRepeatAfterDays('3').allowSave()).toEqual(false);
    expect(repeat.setRepeatAfterDays('3').allowSave()).toEqual(true);

    repeat.next();
    expect(repeat.setRepeatAfterDays('3').allowSave()).toEqual(false);
    expect(repeat.getQuestionToRepeat()?.question).toEqual(questions[1].answer);
    expect(repeat.setRepeatAfterDays('1').allowSave()).toEqual(false);
    expect(repeat.getQuestionToRepeat()?.question).toEqual(questions[1].question);
    expect(repeat.getQuestionToRepeat()?.answer).toEqual(questions[1].answer);
    expect(repeat.setRepeatAfterDays('1').allowSave()).toEqual(false);
    expect(repeat.getQuestionToRepeat()?.question).toEqual(questions[1].answer);
    expect(repeat.getQuestionToRepeat()?.answer).toEqual(questions[1].question);
    expect(repeat.setRepeatAfterDays('1').allowSave()).toEqual(true);
  });

  it('test that if setRepeatAfterDays value is "know" then save is allowed', () => {
    let repeat = new Repeat(questions);
    expect(repeat.setRepeatAfterDays('know').allowSave()).toEqual(true);

    repeat = new Repeat(questions, true);
    expect(repeat.setRepeatAfterDays('know').allowSave()).toEqual(true);
  });

  it('test that if setRepeatAfterDays value is "repeat" then save is not allowed', () => {
    let repeat = new Repeat(questions);
    expect(repeat.setRepeatAfterDays('repeat').allowSave()).toEqual(false);

    repeat = new Repeat(questions, true);
    expect(repeat.setRepeatAfterDays('repeat').allowSave()).toEqual(false);
    expect(repeat.setRepeatAfterDays('repeat').allowSave()).toEqual(false);
  });

  it('test that if switchQuestionAsAnswer is true and question is repeated over time, the answer and question are switching their place', () => {
    const repeat = new Repeat(questions, true);

    repeat.setRepeatAfterDays('repeat');
    repeat.next();
    repeat.next();
    repeat.next();
    expect(repeat.getQuestionToRepeat()?.question).toEqual(questions[0].answer);
    repeat.setRepeatAfterDays('repeat');
    repeat.next();
    repeat.next();
    repeat.next();
    expect(repeat.getQuestionToRepeat()?.question).toEqual(questions[0].question);
  });
});
