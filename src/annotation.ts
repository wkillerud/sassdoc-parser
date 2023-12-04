import type {
	Annotation as ScssCommentParserAnnotation,
	ParseResult as ScssCommentParserParseResult,
} from "scss-comment-parser";
import annotations from "./annotations/index.js";

export type BuiltInAnnotationNames =
	| "access"
	| "alias"
	| "author"
	| "content"
	| "deprecated"
	| "example"
	| "group"
	| "groupDescription"
	| "ignore"
	| "link"
	| "name"
	| "output"
	| "parameter"
	| "property"
	| "require"
	| "return"
	| "see"
	| "since"
	| "throw"
	| "todo"
	| "type";

export interface Annotation extends ScssCommentParserAnnotation {
	resolve?: (
		parseResult: Array<ScssCommentParserParseResult>,
	) => void | Promise<void>;
}

type BuiltInAnnotations = {
	[annotation in BuiltInAnnotationNames]: Annotation;
};

type AnnotationAlias = {
	_: { alias: Record<string, string> };
};

export type annotationFactory = () => Annotation;

interface IAnnotationsApi {
	list: BuiltInAnnotations & AnnotationAlias;
}

export default class AnnotationsApi implements IAnnotationsApi {
	list = {
		_: { alias: {} },
	} as BuiltInAnnotations & AnnotationAlias;

	constructor() {
		annotations.forEach((annotation: annotationFactory) => {
			this.addAnnotation(
				annotation().name as BuiltInAnnotationNames,
				annotation,
			);
		});
	}

	private addAnnotation(
		name: BuiltInAnnotationNames,
		annotationFactory: annotationFactory,
	) {
		const annotation = annotationFactory();

		this.list._.alias[name] = name;

		if (Array.isArray(annotation.alias)) {
			annotation.alias.forEach((aliasName) => {
				this.list._.alias[aliasName] = name;
			});
		}

		this.list[name] = annotation;
	}
}
