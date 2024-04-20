export type CSVParser<T> = (parsedContent: Papa.ParseResult<any>) => Array<T>;
