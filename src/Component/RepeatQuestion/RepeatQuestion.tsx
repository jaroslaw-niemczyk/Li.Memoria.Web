import React from 'react';

interface RepeatProps {
  question: string;
  editUrl: string;
  answer: string;
  repeatButtonClickCallback?: (repeatAfterDays: string) => void;
}

interface RepeatState {
  checked: boolean;
  answer: string;
  validClassName: string;
}

export class RepeatQuestion extends React.Component<RepeatProps, RepeatState> {
  constructor(props: RepeatProps) {
    super(props);
    this.state = {
      checked: false,
      answer: '',
      validClassName: '',
    };

    this.handleCheckButtonClick = this.handleCheckButtonClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRepeatButtonClick = this.handleRepeatButtonClick.bind(this);
  }

  render(): JSX.Element {
    return (
      <>
        <h4 className="text-center mb-3">
          <a href={this.props.editUrl} target="_blank" rel="noopener noreferrer">
            {this.props.question}
          </a>
        </h4>
        {this.getAnswerForm()}
        {this.getAnswer()}
        <div className="row">{this.getRepeatButtons()}</div>
      </>
    );
  }

  private handleCheckButtonClick(event: React.FormEvent<HTMLButtonElement>): void {
    this.setState({
      checked: true,
      validClassName: this.validate(),
    });
    event.preventDefault();
  }

  private validate(): string {
    return this.state.answer.toLowerCase().trim() === this.props.answer.toLowerCase().trim()
      ? ' is-valid'
      : ' is-invalid';
  }

  private handleChange(event: React.FormEvent<HTMLInputElement>): void {
    this.setState({ answer: event.currentTarget.value });
  }

  private getAnswerForm(): JSX.Element {
    // if (this.props.answer.length > 30) {
    //   return (<textarea className="form-control" style={{resize:'none'}}>{this.props.answer}</textarea>)
    // }

    return (
      <input className={`form-control text-center mb-3${this.state.validClassName}`} onChange={this.handleChange} />
    );
  }

  private getAnswer(): JSX.Element {
    return <h4 className="text-center text-info mb-3">{(this.state.checked && this.props.answer) || '\u00A0'}</h4>;
  }

  private handleRepeatButtonClick(e: React.FormEvent<HTMLButtonElement>): void {
    if (this.props.repeatButtonClickCallback) {
      this.props.repeatButtonClickCallback(e.currentTarget.value);
      this.setState({
        checked: false,
        validClassName: '',
      });
      e.preventDefault();
    }
  }

  private getRepeatButtons(): JSX.Element {
    const repeatButtons = [
      { value: 'repeat', text: 'Repeat now', cssBtnPostfix: 'info' },
      { value: '1', text: 'Repeat after 1 day', cssBtnPostfix: 'outline-primary' },
      { value: '5', text: 'Repeat after 5 days', cssBtnPostfix: 'outline-primary' },
      { value: '20', text: 'Repeat after 20 days', cssBtnPostfix: 'outline-primary' },
      { value: 'know', text: 'Already know :)', cssBtnPostfix: 'danger' },
    ];

    return (
      (this.state.checked && (
        <>
          {repeatButtons.map((value, index) => {
            return (
              <div key={index} className="col-12 mb-3">
                <button
                  type="submit"
                  onClick={this.handleRepeatButtonClick}
                  className={`btn btn-block btn-${value.cssBtnPostfix}`}
                  name="repeatAfterDays"
                  value={value.value}
                >
                  {value.text}
                </button>
              </div>
            );
          })}
        </>
      )) || (
        <div className="col-12 mb-2">
          <button type="button" className="btn btn-block btn-success" onClick={this.handleCheckButtonClick}>
            Check
          </button>
        </div>
      )
    );
  }
}
