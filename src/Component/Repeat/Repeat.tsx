import React from 'react';

interface RepeatProps {
  question: string;
  editUrl: string;
  answer: string;
}

interface RepeatState {
  checked: boolean;
  answer: string;
  validClassName: string;
}

export class Repeat extends React.Component<RepeatProps, RepeatState> {
  constructor(props: RepeatProps) {
    super(props);
    this.state = {
      checked: false,
      answer: '',
      validClassName: '',
    };

    this.handleCheck = this.handleCheck.bind(this);
    this.handleChange = this.handleChange.bind(this);
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

  private handleCheck(event: React.FormEvent<HTMLButtonElement>): void {
    this.setState({
      checked: true,
      validClassName: this.validate(),
    });
    event.preventDefault();
  }

  private validate(): string {
    if (this.state.answer.toLowerCase().trim() === this.props.answer.toLowerCase().trim()) {
      return ' is-valid';
    }

    return ' is-invalid';
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

  private getRepeatButtons(): JSX.Element {
    return (
      (this.state.checked && (
        <>
          <div className="col-12 mb-3">
            <button type="submit" className="btn btn-block btn-info" name="repeatAfterDays" value="repeat">
              Repeat now
            </button>
          </div>
          <div className="col-12 col-md-3 mb-3">
            <button type="submit" className="btn btn-block btn-outline-primary" name="repeatAfterDays" value="1">
              Repeat after 1 day
            </button>
          </div>
          <div className="col-12 col-md-3 mb-3">
            <button type="submit" className="btn btn-block btn-outline-primary" name="repeatAfterDays" value="5">
              Repeat after 5 days
            </button>
          </div>
          <div className="col-12 col-md-3 mb-3">
            <button type="submit" className="btn btn-block btn-outline-primary" name="repeatAfterDays" value="20">
              Repeat after 20 days
            </button>
          </div>
          <div className="col-12 col-md-3 mb-3">
            <button type="submit" className="btn btn-block btn-danger" name="repeatAfterDays" value="know">
              Already know :)
            </button>
          </div>
        </>
      )) || (
        <div className="col-12 mb-2">
          <button type="button" className="btn btn-block btn-success" onClick={this.handleCheck}>
            Check
          </button>
        </div>
      )
    );
  }
}
