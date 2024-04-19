import { Session } from '@shopify/shopify-api';
import { db } from "./firebase.server";


const sessionCollection = db.collection("session");

// console.log('Session...................', Session);
// console.log('sessionCollection......................', sessionCollection);

export class FirebaseSessionStorage {

    async storeSession(session) {
        try {
            console.log('session from storeSession', session);
            await sessionCollection.doc(session.id).set(session.toObject());
            return true;
        } catch (error) {
            console.log('error from storeSession', error);
            return false;
        }
    }


    async loadSession(id) {
        try {
            console.log('id from loadSession', id);

            const doc = await sessionCollection.doc(id).get();
            if (doc.exists) {
                const sessionP = doc.data();
                return new Session(sessionP);
            } else {
                return undefined;
            }
        } catch (error) {
            console.log('error from loadSession', error);

            return undefined;
        }
    }

    async deleteSession(id) {

        try {
            console.log('id from deleteSession', id);

            await sessionCollection.doc(id).delete();
            return true;
        } catch (error) {
            console.log('error from deleteSession', error);

            return false;
        }
    }


    async deleteSessions(ids) {
        try {
            console.log('ids from deleteSession', ids);

            await Promise.all(ids.map(async (id) => {
                await sessionCollection.doc(id).delete();
            }));
            return true;
        } catch (error) {
            console.log('error from deleteSessions', error);
            return false;
        }
    }


    async findSessionsByShop(shop) {
        try {
            console.log('shop from deleteSession', shop);

            const docs = await sessionCollection.where("shop", "==", shop).get();
            if (docs.empty) {
                return [];
            } else {
                return docs.docs.map((doc) => {
                    const sessionP = doc.data();
                    return new Session(sessionP);
                });
            }
        } catch (error) {
            console.log('error from findSessionsByShop', error);

            return [];
        }
    }
}
