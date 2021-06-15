function badSyntax(message) {
    const error = Error(message);
    error.name = "Bad Syntax";
    throw error;
}

export default badSyntax;
