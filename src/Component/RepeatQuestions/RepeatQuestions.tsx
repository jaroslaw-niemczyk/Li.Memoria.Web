import React from 'react';
import { QuestionToRepeat, Repeat } from '../../domain/Repeat/Repeat';
import { RepeatQuestion } from '../RepeatQuestion/RepeatQuestion';

interface RepeatQuestionsProps {
  saveRepeatAfterDaysUrl: string;
  getQuestionsUrl: string;
  switchQuestionAsAnswer?: boolean;
}

interface RepeatQuestionsState {
  repeat: Repeat;
}

export class RepeatQuestions extends React.Component<RepeatQuestionsProps, RepeatQuestionsState> {
  constructor(props: RepeatQuestionsProps) {
    super(props);
    this.state = {} as RepeatQuestionsState;
    this.repeatButtonClickCallback = this.repeatButtonClickCallback.bind(this);
  }

  async componentDidMount(): Promise<void> {
    const fetchedQuestions = await this.fetchQuestionsToRepeat();
    this.setState({ repeat: new Repeat(fetchedQuestions, this.props.switchQuestionAsAnswer) });
  }

  render(): JSX.Element {
    if (this.state.repeat === undefined) {
      return <>loading</>;
    }

    if (this.state.repeat.getQuestionToRepeat() === undefined) {
      return <>no more question to repeat</>;
    }

    return (
      <>
        <RepeatQuestion
          question={String(this.state.repeat.getQuestionToRepeat()?.question)}
          answer={String(this.state.repeat.getQuestionToRepeat()?.answer)}
          editUrl={'#'}
          repeatButtonClickCallback={this.repeatButtonClickCallback}
        />
      </>
    );
  }
  private repeatButtonClickCallback(repeatAfterDays: string): void {
    const repeat = this.state.repeat;
    const id = repeat.current()?.questionToRepeat.id;
    repeat.setRepeatAfterDays(repeatAfterDays);
    if (repeat.allowSave()) {
      this.saveRepeatAfterDays(Number(id));
      repeat.setSaved();
    }
    repeat.next();
    this.setState({ repeat });
  }

  private async fetchQuestionsToRepeat(): Promise<Array<QuestionToRepeat>> {
    const response = await fetch(this.props.getQuestionsUrl, { credentials: 'same-origin' });
    return response.json();
  }

  private async saveRepeatAfterDays(id: number): Promise<void> {
    fetch(this.props.saveRepeatAfterDaysUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  }
}
