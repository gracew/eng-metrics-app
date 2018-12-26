import * as React from "react";

interface IRepoFormProps {
    handler: (repo?: string) => void
}

interface IRepoFormState {
    repo?: string
}

export class RepoForm extends React.Component<IRepoFormProps, IRepoFormState> {

    constructor(props: IRepoFormProps) {
        super(props);
        this.state = {}
    }

    public render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>Repository:</label>
                <input type="text" name="repository" onChange={this.handleChange}/>
                <input type="submit" value="Submit" />
            </form>
        );
    }

    private handleChange = (event: any) => this.setState({ repo: event.target.value })

    private handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (this.state.repo && this.state.repo.includes('/')) {
            this.props.handler(this.state.repo)
        } 
    }

}
