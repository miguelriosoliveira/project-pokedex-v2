interface Props {
	code: number;
	message: string;
}

export class AppError extends Error {
	constructor(private props: Props) {
		super(props.message);
	}

	get code() {
		return this.props.code;
	}
}
