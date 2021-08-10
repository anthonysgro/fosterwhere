function parseAddress(address) {
    const testAddress = address.substring(address.length - 15).split("");
    let punctuation = "";
    const punctPattern = ", ()-";
    const numbers = [];

    testAddress.forEach((char, i) => {
        const punctuationIdxs = [0, 1, 2, 6, 10];

        if (punctuationIdxs.includes(i)) punctuation += char;
        else numbers.push(isNaN(parseInt(char)));
    });

    if (punctuation === punctPattern && !numbers.includes(true)) {
        return address.substring(0, address.length - 15);
    } else {
        return address;
    }
}

module.exports = parseAddress;
