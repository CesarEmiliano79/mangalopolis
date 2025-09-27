import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;

// Helper function to decode base64url
function base64urlDecode(str) {
  str += new Array(5 - (str.length % 4)).join('=');
  return atob(str.replace(/\-/g, '+').replace(/_/g, '/'));
}

// Helper function to encode base64url
function base64urlEncode(str) {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Verify JWT using Web Crypto API
async function verifyJWT(token, secret) {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid token format');
  }

  const [header, payload, signature] = parts;
  
  // Decode header and payload
  const headerObj = JSON.parse(base64urlDecode(header));
  const payloadObj = JSON.parse(base64urlDecode(payload));
  
  // Check if token is expired
  if (payloadObj.exp && Date.now() >= payloadObj.exp * 1000) {
    throw new Error('Token expired');
  }
  
  // Create the signing input
  const signingInput = `${header}.${payload}`;
  
  // Import the secret key
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );
  
  // Verify the signature
  const expectedSignature = new Uint8Array(
    atob(signature.replace(/\-/g, '+').replace(/_/g, '/'))
      .split('')
      .map(c => c.charCodeAt(0))
  );
  
  const isValid = await crypto.subtle.verify(
    'HMAC',
    key,
    expectedSignature,
    new TextEncoder().encode(signingInput)
  );
  
  if (!isValid) {
    throw new Error('Invalid signature');
  }
  
  return payloadObj;
}

export default async function sessionMiddleware(req) {
  const token = req.cookies.get("tokenSesion")?.value;

  if (!token) {
    return NextResponse.json({ mensaje: "Token requerido" }, { status: 401 });
  }

  try {
    console.log("Verifying token...");
    console.log(token);
    
    const decoded = await verifyJWT(token, JWT_SECRET);
    console.log("Decoded:", decoded);
    
    // Create new headers with user info
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user', decoded.user || '');
    requestHeaders.set('x-user-role', decoded.role || 'user');
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error("Error al verificar token: " + error.message);
    return NextResponse.json({ mensaje: "Token inválido" }, { status: 401 });
  }
}