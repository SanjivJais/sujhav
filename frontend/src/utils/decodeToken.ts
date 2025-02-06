function decodeToken(token: string) {
    try {
        const payload = token.split('.')[1]; // Extract the payload part of the JWT
        const decodedPayload = JSON.parse(atob(payload)); // Decode the Base64 URL-encoded payload
        // Extract and map relevant claims (if needed)
        return {
            role: decodedPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
            email: decodedPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
            userId: decodedPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
            // exp: decodedPayload.exp, // Token expiration time
            // iss: decodedPayload.iss, // Issuer
            // aud: decodedPayload.aud, // Audience
        };
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}

export default decodeToken;
