export interface QuestionToRepeat {
  question: string;
  answer: string;
  id: number;
}

export interface UserAnswers {
  questionToRepeat: QuestionToRepeat;
  repeatQuestionAsQuestionAfterDays: string | undefined;
  repeatQuestionAsAnswerAfterDays: string | undefined;
  savedAnswer: boolean;
}

export class Repeat {
  get questionsToRepeat(): Array<UserAnswers> {
    return this._questionsToRepeat;
  }
  private questions: Array<QuestionToRepeat>;
  private readonly _questionsToRepeat: Array<UserAnswers>;
  private readonly switchQuestionAsAnswer: boolean;
  private questionToRepeatIndex: number | undefined;

  constructor(questions: Array<QuestionToRepeat>, switchQuestionAsAnswer = false) {
    this.questions = questions;
    this.switchQuestionAsAnswer = switchQuestionAsAnswer;
    this._questionsToRepeat = this.questions.map(
      (question: QuestionToRepeat): UserAnswers => {
        return {
          questionToRepeat: question,
        } as UserAnswers;
      },
    );
    this.questionToRepeatIndex = this._questionsToRepeat.length > 0 ? 0 : undefined;
  }

  public getQuestionToRepeat(): QuestionToRepeat | undefined {
    if (this.current() != null) {
      if (this.current()?.repeatQuestionAsQuestionAfterDays === undefined || !this.switchQuestionAsAnswer) {
        return this.current()?.questionToRepeat;
      } else {
        return {
          id: this.current()?.questionToRepeat.id,
          question: this.current()?.questionToRepeat.answer,
          answer: this.current()?.questionToRepeat.question,
        } as QuestionToRepeat;
      }
    }
    return undefined;
  }

  public current(): UserAnswers | undefined {
    return this.questionToRepeatIndex !== undefined ? this._questionsToRepeat[this.questionToRepeatIndex] : undefined;
  }

  public next(): UserAnswers | undefined {
    if (this.questionToRepeatIndex != null) {
      let nextQuestionIndex;

      for (let i = 0; i < this._questionsToRepeat.length; i++) {
        if (!this._questionsToRepeat[i].savedAnswer) {
          nextQuestionIndex = i;
          if (this.questionToRepeatIndex + 1 === this._questionsToRepeat.length || this.questionToRepeatIndex < i) {
            break;
          }
        }
      }
      this.questionToRepeatIndex = nextQuestionIndex;
    }

    return this.current();
  }

  public allowSave(): boolean {
    if (
      this.current()?.repeatQuestionAsAnswerAfterDays === 'know' ||
      this.current()?.repeatQuestionAsQuestionAfterDays === 'know'
    ) {
      return true;
    }

    if (
      this.current()?.repeatQuestionAsAnswerAfterDays === 'repeat' ||
      this.current()?.repeatQuestionAsQuestionAfterDays === 'repeat'
    ) {
      return false;
    }

    if (!this.switchQuestionAsAnswer) {
      return this.current()?.repeatQuestionAsQuestionAfterDays !== undefined;
    } else {
      return (
        this.current()?.repeatQuestionAsQuestionAfterDays !== undefined &&
        this.current()?.repeatQuestionAsAnswerAfterDays === this.current()?.repeatQuestionAsQuestionAfterDays
      );
    }
  }

  public setRepeatAfterDays(repeatAfterDays: string): this {
    if (this.questionToRepeatIndex !== undefined) {
      if (this._questionsToRepeat[this.questionToRepeatIndex].repeatQuestionAsQuestionAfterDays === undefined) {
        this._questionsToRepeat[this.questionToRepeatIndex].repeatQuestionAsQuestionAfterDays = repeatAfterDays;
        return this;
      }

      if (this._questionsToRepeat[this.questionToRepeatIndex].repeatQuestionAsAnswerAfterDays === undefined) {
        this._questionsToRepeat[this.questionToRepeatIndex].repeatQuestionAsAnswerAfterDays = repeatAfterDays;
        if (repeatAfterDays === 'repeat') {
          this._questionsToRepeat[this.questionToRepeatIndex].repeatQuestionAsQuestionAfterDays = undefined;
          this._questionsToRepeat[this.questionToRepeatIndex].repeatQuestionAsAnswerAfterDays = undefined;
          return this;
        }
        if (repeatAfterDays === 'know') {
          return this;
        }

        if (
          this._questionsToRepeat[this.questionToRepeatIndex].repeatQuestionAsQuestionAfterDays !==
          this._questionsToRepeat[this.questionToRepeatIndex].repeatQuestionAsAnswerAfterDays
        ) {
          this._questionsToRepeat[this.questionToRepeatIndex].repeatQuestionAsQuestionAfterDays = undefined;
          this._questionsToRepeat[this.questionToRepeatIndex].repeatQuestionAsAnswerAfterDays = undefined;
        }
      }
    }

    return this;
  }

  public setSaved(): this {
    if (this.questionToRepeatIndex !== undefined) {
      this._questionsToRepeat[this.questionToRepeatIndex].savedAnswer = true;
    }

    return this;
  }
}
