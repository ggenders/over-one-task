
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, type UserCredential } from 'firebase/auth';

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const checkAuth = () => {
    if (!auth) {
        // This error will be caught by the try/catch in the component
        throw new Error('Firebase is not configured. Please add your Firebase credentials to .env.local');
    }
}

export const signInWithGoogle = async (): Promise<UserCredential> => {
  checkAuth();
  // We can safely use the non-null assertion (!) because checkAuth would have thrown an error if auth was null.
  return await signInWithPopup(auth!, googleProvider);
};

export const signInWithFacebook = async (): Promise<UserCredential> => {
    checkAuth();
    // We can safely use the non-null assertion (!) because checkAuth would have thrown an error if auth was null.
    return await signInWithPopup(auth!, facebookProvider);
};
