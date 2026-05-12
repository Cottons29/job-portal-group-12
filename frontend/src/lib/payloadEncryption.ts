import api from '@/lib/api'

interface EncryptionKeyResponse {
    publicKey: string
}

interface EncryptedPayload {
    encryptedKey: string
    iv: string
    ciphertext: string
}

let cachedPublicKey: CryptoKey | null = null

function base64ToArrayBuffer(value: string) {
    const binary = window.atob(value)
    const bytes = new Uint8Array(binary.length)

    for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index)
    }

    return bytes.buffer
}

function arrayBufferToBase64(value: ArrayBuffer) {
    const bytes = new Uint8Array(value)
    let binary = ''

    for (const byte of bytes) {
        binary += String.fromCharCode(byte)
    }

    return window.btoa(binary)
}

function pemToArrayBuffer(pem: string) {
    const base64 = pem
        .replace('-----BEGIN PUBLIC KEY-----', '')
        .replace('-----END PUBLIC KEY-----', '')
        .replace(/\s/g, '')

    return base64ToArrayBuffer(base64)
}

async function getPublicKey() {
    if (cachedPublicKey) {
        return cachedPublicKey
    }

    const {data} = await api.get<EncryptionKeyResponse>('/auth/encryption-key')

    cachedPublicKey = await window.crypto.subtle.importKey(
        'spki',
        pemToArrayBuffer(data.publicKey),
        {
            name: 'RSA-OAEP',
            hash: 'SHA-256',
        },
        false,
        ['encrypt'],
    )

    return cachedPublicKey
}

export async function encryptPayload(payload: Record<string, unknown>): Promise<EncryptedPayload> {
    const publicKey = await getPublicKey()
    const aesKey = await window.crypto.subtle.generateKey(
        {
            name: 'AES-GCM',
            length: 256,
        },
        true,
        ['encrypt'],
    )
    const iv = window.crypto.getRandomValues(new Uint8Array(12))
    const encodedPayload = new TextEncoder().encode(JSON.stringify(payload))

    const ciphertext = await window.crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv,
        },
        aesKey,
        encodedPayload,
    )
    const rawAesKey = await window.crypto.subtle.exportKey('raw', aesKey)
    const encryptedKey = await window.crypto.subtle.encrypt(
        {
            name: 'RSA-OAEP',
        },
        publicKey,
        rawAesKey,
    )

    return {
        encryptedKey: arrayBufferToBase64(encryptedKey),
        iv: arrayBufferToBase64(iv.buffer),
        ciphertext: arrayBufferToBase64(ciphertext),
    }
}
