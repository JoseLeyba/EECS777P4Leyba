import crypto from 'crypto';


function b64encode(input) {
    return Buffer.from(JSON.stringify(input))
        .toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")

}

function sign(data, secret) {
    return crypto
        .createHmac("sha256", secret)
        .update(data)
        .digest("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")

}

function encodeJWT(payload, secret) {
    const header = {alg: "HS256", typ: "JWT"};
    const headerEncoded = b64encode(header);
    const payloadEncoded = b64encode(payload);
    const signature = sign(`${headerEncoded}.${payloadEncoded}`, secret);
    return `${headerEncoded}.${payloadEncoded}.${signature}`;
}

function decodeJWT(token, secret) {
    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("Malformed token");
    const [header, payload, signature] = parts;
    const checkSignature = sign(`${header}.${payload}`, secret);

    if (checkSignature !== signature){
        throw new Error("Invalid Token Signature");        
    }
    let base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) {
        base64 += "=";
    } 
    const decodedPayload = JSON.parse(Buffer.from(base64, "base64").toString());
    return decodedPayload;
}

export { encodeJWT, decodeJWT };
