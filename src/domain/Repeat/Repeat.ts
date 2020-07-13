export interface QuestionToRepeat {
  question: string;
  answer: string;
  id: number;
}

export interface UserAnswers {
  questionToRepeat: QuestionToRepeat;
  repeatQuestionAfterDays: string | undefined;
  repeatAnswerAfterDays: string | undefined;
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
      if (this.current()?.repeatQuestionAfterDays == undefined || !this.switchQuestionAsAnswer) {
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
    return this.questionToRepeatIndex != undefined ? this._questionsToRepeat[this.questionToRepeatIndex] : undefined;
  }

  public next(): UserAnswers | undefined {
    if (this.questionToRepeatIndex != null) {
      let nextQuestionIndex;

      for (let i = 0; i < this._questionsToRepeat.length; i++) {
        if (!this._questionsToRepeat[i].savedAnswer) {
          nextQuestionIndex = i;
          if (this.questionToRepeatIndex + 1 == this._questionsToRepeat.length || this.questionToRepeatIndex < i) {
            break;
          }
        }
      }
      this.questionToRepeatIndex = nextQuestionIndex;
    }

    return this.current();
  }

  public allowSave(): boolean {
    if (!this.switchQuestionAsAnswer) {
      return this.current()?.repeatQuestionAfterDays != undefined;
    } else {
      return (
        this.current()?.repeatAnswerAfterDays == this.current()?.repeatQuestionAfterDays &&
        this.current()?.repeatQuestionAfterDays != undefined
      );
    }
  }

  public setRepeatAfterDays(repeatAfterDays: string): this {
    if (this.questionToRepeatIndex != undefined) {
      if (
        this._questionsToRepeat[this.questionToRepeatIndex].repeatQuestionAfterDays == undefined ||
        this._questionsToRepeat[this.questionToRepeatIndex].repeatAnswerAfterDays != undefined
      ) {
        this._questionsToRepeat[this.questionToRepeatIndex].repeatQuestionAfterDays = repeatAfterDays;
      } else {
        this._questionsToRepeat[this.questionToRepeatIndex].repeatAnswerAfterDays = repeatAfterDays;

        if (
          this._questionsToRepeat[this.questionToRepeatIndex].repeatQuestionAfterDays !=
          this._questionsToRepeat[this.questionToRepeatIndex].repeatAnswerAfterDays
        ) {
          this._questionsToRepeat[this.questionToRepeatIndex].repeatQuestionAfterDays = undefined;
          this._questionsToRepeat[this.questionToRepeatIndex].repeatAnswerAfterDays = undefined;
        }
      }
    }

    return this;
  }

  public setSaved(): this {
    if (this.questionToRepeatIndex != undefined) {
      this._questionsToRepeat[this.questionToRepeatIndex].savedAnswer = true;
    }

    return this;
  }
}
